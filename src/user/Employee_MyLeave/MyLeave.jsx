import React, { useState, useEffect, useMemo } from "react";
import { useAuth } from "../../contexts/AuthContext";
import axios from "axios";
import {
  RiAddLine,
  RiCalendarLine,
  RiTimeLine,
  RiCheckboxCircleFill,
  RiCloseCircleFill,
  RiSearchLine,
  RiFilterLine,
  RiCloseLine,
  RiInformationLine,
  RiDeleteBinLine,
} from "react-icons/ri";
import { SkeletonHeader, SkeletonStats, SkeletonTable } from "../../components/Skeletons";

const BASE = "http://localhost:5000";

// ── Inline Toast ──────────────────────────────────────────────────────────────
const useToast = () => {
  const [toast, setToast] = useState(null);
  const showToast = (msg, type = "success") => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 3500);
  };
  const ToastUI = toast ? (
    <div
      className={`fixed bottom-6 right-6 z-50 flex items-center gap-3 px-5 py-3.5 rounded-2xl shadow-2xl font-semibold text-sm text-white ${
        toast.type === "error"
          ? "bg-red-600"
          : toast.type === "warning"
          ? "bg-amber-600"
          : "bg-emerald-600"
      }`}
    >
      <i
        className={`${
          toast.type === "error" ? "ri-close-circle-line" : "ri-checkbox-circle-line"
        } text-lg`}
      ></i>
      {toast.msg}
    </div>
  ) : null;
  return { showToast, ToastUI };
};

// ── Helpers ───────────────────────────────────────────────────────────────────
const calcDays = (from, to) => {
  if (!from || !to) return 0;
  const diff = new Date(to) - new Date(from);
  if (diff < 0) return 0;
  return Math.ceil(diff / (1000 * 60 * 60 * 24)) + 1;
};

const getStatusBadge = (status) => {
  const map = {
    Pending:  "bg-yellow-100 text-yellow-700 border-yellow-200",
    Approved: "bg-emerald-100 text-emerald-700 border-emerald-200",
    Rejected: "bg-red-100 text-red-700 border-red-200",
  };
  return map[status] || "bg-slate-100 text-slate-700 border-slate-200";
};

const LEAVE_TYPES = [
  "Sick",
  "Casual",
  "Earned",
  "Maternity",
  "Paternity",
  "Emergency",
  "Personal",
];

const EMPTY_FORM = {
  type: "Sick",
  fromDate: "",
  toDate: "",
  reason: "",
};

