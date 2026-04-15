import { useState, useEffect, useCallback, useMemo } from "react";
import { useAuth } from "../../contexts/AuthContext";
import axios from "axios";
import {
  RiAddLine,
  RiTaskLine,
  RiTimeLine,
  RiCheckboxCircleLine,
  RiProgress3Line,
  RiRefreshLine,
  RiPlayLine,
  RiSearchLine,
  RiFilterLine,
  RiCheckboxCircleFill,
  RiCloseCircleLine,
} from "react-icons/ri";
import TimesheetSubmitModal from "../../components/Task_Timesheet/TimesheetSubmitModal";
import { SkeletonStats, SkeletonTable } from "../../components/Skeletons";

// ─── Toast ────────────────────────────────────────────────────────────────────
const Toast = ({ toasts, onRemove }) => (
  <div className="fixed bottom-5 right-5 z-[200] flex flex-col gap-2 pointer-events-none">
    {toasts.map((t) => (
      <div
        key={t.id}
        className={`pointer-events-auto flex items-center gap-3 px-4 py-3 rounded-xl shadow-lg text-white text-sm font-medium transition-all duration-300 ${
          t.type === "success"
            ? "bg-emerald-500"
            : "bg-red-500"
        }`}
      >
        {t.type === "success" ? (
          <RiCheckboxCircleFill className="text-lg shrink-0" />
        ) : (
          <RiCloseCircleLine className="text-lg shrink-0" />
        )}
        <span>{t.message}</span>
        <button
          onClick={() => onRemove(t.id)}
          className="ml-2 opacity-70 hover:opacity-100"
        >
          ✕
        </button>
      </div>
    ))}
  </div>
);

// ─── Helpers ──────────────────────────────────────────────────────────────────
const priorityConfig = {
  High: "bg-red-100 text-red-700 border border-red-200",
  Medium: "bg-amber-100 text-amber-700 border border-amber-200",
  Low: "bg-emerald-100 text-emerald-700 border border-emerald-200",
};

const statusConfig = {
  TODO: "bg-slate-100 text-slate-600 border border-slate-200",
  IN_PROGRESS: "bg-blue-100 text-blue-700 border border-blue-200",
  COMPLETED: "bg-emerald-100 text-emerald-700 border border-emerald-200",
  BLOCKED: "bg-red-100 text-red-700 border border-red-200",
};

const timesheetStatusConfig = {
  SUBMITTED: "bg-amber-100 text-amber-700 border border-amber-200",
  APPROVED: "bg-emerald-100 text-emerald-700 border border-emerald-200",
  REJECTED: "bg-red-100 text-red-700 border border-red-200",
};

const formatDate = (dateStr) => {
  if (!dateStr) return "—";
  return new Date(dateStr).toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
};

const isOverdue = (task) => {
  if (!task.due_date || task.status === "COMPLETED") return false;
  return new Date(task.due_date) < new Date();
};

// ─── Stat Card ────────────────────────────────────────────────────────────────
const StatCard = ({ label, value, icon, bg }) => (
  <div
    className={`rounded-2xl p-4 lg:p-5 bg-gradient-to-r ${bg} text-white shadow-md hover:shadow-xl hover:-translate-y-0.5 transition-all duration-200 flex items-center justify-between`}
  >
    <div>
      <p className="text-white/80 text-xs font-semibold uppercase tracking-wider mb-1">
        {label}
      </p>
      <p className="text-2xl lg:text-3xl font-black">{value}</p>
    </div>
    <div className="bg-white/20 p-2.5 lg:p-3 rounded-xl text-xl lg:text-2xl">{icon}</div>
  </div>
);

