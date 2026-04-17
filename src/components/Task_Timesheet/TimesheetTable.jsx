import { useState, useMemo } from "react";
import TaskDetailsModal from "./TaskModel";
import TimesheetApprovalModal from "./TimesheetApprovalModal";
import { useAuth } from "../../contexts/AuthContext";
import axios from "axios";
import {
  RiEditLine, RiDeleteBinLine, RiLoader4Line, RiCheckLine,
  RiAlertLine, RiCloseLine, RiArrowUpSLine, RiArrowDownSLine,
} from "react-icons/ri";
import { BASE_URL } from "../../config/api";

// ── Status badge configs ──────────────────────────────────────────────────────
const TASK_STATUS_CFG = {
  "Todo":        "bg-slate-100  text-slate-700  border-slate-200",
  "In Progress": "bg-blue-100   text-blue-700   border-blue-200",
  "Review":      "bg-purple-100 text-purple-700 border-purple-200",
  "Completed":   "bg-emerald-100 text-emerald-700 border-emerald-200",
  "Blocked":     "bg-red-100    text-red-700    border-red-200",
};
const TS_STATUS_CFG = {
  "Submitted": "bg-amber-100   text-amber-700   border-amber-200",
  "Approved":  "bg-emerald-100 text-emerald-700 border-emerald-200",
  "Rejected":  "bg-red-100     text-red-700     border-red-200",
};
const PRIORITY_CFG = {
  "Low":      "bg-emerald-50 text-emerald-700",
  "Medium":   "bg-amber-50   text-amber-700",
  "High":     "bg-red-50     text-red-700",
  "Critical": "bg-purple-50  text-purple-700",
};

const fmtDate = (d) => d ? new Date(d).toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric" }) : "—";

// ── Confirm Delete Dialog ─────────────────────────────────────────────────────
const DeleteConfirm = ({ item, type, onConfirm, onCancel, loading }) => (
  <div className="fixed inset-0 z-[120] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
    <div className="bg-white rounded-2xl w-full max-w-sm shadow-2xl overflow-hidden">
      <div className="flex items-center gap-3 px-5 py-4 bg-red-50 border-b border-red-100">
        <div className="p-2 bg-red-100 rounded-xl"><RiAlertLine size={18} className="text-red-600" /></div>
        <div>
          <h3 className="font-bold text-slate-800">Delete {type === "tasks" ? "Task" : "Timesheet"}?</h3>
          <p className="text-xs text-slate-500 mt-0.5">This action cannot be undone</p>
        </div>
        <button onClick={onCancel} className="ml-auto p-1.5 hover:bg-red-100 rounded-lg"><RiCloseLine size={16} className="text-slate-500" /></button>
      </div>
      <div className="p-5">
        <p className="text-sm text-slate-600 mb-4">
          {type === "tasks"
            ? `Delete task "${item?.task_title}"?`
            : `Delete timesheet for ${item?.employee_id?.name || "employee"} (${item?.hours_worked}h)?`}
        </p>
        <div className="flex gap-3">
          <button onClick={onCancel} className="flex-1 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-xl text-sm transition-all">Cancel</button>
          <button onClick={onConfirm} disabled={loading} className="flex-1 py-2.5 bg-red-600 hover:bg-red-700 text-white font-bold rounded-xl text-sm transition-all disabled:opacity-50 flex items-center justify-center gap-2">
            {loading ? <RiLoader4Line className="animate-spin" size={15} /> : <RiDeleteBinLine size={15} />}
            {loading ? "Deleting..." : "Delete"}
          </button>
        </div>
      </div>
    </div>
  </div>
);

// ── Progress Bar ──────────────────────────────────────────────────────────────
const ProgressBar = ({ value = 0 }) => {
  const pct = Math.max(0, Math.min(100, value));
  const color = pct >= 80 ? "bg-emerald-500" : pct >= 50 ? "bg-blue-500" : pct >= 25 ? "bg-amber-500" : "bg-red-400";
  return (
    <div className="flex items-center gap-2 min-w-[100px]">
      <div className="flex-1 h-1.5 bg-slate-100 rounded-full overflow-hidden">
        <div className={`h-full rounded-full transition-all duration-300 ${color}`} style={{ width: `${pct}%` }} />
      </div>
      <span className="text-xs font-bold text-slate-600 w-8 text-right">{pct}%</span>
    </div>
  );
};

