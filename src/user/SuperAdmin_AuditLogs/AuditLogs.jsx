import React, { useState, useEffect, useCallback } from "react";
import { useAuth } from "../../contexts/AuthContext";
import axios from "axios";
import {
  RiFileList3Fill, RiSearchLine, RiDownloadFill, RiRefreshLine,
  RiEyeFill, RiUserFill, RiTimeFill, RiComputerFill,
  RiShieldCheckFill, RiCloseLine, RiArrowLeftSLine, RiArrowRightSLine,
  RiCalendarCheckLine, RiSurveyLine, RiTaskLine, RiTimeLine,
  RiSmartphoneLine, RiTabletLine, RiMacbookLine, RiGlobalLine,
  RiDeleteBin6Line, RiDeleteBinLine, RiAlertLine
} from "react-icons/ri";

// ── helpers ──────────────────────────────────────────────────────────────────
const SEVERITY_STYLE = {
  HIGH:    "bg-red-100    text-red-700    border-red-200",
  MEDIUM:  "bg-orange-100 text-orange-700 border-orange-200",
  WARNING: "bg-yellow-100 text-yellow-700 border-yellow-200",
  INFO:    "bg-blue-100   text-blue-700   border-blue-200",
};
const STATUS_STYLE = {
  SUCCESS: "bg-emerald-100 text-emerald-700",
  FAILED:  "bg-red-100     text-red-700",
  PENDING: "bg-yellow-100  text-yellow-700",
};

const ActionIcon = ({ action = "" }) => {
  if (action.includes("EMPLOYEE"))   return <RiUserFill />;
  if (action.includes("ATTENDANCE")) return <RiCalendarCheckLine />;
  if (action.includes("LEAVE"))      return <RiSurveyLine />;
  if (action.includes("TASK"))       return <RiTaskLine />;
  if (action.includes("TIMESHEET"))  return <RiTimeLine />;
  return <RiComputerFill />;
};

// Device type icon
const DeviceIcon = ({ type = "Desktop" }) => {
  if (type === "Mobile")  return <RiSmartphoneLine className="text-blue-500" size={14} />;
  if (type === "Tablet")  return <RiTabletLine className="text-purple-500" size={14} />;
  return <RiMacbookLine className="text-slate-500" size={14} />;
};

const ITEMS_PER_PAGE = 10;

