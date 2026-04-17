import { useState, useEffect, useMemo, useCallback } from "react";
import { useAuth } from "../../contexts/AuthContext";
import axios from "axios";
import {
  RiAddLine, RiCalendarLine, RiSearchLine, RiFilterLine,
  RiCloseLine, RiInformationLine, RiDeleteBinLine, RiLoader4Line,
  RiCheckLine, RiAlertLine,
} from "react-icons/ri";
import { SkeletonHeader, SkeletonStats, SkeletonTable } from "../../components/Skeletons";
import { BASE_URL as BASE } from "../../config/api";

// ── constants ─────────────────────────────────────────────────────────────────
const LEAVE_TYPES = ["Casual", "Sick", "Emergency", "Maternity", "Paternity", "Personal", "Earned"];
const EMPTY_FORM  = { type: "Casual", fromDate: "", toDate: "", reason: "" };

// ── helpers ───────────────────────────────────────────────────────────────────
const calcDays = (from, to) => {
  if (!from || !to) return 0;
  const diff = new Date(to) - new Date(from);
  return diff < 0 ? 0 : Math.ceil(diff / 86400000) + 1;
};

const fmtDate = (d) =>
  d ? new Date(d).toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric" }) : "—";

const statusStyle = {
  Pending:  "bg-amber-50  text-amber-700  border-amber-200",
  Approved: "bg-emerald-50 text-emerald-700 border-emerald-200",
  Rejected: "bg-red-50    text-red-700    border-red-200",
};

// ── Field wrapper (same as TimesheetSubmitModal) ───────────────────────────────
const Field = ({ label, required, error, hint, children }) => (
  <div className="space-y-1.5">
    <label className="flex items-center gap-1 text-[10px] font-black uppercase tracking-widest text-slate-500">
      {label}
      {required && <span className="text-red-500 normal-case font-bold">*</span>}
    </label>
    {children}
    {error && (
      <p className="flex items-center gap-1 text-red-500 text-xs font-medium">
        <RiAlertLine size={11} className="shrink-0" />{error}
      </p>
    )}
    {!error && hint && <p className="text-slate-400 text-xs">{hint}</p>}
  </div>
);

const inputBase = "w-full px-4 py-3 border-2 rounded-xl text-sm font-medium outline-none transition-all bg-slate-50 focus:bg-white";
const inputCls  = (err) => `${inputBase} ${err ? "border-red-300 focus:border-red-400 focus:ring-2 focus:ring-red-100" : "border-slate-100 focus:border-blue-400 focus:ring-2 focus:ring-blue-100"}`;

// ── Toast ─────────────────────────────────────────────────────────────────────
const Toast = ({ msg, type, onClose }) => {
  useEffect(() => { const t = setTimeout(onClose, 3500); return () => clearTimeout(t); }, [onClose]);
  const bg = type === "error" ? "bg-red-600" : type === "warning" ? "bg-amber-600" : "bg-emerald-600";
  return (
    <div className={`fixed bottom-6 right-6 z-[200] flex items-center gap-3 px-5 py-3.5 rounded-2xl shadow-2xl font-semibold text-sm text-white ${bg}`}>
      {type === "error" ? <RiCloseLine size={18} /> : <RiCheckLine size={18} />}
      {msg}
    </div>
  );
};