// ─── Progress Inline Editor ───────────────────────────────────────────────────
const ProgressEditor = ({ task, token, onSaved, onCancel }) => {
  const [val, setVal] = useState(task.progress ?? 0);
  const [saving, setSaving] = useState(false);

  const save = async () => {
    setSaving(true);
    try {
      await axios.put(
        `http://localhost:5000/api/employees/tasks/${task._id}/progress`,
        { progress: val },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      onSaved(task._id, val);
    } catch {
      onCancel();
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="flex items-center gap-2 mt-1" onClick={(e) => e.stopPropagation()}>
      <input
        type="range"
        min={0}
        max={100}
        value={val}
        onChange={(e) => setVal(Number(e.target.value))}
        className="w-24 accent-indigo-500"
      />
      <span className="text-xs font-bold text-slate-700 w-8">{val}%</span>
      <button
        onClick={save}
        disabled={saving}
        className="px-2 py-0.5 bg-indigo-500 hover:bg-indigo-600 text-white text-xs rounded-lg font-semibold disabled:opacity-50"
      >
        {saving ? "…" : "Save"}
      </button>
      <button
        onClick={onCancel}
        className="px-2 py-0.5 bg-slate-200 hover:bg-slate-300 text-slate-600 text-xs rounded-lg font-semibold"
      >
        ✕
      </button>
    </div>
  );
};

// ─── Main Component ───────────────────────────────────────────────────────────
const MyTasks = () => {
  const { token } = useAuth();

  const [tasks, setTasks] = useState([]);
  const [timesheets, setTimesheets] = useState([]);
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);

  const [activeTab, setActiveTab] = useState("tasks");
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");

  const [timesheetModal, setTimesheetModal] = useState(false);
  const [selectedTask, setSelectedTask] = useState(null);

  const [editingProgress, setEditingProgress] = useState(null); // task._id

  const [toasts, setToasts] = useState([]);

  // ── Toast helpers ──────────────────────────────────────────────────────────
  const addToast = useCallback((message, type = "success") => {
    const id = Date.now();
    setToasts((prev) => [...prev, { id, message, type }]);
    setTimeout(() => setToasts((prev) => prev.filter((t) => t.id !== id)), 4000);
  }, []);

  const removeToast = useCallback((id) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  // ── Fetch ──────────────────────────────────────────────────────────────────
  const fetchAll = useCallback(async () => {
    setLoading(true);
    try {
      const headers = { Authorization: `Bearer ${token}` };
      const [tasksRes, timesheetsRes, projectsRes] = await Promise.all([
        axios.get("http://localhost:5000/api/employees/tasks", { headers }),
        axios.get("http://localhost:5000/api/employees/timesheets", { headers }),
        // Employee now has read access — fallback to empty if still 403 (before backend restart)
        axios.get("http://localhost:5000/api/admin/projects", { headers })
          .catch(() => ({ data: { projects: [] } })),
      ]);
      setTasks(tasksRes.data.tasks ?? []);
      setTimesheets(timesheetsRes.data.timesheets ?? []);
      setProjects(projectsRes.data.projects ?? []);
    } catch {
      addToast("Failed to load data. Please try again.", "error");
    } finally {
      setLoading(false);
    }
  }, [token, addToast]);

  useEffect(() => {
    fetchAll();
  }, [fetchAll]);

  // ── Stats ──────────────────────────────────────────────────────────────────
  const stats = useMemo(() => {
    const total = tasks.length;
    const completed = tasks.filter((t) => t.status === "COMPLETED").length;
    const inProgress = tasks.filter((t) => t.status === "IN_PROGRESS").length;
    const hoursLogged = timesheets.reduce((sum, ts) => sum + (ts.hours_worked || 0), 0);
    return { total, completed, inProgress, hoursLogged };
  }, [tasks, timesheets]);

  // ── Filtered tasks ─────────────────────────────────────────────────────────
  const filteredTasks = useMemo(() => {
    return tasks.filter((t) => {
      const matchSearch =
        !search ||
        t.task_title?.toLowerCase().includes(search.toLowerCase()) ||
        t.description?.toLowerCase().includes(search.toLowerCase());
      const matchStatus = statusFilter === "All" || t.status === statusFilter;
      return matchSearch && matchStatus;
    });
  }, [tasks, search, statusFilter]);

  // ── Progress saved ─────────────────────────────────────────────────────────
  const handleProgressSaved = useCallback(
    (taskId, newProgress) => {
      setTasks((prev) =>
        prev.map((t) => (t._id === taskId ? { ...t, progress: newProgress } : t))
      );
      setEditingProgress(null);
      addToast("Progress updated successfully!");
    },
    [addToast]
  );

  // ── Open timesheet modal ───────────────────────────────────────────────────
  const openTimesheetModal = useCallback((task = null) => {
    setSelectedTask(task);
    setTimesheetModal(true);
  }, []);

  // ── Tab label ─────────────────────────────────────────────────────────────
  const tabCls = (tab) =>
    activeTab === tab
      ? "px-4 py-2 rounded-xl text-sm font-bold bg-gradient-to-r from-indigo-500 to-purple-600 text-white shadow"
      : "px-4 py-2 rounded-xl text-sm font-semibold text-slate-500 hover:text-slate-700 hover:bg-slate-100 transition-all";

  // ── Render ─────────────────────────────────────────────────────────────────
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div>
          <h1 className="text-2xl font-black text-slate-800">My Tasks</h1>
          <p className="text-slate-500 text-sm mt-0.5">
            Track your assigned tasks and log your work hours
          </p>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={fetchAll}
            className="flex items-center gap-1.5 px-3 py-2 rounded-xl border border-slate-200 text-slate-600 hover:bg-slate-50 text-sm font-semibold transition-all"
          >
            <RiRefreshLine className="text-base" />
            Refresh
          </button>
          <button
            onClick={() => openTimesheetModal(null)}
            className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 text-white text-sm font-bold shadow transition-all"
          >
            <RiAddLine className="text-base" />
            Log Time
          </button>
        </div>
      </div>

      {/* Stat Cards */}
      {loading ? (
        <SkeletonStats count={4} />
      ) : (
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <StatCard
            label="Total Tasks"
            value={stats.total}
            icon={<RiTaskLine />}
            bg="from-blue-500 to-indigo-600"
          />
          <StatCard
            label="Completed"
            value={stats.completed}
            icon={<RiCheckboxCircleLine />}
            bg="from-emerald-500 to-green-600"
          />
          <StatCard
            label="In Progress"
            value={stats.inProgress}
            icon={<RiProgress3Line />}
            bg="from-purple-500 to-pink-600"
          />
          <StatCard
            label="Hours Logged"
            value={stats.hoursLogged.toFixed(1)}
            icon={<RiTimeLine />}
            bg="from-orange-500 to-red-500"
          />
        </div>
      )}

      {/* Filter Bar */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <RiSearchLine className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-base" />
          <input
            type="text"
            placeholder="Search tasks..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-4 py-2.5 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-indigo-200 focus:border-indigo-400 outline-none transition-all"
          />
        </div>
        <div className="relative">
          <RiFilterLine className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-base" />
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="pl-9 pr-8 py-2.5 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-indigo-200 focus:border-indigo-400 outline-none transition-all appearance-none bg-white"
          >
            <option value="All">All Statuses</option>
            <option value="TODO">TODO</option>
            <option value="IN_PROGRESS">IN PROGRESS</option>
            <option value="COMPLETED">COMPLETED</option>
            <option value="BLOCKED">BLOCKED</option>
          </select>
        </div>
      </div>

      {/* Tab Switcher */}
      <div className="flex items-center gap-2 bg-slate-100 p-1 rounded-xl w-fit">
        <button className={tabCls("tasks")} onClick={() => setActiveTab("tasks")}>
          My Tasks ({tasks.length})
        </button>
        <button className={tabCls("timesheets")} onClick={() => setActiveTab("timesheets")}>
          My Timesheets ({timesheets.length})
        </button>
      </div>

      {/* Tasks Tab */}
      {activeTab === "tasks" && (
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
          {loading ? (
            <SkeletonTable rows={6} />
          ) : filteredTasks.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-16 text-slate-400">
              <RiTaskLine className="text-5xl mb-3 opacity-40" />
              <p className="font-semibold text-slate-500">No tasks found</p>
              <p className="text-sm mt-1">
                {search || statusFilter !== "All"
                  ? "Try adjusting your filters"
                  : "You have no assigned tasks yet"}
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="bg-slate-50 border-b border-slate-200">
                    <th className="text-left px-5 py-3.5 font-bold text-slate-600 text-xs uppercase tracking-wider">
                      Task
                    </th>
                    <th className="text-left px-5 py-3.5 font-bold text-slate-600 text-xs uppercase tracking-wider">
                      Project
                    </th>
                    <th className="text-left px-5 py-3.5 font-bold text-slate-600 text-xs uppercase tracking-wider">
                      Priority
                    </th>
                    <th className="text-left px-5 py-3.5 font-bold text-slate-600 text-xs uppercase tracking-wider">
                      Status
                    </th>
                    <th className="text-left px-5 py-3.5 font-bold text-slate-600 text-xs uppercase tracking-wider">
                      Due Date
                    </th>
                    <th className="text-left px-5 py-3.5 font-bold text-slate-600 text-xs uppercase tracking-wider">
                      Progress
                    </th>
                    <th className="text-left px-5 py-3.5 font-bold text-slate-600 text-xs uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {filteredTasks.map((task) => {
                    const overdue = isOverdue(task);
                    return (
                      <tr key={task._id} className="hover:bg-slate-50 transition-colors">
                        {/* Task Title + Description */}
                        <td className="px-5 py-4 max-w-[220px]">
                          <p className="font-semibold text-slate-800 truncate">
                            {task.task_title}
                          </p>
                          {task.description && (
                            <p className="text-xs text-slate-400 truncate mt-0.5">
                              {task.description}
                            </p>
                          )}
                        </td>

                        {/* Project */}
                        <td className="px-5 py-4 text-slate-600">
                          {task.project_id?.name ?? "—"}
                        </td>

                        {/* Priority */}
                        <td className="px-5 py-4">
                          <span
                            className={`px-2.5 py-1 rounded-lg text-xs font-bold ${
                              priorityConfig[task.priority] ?? "bg-slate-100 text-slate-600"
                            }`}
                          >
                            {task.priority ?? "—"}
                          </span>
                        </td>

                        {/* Status */}
                        <td className="px-5 py-4">
                          <span
                            className={`px-2.5 py-1 rounded-lg text-xs font-bold ${
                              statusConfig[task.status] ?? "bg-slate-100 text-slate-600"
                            }`}
                          >
                            {task.status?.replace("_", " ") ?? "—"}
                          </span>
                        </td>

                        {/* Due Date */}
                        <td className="px-5 py-4">
                          <div className="flex flex-col gap-1">
                            <span
                              className={`text-sm ${
                                overdue ? "text-red-600 font-semibold" : "text-slate-600"
                              }`}
                            >
                              {formatDate(task.due_date)}
                            </span>
                            {overdue && (
                              <span className="px-2 py-0.5 bg-red-100 text-red-600 border border-red-200 rounded-md text-xs font-bold w-fit">
                                Overdue
                              </span>
                            )}
                          </div>
                        </td>

                        {/* Progress */}
                        <td className="px-5 py-4 min-w-[160px]">
                          {editingProgress === task._id ? (
                            <ProgressEditor
                              task={task}
                              token={token}
                              onSaved={handleProgressSaved}
                              onCancel={() => setEditingProgress(null)}
                            />
                          ) : (
                            <div
                              className="cursor-pointer group"
                              onClick={() => setEditingProgress(task._id)}
                              title="Click to update progress"
                            >
                              <div className="flex items-center justify-between mb-1">
                                <span className="text-xs font-bold text-slate-600 group-hover:text-indigo-600 transition-colors">
                                  {task.progress ?? 0}%
                                </span>
                              </div>
                              <div className="w-full bg-slate-200 rounded-full h-2 overflow-hidden">
                                <div
                                  className="h-2 rounded-full bg-gradient-to-r from-indigo-500 to-purple-500 transition-all duration-300"
                                  style={{ width: `${task.progress ?? 0}%` }}
                                />
                              </div>
                              <p className="text-xs text-slate-400 mt-0.5 group-hover:text-indigo-400 transition-colors">
                                Click to edit
                              </p>
                            </div>
                          )}
                        </td>

                        {/* Actions */}
                        <td className="px-5 py-4">
                          <button
                            onClick={() => openTimesheetModal(task)}
                            className="flex items-center gap-1.5 px-3 py-1.5 bg-indigo-50 hover:bg-indigo-100 text-indigo-600 rounded-lg text-xs font-bold transition-all"
                          >
                            <RiPlayLine className="text-sm" />
                            Log Time
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
          {loading ? (
            <SkeletonTable rows={6} />
          ) : timesheets.length === 0 ? (
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
                    <th className="text-left px-5 py-3.5 font-bold text-slate-600 text-xs uppercase tracking-wider">
                      Date
                    </th>
                    <th className="text-left px-5 py-3.5 font-bold text-slate-600 text-xs uppercase tracking-wider">
                      Project
                    </th>
                    <th className="text-left px-5 py-3.5 font-bold text-slate-600 text-xs uppercase tracking-wider">
                      Task
                    </th>
                    <th className="text-left px-5 py-3.5 font-bold text-slate-600 text-xs uppercase tracking-wider">
                      Hours
                    </th>
                    <th className="text-left px-5 py-3.5 font-bold text-slate-600 text-xs uppercase tracking-wider">
                      Description
                    </th>
                    <th className="text-left px-5 py-3.5 font-bold text-slate-600 text-xs uppercase tracking-wider">
                      Status
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {timesheets.map((ts) => (
                    <tr key={ts._id} className="hover:bg-slate-50 transition-colors">
                      <td className="px-5 py-4 text-slate-700 font-medium whitespace-nowrap">
                        {formatDate(ts.date)}
                      </td>
                      <td className="px-5 py-4 text-slate-600">
                        {ts.project_id?.name ?? "—"}
                      </td>
                      <td className="px-5 py-4 text-slate-600 max-w-[180px]">
                        <span className="truncate block">
                          {ts.task_id?.task_title ?? "—"}
                        </span>
                      </td>
                      <td className="px-5 py-4">
                        <span className="font-bold text-slate-800">{ts.hours_worked}</span>
                        <span className="text-slate-400 text-xs ml-1">hrs</span>
                      </td>
                      <td className="px-5 py-4 text-slate-500 max-w-[220px]">
                        <span className="truncate block">{ts.work_description ?? "—"}</span>
                      </td>
                      <td className="px-5 py-4">
                        <span
                          className={`px-2.5 py-1 rounded-lg text-xs font-bold ${
                            timesheetStatusConfig[ts.status] ?? "bg-slate-100 text-slate-600"
                          }`}
                        >
                          {ts.status ?? "—"}
                        </span>
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
        onClose={() => {
          setTimesheetModal(false);
          setSelectedTask(null);
        }}
        onRefresh={fetchAll}
        projects={projects}
        tasks={tasks}
        selectedTask={selectedTask}
        onSuccess={() => addToast("Timesheet submitted successfully!")}
      />

      {/* Toast Notifications */}
      <Toast toasts={toasts} onRemove={removeToast} />
    </div>
  );
};

export default MyTasks;