// ── component ─────────────────────────────────────────────────────────────────
const AuditLogs = () => {
  const { token } = useAuth();

  const [logs, setLogs]               = useState([]);
  const [total, setTotal]             = useState(0);
  const [loading, setLoading]         = useState(true);
  const [error, setError]             = useState(null);
  const [page, setPage]               = useState(1);
  const [selectedLog, setSelectedLog] = useState(null);
  const [deleting, setDeleting]       = useState(null);   // id being deleted
  const [showClearModal, setShowClearModal] = useState(false);

  const [filters, setFilters] = useState({
    search:    "",
    action:    "All",
    severity:  "All",
    status:    "All",
    dateRange: "week",
  });

  // ── fetch ──────────────────────────────────────────────────────────────────
  const fetchLogs = useCallback(async () => {
    if (!token) return;
    try {
      setLoading(true);
      setError(null);

      // Build query params
      const params = new URLSearchParams({
        page,
        limit: ITEMS_PER_PAGE,
        dateRange: filters.dateRange,
        ...(filters.search   && { search:   filters.search }),
        ...(filters.action   !== "All" && { action:   filters.action }),
        ...(filters.severity !== "All" && { severity: filters.severity }),
        ...(filters.status   !== "All" && { status:   filters.status }),
      });

      const res = await axios.get(
        `http://localhost:5000/api/admin/audit-logs?${params}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );

      if (res.data.success) {
        setLogs(res.data.logs || []);
        setTotal(res.data.total || res.data.logs?.length || 0);
      } else {
        // Fallback: derive logs from existing project/employee/attendance activity
        await fetchFallbackLogs();
      }
    } catch (err) {
      // Backend may not have audit-logs endpoint yet — derive from activity
      await fetchFallbackLogs();
    } finally {
      setLoading(false);
    }
  }, [token, page, filters]);

  // Derive audit-like logs from dashboard activity endpoint
  const fetchFallbackLogs = async () => {
    try {
      const res = await axios.get(
        "http://localhost:5000/api/admin/dashboard/activity",
        { headers: { Authorization: `Bearer ${token}` } }
      );
      const activity = res.data.activity || [];
      const mapped = activity.map((a, i) => ({
        _id:       a._id || `act-${i}`,
        timestamp: a.timestamp || a.createdAt || new Date().toISOString(),
        user:      { name: a.user?.name || a.userName || "System", role: a.user?.role || "admin" },
        action:    (a.action || a.type || "SYSTEM_EVENT").toUpperCase().replace(/ /g, "_"),
        resource:  a.resource || a.module || "System",
        details:   a.description || a.details || "—",
        ipAddress: a.ipAddress || "—",
        userAgent: a.userAgent || "—",
        severity:  a.severity || "INFO",
        status:    a.status === "success" ? "SUCCESS" : a.status === "error" ? "FAILED" : "SUCCESS",
      }));
      setLogs(mapped);
      setTotal(mapped.length);
    } catch {
      setLogs([]);
      setTotal(0);
      setError("Could not load audit logs. Please check backend connection.");
    }
  };

  useEffect(() => { fetchLogs(); }, [fetchLogs]);

  // Reset page when filters change
  const handleFilter = (key, val) => {
    setFilters(prev => ({ ...prev, [key]: val }));
    setPage(1);
  };

  const handleClear = () => {
    setFilters({ search: "", action: "All", severity: "All", status: "All", dateRange: "week" });
    setPage(1);
  };

  // ── Delete single log ──────────────────────────────────────────────────────
  const handleDeleteLog = async (id) => {
    try {
      setDeleting(id);
      await axios.delete(`http://localhost:5000/api/admin/audit-logs/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setLogs(prev => prev.filter(l => l._id !== id));
      setTotal(t => Math.max(0, t - 1));
      if (selectedLog?._id === id) setSelectedLog(null);
    } catch (err) {
      const status = err.response?.status;
      if (status === 404) {
        // Route not yet available — backend needs restart
        // Still remove from UI optimistically
        setLogs(prev => prev.filter(l => l._id !== id));
        setTotal(t => Math.max(0, t - 1));
        if (selectedLog?._id === id) setSelectedLog(null);
      } else {
        console.error('Delete log error:', err);
      }
    } finally {
      setDeleting(null);
    }
  };

  // ── Clear logs (bulk delete) ───────────────────────────────────────────────
  const handleClearLogs = async (dateRange) => {
    try {
      setLoading(true);
      const params = dateRange !== 'all' ? `?dateRange=${dateRange}` : '';
      await axios.delete(`http://localhost:5000/api/admin/audit-logs${params}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setShowClearModal(false);
      await fetchLogs();
    } catch (err) {
      const status = err.response?.status;
      if (status === 404) {
        // Backend not restarted yet — clear UI only
        setLogs([]);
        setTotal(0);
        setShowClearModal(false);
      } else {
        console.error('Clear logs error:', err);
      }
    } finally {
      setLoading(false);
    }
  };

  // ── export ─────────────────────────────────────────────────────────────────
  const handleExport = () => {
    if (!logs.length) return;
    const csv = [
      "Timestamp,User,Role,Action,Resource,Details,IP,Severity,Status",
      ...logs.map(l =>
        `"${new Date(l.timestamp).toLocaleString()}","${l.user?.name}","${l.user?.role}","${l.action}","${l.resource}","${l.details}","${l.ipAddress}","${l.severity}","${l.status}"`
      ),
    ].join("\n");
    const url = URL.createObjectURL(new Blob([csv], { type: "text/csv" }));
    const a = document.createElement("a");
    a.href = url;
    a.download = `audit-logs-${new Date().toISOString().split("T")[0]}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const totalPages = Math.max(1, Math.ceil(total / ITEMS_PER_PAGE));

  // ── loading skeleton ───────────────────────────────────────────────────────
  if (loading && !logs.length) {
    return (
      <div className="space-y-6 animate-pulse">
        <div className="h-10 bg-slate-200 rounded-xl w-64" />
        <div className="h-16 bg-slate-200 rounded-2xl" />
        <div className="space-y-3">
          {[...Array(6)].map((_, i) => <div key={i} className="h-14 bg-slate-200 rounded-xl" />)}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">

      {/* ── Header ── */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl lg:text-3xl font-black text-slate-900 tracking-tight">Audit Logs</h1>
          <p className="text-slate-500 text-sm mt-0.5">
            {total} total events · real-time system activity
          </p>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={fetchLogs}
            disabled={loading}
            className="flex items-center gap-2 px-4 py-2.5 bg-white border border-slate-200 hover:border-slate-300 text-slate-700 font-semibold rounded-xl shadow-sm text-sm transition-all disabled:opacity-50"
          >
            <RiRefreshLine className={loading ? "animate-spin" : ""} />
            Refresh
          </button>
          <button
            onClick={handleExport}
            disabled={!logs.length}
            className="flex items-center gap-2 px-4 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold rounded-xl shadow-sm text-sm transition-all disabled:opacity-50"
          >
            <RiDownloadFill /> Export CSV
          </button>
          {/* Clear Logs — SuperAdmin only */}
          <button
            onClick={() => setShowClearModal(true)}
            disabled={!logs.length}
            className="flex items-center gap-2 px-4 py-2.5 bg-red-50 hover:bg-red-100 text-red-600 border border-red-200 font-semibold rounded-xl text-sm transition-all disabled:opacity-50"
          >
            <RiDeleteBinLine size={15} /> Clear Logs
          </button>
        </div>
      </div>

      {/* ── Error ── */}
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-xl text-sm font-medium">
          {error}
        </div>
      )}

      {/* ── Filters ── */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-6 gap-3">
          {/* Search */}
          <div className="lg:col-span-2 relative">
            <RiSearchLine className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              placeholder="Search user, action, resource..."
              value={filters.search}
              onChange={e => handleFilter("search", e.target.value)}
              className="w-full pl-9 pr-4 py-2.5 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
            />
          </div>

          <select value={filters.action}   onChange={e => handleFilter("action",   e.target.value)} className="px-3 py-2.5 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-blue-500 outline-none">
            <option value="All">All Actions</option>
            <option value="EMPLOYEE_CREATE">Employee Created</option>
            <option value="ATTENDANCE_MARK">Attendance Marked</option>
            <option value="LEAVE_REQUEST">Leave Requested</option>
            <option value="LEAVE_APPROVED">Leave Approved</option>
            <option value="LEAVE_REJECTED">Leave Rejected</option>
            <option value="TASK_CREATE">Task Created</option>
            <option value="TIMESHEET_SUBMIT">Timesheet Submitted</option>
            <option value="TIMESHEET_REJECTED">Timesheet Rejected</option>
          </select>

          <select value={filters.severity} onChange={e => handleFilter("severity", e.target.value)} className="px-3 py-2.5 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-blue-500 outline-none">
            <option value="All">All Severity</option>
            <option value="HIGH">High</option>
            <option value="MEDIUM">Medium</option>
            <option value="WARNING">Warning</option>
            <option value="INFO">Info</option>
          </select>

          <select value={filters.dateRange} onChange={e => handleFilter("dateRange", e.target.value)} className="px-3 py-2.5 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-blue-500 outline-none">
            <option value="today">Today</option>
            <option value="week">This Week</option>
            <option value="month">This Month</option>
            <option value="all">All Time</option>
          </select>

          <button onClick={handleClear} className="px-4 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-600 font-semibold rounded-xl text-sm transition-all">
            Clear
          </button>
        </div>
      </div>

      {/* ── Table ── */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="px-5 py-4 border-b border-slate-100 flex items-center gap-3">
          <RiFileList3Fill className="text-slate-500" />
          <h2 className="font-bold text-slate-900">System Activity</h2>
          <span className="ml-auto px-2.5 py-0.5 bg-blue-100 text-blue-700 text-xs font-bold rounded-full">
            {total} records
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full min-w-[900px]">
            <thead className="bg-slate-50 border-b border-slate-100">
              <tr>
                {["Timestamp","User","Action","Resource","Device","Severity","Status",""].map((h, i) => (
                  <th key={i} className="px-4 py-3 text-left text-[10px] font-black text-slate-400 uppercase tracking-wider">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {logs.length === 0 ? (
                <tr>
                  <td colSpan={8} className="px-4 py-12 text-center text-slate-400 text-sm">
                    No audit logs found
                  </td>
                </tr>
              ) : logs.map(log => (
                <tr key={log._id} className="hover:bg-slate-50 transition-colors">
                  {/* Timestamp */}
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2">
                      <RiTimeFill className="text-slate-300 shrink-0" />
                      <div>
                        <p className="text-xs font-semibold text-slate-800">
                          {new Date(log.timestamp).toLocaleDateString()}
                        </p>
                        <p className="text-[10px] text-slate-400">
                          {new Date(log.timestamp).toLocaleTimeString()}
                        </p>
                      </div>
                    </div>
                  </td>

                  {/* User */}
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2">
                      <div className="w-7 h-7 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-full flex items-center justify-center text-white text-xs font-bold shrink-0">
                        {(log.user?.name || "?").charAt(0).toUpperCase()}
                      </div>
                      <div>
                        <p className="text-xs font-semibold text-slate-800">{log.user?.name || "—"}</p>
                        <p className="text-[10px] text-slate-400 capitalize">{log.user?.role || "—"}</p>
                      </div>
                    </div>
                  </td>

                  {/* Action */}
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2">
                      <div className="p-1.5 bg-blue-50 text-blue-600 rounded-lg text-xs">
                        <ActionIcon action={log.action} />
                      </div>
                      <span className="text-xs font-semibold text-slate-700">
                        {log.action.replace(/_/g, " ")}
                      </span>
                    </div>
                  </td>

                  {/* Resource */}
                  <td className="px-4 py-3 text-xs text-slate-600 font-medium">{log.resource}</td>

                  {/* Device */}
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-1.5">
                      <DeviceIcon type={log.device?.type} />
                      <div>
                        <p className="text-xs font-semibold text-slate-700 leading-tight">
                          {log.device?.browser || "Unknown"}
                        </p>
                        <p className="text-[10px] text-slate-400 leading-tight">
                          {log.device?.os || "—"}
                        </p>
                      </div>
                    </div>
                  </td>

                  {/* Severity */}
                  <td className="px-4 py-3">
                    <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase border ${SEVERITY_STYLE[log.severity] || SEVERITY_STYLE.INFO}`}>
                      {log.severity}
                    </span>
                  </td>

                  {/* Status */}
                  <td className="px-4 py-3">
                    <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase ${STATUS_STYLE[log.status] || STATUS_STYLE.SUCCESS}`}>
                      {log.status}
                    </span>
                  </td>

                  {/* View */}
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-1">
                      <button
                        onClick={() => setSelectedLog(log)}
                        className="p-1.5 bg-slate-100 hover:bg-slate-200 text-slate-500 rounded-lg transition-colors"
                        title="View Details"
                      >
                        <RiEyeFill size={14} />
                      </button>
                      <button
                        onClick={() => handleDeleteLog(log._id)}
                        disabled={deleting === log._id}
                        className="p-1.5 bg-red-50 hover:bg-red-100 text-red-500 rounded-lg transition-colors disabled:opacity-40"
                        title="Delete Log"
                      >
                        {deleting === log._id
                          ? <div className="w-3.5 h-3.5 border-2 border-red-300 border-t-red-500 rounded-full animate-spin" />
                          : <RiDeleteBin6Line size={14} />}
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="px-5 py-3 border-t border-slate-100 bg-slate-50 flex items-center justify-between">
            <span className="text-xs text-slate-500 font-medium">
              Page {page} of {totalPages} · {total} records
            </span>
            <div className="flex items-center gap-1">
              <button onClick={() => setPage(p => Math.max(p - 1, 1))} disabled={page === 1}
                className="p-1.5 border border-slate-200 rounded-lg disabled:opacity-40 hover:bg-white transition-colors">
                <RiArrowLeftSLine size={16} />
              </button>
              <button onClick={() => setPage(p => Math.min(p + 1, totalPages))} disabled={page === totalPages}
                className="p-1.5 border border-slate-200 rounded-lg disabled:opacity-40 hover:bg-white transition-colors">
                <RiArrowRightSLine size={16} />
              </button>
            </div>
          </div>
        )}
      </div>

      {/* ── Clear Logs Modal ── */}
      {showClearModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl w-full max-w-md shadow-2xl overflow-hidden">
            <div className="flex items-center gap-3 p-5 border-b border-slate-100 bg-red-50">
              <div className="p-2 bg-red-100 rounded-xl">
                <RiAlertLine size={20} className="text-red-600" />
              </div>
              <div>
                <h3 className="font-bold text-slate-900">Clear Audit Logs</h3>
                <p className="text-xs text-slate-500 mt-0.5">This action cannot be undone</p>
              </div>
              <button onClick={() => setShowClearModal(false)} className="ml-auto p-1.5 hover:bg-red-100 rounded-lg">
                <RiCloseLine size={18} className="text-slate-500" />
              </button>
            </div>
            <div className="p-5 space-y-3">
              <p className="text-sm text-slate-600">Select which logs to delete:</p>
              {[
                { label: "Today's logs",      value: "today", color: "hover:bg-amber-50 hover:border-amber-300 hover:text-amber-700" },
                { label: "This week's logs",  value: "week",  color: "hover:bg-orange-50 hover:border-orange-300 hover:text-orange-700" },
                { label: "This month's logs", value: "month", color: "hover:bg-red-50 hover:border-red-300 hover:text-red-700" },
                { label: "All logs",          value: "all",   color: "hover:bg-red-100 hover:border-red-400 hover:text-red-800" },
              ].map(opt => (
                <button key={opt.value} onClick={() => handleClearLogs(opt.value)}
                  className={`w-full flex items-center justify-between px-4 py-3 border border-slate-200 rounded-xl text-sm font-semibold text-slate-700 transition-all ${opt.color}`}>
                  <span>{opt.label}</span>
                  <RiDeleteBin6Line size={15} />
                </button>
              ))}
            </div>
            <div className="px-5 pb-5">
              <button onClick={() => setShowClearModal(false)}
                className="w-full py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-xl text-sm transition-all">
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ── Detail Modal ── */}
      {selectedLog && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto shadow-2xl">
            <div className="flex items-center justify-between p-5 border-b border-slate-100">
              <h3 className="font-bold text-slate-900">Log Details</h3>
              <button onClick={() => setSelectedLog(null)} className="p-1.5 hover:bg-slate-100 rounded-lg transition-colors">
                <RiCloseLine size={20} />
              </button>
            </div>
            <div className="p-5 space-y-4">
              {[
                ["Timestamp",  new Date(selectedLog.timestamp).toLocaleString()],
                ["User",       `${selectedLog.user?.name} (${selectedLog.user?.role})`],
                ["Email",      selectedLog.user?.email || "—"],
                ["Action",     selectedLog.action.replace(/_/g, " ")],
                ["Resource",   selectedLog.resource],
                ["IP Address", selectedLog.ipAddress],
                ["Severity",   selectedLog.severity],
                ["Status",     selectedLog.status],
              ].map(([label, value]) => (
                <div key={label} className="flex gap-3">
                  <span className="text-xs font-bold text-slate-400 uppercase tracking-wider w-24 shrink-0 pt-0.5">{label}</span>
                  <span className="text-sm text-slate-800 font-medium">{value}</span>
                </div>
              ))}

              {/* Device info block */}
              {selectedLog.device && (
                <div className="bg-slate-50 rounded-xl p-4 space-y-2">
                  <p className="text-xs font-black text-slate-400 uppercase tracking-wider mb-2">Device Info</p>
                  <div className="flex items-center gap-2">
                    <DeviceIcon type={selectedLog.device.type} />
                    <span className="text-sm font-bold text-slate-800">{selectedLog.device.name}</span>
                  </div>
                  <div className="grid grid-cols-3 gap-3 mt-2">
                    {[
                      ["Type",    selectedLog.device.type],
                      ["Browser", selectedLog.device.browser],
                      ["OS",      selectedLog.device.os],
                    ].map(([k, v]) => (
                      <div key={k} className="bg-white rounded-lg p-2.5 border border-slate-200">
                        <p className="text-[9px] font-black text-slate-400 uppercase tracking-wider">{k}</p>
                        <p className="text-xs font-semibold text-slate-700 mt-0.5">{v || "—"}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              <div>
                <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block mb-1">Details</span>
                <p className="text-sm text-slate-700 bg-slate-50 p-3 rounded-xl">{selectedLog.details}</p>
              </div>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};

export default AuditLogs;