// ── Apply Leave Modal ─────────────────────────────────────────────────────────
const ApplyModal = ({ onClose, onSubmit, submitting }) => {
  const [form,   setForm]   = useState(EMPTY_FORM);
  const [errors, setErrors] = useState({});

  const set = (k, v) => {
    setForm((p) => ({ ...p, [k]: v }));
    setErrors((p) => ({ ...p, [k]: undefined }));
  };

  const validate = () => {
    const e = {};
    if (!form.type)     e.type     = "Leave type is required";
    if (!form.fromDate) e.fromDate = "From date is required";
    if (!form.toDate)   e.toDate   = "To date is required";
    if (form.fromDate && form.toDate && form.toDate < form.fromDate)
      e.toDate = "To date must be on or after From date";
    if (!form.reason || form.reason.trim().length < 10)
      e.reason = "Reason must be at least 10 characters";
    setErrors(e);
    return !Object.keys(e).length;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (validate()) onSubmit(form);
  };

  const handleClose = () => {
    if (submitting) return;
    onClose();
  };

  const liveDays = calcDays(form.fromDate, form.toDate);

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-3 sm:p-4 bg-slate-900/60 backdrop-blur-sm">
      {/* Backdrop click */}
      <div className="absolute inset-0" onClick={handleClose} />

      <div className="relative bg-white w-full max-w-lg rounded-2xl shadow-2xl max-h-[90vh] sm:max-h-[95vh] flex flex-col overflow-hidden">

        {/* ── Header ── */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 shrink-0">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-blue-100 text-blue-600 rounded-xl">
              <RiCalendarLine size={20} />
            </div>
            <div>
              <h3 className="font-black text-slate-800 text-base leading-tight">Apply for Leave</h3>
              <p className="text-xs text-slate-400 mt-0.5">Submit a new request</p>
            </div>
          </div>
          <button
            onClick={handleClose}
            disabled={submitting}
            className="p-2 text-slate-400 hover:text-rose-500 rounded-xl hover:bg-slate-100 transition-all disabled:opacity-40"
          >
            <RiCloseLine size={20} />
          </button>
        </div>

        {/* ── Body ── */}
        <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto">
          <div className="p-6 space-y-5">

            {/* Leave Type */}
            <Field label="Leave Type" required error={errors.type}>
              <select
                value={form.type}
                onChange={(e) => set("type", e.target.value)}
                className={inputCls(errors.type)}
              >
                {LEAVE_TYPES.map((t) => <option key={t} value={t}>{t} Leave</option>)}
              </select>
            </Field>

            {/* Date range */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Field label="From Date" required error={errors.fromDate}>
                <input
                  type="date"
                  value={form.fromDate}
                  min={new Date().toISOString().split("T")[0]}
                  onChange={(e) => set("fromDate", e.target.value)}
                  className={inputCls(errors.fromDate)}
                />
              </Field>
              <Field label="To Date" required error={errors.toDate}>
                <input
                  type="date"
                  value={form.toDate}
                  min={form.fromDate || new Date().toISOString().split("T")[0]}
                  onChange={(e) => set("toDate", e.target.value)}
                  className={inputCls(errors.toDate)}
                />
              </Field>
            </div>

            {/* Live days badge */}
            {liveDays > 0 && (
              <div className="flex items-center gap-2 px-4 py-2.5 bg-blue-50 border border-blue-200 rounded-xl">
                <RiCalendarLine className="text-blue-500 shrink-0" size={16} />
                <span className="text-sm font-bold text-blue-700">
                  {liveDays} day{liveDays !== 1 ? "s" : ""} of leave
                </span>
              </div>
            )}

            {/* Reason */}
            <Field
              label="Reason"
              required
              error={errors.reason}
              hint="Minimum 10 characters"
            >
              <textarea
                value={form.reason}
                onChange={(e) => set("reason", e.target.value)}
                rows={4}
                maxLength={500}
                placeholder="Describe the reason for your leave..."
                className={`${inputCls(errors.reason)} resize-none`}
              />
              <div className="flex items-center justify-between">
                <span className={`text-xs font-medium ${form.reason.length < 10 && form.reason.length > 0 ? "text-red-500" : "text-slate-400"}`}>
                  {form.reason.length < 10 && form.reason.length > 0
                    ? `${10 - form.reason.length} more chars needed`
                    : ""}
                </span>
                <span className={`text-xs font-medium ${form.reason.length > 450 ? "text-amber-500" : "text-slate-400"}`}>
                  {form.reason.length}/500
                </span>
              </div>
            </Field>

          </div>

          {/* ── Footer ── */}
          <div className="px-6 pb-6 flex gap-3 shrink-0">
            <button
              type="button"
              onClick={handleClose}
              disabled={submitting}
              className="flex-1 py-3 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-xl text-sm transition-all disabled:opacity-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={submitting}
              className="flex-1 py-3 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl text-sm shadow-md transition-all disabled:opacity-50 flex items-center justify-center gap-2"
            >
              {submitting ? (
                <><RiLoader4Line className="animate-spin" size={16} /> Submitting...</>
              ) : (
                <><RiCheckLine size={16} /> Submit Request</>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

// ── Main Component ────────────────────────────────────────────────────────────
const MyLeave = () => {
  const { token } = useAuth();

  const [leaves,       setLeaves]       = useState([]);
  const [loading,      setLoading]      = useState(true);
  const [submitting,   setSubmitting]   = useState(false);
  const [cancelling,   setCancelling]   = useState(null);
  const [showModal,    setShowModal]    = useState(false);
  const [toast,        setToast]        = useState(null);
  const [search,       setSearch]       = useState("");
  const [statusFilter, setStatusFilter] = useState("All");

  const showToast = (msg, type = "success") => setToast({ msg, type });

  // ── Fetch ─────────────────────────────────────────────────────────────────
  const fetchLeaves = useCallback(async () => {
    if (!token) return;
    try {
      setLoading(true);
      const res = await axios.get(`${BASE}/api/employees/leaves`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setLeaves(res.data.leaves || []);
    } catch (err) {
      showToast(err.response?.data?.message || "Failed to load leave requests", "error");
    } finally {
      setLoading(false);
    }
  }, [token]);

  useEffect(() => { fetchLeaves(); }, [fetchLeaves]);

  // ── Stats ─────────────────────────────────────────────────────────────────
  const stats = useMemo(() => ({
    total:    leaves.length,
    pending:  leaves.filter((l) => l.status === "Pending").length,
    approved: leaves.filter((l) => l.status === "Approved").length,
    rejected: leaves.filter((l) => l.status === "Rejected").length,
  }), [leaves]);

  // ── Filtered list ─────────────────────────────────────────────────────────
  const filtered = useMemo(() => {
    let list = leaves;
    if (statusFilter !== "All") list = list.filter((l) => l.status === statusFilter);
    if (search.trim()) {
      const q = search.toLowerCase();
      list = list.filter((l) =>
        l.type?.toLowerCase().includes(q) || l.reason?.toLowerCase().includes(q)
      );
    }
    return list;
  }, [leaves, statusFilter, search]);

  // ── Submit ────────────────────────────────────────────────────────────────
  const handleSubmit = async (form) => {
    try {
      setSubmitting(true);
      await axios.post(
        `${BASE}/api/employees/leaves`,
        { ...form, days: calcDays(form.fromDate, form.toDate) },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      showToast("Leave request submitted successfully!");
      setShowModal(false);
      fetchLeaves();
    } catch (err) {
      showToast(err.response?.data?.message || "Failed to submit leave request", "error");
    } finally {
      setSubmitting(false);
    }
  };

  // ── Cancel ────────────────────────────────────────────────────────────────
  const handleCancel = async (id) => {
    try {
      setCancelling(id);
      await axios.delete(`${BASE}/api/employees/leaves/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      showToast("Leave request cancelled");
      fetchLeaves();
    } catch (err) {
      const status = err.response?.status;
      if (status === 400) {
        showToast(err.response.data.message, "error");
      } else {
        showToast("Failed to cancel leave. Please contact HR.", "warning");
      }
    } finally {
      setCancelling(null);
    }
  };

  // ── Loading skeleton ──────────────────────────────────────────────────────
  if (loading) {
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
          <h1 className="text-2xl lg:text-3xl font-black text-slate-800">My Leave Requests</h1>
          <p className="text-slate-500 text-sm mt-0.5">Track and manage your time off</p>
        </div>
        <button
          onClick={() => setShowModal(true)}
          className="w-auto self-start sm:self-auto flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-5 py-2.5 rounded-xl font-bold shadow-md transition-all text-sm"
        >
          <RiAddLine size={18} /> Apply Leave
        </button>
      </div>

      {/* Stat Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 lg:gap-5">
        {[
          { label: "Total",    value: stats.total,    bg: "from-indigo-500 to-blue-600",   icon: "ri-calendar-line",        key: "All"      },
          { label: "Pending",  value: stats.pending,  bg: "from-yellow-500 to-orange-500", icon: "ri-time-line",            key: "Pending"  },
          { label: "Approved", value: stats.approved, bg: "from-emerald-500 to-green-600", icon: "ri-checkbox-circle-fill", key: "Approved" },
          { label: "Rejected", value: stats.rejected, bg: "from-red-500 to-rose-600",      icon: "ri-close-circle-fill",    key: "Rejected" },
        ].map((s) => (
          <div
            key={s.key}
            onClick={() => setStatusFilter(s.key)}
            className={`cursor-pointer rounded-2xl p-4 lg:p-5 bg-gradient-to-r ${s.bg} text-white shadow-md hover:shadow-xl hover:-translate-y-0.5 transition-all duration-200 flex items-center justify-between ${
              statusFilter === s.key ? "ring-4 ring-white/40 scale-[1.02]" : ""
            }`}
          >
            <div>
              <p className="text-xs opacity-90 font-semibold">{s.label}</p>
              <h2 className="text-2xl lg:text-3xl font-black mt-1">{s.value}</h2>
            </div>
            <div className="bg-white/20 p-2.5 lg:p-3 rounded-xl text-xl lg:text-2xl">
              <i className={s.icon} />
            </div>
          </div>
        ))}
      </div>

      {/* Filter Bar */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-3 sm:p-4 flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <RiSearchLine className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={15} />
          <input
            type="text"
            placeholder="Search by type or reason..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-4 py-2.5 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-200 focus:border-blue-400 outline-none text-sm transition-all"
          />
        </div>
        <div className="flex gap-3">
          <div className="relative flex-1 sm:flex-none">
            <RiFilterLine className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" size={14} />
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="w-full sm:w-auto pl-9 pr-8 py-2.5 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-200 outline-none text-sm bg-white appearance-none cursor-pointer sm:min-w-[150px]"
            >
              {["All", "Pending", "Approved", "Rejected"].map((s) => (
                <option key={s} value={s}>{s === "All" ? "All Statuses" : s}</option>
              ))}
            </select>
          </div>
          <div className="flex items-center px-3 py-2.5 bg-slate-50 rounded-xl border border-slate-200 text-xs font-semibold text-slate-500 shrink-0">
            {filtered.length} result{filtered.length !== 1 ? "s" : ""}
          </div>
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[640px]">
            <thead className="bg-slate-50 border-b border-slate-200">
              <tr>
                {["Type", "From", "To", "Days", "Reason", "Status", "Action"].map((h) => (
                  <th key={h} className="px-4 py-3.5 text-left text-[10px] font-black text-slate-500 uppercase tracking-wider">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan={7} className="px-6 py-16 text-center">
                    <div className="flex flex-col items-center gap-2 text-slate-400">
                      <RiCalendarLine className="text-4xl opacity-40" />
                      <p className="font-semibold text-slate-500">
                        {search || statusFilter !== "All" ? "No requests match your filters" : "No leave requests yet"}
                      </p>
                      <p className="text-sm">
                        {search || statusFilter !== "All"
                          ? "Try adjusting your search or filter"
                          : 'Click "Apply Leave" to submit your first request'}
                      </p>
                    </div>
                  </td>
                </tr>
              ) : filtered.map((leave) => {
                const days = leave.days || calcDays(
                  leave.fromDate ? new Date(leave.fromDate).toISOString().split("T")[0] : "",
                  leave.toDate   ? new Date(leave.toDate).toISOString().split("T")[0]   : ""
                );
                return (
                  <tr key={leave._id} className="hover:bg-slate-50 transition-colors">
                    <td className="px-4 py-3.5">
                      <span className="px-2.5 py-1 bg-slate-100 text-slate-600 rounded-lg text-[10px] font-black uppercase tracking-wide">
                        {leave.type}
                      </span>
                    </td>
                    <td className="px-4 py-3.5 text-sm text-slate-600 whitespace-nowrap">{fmtDate(leave.fromDate)}</td>
                    <td className="px-4 py-3.5 text-sm text-slate-600 whitespace-nowrap">{fmtDate(leave.toDate)}</td>
                    <td className="px-4 py-3.5 text-sm font-black text-slate-700">{days}d</td>
                    <td className="px-4 py-3.5 text-sm text-slate-500 max-w-[180px] truncate" title={leave.reason}>
                      {leave.reason || "—"}
                    </td>
                    <td className="px-4 py-3.5">
                      <div className="flex items-center gap-1.5">
                        <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold border ${statusStyle[leave.status] || "bg-slate-100 text-slate-600 border-slate-200"}`}>
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
                        {leave.status !== "Pending" && leave.approvedBy?.name && (
                          <span className="text-[10px] text-slate-400 hidden sm:inline">
                            by {leave.approvedBy.name}
                          </span>
                        )}
                      </div>
                    </td>
                    <td className="px-4 py-3.5">
                      {leave.status === "Pending" ? (
                        <button
                          onClick={() => handleCancel(leave._id)}
                          disabled={cancelling === leave._id}
                          className="flex items-center gap-1 px-3 py-1.5 bg-red-50 hover:bg-red-100 text-red-600 rounded-lg text-xs font-bold transition-all disabled:opacity-50"
                        >
                          {cancelling === leave._id
                            ? <RiLoader4Line className="animate-spin" size={13} />
                            : <RiDeleteBinLine size={13} />}
                          Cancel
                        </button>
                      ) : (
                        <span className="text-xs text-slate-400">—</span>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Apply Leave Modal */}
      {showModal && (
        <ApplyModal
          onClose={() => setShowModal(false)}
          onSubmit={handleSubmit}
          submitting={submitting}
        />
      )}
    </div>
  );
};

export default MyLeave;
