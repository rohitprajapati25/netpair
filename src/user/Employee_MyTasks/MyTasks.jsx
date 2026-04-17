import { useState, useEffect, useCallback, useMemo } from "react";
import { useAuth } from "../../contexts/AuthContext";
import axios from "axios";
import {
  RiAddLine, RiTaskLine, RiTimeLine, RiCheckboxCircleLine,
  RiProgress3Line, RiRefreshLine, RiPlayLine, RiSearchLine,
  RiFilterLine, RiCheckboxCircleFill, RiCloseCircleLine,
  RiDeleteBinLine, RiChat1Line, RiArrowDownSLine, RiArrowUpSLine,
  RiLoader4Line, RiEditLine,
} from "react-icons/ri";
import TimesheetSubmitModal from "../../components/Task_Timesheet/TimesheetSubmitModal";
import { SkeletonStats, SkeletonTable } from "../../components/Skeletons";
import API_URL from "../../config/api";

// Status and priority config matching backend enums exactly
const PRIORITY_CFG = {
  Low:      "bg-emerald-100 text-emerald-700 border border-emerald-200",
  Medium:   "bg-amber-100   text-amber-700   border border-amber-200",
  High:     "bg-red-100     text-red-700     border border-red-200",
  Critical: "bg-purple-100  text-purple-700  border border-purple-200",
};

const STATUS_CFG = {
  "Todo":        { cls: "bg-slate-100  text-slate-600  border border-slate-200",  dot: "bg-slate-400"   },
  "In Progress": { cls: "bg-blue-100   text-blue-700   border border-blue-200",   dot: "bg-blue-500"    },
  "Review":      { cls: "bg-purple-100 text-purple-700 border border-purple-200", dot: "bg-purple-500"  },
  "Completed":   { cls: "bg-emerald-100 text-emerald-700 border border-emerald-200", dot: "bg-emerald-500" },
  "Blocked":     { cls: "bg-red-100    text-red-700    border border-red-200",    dot: "bg-red-500"     },
};

const TS_STATUS_CFG = {
  "Submitted": "bg-amber-100   text-amber-700   border border-amber-200",
  "Approved":  "bg-emerald-100 text-emerald-700 border border-emerald-200",
  "Rejected":  "bg-red-100     text-red-700     border border-red-200",
};

const ALL_STATUSES = ["Todo", "In Progress", "Review", "Completed", "Blocked"];

const fmtDate = (d) => d ? new Date(d).toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric" }) : "—";

const isOverdue = (task) =>
  task.due_date && task.status !== "Completed" && new Date(task.due_date) < new Date();

// Toast
const Toast = ({ toasts, onRemove }) => (
  <div className="fixed bottom-5 right-5 z-[200] flex flex-col gap-2 pointer-events-none">
    {toasts.map((t) => (
      <div key={t.id} className={`pointer-events-auto flex items-center gap-3 px-4 py-3 rounded-xl shadow-lg text-white text-sm font-semibold transition-all ${t.type === "success" ? "bg-emerald-500" : "bg-red-500"}`}>
        {t.type === "success" ? <RiCheckboxCircleFill className="shrink-0" /> : <RiCloseCircleLine className="shrink-0" />}
        <span>{t.message}</span>
        <button onClick={() => onRemove(t.id)} className="ml-2 opacity-70 hover:opacity-100">x</button>
      </div>
    ))}
  </div>
);

// Stat Card
const StatCard = ({ label, value, icon, bg }) => (
  <div className={`rounded-2xl p-4 lg:p-5 bg-gradient-to-r ${bg} text-white shadow-md hover:shadow-xl hover:-translate-y-0.5 transition-all duration-200 flex items-center justify-between`}>
    <div>
      <p className="text-white/80 text-xs font-semibold uppercase tracking-wider mb-1">{label}</p>
      <p className="text-2xl lg:text-3xl font-black">{value}</p>
    </div>
    <div className="bg-white/20 p-2.5 lg:p-3 rounded-xl text-xl lg:text-2xl">{icon}</div>
  </div>
);

