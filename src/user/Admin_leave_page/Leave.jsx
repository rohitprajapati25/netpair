import { useState, useCallback, useEffect, useMemo } from "react";
import { useAuth } from "../../contexts/AuthContext";
import axios from "axios";
import {
  RiSurveyLine, RiSearchLine, RiFilterLine, RiRefreshLine,
  RiCheckLine, RiCloseLine, RiEditLine, RiTimeLine,
  RiArrowLeftSLine, RiArrowRightSLine, RiInformationLine,
  RiLoader4Line, RiCalendarLine,
} from "react-icons/ri";
import { SkeletonHeader, SkeletonStats, SkeletonTable } from "../../components/Skeletons";
import API_URL from "../../config/api";

// ── constants ─────────────────────────────────────────────────────────────────
const LEAVE_TYPES = ["All", "Casual", "Sick", "Emergency", "Maternity", "Paternity", "Personal", "Earned"];
const STATUSES    = ["All", "Pending", "Approved", "Rejected"];

// ── helpers ───────────────────────────────────────────────────────────────────
const statusStyle = {
  Pending:  "bg-amber-50  text-amber-700  border-amber-200",
  Approved: "bg-emerald-50 text-emerald-700 border-emerald-200",
  Rejected: "bg-red-50    text-red-700    border-red-200",
};

const fmtDate = (d) =>
  d ? new Date(d).toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric" }) : "—";

// ── Toast ─────────────────────────────────────────────────────────────────────
const Toast = ({ msg, type, onClose }) => {
  useEffect(() => { const t = setTimeout(onClose, 3500); return () => clearTimeout(t); }, [onClose]);
  return (
    <div className={`fixed bottom-6 right-6 z-50 flex items-center gap-3 px-5 py-3.5 rounded-2xl shadow-2xl font-semibold text-sm text-white ${
      type === "error" ? "bg-red-600" : "bg-emerald-600"
    }`}>
      {type === "error" ? <RiCloseLine size={18} /> : <RiCheckLine size={18} />}
      {msg}
    </div>
  );
};

// ── Stat Cards ────────────────────────────────────────────────────────────────
const StatCards = ({ stats, activeFilter, onFilter }) => {
  const cards = [
    { key: "All",      label: "Total",    value: stats.total,    bg: "from-indigo-500 to-blue-600",   icon: "ri-file-list-3-line" },
    { key: "Pending",  label: "Pending",  value: stats.pending,  bg: "from-yellow-500 to-orange-500", icon: "ri-time-line" },
    { key: "Approved", label: "Approved", value: stats.approved, bg: "from-emerald-500 to-green-600", icon: "ri-checkbox-circle-line" },
    { key: "Rejected", label: "Rejected", value: stats.rejected, bg: "from-red-500 to-rose-600",      icon: "ri-close-circle-line" },
  ];
  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 lg:gap-5">
      {cards.map((c) => (
        <div
          key={c.key}
          onClick={() => onFilter(c.key)}
          className={`cursor-pointer rounded-2xl text-white p-4 lg:p-5 bg-gradient-to-r ${c.bg} shadow-md
            hover:shadow-xl hover:-translate-y-0.5 transition-all duration-200 flex items-center justify-between
            ${activeFilter === c.key ? "ring-4 ring-white/40 scale-[1.02]" : ""}`}
        >
          <div>
            <p className="text-xs opacity-90 font-semibold">{c.label}</p>
            <h2 className="text-2xl lg:text-3xl font-black mt-1">{c.value ?? 0}</h2>
          </div>
          <div className="bg-white/20 p-2.5 lg:p-3 rounded-xl text-xl lg:text-2xl">
            <i className={c.icon} />
          </div>
        </div>
      ))}
    </div>
  );
};