// ── Main Table ────────────────────────────────────────────────────────────────
const TasksTable = ({ data, type = "tasks", onRefresh, filters = {}, role }) => {
  const { token } = useAuth();

  const [selectedTask,      setSelectedTask]      = useState(null);
  const [selectedTimesheet, setSelectedTimesheet] = useState(null);
  const [deleteTarget,      setDeleteTarget]      = useState(null);
  const [deleting,          setDeleting]          = useState(false);
  const [sortKey,           setSortKey]           = useState(null);
  const [sortDir,           setSortDir]           = useState("asc");

  const canManage = ["admin", "superadmin"].includes(role);

  // ── Filter ──────────────────────────────────────────────────────────────────
  const filtered = useMemo(() => {
    if (!Array.isArray(data)) return [];
    return data.filter(item => {
      const search = (filters.search || "").toLowerCase().trim();
      const matchSearch = !search ||
        item.task_title?.toLowerCase().includes(search) ||
        item.work_description?.toLowerCase().includes(search) ||
        item.assigned_to?.name?.toLowerCase().includes(search) ||
        item.employee_id?.name?.toLowerCase().includes(search) ||
        item.project_id?.name?.toLowerCase().includes(search);

      const matchStatus = !filters.status || filters.status === "All" || item.status === filters.status;
      return matchSearch && matchStatus;
    });
  }, [data, filters]);

  // ── Sort ────────────────────────────────────────────────────────────────────
  const sorted = useMemo(() => {
    if (!sortKey) return filtered;
    return [...filtered].sort((a, b) => {
      let av = a[sortKey], bv = b[sortKey];
      if (typeof av === "string") av = av.toLowerCase();
      if (typeof bv === "string") bv = bv.toLowerCase();
      if (av < bv) return sortDir === "asc" ? -1 : 1;
      if (av > bv) return sortDir === "asc" ? 1 : -1;
      return 0;
    });
  }, [filtered, sortKey, sortDir]);

  const toggleSort = (key) => {
    if (sortKey === key) setSortDir(d => d === "asc" ? "desc" : "asc");
    else { setSortKey(key); setSortDir("asc"); }
  };

  const SortIcon = ({ k }) => sortKey === k
    ? (sortDir === "asc" ? <RiArrowUpSLine size={14} className="text-blue-500" /> : <RiArrowDownSLine size={14} className="text-blue-500" />)
    : <RiArrowUpSLine size={14} className="text-slate-300" />;

  // ── Delete ──────────────────────────────────────────────────────────────────
  const handleDelete = async () => {
    if (!deleteTarget) return;
    setDeleting(true);
    try {
      const endpoint = type === "tasks"
        ? `/api/admin/tasks/${deleteTarget._id}`
        : `/api/admin/timesheets/${deleteTarget._id}`;
      await axios.delete(`${BASE_URL}${endpoint}`, { headers: { Authorization: `Bearer ${token}` } });
      setDeleteTarget(null);
      onRefresh();
    } catch (err) {
      alert(err.response?.data?.message || "Delete failed");
    } finally {
      setDeleting(false);
    }
  };

  // ── Th helper ───────────────────────────────────────────────────────────────
  const Th = ({ label, sortable, k, center }) => (
    <th
      onClick={sortable ? () => toggleSort(k) : undefined}
      className={`px-5 py-3.5 text-[10px] font-black uppercase tracking-wider text-slate-500 ${center ? "text-center" : "text-left"} ${sortable ? "cursor-pointer hover:text-slate-700 select-none" : ""}`}
    >
      <span className="flex items-center gap-1 ${center ? 'justify-center' : ''}">
        {label}
        {sortable && <SortIcon k={k} />}
      </span>
    </th>
  );

  // ── Empty state ─────────────────────────────────────────────────────────────
  if (sorted.length === 0) {
    return (
      <div className="bg-white rounded-b-2xl border-x border-b border-slate-100 py-16 text-center text-slate-400">
        <i className={`${type === "tasks" ? "ri-task-line" : "ri-time-line"} text-5xl opacity-30 block mb-3`} />
        <p className="font-semibold text-slate-500">No {type} found</p>
        <p className="text-sm mt-1">{filters.search || (filters.status && filters.status !== "All") ? "Try adjusting your filters" : `No ${type} have been created yet`}</p>
      </div>
    );
  }

  // ── TASKS TABLE ─────────────────────────────────────────────────────────────
  if (type === "tasks") {
    return (
      <>
        <div className="bg-white rounded-b-2xl border-x border-b border-slate-100 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full min-w-[900px]">
              <thead className="bg-slate-50 border-b border-slate-100">
                <tr>
                  <Th label="Assignee"  sortable k="assigned_to" />
                  <Th label="Task"      sortable k="task_title" />
                  <Th label="Project" />
                  <Th label="Priority"  center />
                  <Th label="Status"    center />
                  <Th label="Progress"  center />
                  <Th label="Due Date"  sortable k="due_date" center />
                  <Th label="Actions"   center />
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                {sorted.map((task) => {
                  const overdue = task.due_date && task.status !== "Completed" && new Date(task.due_date) < new Date();
                  return (
                    <tr key={task._id} className="hover:bg-slate-50/60 transition-colors group">
                      {/* Assignee */}
                      <td className="px-5 py-4">
                        <div className="flex items-center gap-2.5">
                          <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-white text-xs font-black shrink-0">
                            {(task.assigned_to?.name || "?").charAt(0).toUpperCase()}
                          </div>
                          <div>
                            <p className="font-semibold text-slate-800 text-sm">{task.assigned_to?.name || "—"}</p>
                            <p className="text-[10px] text-slate-400">{task.assigned_to?.department || ""}</p>
                          </div>
                        </div>
                      </td>
                      {/* Task */}
                      <td className="px-5 py-4 max-w-[200px]">
                        <p className="font-semibold text-slate-800 text-sm truncate">{task.task_title}</p>
                        {task.description && <p className="text-xs text-slate-400 truncate mt-0.5">{task.description}</p>}
                      </td>
                      {/* Project */}
                      <td className="px-5 py-4">
                        <span className="px-2.5 py-1 bg-slate-100 text-slate-600 rounded-lg text-xs font-semibold">
                          {task.project_id?.name || "—"}
                        </span>
                      </td>
                      {/* Priority */}
                      <td className="px-5 py-4 text-center">
                        <span className={`px-2.5 py-1 rounded-lg text-xs font-bold ${PRIORITY_CFG[task.priority] || "bg-slate-100 text-slate-600"}`}>
                          {task.priority || "—"}
                        </span>
                      </td>
                      {/* Status */}
                      <td className="px-5 py-4 text-center">
                        <span className={`px-2.5 py-1 rounded-full text-[10px] font-black border ${TASK_STATUS_CFG[task.status] || "bg-slate-100 text-slate-600 border-slate-200"}`}>
                          {task.status}
                        </span>
                      </td>
                      {/* Progress */}
                      <td className="px-5 py-4">
                        <ProgressBar value={task.progress} />
                      </td>
                      {/* Due Date */}
                      <td className="px-5 py-4 text-center">
                        <span className={`text-sm font-medium ${overdue ? "text-red-600 font-bold" : "text-slate-600"}`}>
                          {fmtDate(task.due_date)}
                        </span>
                        {overdue && <span className="block text-[10px] text-red-500 font-bold mt-0.5">Overdue</span>}
                      </td>
                      {/* Actions */}
                      <td className="px-5 py-4">
                        <div className="flex items-center justify-center gap-1">
                          <button onClick={() => setSelectedTask(task)} className="p-1.5 text-blue-500 hover:bg-blue-50 rounded-lg transition-all" title="Edit">
                            <RiEditLine size={15} />
                          </button>
                          {canManage && (
                            <button onClick={() => setDeleteTarget(task)} className="p-1.5 text-red-400 hover:bg-red-50 rounded-lg transition-all" title="Delete">
                              <RiDeleteBinLine size={15} />
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
          {/* Footer count */}
          <div className="px-5 py-3 border-t border-slate-100 bg-slate-50 text-xs text-slate-400 font-medium">
            Showing {sorted.length} of {Array.isArray(data) ? data.length : 0} tasks
          </div>
        </div>

        {selectedTask && <TaskDetailsModal task={selectedTask} onClose={() => setSelectedTask(null)} onRefresh={onRefresh} />}
        {deleteTarget && <DeleteConfirm item={deleteTarget} type="tasks" onConfirm={handleDelete} onCancel={() => setDeleteTarget(null)} loading={deleting} />}
      </>
    );
  }

  // ── TIMESHEETS TABLE ─────────────────────────────────────────────────────────
  return (
    <>
      <div className="bg-white rounded-b-2xl border-x border-b border-slate-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[800px]">
            <thead className="bg-slate-50 border-b border-slate-100">
              <tr>
                <Th label="Employee"    sortable k="employee_id" />
                <Th label="Project" />
                <Th label="Task" />
                <Th label="Date"        sortable k="date" center />
                <Th label="Hours"       sortable k="hours_worked" center />
                <Th label="Description" />
                <Th label="Status"      center />
                <Th label="Actions"     center />
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {sorted.map((ts) => (
                <tr key={ts._id} className="hover:bg-slate-50/60 transition-colors">
                  {/* Employee */}
                  <td className="px-5 py-4">
                    <div className="flex items-center gap-2.5">
                      <div className="w-8 h-8 rounded-full bg-gradient-to-br from-purple-500 to-indigo-600 flex items-center justify-center text-white text-xs font-black shrink-0">
                        {(ts.employee_id?.name || "?").charAt(0).toUpperCase()}
                      </div>
                      <p className="font-semibold text-slate-800 text-sm">{ts.employee_id?.name || "—"}</p>
                    </div>
                  </td>
                  {/* Project */}
                  <td className="px-5 py-4">
                    <span className="px-2.5 py-1 bg-slate-100 text-slate-600 rounded-lg text-xs font-semibold">
                      {ts.project_id?.name || "—"}
                    </span>
                  </td>
                  {/* Task */}
                  <td className="px-5 py-4 max-w-[140px]">
                    <span className="text-xs text-slate-500 truncate block">{ts.task_id?.task_title || "—"}</span>
                  </td>
                  {/* Date */}
                  <td className="px-5 py-4 text-center text-sm text-slate-600 whitespace-nowrap">{fmtDate(ts.date)}</td>
                  {/* Hours */}
                  <td className="px-5 py-4 text-center">
                    <span className="font-black text-slate-800 text-base">{ts.hours_worked}</span>
                    <span className="text-slate-400 text-xs ml-0.5">h</span>
                  </td>
                  {/* Description */}
                  <td className="px-5 py-4 max-w-[200px]">
                    <p className="text-xs text-slate-500 truncate" title={ts.work_description}>{ts.work_description || "—"}</p>
                    {ts.status === "Rejected" && ts.rejection_reason && (
                      <p className="text-[10px] text-red-500 mt-0.5 truncate" title={ts.rejection_reason}>Reason: {ts.rejection_reason}</p>
                    )}
                  </td>
                  {/* Status */}
                  <td className="px-5 py-4 text-center">
                    <span className={`px-2.5 py-1 rounded-full text-[10px] font-black border ${TS_STATUS_CFG[ts.status] || "bg-slate-100 text-slate-600 border-slate-200"}`}>
                      {ts.status}
                    </span>
                    {ts.approved_by?.name && ts.status === "Approved" && (
                      <p className="text-[10px] text-slate-400 mt-0.5">by {ts.approved_by.name}</p>
                    )}
                  </td>
                  {/* Actions */}
                  <td className="px-5 py-4">
                    <div className="flex items-center justify-center gap-1">
                      {ts.status === "Submitted" && !["employee"].includes(role) && (
                        <button onClick={() => setSelectedTimesheet(ts)} className="p-1.5 text-indigo-500 hover:bg-indigo-50 rounded-lg transition-all" title="Approve / Reject">
                          <RiCheckLine size={15} />
                        </button>
                      )}
                      {canManage && (
                        <button onClick={() => setDeleteTarget(ts)} className="p-1.5 text-red-400 hover:bg-red-50 rounded-lg transition-all" title="Delete">
                          <RiDeleteBinLine size={15} />
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {/* Footer */}
        <div className="px-5 py-3 border-t border-slate-100 bg-slate-50 flex items-center justify-between text-xs text-slate-400 font-medium">
          <span>Showing {sorted.length} of {Array.isArray(data) ? data.length : 0} timesheets</span>
          <span className="font-bold text-slate-600">
            Total: {sorted.reduce((s, t) => s + (t.hours_worked || 0), 0).toFixed(1)}h logged
          </span>
        </div>
      </div>

      {selectedTimesheet && (
        <TimesheetApprovalModal
          open={true}
          timesheet={selectedTimesheet}
          onClose={() => setSelectedTimesheet(null)}
          onRefresh={onRefresh}
        />
      )}
      {deleteTarget && (
        <DeleteConfirm item={deleteTarget} type="timesheets" onConfirm={handleDelete} onCancel={() => setDeleteTarget(null)} loading={deleting} />
      )}
    </>
  );
};

export default TasksTable;