// Inline Progress Editor
const ProgressEditor = ({ task, token, onSaved, onCancel }) => {
  const [val, setVal] = useState(task.progress ?? 0);
  const [saving, setSaving] = useState(false);

  const save = async () => {
    setSaving(true);
    try {
      await axios.put(`${API_URL}/employees/tasks/${task._id}/progress`, { progress: val }, { headers: { Authorization: `Bearer ${token}` } });
      onSaved(task._id, val);
    } catch { onCancel(); }
    finally { setSaving(false); }
  };

  return (
    <div className="flex items-center gap-2" onClick={(e) => e.stopPropagation()}>
      <input type="range" min={0} max={100} value={val} onChange={(e) => setVal(Number(e.target.value))} className="w-20 accent-indigo-500" />
      <span className="text-xs font-bold text-slate-700 w-8">{val}%</span>
      <button onClick={save} disabled={saving} className="px-2 py-0.5 bg-indigo-500 hover:bg-indigo-600 text-white text-xs rounded-lg font-semibold disabled:opacity-50">
        {saving ? "..." : "Save"}
      </button>
      <button onClick={onCancel} className="px-2 py-0.5 bg-slate-200 hover:bg-slate-300 text-slate-600 text-xs rounded-lg font-semibold">x</button>
    </div>
  );
};

