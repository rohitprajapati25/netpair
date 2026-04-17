import React, { useState, useEffect, useCallback } from "react";
import { useAuth } from "../../contexts/AuthContext";
import axios from "axios";
import {
  RiMegaphoneLine, RiSendPlane2Line, RiDeleteBin6Line,
  RiCalendarLine, RiGroupLine, RiAlertLine,
  RiInformationLine, RiCheckboxCircleLine, RiRefreshLine,
  RiCloseLine, RiSearchLine, RiFilterLine
} from "react-icons/ri";
import API_URL from "../../config/api";

// Use role-aware endpoint: admins use /admin, employees/hr use /employees or /admin (both work)
const getAnnouncementsEndpoint = (role) => {
  if (role === "superadmin" || role === "admin") return `${API_URL}/admin`;
  return `${API_URL}/admin`; // backend filters by role automatically
};

// ── Config ────────────────────────────────────────────────────────────────────
const TARGET_OPTIONS = [
  { value: "all",      label: "Everyone",          desc: "All admins, HR & employees",  icon: "ri-team-fill",         color: "text-blue-600   bg-blue-50   border-blue-200"   },
  { value: "admin",    label: "Admins Only",        desc: "System administrators",        icon: "ri-shield-user-fill",  color: "text-indigo-600 bg-indigo-50 border-indigo-200" },
  { value: "hr",       label: "HR Team",            desc: "HR managers only",             icon: "ri-user-star-fill",    color: "text-emerald-600 bg-emerald-50 border-emerald-200" },
  { value: "employee", label: "Employees Only",     desc: "All employees",                icon: "ri-user-fill",         color: "text-slate-600  bg-slate-50  border-slate-200"  },
];

const PRIORITY_OPTIONS = [
  { value: "normal",    label: "Normal",    icon: <RiInformationLine />,    color: "text-blue-600   bg-blue-50   border-blue-200"   },
  { value: "important", label: "Important", icon: <RiAlertLine />,          color: "text-amber-600  bg-amber-50  border-amber-200"  },
  { value: "urgent",    label: "Urgent",    icon: <RiCheckboxCircleLine />, color: "text-red-600    bg-red-50    border-red-200"    },
];

const priorityStyle = (p) => ({
  normal:    "bg-blue-50   text-blue-700   border-blue-200",
  important: "bg-amber-50  text-amber-700  border-amber-200",
  urgent:    "bg-red-50    text-red-700    border-red-200",
}[p] || "bg-slate-50 text-slate-600 border-slate-200");

const targetStyle = (t) => ({
  all:      "bg-blue-50   text-blue-700   border-blue-200",
  admin:    "bg-indigo-50 text-indigo-700 border-indigo-200",
  hr:       "bg-emerald-50 text-emerald-700 border-emerald-200",
  employee: "bg-slate-50  text-slate-600  border-slate-200",
}[t] || "bg-slate-50 text-slate-600 border-slate-200");

const targetLabel = (t) => TARGET_OPTIONS.find(o => o.value === t)?.label || t;