// ── Approve / Reject modal ────────────────────────────────────────────────────
const ActionModal = ({ leave, onClose, onSave, saving }) => {
  const [status, setStatus]           = useState(leave.status === "Pending" ? "Approved" : leave.status);
  const [rejectionReason, setReason]  = useState(leave.rejectionReason || "");

  return (
    <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl w-full max-w-md shadow-2xl overflow-hidden">
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100">
          <h3 className="font-black text-slate-800">Update Leave Status</h3>
          <button onClick={onClose} className="p-2 hover:bg-slate-100 rounded-xl transition-all">
            <RiCloseLine size={18} className="text-slate-500" />
          </button>
        </div>
        <div className="p-6 space-y-4">
          {/* Employee info */}
          <div className="flex items-center gap-3 p-3 bg-slate-50 rounded-xl">
            <div className="w-9 h-9 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-full flex items-center justify-center text-white text-sm font-black shrink-0">
              {(leave.name || "?").charAt(0).toUpperCase()}
            </div>
            <div>
              <p className="font-bold text-slate-800 text-sm">{leave.name}</p>
              <p className="text-xs text-slate-500">{leave.type} Leave · {leave.days}d · {fmtDate(leave.fromDate)} → {fmtDate(leave.toDate)}</p>
            </div>
          </div>

          {/* Status selector — only Approved / Rejected allowed */}
          <div>
            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 block">New Status</label>
            <div className="flex gap-3">
              {["Approved", "Rejected"].map((s) => (
                <button
                  key={s}
                  onClick={() => setStatus(s)}
                  className={`flex-1 py-2.5 rounded-xl font-bold text-sm border-2 transition-all ${
                    status === s
                      ? s === "Approved"
                        ? "bg-emerald-600 text-white border-emerald-600 shadow-md"
                        : "bg-red-600 text-white border-red-600 shadow-md"
                      : "bg-white text-slate-600 border-slate-200 hover:border-slate-300"
                  }`}
                >
                  {s === "Approved" ? "✓ Approve" : "✕ Reject"}
                </button>
              ))}
            </div>
          </div>

          {/* Rejection reason — shown only when rejecting */}
          {status === "Rejected" && (
            <div>
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1.5 block">
                Rejection Reason <span className="normal-case font-normal text-slate-400">(optional)</span>
              </label>
              <textarea
                value={rejectionReason}
                onChange={(e) => setReason(e.target.value)}
                rows={3}
                placeholder="Explain why the leave is being rejected..."
                className="w-full p-3 border border-slate-200 rounded-xl text-sm resize-none focus:ring-2 focus:ring-red-200 focus:border-red-400 outline-none transition-all"
              />
            </div>
          )}

          {/* Reason display */}
          {leave.reason && (
            <div className="p-3 bg-blue-50 border border-blue-100 rounded-xl">
              <p className="text-[10px] font-black text-blue-400 uppercase tracking-widest mb-1">Employee's Reason</p>
              <p className="text-sm text-blue-800">{leave.reason}</p>
            </div>
          )}
        </div>
        <div className="flex gap-3 px-6 pb-6">
          <button onClick={onClose} className="flex-1 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-xl text-sm transition-all">
            Cancel
          </button>
          <button
            onClick={() => onSave(leave._id || leave.id, status, rejectionReason)}
            disabled={saving}
            className={`flex-1 py-2.5 font-bold rounded-xl text-sm text-white shadow-md transition-all disabled:opacity-60 flex items-center justify-center gap-2 ${
              status === "Approved" ? "bg-emerald-600 hover:bg-emerald-700" : "bg-red-600 hover:bg-red-700"
            }`}
          >
            {saving ? <RiLoader4Line className="animate-spin" size={16} /> : null}
            {saving ? "Saving..." : `Confirm ${status}`}
          </button>
        </div>
      </div>
    </div>
  );
};