// Comment Panel (expandable)
const CommentPanel = ({ task, token, onUpdated }) => {
  const [open, setOpen] = useState(false);
  const [text, setText] = useState("");
  const [saving, setSaving] = useState(false);

  const submit = async () => {
    if (!text.trim()) return;
    setSaving(true);
    try {
      const res = await axios.post(`${API_URL}/employees/tasks/${task._id}/comments`, { comment: text.trim() }, { headers: { Authorization: `Bearer ${token}` } });
      onUpdated(res.data.task);
      setText("");
    } catch {}
    finally { setSaving(false); }
  };

  const comments = task.comments || [];

  return (
    <div className="mt-2">
      <button onClick={() => setOpen((v) => !v)} className="flex items-center gap-1 text-xs text-slate-400 hover:text-indigo-600 transition-colors font-semibold">
        <RiChat1Line size={13} />
        {comments.length} comment{comments.length !== 1 ? "s" : ""}
        {open ? <RiArrowUpSLine size={13} /> : <RiArrowDownSLine size={13} />}
      </button>
      {open && (
        <div className="mt-2 space-y-2">
          {comments.slice(-3).map((c, i) => (
            <div key={i} className="bg-slate-50 rounded-lg px-3 py-2 text-xs text-slate-600">
              <span className="font-semibold text-slate-700">{c.by?.name || "You"}: </span>{c.text}
            </div>
          ))}
          <div className="flex gap-2">
            <input value={text} onChange={(e) => setText(e.target.value)} onKeyDown={(e) => e.key === "Enter" && submit()} placeholder="Add a comment..." className="flex-1 px-3 py-1.5 border border-slate-200 rounded-lg text-xs outline-none focus:border-indigo-400 focus:ring-1 focus:ring-indigo-200" />
            <button onClick={submit} disabled={saving || !text.trim()} className="px-3 py-1.5 bg-indigo-500 hover:bg-indigo-600 text-white text-xs rounded-lg font-semibold disabled:opacity-40">
              {saving ? "..." : "Post"}
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

// Status Change Dropdown
const StatusDropdown = ({ task, token, onUpdated }) => {
  const [open, setOpen] = useState(false);
  const [saving, setSaving] = useState(false);

  const change = async (newStatus) => {
    if (newStatus === task.status) { setOpen(false); return; }
    setSaving(true);
    try {
      const res = await axios.put(`${API_URL}/employees/tasks/${task._id}`, { status: newStatus }, { headers: { Authorization: `Bearer ${token}` } });
      onUpdated(res.data.task);
    } catch {}
    finally { setSaving(false); setOpen(false); }
  };

  const cfg = STATUS_CFG[task.status] || STATUS_CFG["Todo"];

  return (
    <div className="relative">
      <button onClick={() => setOpen((v) => !v)} disabled={saving} className={`flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-bold border transition-all ${cfg.cls} hover:opacity-80`}>
        {saving ? <RiLoader4Line className="animate-spin" size={11} /> : <span className={`w-1.5 h-1.5 rounded-full ${cfg.dot}`} />}
        {task.status}
        <RiArrowDownSLine size={12} />
      </button>
      {open && (
        <div className="absolute top-full left-0 mt-1 bg-white border border-slate-200 rounded-xl shadow-xl z-30 min-w-[140px] overflow-hidden">
          {ALL_STATUSES.map((s) => {
            const c = STATUS_CFG[s];
            return (
              <button key={s} onClick={() => change(s)} className={`w-full flex items-center gap-2 px-3 py-2 text-xs font-semibold hover:bg-slate-50 transition-colors ${s === task.status ? "bg-slate-50 font-black" : ""}`}>
                <span className={`w-2 h-2 rounded-full ${c.dot}`} />
                {s}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
};

// Main Component
const MyTasks = () => {
  const { token } = useAuth();

  const [tasks,      setTasks]      = useState([]);
  const [timesheets, setTimesheets] = useState([]);
  const [projects,   setProjects]   = useState([]);
  const [loading,    setLoading]    = useState(true);
  const [activeTab,  setActiveTab]  = useState("tasks");
  const [search,     setSearch]     = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [timesheetModal, setTimesheetModal] = useState(false);
  const [selectedTask,   setSelectedTask]   = useState(null);
  const [editingProgress, setEditingProgress] = useState(null);
  const [deletingTs, setDeletingTs] = useState(null);
  const [toasts, setToasts] = useState([]);

  const addToast = useCallback((message, type = "success") => {
    const id = Date.now();
    setToasts((p) => [...p, { id, message, type }]);
    setTimeout(() => setToasts((p) => p.filter((t) => t.id !== id)), 4000);
  }, []);

  const removeToast = useCallback((id) => setToasts((p) => p.filter((t) => t.id !== id)), []);

  // Fetch all data
  const fetchAll = useCallback(async () => {
    setLoading(true);
    try {
      const h = { Authorization: `Bearer ${token}` };
      const [tRes, tsRes, pRes] = await Promise.all([
        axios.get(`${API_URL}/employees/tasks?limit=200`, { headers: h }),
        axios.get(`${API_URL}/employees/timesheets?limit=200`, { headers: h }),
        axios.get(`${API_URL}/employees/projects`, { headers: h }).catch(() => ({ data: { projects: [] } })),
      ]);
      setTasks(tRes.data.tasks ?? []);
      setTimesheets(tsRes.data.timesheets ?? []);
      setProjects(pRes.data.projects ?? []);
    } catch {
      addToast("Failed to load data. Please try again.", "error");
    } finally {
      setLoading(false);
    }
  }, [token, addToast]);

  useEffect(() => { fetchAll(); }, [fetchAll]);

  // Stats
  const stats = useMemo(() => ({
    total:      tasks.length,
    completed:  tasks.filter((t) => t.status === "Completed").length,
    inProgress: tasks.filter((t) => t.status === "In Progress").length,
    overdue:    tasks.filter(isOverdue).length,
    hoursLogged: timesheets.reduce((s, ts) => s + (ts.hours_worked || 0), 0),
  }), [tasks, timesheets]);

  // Filtered tasks
  const filteredTasks = useMemo(() => tasks.filter((t) => {
    const matchSearch = !search || t.task_title?.toLowerCase().includes(search.toLowerCase()) || t.description?.toLowerCase().includes(search.toLowerCase());
    const matchStatus = statusFilter === "All" || t.status === statusFilter;
    return matchSearch && matchStatus;
  }), [tasks, search, statusFilter]);

  // Update task in local state
  const handleTaskUpdated = useCallback((updated) => {
    setTasks((p) => p.map((t) => t._id === updated._id ? updated : t));
  }, []);

  // Progress saved
  const handleProgressSaved = useCallback((taskId, newProgress) => {
    setTasks((p) => p.map((t) => t._id === taskId ? { ...t, progress: newProgress, status: newProgress === 100 ? "Completed" : t.status } : t));
    setEditingProgress(null);
    addToast("Progress updated!");
  }, [addToast]);

  // Delete timesheet
  const handleDeleteTimesheet = useCallback(async (id) => {
    setDeletingTs(id);
    try {
      await axios.delete(`${API_URL}/employees/timesheets/${id}`, { headers: { Authorization: `Bearer ${token}` } });
      setTimesheets((p) => p.filter((ts) => ts._id !== id));
      addToast("Timesheet deleted");
    } catch (err) {
      addToast(err.response?.data?.message || "Cannot delete this timesheet", "error");
    } finally {
      setDeletingTs(null);
    }
  }, [token, addToast]);

  const tabCls = (tab) => activeTab === tab
    ? "px-4 py-2 rounded-xl text-sm font-bold bg-gradient-to-r from-indigo-500 to-purple-600 text-white shadow"
    : "px-4 py-2 rounded-xl text-sm font-semibold text-slate-500 hover:text-slate-700 hover:bg-slate-100 transition-all";

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div>
          <h1 className="text-2xl lg:text-3xl font-black text-slate-800">My Tasks</h1>
          <p className="text-slate-500 text-sm mt-0.5">Track your assigned tasks and log work hours</p>
        </div>
        <div className="flex items-center gap-2 flex-wrap">
          <button onClick={fetchAll} disabled={loading} className="flex items-center gap-1.5 px-3 py-2 rounded-xl border border-slate-200 text-slate-600 hover:bg-slate-50 text-sm font-semibold transition-all disabled:opacity-50">
            <RiRefreshLine className={loading ? "animate-spin" : ""} size={15} /> Refresh
          </button>
          <button onClick={() => { setSelectedTask(null); setTimesheetModal(true); }} className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 text-white text-sm font-bold shadow transition-all">
            <RiAddLine size={15} /> Log Time
          </button>
        </div>
      </div>

      {/* Stat Cards */}
      {loading ? <SkeletonStats count={5} /> : (
        <div className="grid grid-cols-2 lg:grid-cols-5 gap-3 lg:gap-4">
          <StatCard label="Total Tasks"  value={stats.total}                    icon={<RiTaskLine />}            bg="from-blue-500 to-indigo-600" />
          <StatCard label="Completed"    value={stats.completed}                icon={<RiCheckboxCircleLine />}  bg="from-emerald-500 to-green-600" />
          <StatCard label="In Progress"  value={stats.inProgress}               icon={<RiProgress3Line />}       bg="from-purple-500 to-pink-600" />
          <StatCard label="Overdue"      value={stats.overdue}                  icon={<RiTimeLine />}            bg="from-red-500 to-rose-600" />
          <StatCard label="Hours Logged" value={stats.hoursLogged.toFixed(1)}   icon={<RiTimeLine />}            bg="from-orange-500 to-red-500" />
        </div>
      )}

      {/* Filter Bar */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <RiSearchLine className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={15} />
          <input type="text" placeholder="Search tasks..." value={search} onChange={(e) => setSearch(e.target.value)} className="w-full pl-9 pr-4 py-2.5 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-indigo-200 focus:border-indigo-400 outline-none transition-all" />
        </div>
        <div className="relative">
          <RiFilterLine className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={14} />
          <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)} className="pl-9 pr-8 py-2.5 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-indigo-200 focus:border-indigo-400 outline-none transition-all appearance-none bg-white min-w-[150px]">
            <option value="All">All Statuses</option>
            {ALL_STATUSES.map((s) => <option key={s} value={s}>{s}</option>)}
          </select>
        </div>
      </div>

      {/* Tab Switcher */}
      <div className="flex items-center gap-2 bg-slate-100 p-1 rounded-xl w-fit">
        <button className={tabCls("tasks")}      onClick={() => setActiveTab("tasks")}>My Tasks ({tasks.length})</button>
        <button className={tabCls("timesheets")} onClick={() => setActiveTab("timesheets")}>My Timesheets ({timesheets.length})</button>
      </div>

      {/* Tasks Tab */}
      {activeTab === "tasks" && (
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
          {loading ? <SkeletonTable rows={6} /> : filteredTasks.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-16 text-slate-400">
              <RiTaskLine className="text-5xl mb-3 opacity-40" />
              <p className="font-semibold text-slate-500">No tasks found</p>
              <p className="text-sm mt-1">{search || statusFilter !== "All" ? "Try adjusting your filters" : "You have no assigned tasks yet"}</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="bg-slate-50 border-b border-slate-200">
                    {["Task", "Project", "Priority", "Status", "Due Date", "Progress", "Actions"].map((h) => (
                      <th key={h} className="text-left px-5 py-3.5 font-bold text-slate-600 text-xs uppercase tracking-wider">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {filteredTasks.map((task) => {
                    const overdue = isOverdue(task);
                    return (
                      <tr key={task._id} className="hover:bg-slate-50 transition-colors">
                        {/* Task */}
                        <td className="px-5 py-4 max-w-[220px]">
                          <p className="font-semibold text-slate-800 truncate">{task.task_title}</p>
                          {task.description && <p className="text-xs text-slate-400 truncate mt-0.5">{task.description}</p>}
                          <CommentPanel task={task} token={token} onUpdated={handleTaskUpdated} />
                        </td>
                        {/* Project */}
                        <td className="px-5 py-4 text-slate-600 text-sm">{task.project_id?.name ?? "—"}</td>
                        {/* Priority */}
                        <td className="px-5 py-4">
                          <span className={`px-2.5 py-1 rounded-lg text-xs font-bold ${PRIORITY_CFG[task.priority] ?? "bg-slate-100 text-slate-600"}`}>{task.priority ?? "—"}</span>
                        </td>
                        {/* Status — employee can change */}
                        <td className="px-5 py-4">
                          <StatusDropdown task={task} token={token} onUpdated={handleTaskUpdated} />
                        </td>
                        {/* Due Date */}
                        <td className="px-5 py-4">
                          <span className={`text-sm ${overdue ? "text-red-600 font-semibold" : "text-slate-600"}`}>{fmtDate(task.due_date)}</span>
                          {overdue && <span className="block mt-0.5 px-2 py-0.5 bg-red-100 text-red-600 border border-red-200 rounded-md text-xs font-bold w-fit">Overdue</span>}
                        </td>
                        {/* Progress */}
                        <td className="px-5 py-4 min-w-[160px]">
                          {editingProgress === task._id ? (
                            <ProgressEditor task={task} token={token} onSaved={handleProgressSaved} onCancel={() => setEditingProgress(null)} />
                          ) : (
                            <div className="cursor-pointer group" onClick={() => setEditingProgress(task._id)} title="Click to update">
                              <div className="flex items-center justify-between mb-1">
                                <span className="text-xs font-bold text-slate-600 group-hover:text-indigo-600 transition-colors">{task.progress ?? 0}%</span>
                                <RiEditLine size={11} className="text-slate-300 group-hover:text-indigo-400 transition-colors" />
                              </div>
                              <div className="w-full bg-slate-200 rounded-full h-2 overflow-hidden">
                                <div className="h-2 rounded-full bg-gradient-to-r from-indigo-500 to-purple-500 transition-all duration-300" style={{ width: `${task.progress ?? 0}%` }} />
                              </div>
                            </div>
                          )}
                        </td>
                        {/* Actions */}
                        <td className="px-5 py-4">
                          <button onClick={() => { setSelectedTask(task); setTimesheetModal(true); }} className="flex items-center gap-1.5 px-3 py-1.5 bg-indigo-50 hover:bg-indigo-100 text-indigo-600 rounded-lg text-xs font-bold transition-all">
                            <RiPlayLine size={13} /> Log Time
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}

      {/* Timesheets Tab */}
      {activeTab === "timesheets" && (
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
          {loading ? <SkeletonTable rows={6} /> : timesheets.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-16 text-slate-400">
              <RiTimeLine className="text-5xl mb-3 opacity-40" />
              <p className="font-semibold text-slate-500">No timesheets yet</p>
              <p className="text-sm mt-1">Start logging your work hours</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="bg-slate-50 border-b border-slate-200">
                    {["Date", "Project", "Task", "Hours", "Description", "Status", ""].map((h, i) => (
                      <th key={i} className="text-left px-5 py-3.5 font-bold text-slate-600 text-xs uppercase tracking-wider">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {timesheets.map((ts) => (
                    <tr key={ts._id} className="hover:bg-slate-50 transition-colors">
                      <td className="px-5 py-4 text-slate-700 font-medium whitespace-nowrap">{fmtDate(ts.date)}</td>
                      <td className="px-5 py-4 text-slate-600">{ts.project_id?.name ?? "—"}</td>
                      <td className="px-5 py-4 text-slate-600 max-w-[160px]"><span className="truncate block">{ts.task_id?.task_title ?? "—"}</span></td>
                      <td className="px-5 py-4"><span className="font-bold text-slate-800">{ts.hours_worked}</span><span className="text-slate-400 text-xs ml-1">hrs</span></td>
                      <td className="px-5 py-4 text-slate-500 max-w-[200px]"><span className="truncate block">{ts.work_description ?? "—"}</span></td>
                      <td className="px-5 py-4">
                        <span className={`px-2.5 py-1 rounded-lg text-xs font-bold ${TS_STATUS_CFG[ts.status] ?? "bg-slate-100 text-slate-600"}`}>{ts.status ?? "—"}</span>
                        {ts.status === "Rejected" && ts.rejection_reason && (
                          <p className="text-xs text-red-500 mt-0.5 max-w-[160px] truncate" title={ts.rejection_reason}>Reason: {ts.rejection_reason}</p>
                        )}
                      </td>
                      <td className="px-5 py-4">
                        {ts.status === "Submitted" && (
                          <button onClick={() => handleDeleteTimesheet(ts._id)} disabled={deletingTs === ts._id} className="p-1.5 text-red-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-all disabled:opacity-40" title="Delete timesheet">
                            {deletingTs === ts._id ? <RiLoader4Line className="animate-spin" size={15} /> : <RiDeleteBinLine size={15} />}
                          </button>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}

      {/* Timesheet Modal */}
      <TimesheetSubmitModal
        open={timesheetModal}
        onClose={() => { setTimesheetModal(false); setSelectedTask(null); }}
        onRefresh={fetchAll}
        projects={projects}
        tasks={tasks}
        selectedTask={selectedTask}
        onSuccess={() => addToast("Timesheet submitted successfully!")}
      />

      <Toast toasts={toasts} onRemove={removeToast} />
    </div>
  );
};

export default MyTasks;