// ── Main Page ─────────────────────────────────────────────────────────────────
const Announcements = () => {
  const { token, user } = useAuth();
  const role = user?.role?.toLowerCase();
  const API  = getAnnouncementsEndpoint(role);

  const [announcements, setAnnouncements] = useState([]);
  const [loading,       setLoading]       = useState(true);
  const [submitting,    setSubmitting]    = useState(false);
  const [selected,      setSelected]      = useState(null);
  const [filterTarget,  setFilterTarget]  = useState("all_filter");
  const [search,        setSearch]        = useState("");
  const [toast,         setToast]         = useState(null);

  // Form state
  const [form, setForm] = useState({
    title:      "",
    message:    "",
    targetRole: "all",
    priority:   "normal",
    expiresAt:  "",
  });
  const [errors, setErrors] = useState({});

  const showToast = (msg, type = "success") => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 3000);
  };

  // ── Fetch ──────────────────────────────────────────────────────────────────
  const fetchAnnouncements = useCallback(async () => {
    if (!token) return;
    try {
      setLoading(true);
      const res = await axios.get(`${API}/announcements?limit=50`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setAnnouncements(res.data.announcements || []);
    } catch (err) {
      showToast("Failed to load announcements", "error");
    } finally {
      setLoading(false);
    }
  }, [token]);

  useEffect(() => { fetchAnnouncements(); }, [fetchAnnouncements]);

  // ── Validate ───────────────────────────────────────────────────────────────
  const validate = () => {
    const e = {};
    if (!form.title.trim())   e.title   = "Title is required";
    if (!form.message.trim()) e.message = "Message is required";
    if (form.title.length > 200)   e.title   = "Max 200 characters";
    if (form.message.length > 2000) e.message = "Max 2000 characters";
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  // ── Submit ─────────────────────────────────────────────────────────────────
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;
    try {
      setSubmitting(true);
      const res = await axios.post(`${API}/announcements`, form, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.data.success) {
        setAnnouncements(prev => [res.data.announcement, ...prev]);
        setForm({ title: "", message: "", targetRole: "all", priority: "normal", expiresAt: "" });
        setErrors({});
        showToast("Announcement published successfully!");
      }
    } catch (err) {
      showToast(err.response?.data?.message || "Failed to publish", "error");
    } finally {
      setSubmitting(false);
    }
  };

  // ── Delete ─────────────────────────────────────────────────────────────────
  const handleDelete = async (id) => {
    if (!window.confirm("Delete this announcement?")) return;
    try {
      await axios.delete(`${API}/announcements/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setAnnouncements(prev => prev.filter(a => a._id !== id));
      if (selected?._id === id) setSelected(null);
      showToast("Announcement deleted");
    } catch (err) {
      showToast(err.response?.data?.message || "Delete failed", "error");
    }
  };

  // ── Filter ─────────────────────────────────────────────────────────────────
  const filtered = announcements.filter(a => {
    const matchTarget = filterTarget === "all_filter" || a.targetRole === filterTarget;
    const matchSearch = !search || a.title.toLowerCase().includes(search.toLowerCase()) || a.message.toLowerCase().includes(search.toLowerCase());
    return matchTarget && matchSearch;
  });

  const canCreate = role === "superadmin" || role === "admin";

  return (
    <div className="space-y-6">

      {/* Toast */}
      {toast && (
        <div className={`fixed bottom-6 right-6 z-50 flex items-center gap-3 px-5 py-3 rounded-2xl shadow-2xl font-semibold text-sm text-white animate-fade-in ${toast.type === "error" ? "bg-red-600" : "bg-emerald-600"}`}>
          {toast.type === "error" ? <RiAlertLine /> : <RiCheckboxCircleLine />}
          {toast.msg}
        </div>
      )}

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="p-2.5 bg-blue-600 text-white rounded-xl shadow-md shadow-blue-200">
            <RiMegaphoneLine size={20} />
          </div>
          <div>
            <h1 className="text-2xl lg:text-3xl font-black text-slate-900 tracking-tight">Announcements</h1>
            <p className="text-slate-500 text-sm">{announcements.length} total · broadcast to your team</p>
          </div>
        </div>
        <button onClick={fetchAnnouncements} disabled={loading}
          className="self-start sm:self-auto flex items-center gap-2 px-4 py-2.5 bg-white border border-slate-200 hover:border-slate-300 text-slate-700 font-semibold rounded-xl shadow-sm text-sm transition-all disabled:opacity-50">
          <RiRefreshLine className={loading ? "animate-spin" : ""} /> Refresh
        </button>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-12 gap-6 items-start">

        {/* ── LEFT: Create Form ── */}
        {canCreate && (
          <div className="xl:col-span-4">
            <form onSubmit={handleSubmit} className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
              <div className="px-5 py-4 border-b border-slate-100 bg-slate-50">
                <h3 className="font-bold text-slate-800 text-sm flex items-center gap-2">
                  <RiSendPlane2Line className="text-blue-600" /> New Announcement
                </h3>
              </div>

              <div className="p-5 space-y-4">

                {/* Target audience */}
                <div>
                  <label className="block text-[10px] font-black text-slate-400 uppercase tracking-wider mb-2">Target Audience</label>
                  <div className="grid grid-cols-2 gap-2">
                    {TARGET_OPTIONS.map(opt => (
                      <button key={opt.value} type="button"
                        onClick={() => setForm(f => ({ ...f, targetRole: opt.value }))}
                        className={`flex items-center gap-2 p-2.5 rounded-xl border text-xs font-bold transition-all ${
                          form.targetRole === opt.value
                            ? opt.color + " shadow-sm"
                            : "border-slate-200 text-slate-500 hover:border-slate-300 bg-white"
                        }`}>
                        <i className={`${opt.icon} text-sm`}></i>
                        <div className="text-left min-w-0">
                          <p className="font-black truncate">{opt.label}</p>
                          <p className="text-[9px] opacity-70 truncate">{opt.desc}</p>
                        </div>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Priority */}
                <div>
                  <label className="block text-[10px] font-black text-slate-400 uppercase tracking-wider mb-2">Priority</label>
                  <div className="flex gap-2">
                    {PRIORITY_OPTIONS.map(opt => (
                      <button key={opt.value} type="button"
                        onClick={() => setForm(f => ({ ...f, priority: opt.value }))}
                        className={`flex-1 flex items-center justify-center gap-1.5 py-2 rounded-xl border text-xs font-bold transition-all ${
                          form.priority === opt.value
                            ? opt.color + " shadow-sm"
                            : "border-slate-200 text-slate-500 hover:border-slate-300 bg-white"
                        }`}>
                        {opt.icon} {opt.label}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Title */}
                <div>
                  <label className="block text-[10px] font-black text-slate-400 uppercase tracking-wider mb-1.5">Title *</label>
                  <input
                    value={form.title}
                    onChange={e => setForm(f => ({ ...f, title: e.target.value }))}
                    placeholder="Announcement title..."
                    className={`w-full px-4 py-2.5 bg-slate-50 border rounded-xl text-sm font-medium outline-none transition-all ${errors.title ? "border-red-300 focus:ring-2 focus:ring-red-200" : "border-slate-200 focus:ring-2 focus:ring-blue-100 focus:border-blue-400"}`}
                  />
                  {errors.title && <p className="text-[10px] text-red-500 font-bold mt-1">{errors.title}</p>}
                </div>

                {/* Message */}
                <div>
                  <label className="block text-[10px] font-black text-slate-400 uppercase tracking-wider mb-1.5">Message *</label>
                  <textarea
                    value={form.message}
                    onChange={e => setForm(f => ({ ...f, message: e.target.value }))}
                    placeholder="Write your announcement..."
                    rows={4}
                    className={`w-full px-4 py-2.5 bg-slate-50 border rounded-xl text-sm font-medium outline-none transition-all resize-none ${errors.message ? "border-red-300 focus:ring-2 focus:ring-red-200" : "border-slate-200 focus:ring-2 focus:ring-blue-100 focus:border-blue-400"}`}
                  />
                  <div className="flex items-center justify-between mt-1">
                    {errors.message
                      ? <p className="text-[10px] text-red-500 font-bold">{errors.message}</p>
                      : <span />}
                    <span className={`text-[10px] font-semibold ${form.message.length > 1800 ? "text-red-500" : "text-slate-400"}`}>
                      {form.message.length}/2000
                    </span>
                  </div>
                </div>

                {/* Expiry (optional) */}
                <div>
                  <label className="block text-[10px] font-black text-slate-400 uppercase tracking-wider mb-1.5">
                    Expires On <span className="normal-case font-normal">(optional)</span>
                  </label>
                  <input
                    type="date"
                    value={form.expiresAt}
                    min={new Date().toISOString().split("T")[0]}
                    onChange={e => setForm(f => ({ ...f, expiresAt: e.target.value }))}
                    className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-medium outline-none focus:ring-2 focus:ring-blue-100 focus:border-blue-400 transition-all"
                  />
                </div>

                {/* Submit */}
                <button type="submit" disabled={submitting}
                  className="w-full flex items-center justify-center gap-2 py-3 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl shadow-md transition-all disabled:opacity-50 text-sm">
                  {submitting
                    ? <><div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" /> Publishing...</>
                    : <><RiSendPlane2Line size={16} /> Publish Announcement</>}
                </button>
              </div>
            </form>
          </div>
        )}

        {/* ── RIGHT: List ── */}
        <div className={canCreate ? "xl:col-span-8" : "xl:col-span-12"}>

          {/* Search + Filter */}
          <div className="flex flex-col sm:flex-row gap-3 mb-4">
            <div className="relative flex-1">
              <RiSearchLine className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={15} />
              <input
                type="text"
                placeholder="Search announcements..."
                value={search}
                onChange={e => setSearch(e.target.value)}
                className="w-full pl-9 pr-4 py-2.5 border border-slate-200 rounded-xl text-sm outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white"
              />
            </div>
            <select
              value={filterTarget}
              onChange={e => setFilterTarget(e.target.value)}
              className="px-4 py-2.5 border border-slate-200 rounded-xl text-sm font-semibold outline-none focus:ring-2 focus:ring-blue-500 bg-white text-slate-700"
            >
              <option value="all_filter">All Audiences</option>
              {TARGET_OPTIONS.map(o => (
                <option key={o.value} value={o.value}>{o.label}</option>
              ))}
            </select>
          </div>

          {/* Loading */}
          {loading ? (
            <div className="space-y-3">
              {[...Array(4)].map((_, i) => (
                <div key={i} className="bg-white rounded-2xl border border-slate-200 p-5 animate-pulse">
                  <div className="flex gap-3 mb-3">
                    <div className="h-5 bg-slate-200 rounded-full w-20" />
                    <div className="h-5 bg-slate-200 rounded-full w-16" />
                  </div>
                  <div className="h-5 bg-slate-200 rounded w-3/4 mb-2" />
                  <div className="h-4 bg-slate-200 rounded w-full" />
                  <div className="h-4 bg-slate-200 rounded w-2/3 mt-1" />
                </div>
              ))}
            </div>
          ) : filtered.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-20 bg-white rounded-2xl border-2 border-dashed border-slate-200 text-slate-400">
              <RiMegaphoneLine size={40} className="opacity-20 mb-3" />
              <p className="font-bold text-base">No announcements found</p>
              <p className="text-sm mt-1">{canCreate ? "Create your first announcement" : "Check back later"}</p>
            </div>
          ) : (
            <div className="space-y-3">
              {filtered.map(a => (
                <AnnouncementCard
                  key={a._id}
                  announcement={a}
                  onView={() => setSelected(a)}
                  onDelete={canCreate ? handleDelete : null}
                  currentUserId={user?.id}
                  currentRole={role}
                />
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Detail Modal */}
      {selected && <AnnouncementDetailModal data={selected} onClose={() => setSelected(null)} />}
    </div>
  );
};

// ── Announcement Card ─────────────────────────────────────────────────────────
const AnnouncementCard = ({ announcement: a, onView, onDelete, currentUserId, currentRole }) => {
  const canDelete = onDelete && (currentRole === "superadmin" || a.createdBy?.id === currentUserId);

  return (
    <div
      onClick={onView}
      className="group bg-white rounded-2xl border border-slate-200 shadow-sm hover:shadow-md hover:border-blue-200 transition-all cursor-pointer p-5"
    >
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-center gap-2 flex-wrap">
          {/* Priority badge */}
          <span className={`flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase border ${priorityStyle(a.priority)}`}>
            {a.priority === "urgent" ? <RiAlertLine size={10} /> : a.priority === "important" ? <RiAlertLine size={10} /> : <RiInformationLine size={10} />}
            {a.priority}
          </span>
          {/* Target badge */}
          <span className={`flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase border ${targetStyle(a.targetRole)}`}>
            <RiGroupLine size={10} /> {targetLabel(a.targetRole)}
          </span>
        </div>

        <div className="flex items-center gap-1 shrink-0">
          {canDelete && (
            <button
              onClick={e => { e.stopPropagation(); onDelete(a._id); }}
              className="p-1.5 text-slate-300 hover:text-red-500 hover:bg-red-50 rounded-lg transition-all"
              title="Delete"
            >
              <RiDeleteBin6Line size={15} />
            </button>
          )}
        </div>
      </div>

      <h3 className="font-bold text-slate-900 text-base mt-3 group-hover:text-blue-600 transition-colors line-clamp-1">
        {a.title}
      </h3>
      <p className="text-slate-500 text-sm mt-1 line-clamp-2 leading-relaxed">{a.message}</p>

      <div className="flex items-center justify-between mt-4 pt-3 border-t border-slate-100">
        <div className="flex items-center gap-2 text-xs text-slate-400">
          <div className="w-5 h-5 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-full flex items-center justify-center text-white text-[9px] font-bold">
            {(a.createdBy?.name || "A").charAt(0).toUpperCase()}
          </div>
          <span className="font-medium">{a.createdBy?.name || "Admin"}</span>
          <span className="text-slate-300">·</span>
          <span className="capitalize text-slate-400">{a.createdBy?.role}</span>
        </div>
        <div className="flex items-center gap-1 text-[10px] text-slate-400 font-medium">
          <RiCalendarLine size={11} />
          {new Date(a.createdAt).toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" })}
          <span className="ml-1">
            {new Date(a.createdAt).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
          </span>
        </div>
      </div>
    </div>
  );
};

// ── Detail Modal ──────────────────────────────────────────────────────────────
const AnnouncementDetailModal = ({ data: a, onClose }) => (
  <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center z-50 p-4" onClick={onClose}>
    <div className="bg-white rounded-2xl w-full max-w-2xl shadow-2xl overflow-hidden" onClick={e => e.stopPropagation()}>

      {/* Header */}
      <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 bg-slate-50">
        <div className="flex items-center gap-2">
          <span className={`flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase border ${priorityStyle(a.priority)}`}>
            {a.priority}
          </span>
          <span className={`flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase border ${targetStyle(a.targetRole)}`}>
            <RiGroupLine size={10} /> {targetLabel(a.targetRole)}
          </span>
        </div>
        <button onClick={onClose} className="p-1.5 hover:bg-slate-200 rounded-lg transition-colors text-slate-500">
          <RiCloseLine size={20} />
        </button>
      </div>

      {/* Body */}
      <div className="p-6">
        <h2 className="text-2xl font-black text-slate-900 mb-4">{a.title}</h2>
        <div className="bg-slate-50 rounded-xl p-5 border border-slate-100">
          <p className="text-slate-700 text-sm leading-relaxed whitespace-pre-wrap">{a.message}</p>
        </div>
      </div>

      {/* Footer */}
      <div className="px-6 py-4 border-t border-slate-100 bg-slate-50 flex items-center justify-between">
        <div className="flex items-center gap-3 text-xs text-slate-500">
          <div className="w-7 h-7 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-full flex items-center justify-center text-white text-xs font-bold">
            {(a.createdBy?.name || "A").charAt(0).toUpperCase()}
          </div>
          <div>
            <p className="font-bold text-slate-700">{a.createdBy?.name || "Admin"}</p>
            <p className="text-[10px] text-slate-400">
              {new Date(a.createdAt).toLocaleDateString("en-IN", { day: "2-digit", month: "long", year: "numeric" })}
              &nbsp;at&nbsp;
              {new Date(a.createdAt).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
            </p>
          </div>
        </div>
        {a.expiresAt && (
          <p className="text-[10px] text-amber-600 font-semibold">
            Expires: {new Date(a.expiresAt).toLocaleDateString("en-IN")}
          </p>
        )}
        <button onClick={onClose} className="px-5 py-2 bg-slate-900 text-white font-bold rounded-xl text-sm hover:bg-blue-600 transition-colors">
          Close
        </button>
      </div>
    </div>
  </div>
);

export default Announcements;