// ── Main Leave Page ───────────────────────────────────────────────────────────
const Leave = () => {
  const { token, role } = useAuth();

  const [leaves,  setLeaves]  = useState([]);
  const [stats,   setStats]   = useState({ total: 0, pending: 0, approved: 0, rejected: 0 });
  const [loading, setLoading] = useState(true);
  const [saving,  setSaving]  = useState(false);
  const [error,   setError]   = useState(null);
  const [toast,   setToast]   = useState(null);

  const [search,       setSearch]       = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [typeFilter,   setTypeFilter]   = useState("All");
  const [page,         setPage]         = useState(1);
  const PAGE_SIZE = 10;

  const [editLeave, setEditLeave] = useState(null);

  const showToast = (msg, type = "success") => setToast({ msg, type });

  // ── Fetch ─────────────────────────────────────────────────────────────────
  const fetchLeaves = useCallback(async () => {
    if (!token) return;
    try {
      setLoading(true);
      setError(null);
      const params = new URLSearchParams({
        page:  String(page),
        limit: String(PAGE_SIZE),
        ...(search.trim()              && { search }),
        ...(statusFilter !== "All"     && { status: statusFilter }),
        ...(typeFilter   !== "All"     && { type:   typeFilter }),
      });
      const res = await axios.get(`${API_URL}/admin/leaves?${params}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setLeaves(res.data.leaves  || []);
      setStats(res.data.stats    || { total: 0, pending: 0, approved: 0, rejected: 0 });
    } catch (err) {
      setError(err.response?.data?.message || "Failed to fetch leaves");
    } finally {
      setLoading(false);
    }
  }, [token, page, search, statusFilter, typeFilter]);

  // Debounce search
  useEffect(() => {
    const t = setTimeout(() => { setPage(1); fetchLeaves(); }, 350);
    return () => clearTimeout(t);
  }, [search]);

  // Immediate re-fetch on filter/page change
  useEffect(() => { fetchLeaves(); }, [statusFilter, typeFilter, page]);

  useEffect(() => { if (token) fetchLeaves(); }, [token]);

  // ── Quick approve / reject from table row ─────────────────────────────────
  const handleQuickAction = async (id, status) => {
    setSaving(true);
    const prev = leaves;
    setLeaves((l) => l.map((x) => (x._id === id ? { ...x, status } : x)));
    try {
      await axios.put(
        `${API_URL}/admin/leaves/${id}`,
        { status },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      showToast(`Leave ${status === "Approved" ? "approved" : "rejected"} successfully`);
      fetchLeaves(); // refresh stats
    } catch (err) {
      setLeaves(prev);
      showToast(err.response?.data?.message || "Failed to update status", "error");
    } finally {
      setSaving(false);
    }
  };

  // ── Save from modal (with optional rejection reason) ──────────────────────
  const handleModalSave = async (id, status, rejectionReason) => {
    setSaving(true);
    try {
      await axios.put(
        `${API_URL}/admin/leaves/${id}`,
        { status, ...(rejectionReason?.trim() && { rejectionReason }) },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      showToast(`Leave ${status === "Approved" ? "approved" : "rejected"} successfully`);
      setEditLeave(null);
      fetchLeaves();
    } catch (err) {
      showToast(err.response?.data?.message || "Failed to update status", "error");
    } finally {
      setSaving(false);
    }
  };

  // ── Normalise leave rows for display ─────────────────────────────────────
  const rows = useMemo(() =>
    leaves.map((l) => ({
      ...l,
      _id:  l._id,
      name: l.employeeId?.name  || l.name  || "Unknown",
      email: l.employeeId?.email || l.email || "",
      dept: l.employeeId?.department || "",
    })),
  [leaves]);

  const totalPages = Math.max(1, Math.ceil((stats.total || rows.length) / PAGE_SIZE));

  // ── Loading skeleton ──────────────────────────────────────────────────────
  if (loading && !leaves.length) {
    return (
      <div className="space-y-6">
        <SkeletonHeader />
        <SkeletonStats count={4} />
        <SkeletonTable rows={6} />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {toast && <Toast msg={toast.msg} type={toast.type} onClose={() => setToast(null)} />}

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl lg:text-3xl font-black text-slate-800 tracking-tight">Leave Management</h1>
          <p className="text-slate-500 text-sm mt-0.5">
            {stats.total} total · {stats.pending} pending approval
          </p>
        </div>
        <button
          onClick={fetchLeaves}
          disabled={loading}
          className="self-start sm:self-auto flex items-center gap-2 px-4 py-2.5 bg-white border border-slate-200 hover:border-slate-300 text-slate-700 font-semibold rounded-xl shadow-sm text-sm transition-all disabled:opacity-50"
        >
          <RiRefreshLine className={loading ? "animate-spin" : ""} size={15} />
          Refresh
        </button>
      </div>

      {/* Stat cards — clickable quick filters */}
      <StatCards stats={stats} activeFilter={statusFilter} onFilter={(s) => { setStatusFilter(s); setPage(1); }} />

      {/* Error */}
      {error && (
        <div className="flex items-center gap-3 px-4 py-3 bg-red-50 border border-red-200 rounded-xl text-red-700 text-sm font-medium">
          <RiInformationLine size={18} className="shrink-0" />
          {error}
          <button onClick={fetchLeaves} className="ml-auto text-xs font-bold underline">Retry</button>
        </div>
      )}

      {/* Filter bar */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-4 flex flex-col sm:flex-row gap-3 flex-wrap">
        {/* Search */}
        <div className="relative flex-1 min-w-[200px]">
          <RiSearchLine className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={15} />
          <input
            type="text"
            placeholder="Search employee name or email..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-4 py-2.5 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-blue-200 focus:border-blue-400 outline-none transition-all"
          />
        </div>

        {/* Status filter */}
        <div className="relative">
          <RiFilterLine className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" size={14} />
          <select
            value={statusFilter}
            onChange={(e) => { setStatusFilter(e.target.value); setPage(1); }}
            className="pl-9 pr-8 py-2.5 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-blue-200 outline-none bg-white appearance-none cursor-pointer min-w-[140px]"
          >
            {STATUSES.map((s) => <option key={s} value={s}>{s === "All" ? "All Statuses" : s}</option>)}
          </select>
        </div>

        {/* Type filter */}
        <div className="relative">
          <RiCalendarLine className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" size={14} />
          <select
            value={typeFilter}
            onChange={(e) => { setTypeFilter(e.target.value); setPage(1); }}
            className="pl-9 pr-8 py-2.5 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-blue-200 outline-none bg-white appearance-none cursor-pointer min-w-[140px]"
          >
            {LEAVE_TYPES.map((t) => <option key={t} value={t}>{t === "All" ? "All Types" : t}</option>)}
          </select>
        </div>

        <div className="flex items-center px-3 py-2.5 bg-slate-50 rounded-xl border border-slate-200 text-xs font-semibold text-slate-500 shrink-0">
          {rows.length} result{rows.length !== 1 ? "s" : ""}
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[800px]">
            <thead className="bg-slate-50 border-b border-slate-200">
              <tr>
                {["Employee", "Type", "Duration", "Days", "Reason", "Status", "Actions"].map((h) => (
                  <th key={h} className="px-5 py-3.5 text-left text-[10px] font-black text-slate-500 uppercase tracking-wider">
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {rows.length === 0 ? (
                <tr>
                  <td colSpan={7} className="px-6 py-16 text-center">
                    <div className="flex flex-col items-center gap-2 text-slate-400">
                      <RiSurveyLine className="text-5xl opacity-40" />
                      <p className="font-semibold text-slate-500">No leave requests found</p>
                      <p className="text-sm">Try adjusting your filters</p>
                    </div>
                  </td>
                </tr>
              ) : rows.map((leave) => (
                <tr key={leave._id} className="hover:bg-slate-50 transition-colors group">
                  {/* Employee */}
                  <td className="px-5 py-4">
                    <div className="flex items-center gap-2.5">
                      <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-full flex items-center justify-center text-white text-xs font-black shrink-0">
                        {leave.name.charAt(0).toUpperCase()}
                      </div>
                      <div className="min-w-0">
                        <p className="font-semibold text-slate-800 text-sm truncate">{leave.name}</p>
                        {leave.dept && <p className="text-xs text-slate-400 truncate">{leave.dept}</p>}
                      </div>
                    </div>
                  </td>

                  {/* Type */}
                  <td className="px-5 py-4">
                    <span className="px-2.5 py-1 bg-slate-100 text-slate-600 rounded-lg text-[10px] font-black uppercase tracking-wide">
                      {leave.type}
                    </span>
                  </td>

                  {/* Duration */}
                  <td className="px-5 py-4">
                    <div className="flex items-center gap-1.5 text-xs font-semibold text-slate-600">
                      <span>{fmtDate(leave.fromDate)}</span>
                      <span className="text-slate-300">→</span>
                      <span>{fmtDate(leave.toDate)}</span>
                    </div>
                  </td>

                  {/* Days */}
                  <td className="px-5 py-4">
                    <span className="font-black text-slate-700 text-sm">{leave.days ?? "—"}d</span>
                  </td>

                  {/* Reason */}
                  <td className="px-5 py-4 max-w-[180px]">
                    <p className="text-xs text-slate-500 truncate" title={leave.reason}>{leave.reason || "—"}</p>
                  </td>

                  {/* Status */}
                  <td className="px-5 py-4">
                    <div className="flex items-center gap-1.5">
                      <span className={`px-2.5 py-1 rounded-full text-[10px] font-black border ${statusStyle[leave.status] || "bg-slate-100 text-slate-600 border-slate-200"}`}>
                        {leave.status}
                      </span>
                      {leave.status === "Rejected" && leave.rejectionReason && (
                        <div className="relative group/tip">
                          <RiInformationLine size={14} className="text-red-400 cursor-help" />
                          <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 w-52 bg-slate-800 text-white text-xs rounded-xl p-3 shadow-xl z-20 hidden group-hover/tip:block pointer-events-none">
                            <p className="font-bold mb-1">Rejection Reason:</p>
                            <p className="opacity-90">{leave.rejectionReason}</p>
                            <div className="absolute top-full left-1/2 -translate-x-1/2 border-4 border-transparent border-t-slate-800" />
                          </div>
                        </div>
                      )}
                    </div>
                  </td>

                  {/* Actions */}
                  <td className="px-5 py-4">
                    <div className="flex items-center gap-1">
                      {leave.status === "Pending" && (
                        <>
                          <button
                            onClick={() => handleQuickAction(leave._id, "Approved")}
                            disabled={saving}
                            title="Approve"
                            className="p-1.5 text-emerald-600 hover:bg-emerald-50 rounded-lg transition-all disabled:opacity-40"
                          >
                            <RiCheckLine size={17} />
                          </button>
                          <button
                            onClick={() => handleQuickAction(leave._id, "Rejected")}
                            disabled={saving}
                            title="Reject"
                            className="p-1.5 text-red-500 hover:bg-red-50 rounded-lg transition-all disabled:opacity-40"
                          >
                            <RiCloseLine size={17} />
                          </button>
                        </>
                      )}
                      {/* Edit button — opens modal for full control */}
                      {leave.status === "Pending" && (
                        <button
                          onClick={() => setEditLeave(leave)}
                          title="Edit with reason"
                          className="p-1.5 text-blue-500 hover:bg-blue-50 rounded-lg transition-all"
                        >
                          <RiEditLine size={16} />
                        </button>
                      )}
                      {leave.status !== "Pending" && (
                        <span className="text-xs text-slate-400 px-2">—</span>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="px-5 py-3.5 border-t border-slate-100 bg-slate-50 flex items-center justify-between">
            <span className="text-xs text-slate-500 font-medium">
              Page {page} of {totalPages}
            </span>
            <div className="flex items-center gap-1">
              <button
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                disabled={page === 1}
                className="p-1.5 border border-slate-200 rounded-lg disabled:opacity-40 hover:bg-white transition-colors"
              >
                <RiArrowLeftSLine size={16} />
              </button>
              <button
                onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                disabled={page === totalPages}
                className="p-1.5 border border-slate-200 rounded-lg disabled:opacity-40 hover:bg-white transition-colors"
              >
                <RiArrowRightSLine size={16} />
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Action modal */}
      {editLeave && (
        <ActionModal
          leave={editLeave}
          onClose={() => setEditLeave(null)}
          onSave={handleModalSave}
          saving={saving}
        />
      )}
    </div>
  );
};

export default Leave;