// ── Main Component ────────────────────────────────────────────────────────────
const MyLeave = () => {
  const { token } = useAuth();
  const { showToast, ToastUI } = useToast();

  const [leaves, setLeaves]       = useState([]);
  const [loading, setLoading]     = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [cancelling, setCancelling] = useState(null); // id being cancelled
  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData]   = useState(EMPTY_FORM);
  const [errors, setErrors]       = useState({});
  const [search, setSearch]       = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [tooltipId, setTooltipId] = useState(null); // rejection reason tooltip

  // ── Fetch ─────────────────────────────────────────────────────────────────
  const fetchLeaves = async () => {
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
  };

  useEffect(() => {
    if (token) fetchLeaves();
  }, [token]);

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
      list = list.filter(
        (l) =>
          l.type?.toLowerCase().includes(q) ||
          l.reason?.toLowerCase().includes(q)
      );
    }
    return list;
  }, [leaves, statusFilter, search]);

  // ── Validation ────────────────────────────────────────────────────────────
  const validate = () => {
    const e = {};
    if (!formData.type) e.type = "Leave type is required";
    if (!formData.fromDate) e.fromDate = "From date is required";
    if (!formData.toDate) e.toDate = "To date is required";
    if (formData.fromDate && formData.toDate && formData.toDate < formData.fromDate)
      e.toDate = "To date must be on or after From date";
    if (!formData.reason || formData.reason.trim().length < 10)
      e.reason = "Reason must be at least 10 characters";
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  // ── Submit ────────────────────────────────────────────────────────────────
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;
    try {
      setSubmitting(true);
      const days = calcDays(formData.fromDate, formData.toDate);
      await axios.post(
        `${BASE}/api/employees/leaves`,
        { ...formData, days },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      showToast("Leave request submitted successfully!");
      setShowModal(false);
      setFormData(EMPTY_FORM);
      setErrors({});
      fetchLeaves();
    } catch (err) {
      showToast(err.response?.data?.message || "Failed to submit leave request", "error");
    } finally {
      setSubmitting(false);
    }
  };

  // ── Cancel leave ──────────────────────────────────────────────────────────
  const handleCancel = async (id) => {
    try {
      setCancelling(id);
      await axios.delete(`${BASE}/api/employees/leaves/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      showToast("Leave request cancelled");
      fetchLeaves();
    } catch (err) {
      // If endpoint doesn't exist (404/405), show HR message
      if (err.response?.status === 404 || err.response?.status === 405) {
        showToast("To cancel this leave, please contact HR", "warning");
      } else {
        showToast(err.response?.data?.message || "Failed to cancel leave", "error");
      }
    } finally {
      setCancelling(null);
    }
  };

  // ── Field change ──────────────────────────────────────────────────────────
  const handleChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) setErrors((prev) => ({ ...prev, [field]: undefined }));
  };

  const liveDays = calcDays(formData.fromDate, formData.toDate);

  // ── Loading ───────────────────────────────────────────────────────────────
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
      {ToastUI}

      {/* ── Header ── */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl lg:text-3xl font-black text-slate-800">My Leave Requests</h1>
          <p className="text-slate-500 text-sm mt-0.5">Track and manage your time off</p>
        </div>
        <button
          onClick={() => { setShowModal(true); setFormData(EMPTY_FORM); setErrors({}); }}
          className="self-start sm:self-auto flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-5 py-2.5 rounded-xl font-bold shadow-md transition-all text-sm"
        >
          <RiAddLine size={18} /> Apply Leave
        </button>
      </div>

      {/* ── Stat Cards ── */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 lg:gap-5">
        {[
          { label: "Total",    value: stats.total,    bg: "from-indigo-500 to-blue-600",   icon: "ri-calendar-line" },
          { label: "Pending",  value: stats.pending,  bg: "from-yellow-500 to-orange-500", icon: "ri-time-line" },
          { label: "Approved", value: stats.approved, bg: "from-emerald-500 to-green-600", icon: "ri-checkbox-circle-fill" },
          { label: "Rejected", value: stats.rejected, bg: "from-red-500 to-rose-600",      icon: "ri-close-circle-fill" },
        ].map((s, i) => (
          <div
            key={i}
            className={`rounded-2xl p-4 lg:p-5 bg-gradient-to-r ${s.bg} text-white shadow-md hover:shadow-xl hover:-translate-y-0.5 transition-all duration-200 flex items-center justify-between`}
          >
            <div>
              <p className="text-xs opacity-90 font-semibold">{s.label}</p>
              <h2 className="text-2xl lg:text-3xl font-black mt-1">{s.value}</h2>
            </div>
            <div className="bg-white/20 p-2.5 lg:p-3 rounded-xl text-xl lg:text-2xl">
              <i className={s.icon}></i>
            </div>
          </div>
        ))}
      </div>

      {/* ── Filter Bar ── */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-4 flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <RiSearchLine className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder="Search by type or reason..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-4 py-2.5 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none text-sm"
          />
        </div>
        <div className="relative">
          <RiFilterLine className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="pl-9 pr-8 py-2.5 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none text-sm bg-white appearance-none cursor-pointer min-w-[150px]"
          >
            {["All", "Pending", "Approved", "Rejected"].map((s) => (
              <option key={s} value={s}>{s === "All" ? "All Statuses" : s}</option>
            ))}
          </select>
        </div>
        <div className="flex items-center px-3 py-2.5 bg-slate-50 rounded-xl border border-slate-200 text-xs font-semibold text-slate-500 shrink-0">
          {filtered.length} request{filtered.length !== 1 ? "s" : ""}
        </div>
      </div>

      {/* ── Table ── */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[640px]">
            <thead className="bg-slate-50 border-b border-slate-200">
              <tr>
                {["Type", "From", "To", "Days", "Reason", "Status", "Action"].map((h) => (
                  <th
                    key={h}
                    className="px-4 py-3 text-left text-[10px] font-black text-slate-500 uppercase tracking-wider"
                  >
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan={7} className="px-6 py-16 text-center">
                    <div className="flex flex-col items-center gap-2 text-slate-400">
                      <RiCalendarLine className="text-4xl" />
                      <p className="font-semibold text-slate-500">
                        {search || statusFilter !== "All"
                          ? "No requests match your filters"
                          : "No leave requests yet"}
                      </p>
                      <p className="text-sm">
                        {search || statusFilter !== "All"
                          ? "Try adjusting your search or filter"
                          : "Click \"Apply Leave\" to submit your first request"}
                      </p>
                    </div>
                  </td>
                </tr>
              ) : (
                filtered.map((leave) => {
                  const days =
                    leave.days ||
                    calcDays(
                      leave.fromDate ? new Date(leave.fromDate).toISOString().split("T")[0] : "",
                      leave.toDate   ? new Date(leave.toDate).toISOString().split("T")[0]   : ""
                    );
                  return (
                    <tr key={leave._id} className="hover:bg-slate-50 transition-colors">
                      <td className="px-4 py-3 text-sm font-semibold text-slate-700">
                        {leave.type}
                      </td>
                      <td className="px-4 py-3 text-sm text-slate-600">
                        {leave.fromDate
                          ? new Date(leave.fromDate).toLocaleDateString("en-GB", {
                              day: "2-digit", month: "short", year: "numeric",
                            })
                          : "—"}
                      </td>
                      <td className="px-4 py-3 text-sm text-slate-600">
                        {leave.toDate
                          ? new Date(leave.toDate).toLocaleDateString("en-GB", {
                              day: "2-digit", month: "short", year: "numeric",
                            })
                          : "—"}
                      </td>
                      <td className="px-4 py-3 text-sm font-bold text-slate-700">{days}d</td>
                      <td className="px-4 py-3 text-sm text-slate-500 max-w-[180px] truncate" title={leave.reason}>
                        {leave.reason || "—"}
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-1.5">
                          <span
                            className={`px-2.5 py-1 rounded-full text-[10px] font-bold border ${getStatusBadge(leave.status)}`}
                          >
                            {leave.status}
                          </span>
                          {leave.status === "Rejected" && leave.rejectionReason && (
                            <div className="relative">
                              <button
                                onMouseEnter={() => setTooltipId(leave._id)}
                                onMouseLeave={() => setTooltipId(null)}
                                className="text-red-400 hover:text-red-600 transition-colors"
                              >
                                <RiInformationLine size={15} />
                              </button>
                              {tooltipId === leave._id && (
                                <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 w-52 bg-slate-800 text-white text-xs rounded-xl p-3 shadow-xl z-10">
                                  <p className="font-bold mb-1">Rejection Reason:</p>
                                  <p className="opacity-90">{leave.rejectionReason}</p>
                                  <div className="absolute top-full left-1/2 -translate-x-1/2 border-4 border-transparent border-t-slate-800" />
                                </div>
                              )}
                            </div>
                          )}
                        </div>
                      </td>
                      <td className="px-4 py-3">
                        {leave.status === "Pending" ? (
                          <button
                            onClick={() => handleCancel(leave._id)}
                            disabled={cancelling === leave._id}
                            className="flex items-center gap-1 px-3 py-1.5 bg-red-50 hover:bg-red-100 text-red-600 rounded-lg text-xs font-bold transition-all disabled:opacity-50"
                          >
                            {cancelling === leave._id ? (
                              <span className="animate-spin ri-loader-4-line text-sm" />
                            ) : (
                              <RiDeleteBinLine size={13} />
                            )}
                            Cancel
                          </button>
                        ) : (
                          <span className="text-xs text-slate-400">—</span>
                        )}
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* ── Apply Leave Modal ── */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
          <div className="bg-white w-full max-w-lg rounded-2xl shadow-2xl overflow-hidden">
            {/* Modal header */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100">
              <h3 className="text-lg font-black text-slate-800">Apply for Leave</h3>
              <button
                onClick={() => { setShowModal(false); setErrors({}); }}
                className="p-2 text-slate-400 hover:text-red-500 hover:bg-slate-100 rounded-xl transition-all"
              >
                <RiCloseLine size={20} />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              {/* Leave Type */}
              <div>
                <label className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-1.5 block">
                  Leave Type
                </label>
                <select
                  value={formData.type}
                  onChange={(e) => handleChange("type", e.target.value)}
                  className={`w-full p-3 border rounded-xl focus:ring-2 focus:ring-blue-500 outline-none text-sm ${
                    errors.type ? "border-red-300" : "border-slate-200"
                  }`}
                >
                  {LEAVE_TYPES.map((t) => (
                    <option key={t} value={t}>{t} Leave</option>
                  ))}
                </select>
                {errors.type && <p className="text-red-500 text-xs mt-1">{errors.type}</p>}
              </div>

              {/* Date range */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-1.5 block">
                    From Date
                  </label>
                  <input
                    type="date"
                    value={formData.fromDate}
                    onChange={(e) => handleChange("fromDate", e.target.value)}
                    className={`w-full p-3 border rounded-xl focus:ring-2 focus:ring-blue-500 outline-none text-sm ${
                      errors.fromDate ? "border-red-300" : "border-slate-200"
                    }`}
                  />
                  {errors.fromDate && <p className="text-red-500 text-xs mt-1">{errors.fromDate}</p>}
                </div>
                <div>
                  <label className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-1.5 block">
                    To Date
                  </label>
                  <input
                    type="date"
                    value={formData.toDate}
                    min={formData.fromDate || undefined}
                    onChange={(e) => handleChange("toDate", e.target.value)}
                    className={`w-full p-3 border rounded-xl focus:ring-2 focus:ring-blue-500 outline-none text-sm ${
                      errors.toDate ? "border-red-300" : "border-slate-200"
                    }`}
                  />
                  {errors.toDate && <p className="text-red-500 text-xs mt-1">{errors.toDate}</p>}
                </div>
              </div>

              {/* Live days count */}
              {liveDays > 0 && (
                <div className="flex items-center gap-2 px-4 py-2.5 bg-blue-50 border border-blue-200 rounded-xl">
                  <RiCalendarLine className="text-blue-500" />
                  <span className="text-sm font-bold text-blue-700">
                    {liveDays} day{liveDays !== 1 ? "s" : ""} of leave
                  </span>
                </div>
              )}

              {/* Reason */}
              <div>
                <label className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-1.5 block">
                  Reason
                  <span className="ml-1 text-slate-400 normal-case font-normal">(min 10 chars)</span>
                </label>
                <textarea
                  value={formData.reason}
                  onChange={(e) => handleChange("reason", e.target.value)}
                  rows={3}
                  placeholder="Describe the reason for your leave..."
                  className={`w-full p-3 border rounded-xl focus:ring-2 focus:ring-blue-500 outline-none text-sm resize-none ${
                    errors.reason ? "border-red-300" : "border-slate-200"
                  }`}
                />
                <div className="flex items-center justify-between mt-1">
                  {errors.reason ? (
                    <p className="text-red-500 text-xs">{errors.reason}</p>
                  ) : (
                    <span />
                  )}
                  <span className="text-xs text-slate-400">{formData.reason.length}/500</span>
                </div>
              </div>

              {/* Actions */}
              <div className="flex gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => { setShowModal(false); setErrors({}); }}
                  className="flex-1 px-5 py-3 bg-slate-100 text-slate-700 rounded-xl font-bold hover:bg-slate-200 transition-all text-sm"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="flex-1 px-5 py-3 bg-blue-600 text-white rounded-xl font-bold hover:bg-blue-700 transition-all shadow-md disabled:opacity-60 text-sm flex items-center justify-center gap-2"
                >
                  {submitting ? (
                    <>
                      <span className="animate-spin ri-loader-4-line text-base" />
                      Submitting...
                    </>
                  ) : (
                    "Submit Request"
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default MyLeave;
