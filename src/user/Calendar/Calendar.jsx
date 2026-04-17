
import { useState, useEffect, useCallback, useMemo } from "react";
import { useAuth } from "../../contexts/AuthContext";
import axios from "axios";
import {
  RiCalendarLine,
  RiAddLine,
  RiEditLine,
  RiDeleteBinLine,
  RiArrowLeftSLine,
  RiArrowRightSLine,
  RiCheckLine,
  RiCloseLine,
  RiCalendarEventLine,
  RiGlobalLine,
  RiBuildingLine,
  RiLoader4Line,
  RiRefreshLine,
} from "react-icons/ri";
import { BASE_URL } from "../../config/api";

// ─── Constants ────────────────────────────────────────────────────────────────

const TYPE_CONFIG = {
  national: {
    label: "National",
    bg: "bg-red-100",
    text: "text-red-700",
    dot: "bg-red-500",
    badge: "bg-red-100 text-red-700 border-red-200",
    calBg: "bg-red-100 hover:bg-red-200",
    calText: "text-red-800",
  },
  optional: {
    label: "Optional",
    bg: "bg-blue-100",
    text: "text-blue-700",
    dot: "bg-blue-500",
    badge: "bg-blue-100 text-blue-700 border-blue-200",
    calBg: "bg-blue-100 hover:bg-blue-200",
    calText: "text-blue-800",
  },
  restricted: {
    label: "Restricted",
    bg: "bg-amber-100",
    text: "text-amber-700",
    dot: "bg-amber-500",
    badge: "bg-amber-100 text-amber-700 border-amber-200",
    calBg: "bg-amber-100 hover:bg-amber-200",
    calText: "text-amber-800",
  },
  company: {
    label: "Company",
    bg: "bg-purple-100",
    text: "text-purple-700",
    dot: "bg-purple-500",
    badge: "bg-purple-100 text-purple-700 border-purple-200",
    calBg: "bg-purple-100 hover:bg-purple-200",
    calText: "text-purple-800",
  },
};

const MONTH_NAMES = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December",
];

const DAY_NAMES = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

// ─── Helpers ──────────────────────────────────────────────────────────────────

const toDateKey = (date) => {
  const d = new Date(date);
  // Use UTC to avoid timezone shifts when comparing date strings
  const y = d.getUTCFullYear();
  const m = String(d.getUTCMonth() + 1).padStart(2, "0");
  const day = String(d.getUTCDate()).padStart(2, "0");
  return `${y}-${m}-${day}`;
};

const todayKey = toDateKey(new Date());

const formatDisplayDate = (dateStr) => {
  const d = new Date(dateStr);
  return d.toLocaleDateString("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric",
    timeZone: "UTC",
  });
};

// Build a map: "YYYY-MM-DD" -> holiday object
const buildHolidayMap = (holidays) => {
  const map = {};
  holidays.forEach((h) => {
    const key = toDateKey(h.date);
    map[key] = h;
  });
  return map;
};

// Build calendar grid for a given month (year, monthIndex 0-11)
// Returns array of 6*7 cells: null (empty pad) or { day, dateKey }
const buildMonthGrid = (year, monthIndex) => {
  const firstDay = new Date(year, monthIndex, 1).getDay(); // 0=Sun
  const daysInMonth = new Date(year, monthIndex + 1, 0).getDate();
  const cells = [];
  for (let i = 0; i < firstDay; i++) cells.push(null);
  for (let d = 1; d <= daysInMonth; d++) {
    const m = String(monthIndex + 1).padStart(2, "0");
    const day = String(d).padStart(2, "0");
    cells.push({ day: d, dateKey: `${year}-${m}-${day}` });
  }
  // Pad to complete last row
  while (cells.length % 7 !== 0) cells.push(null);
  return cells;
};

// ─── Toast ────────────────────────────────────────────────────────────────────

const Toast = ({ toasts, onRemove }) => (
  <div className="fixed bottom-5 right-5 z-[200] flex flex-col gap-2 pointer-events-none">
    {toasts.map((t) => (
      <div
        key={t.id}
        className={`pointer-events-auto flex items-center gap-3 px-4 py-3 rounded-xl shadow-lg text-white text-sm font-semibold transition-all duration-300 ${
          t.type === "success" ? "bg-emerald-500" : "bg-red-500"
        }`}
      >
        {t.type === "success" ? (
          <RiCheckLine className="text-base shrink-0" />
        ) : (
          <RiCloseLine className="text-base shrink-0" />
        )}
        <span>{t.message}</span>
        <button
          onClick={() => onRemove(t.id)}
          className="ml-2 opacity-70 hover:opacity-100 transition-opacity"
        >
          <RiCloseLine size={14} />
        </button>
      </div>
    ))}
  </div>
);

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

// ─── Month Calendar ───────────────────────────────────────────────────────────

const MonthCalendar = ({ year, monthIndex, holidayMap }) => {
  const cells = useMemo(
    () => buildMonthGrid(year, monthIndex),
    [year, monthIndex]
  );

  return (
    <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
      {/* Month header */}
      <div className="bg-slate-50 border-b border-slate-200 px-4 py-3">
        <h3 className="font-bold text-slate-700 text-sm">
          {MONTH_NAMES[monthIndex]}
        </h3>
      </div>

      {/* Day-of-week headers */}
      <div className="grid grid-cols-7 border-b border-slate-100">
        {DAY_NAMES.map((d, i) => (
          <div
            key={d}
            className={`text-center py-1.5 text-[10px] font-bold uppercase tracking-wider ${
              i === 0 || i === 6 ? "text-rose-400" : "text-slate-400"
            }`}
          >
            {d}
          </div>
        ))}
      </div>

      {/* Day cells */}
      <div className="grid grid-cols-7">
        {cells.map((cell, idx) => {
          if (!cell) {
            return (
              <div
                key={`empty-${idx}`}
                className="aspect-square border-b border-r border-slate-50"
              />
            );
          }

          const { day, dateKey } = cell;
          const holiday = holidayMap[dateKey];
          const isToday = dateKey === todayKey;
          const dayOfWeek = idx % 7;
          const isWeekend = dayOfWeek === 0 || dayOfWeek === 6;
          const cfg = holiday ? TYPE_CONFIG[holiday.type] || TYPE_CONFIG.company : null;

          return (
            <div
              key={dateKey}
              className={`
                relative aspect-square border-b border-r border-slate-50 flex flex-col items-center justify-start pt-1 group
                ${holiday ? `${cfg.calBg} cursor-pointer` : isWeekend ? "bg-slate-50" : "bg-white hover:bg-slate-50"}
                transition-colors duration-150
              `}
            >
              {/* Day number */}
              <span
                className={`
                  text-[11px] font-bold w-5 h-5 flex items-center justify-center rounded-full leading-none
                  ${isToday ? "bg-blue-600 text-white ring-2 ring-blue-300" : ""}
                  ${!isToday && holiday ? cfg.calText : ""}
                  ${!isToday && !holiday && isWeekend ? "text-rose-400" : ""}
                  ${!isToday && !holiday && !isWeekend ? "text-slate-600" : ""}
                `}
              >
                {day}
              </span>

              {/* Holiday dot indicator */}
              {holiday && (
                <span
                  className={`mt-0.5 w-1 h-1 rounded-full ${cfg.dot}`}
                />
              )}

              {/* Tooltip */}
              {holiday && (
                <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-1.5 z-20 hidden group-hover:flex flex-col items-center pointer-events-none">
                  <div className="bg-slate-900 text-white text-[10px] font-semibold rounded-lg px-2.5 py-1.5 whitespace-nowrap shadow-xl max-w-[140px] text-center">
                    <p className="truncate">{holiday.name}</p>
                    <p className={`mt-0.5 font-normal opacity-80`}>
                      {TYPE_CONFIG[holiday.type]?.label || holiday.type}
                    </p>
                  </div>
                  <div className="w-2 h-2 bg-slate-900 rotate-45 -mt-1" />
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};

// ─── Holiday List Panel ───────────────────────────────────────────────────────

const HolidayListPanel = ({ holidays, canManage, showAddedBy, onEdit, onDeleteRequest, deleteConfirm, onDeleteConfirm, onDeleteCancel }) => {
  // Group by month
  const grouped = useMemo(() => {
    const groups = {};
    [...holidays]
      .sort((a, b) => new Date(a.date) - new Date(b.date))
      .forEach((h) => {
        const d = new Date(h.date);
        const key = d.getUTCMonth();
        if (!groups[key]) groups[key] = [];
        groups[key].push(h);
      });
    return groups;
  }, [holidays]);

  const todayDate = new Date();
  todayDate.setHours(0, 0, 0, 0);

  if (holidays.length === 0) {
    return (
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm flex flex-col items-center justify-center py-16 text-slate-400">
        <RiCalendarEventLine className="text-5xl mb-3 opacity-30" />
        <p className="font-semibold text-slate-500">No holidays found</p>
        <p className="text-sm mt-1">No holidays have been added for this year</p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
      <div className="flex items-center gap-3 px-5 py-4 border-b border-slate-100">
        <div className="p-2 rounded-xl bg-slate-50 text-blue-600">
          <RiCalendarEventLine size={18} />
        </div>
        <h2 className="font-bold text-slate-800">Holiday List</h2>
        <span className="ml-auto text-xs font-bold text-slate-400 bg-slate-100 px-2.5 py-1 rounded-full">
          {holidays.length} total
        </span>
      </div>

      <div className="divide-y divide-slate-100 max-h-[600px] overflow-y-auto">
        {Object.entries(grouped).map(([monthIdx, monthHolidays]) => (
          <div key={monthIdx}>
            {/* Month group header */}
            <div className="px-5 py-2 bg-slate-50 sticky top-0 z-10">
              <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
                {MONTH_NAMES[Number(monthIdx)]}
              </span>
            </div>

            {monthHolidays.map((holiday) => {
              const cfg = TYPE_CONFIG[holiday.type] || TYPE_CONFIG.company;
              const hDate = new Date(holiday.date);
              hDate.setHours(0, 0, 0, 0);
              const isUpcoming = hDate >= todayDate;
              const isConfirming = deleteConfirm === holiday._id;

              return (
                <div
                  key={holiday._id}
                  className={`flex items-center gap-3 px-5 py-3 hover:bg-slate-50 transition-colors ${
                    isUpcoming ? "border-l-2 border-l-emerald-400" : "border-l-2 border-l-transparent"
                  }`}
                >
                  {/* Dot */}
                  <span className={`w-2.5 h-2.5 rounded-full shrink-0 ${cfg.dot}`} />

                  {/* Date + Name */}
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold text-slate-800 truncate">
                      {holiday.name}
                    </p>
                    <p className="text-xs text-slate-400 mt-0.5">
                      {formatDisplayDate(holiday.date)}
                      {holiday.isRecurring && (
                        <span className="ml-1.5 text-[10px] text-slate-300 font-medium">
                          · recurring
                        </span>
                      )}
                    </p>
                    {showAddedBy && holiday.createdBy?.name && (
                      <p className="text-[10px] text-slate-400 mt-0.5">
                        Added by <span className="font-semibold text-slate-500">{holiday.createdBy.name}</span>
                        <span className="ml-1 capitalize text-slate-400">({holiday.createdBy.role})</span>
                      </p>
                    )}
                  </div>

                  {/* Type badge */}
                  <span
                    className={`shrink-0 px-2 py-0.5 rounded-md text-[10px] font-bold border ${cfg.badge}`}
                  >
                    {cfg.label}
                  </span>

                  {/* Admin actions */}
                  {canManage && (
                    <div className="shrink-0 flex items-center gap-1">
                      {isConfirming ? (
                        <div className="flex items-center gap-1.5 bg-red-50 border border-red-200 rounded-xl px-2.5 py-1.5">
                          <span className="text-xs font-semibold text-red-700 whitespace-nowrap">
                            Delete?
                          </span>
                          <button
                            onClick={() => onDeleteConfirm(holiday._id)}
                            className="px-2 py-0.5 bg-red-600 hover:bg-red-700 text-white text-xs font-bold rounded-lg transition-colors"
                          >
                            Yes
                          </button>
                          <button
                            onClick={onDeleteCancel}
                            className="px-2 py-0.5 bg-slate-200 hover:bg-slate-300 text-slate-700 text-xs font-bold rounded-lg transition-colors"
                          >
                            No
                          </button>
                        </div>
                      ) : (
                        <>
                          <button
                            onClick={() => onEdit(holiday)}
                            className="p-1.5 rounded-lg text-slate-400 hover:text-blue-600 hover:bg-blue-50 transition-all"
                            title="Edit"
                          >
                            <RiEditLine size={14} />
                          </button>
                          <button
                            onClick={() => onDeleteRequest(holiday._id)}
                            className="p-1.5 rounded-lg text-slate-400 hover:text-red-600 hover:bg-red-50 transition-all"
                            title="Delete"
                          >
                            <RiDeleteBinLine size={14} />
                          </button>
                        </>
                      )}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        ))}
      </div>
    </div>
  );
};

// ─── Add / Edit Modal ─────────────────────────────────────────────────────────

const EMPTY_FORM = {
  name: "",
  date: "",
  type: "national",
  description: "",
  isRecurring: true,
};

const HolidayModal = ({ open, onClose, onSaved, token, editingHoliday }) => {
  const [form, setForm] = useState(EMPTY_FORM);
  const [errors, setErrors] = useState({});
  const [saving, setSaving] = useState(false);

  // Populate form when editing
  useEffect(() => {
    if (editingHoliday) {
      setForm({
        name: editingHoliday.name || "",
        date: editingHoliday.date ? toDateKey(editingHoliday.date) : "",
        type: editingHoliday.type || "national",
        description: editingHoliday.description || "",
        isRecurring: editingHoliday.isRecurring !== false,
      });
    } else {
      setForm(EMPTY_FORM);
    }
    setErrors({});
  }, [editingHoliday, open]);

  const validate = () => {
    const e = {};
    if (!form.name.trim()) e.name = "Holiday name is required";
    if (!form.date) e.date = "Date is required";
    return e;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length) {
      setErrors(errs);
      return;
    }

    setSaving(true);
    try {
      const payload = {
        name: form.name.trim(),
        date: form.date,
        type: form.type,
        description: form.description.trim(),
        isRecurring: form.isRecurring,
      };

      if (editingHoliday) {
        await axios.put(
          `${BASE_URL}/api/admin/holidays/${editingHoliday._id}`,
          payload,
          { headers: { Authorization: `Bearer ${token}` } }
        );
        onSaved("Holiday updated successfully");
      } else {
        await axios.post(
          `${BASE_URL}/api/admin/holidays`,
          payload,
          { headers: { Authorization: `Bearer ${token}` } }
        );
        onSaved("Holiday added successfully");
      }
    } catch (err) {
      onSaved(null, err.response?.data?.message || "Failed to save holiday");
    } finally {
      setSaving(false);
    }
  };

  const set = (field) => (e) => {
    const val = e.target.type === "checkbox" ? e.target.checked : e.target.value;
    setForm((prev) => ({ ...prev, [field]: val }));
    if (errors[field]) setErrors((prev) => ({ ...prev, [field]: undefined }));
  };

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden">
        {/* Modal header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-blue-50 text-blue-600">
              <RiCalendarEventLine size={18} />
            </div>
            <h2 className="font-bold text-slate-800">
              {editingHoliday ? "Edit Holiday" : "Add Holiday"}
            </h2>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-xl text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-all"
          >
            <RiCloseLine size={18} />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {/* Holiday Name */}
          <div className="space-y-1.5">
            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">
              Holiday Name <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={form.name}
              onChange={set("name")}
              placeholder="e.g. Republic Day"
              className={`w-full px-4 py-3 bg-slate-50 border-2 rounded-xl text-sm font-medium outline-none transition-all focus:bg-white ${
                errors.name
                  ? "border-red-300 focus:border-red-500"
                  : "border-slate-100 focus:border-blue-500"
              }`}
            />
            {errors.name && (
              <p className="text-[11px] text-red-500 font-semibold ml-1">{errors.name}</p>
            )}
          </div>

          {/* Date */}
          <div className="space-y-1.5">
            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">
              Date <span className="text-red-500">*</span>
            </label>
            <input
              type="date"
              value={form.date}
              onChange={set("date")}
              className={`w-full px-4 py-3 bg-slate-50 border-2 rounded-xl text-sm font-medium outline-none transition-all focus:bg-white ${
                errors.date
                  ? "border-red-300 focus:border-red-500"
                  : "border-slate-100 focus:border-blue-500"
              }`}
            />
            {errors.date && (
              <p className="text-[11px] text-red-500 font-semibold ml-1">{errors.date}</p>
            )}
          </div>

          {/* Type */}
          <div className="space-y-1.5">
            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">
              Type
            </label>
            <select
              value={form.type}
              onChange={set("type")}
              className="w-full px-4 py-3 bg-slate-50 border-2 border-slate-100 rounded-xl text-sm font-medium outline-none transition-all focus:bg-white focus:border-blue-500 appearance-none"
            >
              {Object.entries(TYPE_CONFIG).map(([val, cfg]) => (
                <option key={val} value={val}>
                  {cfg.label}
                </option>
              ))}
            </select>
          </div>

          {/* Description */}
          <div className="space-y-1.5">
            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">
              Description <span className="text-slate-300 font-normal normal-case tracking-normal">(optional)</span>
            </label>
            <textarea
              value={form.description}
              onChange={set("description")}
              placeholder="Brief description..."
              rows={3}
              className="w-full px-4 py-3 bg-slate-50 border-2 border-slate-100 rounded-xl text-sm font-medium outline-none transition-all focus:bg-white focus:border-blue-500 resize-none"
            />
          </div>

          {/* Recurring */}
          <label className="flex items-center gap-3 cursor-pointer group">
            <div className="relative">
              <input
                type="checkbox"
                checked={form.isRecurring}
                onChange={set("isRecurring")}
                className="sr-only"
              />
              <div
                className={`w-10 h-5 rounded-full transition-colors duration-200 ${
                  form.isRecurring ? "bg-blue-600" : "bg-slate-200"
                }`}
              />
              <div
                className={`absolute top-0.5 left-0.5 w-4 h-4 bg-white rounded-full shadow transition-transform duration-200 ${
                  form.isRecurring ? "translate-x-5" : "translate-x-0"
                }`}
              />
            </div>
            <span className="text-sm font-semibold text-slate-700 group-hover:text-slate-900 transition-colors">
              Recurring every year
            </span>
          </label>

          {/* Actions */}
          <div className="flex items-center justify-end gap-3 pt-2 border-t border-slate-100">
            <button
              type="button"
              onClick={onClose}
              className="px-5 py-2.5 rounded-xl border border-slate-200 text-slate-600 font-semibold text-sm hover:bg-slate-50 transition-all"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={saving}
              className="flex items-center gap-2 px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl shadow-md transition-all disabled:opacity-50 disabled:cursor-not-allowed text-sm"
            >
              {saving ? (
                <RiLoader4Line className="animate-spin" size={16} />
              ) : (
                <RiCheckLine size={16} />
              )}
              {saving ? "Saving..." : editingHoliday ? "Update" : "Add Holiday"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

// ─── Skeleton ─────────────────────────────────────────────────────────────────

const CalendarSkeleton = () => (
  <div className="space-y-6 animate-pulse">
    {/* Header skeleton */}
    <div className="flex items-center justify-between">
      <div className="h-8 bg-slate-200 rounded-lg w-52" />
      <div className="flex items-center gap-3">
        <div className="h-9 bg-slate-200 rounded-xl w-32" />
        <div className="h-9 bg-slate-200 rounded-xl w-28" />
      </div>
    </div>
    {/* Stat cards skeleton */}
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
      {[...Array(4)].map((_, i) => (
        <div key={i} className="h-24 bg-slate-200 rounded-2xl" />
      ))}
    </div>
    {/* Calendar grid skeleton */}
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {[...Array(12)].map((_, i) => (
        <div key={i} className="h-48 bg-slate-200 rounded-2xl" />
      ))}
    </div>
  </div>
);

// ─── Legend ───────────────────────────────────────────────────────────────────

const Legend = () => (
  <div className="flex flex-wrap items-center gap-x-5 gap-y-2">
    {Object.entries(TYPE_CONFIG).map(([type, cfg]) => (
      <div key={type} className="flex items-center gap-1.5">
        <span className={`w-2.5 h-2.5 rounded-full ${cfg.dot}`} />
        <span className="text-xs font-semibold text-slate-500">{cfg.label}</span>
      </div>
    ))}
    <div className="flex items-center gap-1.5">
      <span className="w-5 h-5 rounded-full bg-blue-600 flex items-center justify-center">
        <span className="text-[8px] font-black text-white">T</span>
      </span>
      <span className="text-xs font-semibold text-slate-500">Today</span>
    </div>
  </div>
);

// ─── Main Component ───────────────────────────────────────────────────────────

const Calendar = () => {
  const { token, role } = useAuth();
  const canManage  = role === "superadmin" || role === "admin";
  const isEmployee = role === "employee";
  const isHR       = role === "hr";

  const currentYear = new Date().getFullYear();
  const [year, setYear] = useState(currentYear);
  const [holidays, setHolidays] = useState([]);
  const [loading, setLoading] = useState(true);

  const [modalOpen, setModalOpen] = useState(false);
  const [editingHoliday, setEditingHoliday] = useState(null);
  const [deleteConfirm, setDeleteConfirm] = useState(null);

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

  // ── Fetch holidays ─────────────────────────────────────────────────────────
  const fetchHolidays = useCallback(async () => {
    setLoading(true);
    try {
      // All roles can read holidays
      // admin/superadmin/HR use admin endpoint; employees use employee endpoint
      const endpoint = (canManage || isHR)
        ? `${BASE_URL}/api/admin/holidays?year=${year}`
        : `${BASE_URL}/api/employees/holidays?year=${year}`;
      const res = await axios.get(endpoint, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setHolidays(res.data.holidays || []);
    } catch (err) {
      addToast(err.response?.data?.message || "Failed to load holidays", "error");
    } finally {
      setLoading(false);
    }
  }, [year, token, addToast, canManage]);

  useEffect(() => { fetchHolidays(); }, [fetchHolidays]);

  const holidayMap = useMemo(() => buildHolidayMap(holidays), [holidays]);

  // ── Derived data ───────────────────────────────────────────────────────────
  const today = useMemo(() => { const d = new Date(); d.setHours(0,0,0,0); return d; }, []);

  const upcomingHolidays = useMemo(() =>
    [...holidays]
      .filter(h => { const d = new Date(h.date); d.setHours(0,0,0,0); return d >= today; })
      .sort((a,b) => new Date(a.date) - new Date(b.date)),
  [holidays, today]);

  const nextHoliday = upcomingHolidays[0] || null;

  const thisMonthHolidays = useMemo(() =>
    holidays.filter(h => {
      const d = new Date(h.date);
      return d.getUTCMonth() === today.getMonth() && d.getUTCFullYear() === today.getFullYear();
    }),
  [holidays, today]);

  const stats = useMemo(() => ({
    total:    holidays.length,
    national: holidays.filter(h => h.type === "national").length,
    company:  holidays.filter(h => h.type === "company").length,
    upcoming: upcomingHolidays.length,
  }), [holidays, upcomingHolidays]);

  // ── Days until next holiday ────────────────────────────────────────────────
  const daysUntilNext = useMemo(() => {
    if (!nextHoliday) return null;
    const d = new Date(nextHoliday.date); d.setHours(0,0,0,0);
    const diff = Math.round((d - today) / (1000 * 60 * 60 * 24));
    if (diff === 0) return "Today!";
    if (diff === 1) return "Tomorrow";
    return `In ${diff} days`;
  }, [nextHoliday, today]);

  // ── CRUD handlers ──────────────────────────────────────────────────────────
  const handleOpenAdd   = () => { setEditingHoliday(null); setModalOpen(true); };
  const handleOpenEdit  = (h) => { setEditingHoliday(h); setModalOpen(true); };
  const handleModalSaved = (successMsg, errorMsg) => {
    if (errorMsg) { addToast(errorMsg, "error"); }
    else { addToast(successMsg, "success"); setModalOpen(false); setEditingHoliday(null); fetchHolidays(); }
  };
  const handleDeleteRequest = (id) => setDeleteConfirm(id);
  const handleDeleteConfirm = async (id) => {
    try {
      await axios.delete(`${BASE_URL}/api/admin/holidays/${id}`, { headers: { Authorization: `Bearer ${token}` } });
      addToast("Holiday deleted successfully", "success");
      setDeleteConfirm(null);
      fetchHolidays();
    } catch (err) {
      addToast(err.response?.data?.message || "Failed to delete holiday", "error");
      setDeleteConfirm(null);
    }
  };
  const handleDeleteCancel = () => setDeleteConfirm(null);

  if (loading) return <CalendarSkeleton />;

  return (
    <div className="space-y-6">
      <Toast toasts={toasts} onRemove={removeToast} />

      {canManage && (
        <HolidayModal
          open={modalOpen}
          onClose={() => { setModalOpen(false); setEditingHoliday(null); }}
          onSaved={handleModalSaved}
          token={token}
          editingHoliday={editingHoliday}
        />
      )}

      {/* ── Header ── */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl lg:text-3xl font-black text-slate-900 tracking-tight">
            Holiday Calendar
          </h1>
          <p className="text-slate-500 text-sm mt-0.5">
            {canManage
              ? "Manage public and company holidays"
              : isHR
              ? "View holidays and plan team schedules"
              : "Your holiday schedule for the year"}
          </p>
        </div>

        <div className="flex items-center gap-3 flex-wrap">
          {/* Year navigator */}
          <div className="flex items-center gap-1 bg-white border border-slate-200 rounded-xl shadow-sm overflow-hidden">
            <button onClick={() => setYear(y => y - 1)} className="p-2 hover:bg-slate-50 text-slate-500 hover:text-slate-700 transition-colors">
              <RiArrowLeftSLine size={18} />
            </button>
            <span className="px-3 py-2 font-black text-slate-800 text-sm min-w-[52px] text-center">{year}</span>
            <button onClick={() => setYear(y => y + 1)} className="p-2 hover:bg-slate-50 text-slate-500 hover:text-slate-700 transition-colors">
              <RiArrowRightSLine size={18} />
            </button>
          </div>

          <button onClick={fetchHolidays} className="flex items-center gap-1.5 px-3 py-2 rounded-xl border border-slate-200 text-slate-600 hover:bg-slate-50 text-sm font-semibold transition-all">
            <RiRefreshLine size={16} /> Refresh
          </button>

          {/* Add Holiday — admin/superadmin only */}
          {canManage && (
            <button onClick={handleOpenAdd} className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 text-white text-sm font-bold shadow-md transition-all">
              <RiAddLine size={16} /> Add Holiday
            </button>
          )}
        </div>
      </div>

      {/* ── NEXT HOLIDAY BANNER — Employee & HR only ── */}
      {(isEmployee || isHR) && nextHoliday && (
        <div className={`rounded-2xl p-4 lg:p-5 bg-gradient-to-r ${
          nextHoliday.type === "national" ? "from-red-500 to-rose-600" :
          nextHoliday.type === "company"  ? "from-purple-500 to-pink-600" :
          nextHoliday.type === "optional" ? "from-blue-500 to-indigo-600" :
          "from-amber-500 to-orange-500"
        } text-white shadow-lg flex items-center justify-between gap-4`}>
          <div className="flex items-center gap-4">
            <div className="bg-white/20 p-3 rounded-xl shrink-0">
              <RiCalendarEventLine size={24} />
            </div>
            <div>
              <p className="text-white/80 text-xs font-semibold uppercase tracking-wider">Next Holiday</p>
              <p className="text-xl font-black mt-0.5">{nextHoliday.name}</p>
              <p className="text-white/80 text-sm mt-0.5">
                {formatDisplayDate(nextHoliday.date)}
                {nextHoliday.description && (
                  <span className="ml-2 opacity-70">· {nextHoliday.description}</span>
                )}
              </p>
            </div>
          </div>
          <div className="shrink-0 text-right">
            <p className="text-2xl font-black">{daysUntilNext}</p>
            <span className={`text-[10px] font-black uppercase tracking-wider px-2 py-0.5 rounded-full bg-white/20`}>
              {TYPE_CONFIG[nextHoliday.type]?.label || nextHoliday.type}
            </span>
          </div>
        </div>
      )}

      {/* ── STAT CARDS ── */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard label="Total Holidays" value={stats.total}    icon={<RiCalendarLine />}      bg="from-blue-500 to-indigo-600" />
        <StatCard label="National"       value={stats.national} icon={<RiGlobalLine />}         bg="from-red-500 to-rose-600" />
        <StatCard label="Company"        value={stats.company}  icon={<RiBuildingLine />}        bg="from-purple-500 to-pink-600" />
        <StatCard label="Upcoming"       value={stats.upcoming} icon={<RiCalendarEventLine />}   bg="from-emerald-500 to-green-600" />
      </div>

      {/* ── THIS MONTH HIGHLIGHT — HR only ── */}
      {isHR && thisMonthHolidays.length > 0 && (
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-5">
          <div className="flex items-center gap-2 mb-3">
            <div className="p-2 rounded-xl bg-emerald-50 text-emerald-600">
              <RiCalendarEventLine size={16} />
            </div>
            <h3 className="font-bold text-slate-800">
              Holidays This Month — {MONTH_NAMES[today.getMonth()]}
            </h3>
            <span className="ml-auto text-xs font-bold text-emerald-600 bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-200">
              {thisMonthHolidays.length} holiday{thisMonthHolidays.length !== 1 ? "s" : ""}
            </span>
          </div>
          <div className="flex flex-wrap gap-2">
            {thisMonthHolidays.map(h => {
              const cfg = TYPE_CONFIG[h.type] || TYPE_CONFIG.company;
              return (
                <div key={h._id} className={`flex items-center gap-2 px-3 py-2 rounded-xl border ${cfg.badge}`}>
                  <span className={`w-2 h-2 rounded-full ${cfg.dot}`} />
                  <span className="text-xs font-bold">{h.name}</span>
                  <span className="text-[10px] opacity-70">{formatDisplayDate(h.date)}</span>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* ── LEGEND ── */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm px-5 py-3.5">
        <Legend />
      </div>

      {/* ── MAIN CONTENT ── */}
      <div className={`grid gap-6 items-start ${canManage || isHR ? "grid-cols-1 xl:grid-cols-3" : "grid-cols-1"}`}>

        {/* Calendar grid */}
        <div className={canManage || isHR ? "xl:col-span-2" : ""}>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {MONTH_NAMES.map((_, monthIndex) => (
              <MonthCalendar key={monthIndex} year={year} monthIndex={monthIndex} holidayMap={holidayMap} />
            ))}
          </div>
        </div>

        {/* Holiday list panel — admin/superadmin/HR only */}
        {(canManage || isHR) && (
          <div className="xl:col-span-1">
            <HolidayListPanel
              holidays={holidays}
              canManage={canManage}
              showAddedBy={canManage}
              onEdit={handleOpenEdit}
              onDeleteRequest={handleDeleteRequest}
              deleteConfirm={deleteConfirm}
              onDeleteConfirm={handleDeleteConfirm}
              onDeleteCancel={handleDeleteCancel}
            />
          </div>
        )}

        {/* Employee: compact upcoming list instead of full management panel */}
        {isEmployee && upcomingHolidays.length > 0 && (
          <div className="xl:col-span-1">
            <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
              <div className="flex items-center gap-3 px-5 py-4 border-b border-slate-100">
                <div className="p-2 rounded-xl bg-slate-50 text-blue-600">
                  <RiCalendarEventLine size={18} />
                </div>
                <h2 className="font-bold text-slate-800">Upcoming Holidays</h2>
                <span className="ml-auto text-xs font-bold text-slate-400 bg-slate-100 px-2.5 py-1 rounded-full">
                  {upcomingHolidays.length}
                </span>
              </div>
              <div className="divide-y divide-slate-100 max-h-[500px] overflow-y-auto">
                {upcomingHolidays.slice(0, 15).map(h => {
                  const cfg = TYPE_CONFIG[h.type] || TYPE_CONFIG.company;
                  const hDate = new Date(h.date); hDate.setHours(0,0,0,0);
                  const diff = Math.round((hDate - today) / (1000*60*60*24));
                  const diffLabel = diff === 0 ? "Today" : diff === 1 ? "Tomorrow" : `${diff}d`;
                  return (
                    <div key={h._id} className="flex items-center gap-3 px-5 py-3 hover:bg-slate-50 transition-colors">
                      <span className={`w-2.5 h-2.5 rounded-full shrink-0 ${cfg.dot}`} />
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-semibold text-slate-800 truncate">{h.name}</p>
                        <p className="text-xs text-slate-400 mt-0.5">{formatDisplayDate(h.date)}</p>
                      </div>
                      <div className="shrink-0 flex flex-col items-end gap-1">
                        <span className={`text-[10px] font-black px-2 py-0.5 rounded-full ${
                          diff === 0 ? "bg-blue-600 text-white" :
                          diff <= 7  ? "bg-emerald-100 text-emerald-700" :
                          "bg-slate-100 text-slate-500"
                        }`}>{diffLabel}</span>
                        <span className={`text-[9px] font-bold px-1.5 py-0.5 rounded border ${cfg.badge}`}>
                          {cfg.label}
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Calendar;
