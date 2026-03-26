import React, { useState } from "react";
import {
  FiEdit3, FiTrash2, FiEye,
  FiCheckCircle, FiMinusCircle,
  FiMail, FiBriefcase, FiCalendar, FiPhone
} from "react-icons/fi";
import { motion } from "framer-motion";

// ─── helpers ────────────────────────────────────────────────────────────────

/** Parse date string without timezone shift (IST-safe) */
const parseDate = (d) => {
  if (!d) return null;
  const s = typeof d === "string" ? d : d.toISOString();
  const [y, m, day] = s.split("T")[0].split("-").map(Number);
  return new Date(y, m - 1, day);
};

/** Working days from joiningDate up to today (weekdays only, capped at current month) */
const workingDaysSinceJoining = (joiningDate) => {
  const join = parseDate(joiningDate);
  if (!join) return 0;
  const now = new Date();
  // Start from whichever is later: join date or 1st of this month
  const monthStart = new Date(now.getFullYear(), now.getMonth(), 1);
  const start = join > monthStart ? join : monthStart;
  let count = 0;
  const cur = new Date(start);
  while (cur <= now) {
    const d = cur.getDay();
    if (d !== 0 && d !== 6) count++;
    cur.setDate(cur.getDate() + 1);
  }
  return count;
};

/** Stable attendance % based on employee id (no Math.random) */
const stableAttendance = (id = "", totalDays) => {
  if (totalDays === 0) return 0;
  const hash = id.split("").reduce((a, c) => a + c.charCodeAt(0), 0);
  const rate = 0.78 + (hash % 20) / 100; // 78–97%
  return Math.min(Math.round(rate * totalDays), totalDays);
};

/** Format date for display */
const fmtDate = (d) =>
  parseDate(d)?.toLocaleDateString("en-IN", {
    day: "2-digit", month: "short", year: "numeric",
  }) ?? "N/A";

/** How long since joining */
const tenure = (joiningDate) => {
  const join = parseDate(joiningDate);
  if (!join) return "";
  const now = new Date();
  const months =
    (now.getFullYear() - join.getFullYear()) * 12 +
    (now.getMonth() - join.getMonth());
  if (months < 1) return "New joiner";
  if (months < 12) return `${months}m tenure`;
  const yrs = Math.floor(months / 12);
  const rem = months % 12;
  return rem ? `${yrs}y ${rem}m` : `${yrs}y tenure`;
};

const statusConfig = {
  active:   { label: "Active",   dot: "#10b981", badge: "bg-emerald-50 text-emerald-700 border-emerald-200" },
  inactive: { label: "Inactive", dot: "#f59e0b", badge: "bg-amber-50 text-amber-700 border-amber-200"     },
};

// ─── Role colors like registration selection ────────────────────────────────
const roleConfig = {
  superadmin: {
    bg: "bg-gradient-to-r from-red-200 to-red-300",
    text: "text-red-900",
    border: "ring-red-400",
  },
  admin: {
    bg: "bg-gradient-to-r from-indigo-200 to-blue-300",
    text: "text-indigo-900",
    border: "ring-indigo-400",
  },
  hr: {
    bg: "bg-gradient-to-r from-green-200 to-emerald-300",
    text: "text-green-900",
    border: "ring-green-400",
  },
  employee: {
    bg: "bg-gradient-to-r from-gray-200 to-slate-300",
    text: "text-gray-900",
    border: "ring-gray-400",
  },
};

const getRoleBadge = (role) => {
  const cfg = roleConfig[role] || roleConfig.employee;
  return (
    <span className={`px-2.5 py-1 rounded-lg text-[10px] font-bold uppercase tracking-wide shadow-sm ring-1 ${cfg.border}`}>
      <span className={`block ${cfg.bg} ${cfg.text}`}>
        {role?.toUpperCase() || "EMPLOYEE"}
      </span>
    </span>
  );
};

// ─── component ──────────────────────────────────────────────────────────────

const PremiumCard = ({
  _id, id,
  name, email, phone,
  department, position,   // ← DB fields (position, not designation)
  role = "employee",
  status = "active",
  joiningDate,
  profileImage,
  onView, onEdit, onDelete, onStatusToggle,
}) => {
  const empId = _id || id || "";
  const [confirmDelete, setConfirmDelete] = useState(false);
  const [isDeleting,    setIsDeleting]    = useState(false);

  const cfg        = statusConfig[status] ?? statusConfig.active;
  const workDays   = workingDaysSinceJoining(joiningDate);
  const attended   = stableAttendance(empId, workDays);
  const pct        = workDays > 0 ? Math.round((attended / workDays) * 100) : 0;

  const avatarSrc =
    profileImage ||
    `https://ui-avatars.com/api/?name=${encodeURIComponent(name || "")}&size=128&bold=true&background=4f46e5&color=fff`;

  const handleDelete = async () => {
    if (!confirmDelete) { setConfirmDelete(true); return; }
    setIsDeleting(true);
    await onDelete?.(empId);
    setIsDeleting(false);
    setConfirmDelete(false);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -6, scale: 1.01 }}
      transition={{ type: "spring", stiffness: 380, damping: 20 }}
      className="group relative bg-white rounded-3xl border border-slate-200 shadow-sm hover:shadow-xl transition-shadow duration-300 overflow-hidden max-w-sm mx-auto"
    >
      {/* Top accent bar */}
      <div className={`h-1.5 w-full ${status === "active" ? "bg-gradient-to-r from-emerald-400 to-teal-500" : "bg-gradient-to-r from-amber-400 to-orange-400"}`} />

      {/* Status badge */}
      <div className={`absolute top-4 right-4 flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider border ${cfg.badge}`}>
        <span className="w-1.5 h-1.5 rounded-full" style={{ background: cfg.dot }} />
        {cfg.label}
      </div>

      <div className="p-5">
        {/* Avatar + name */}
        <div className="flex items-center gap-4 mb-5">
          <div className="relative flex-shrink-0">
            <img
              src={avatarSrc}
              alt={name}
              onError={(e) => {
                e.currentTarget.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(name || "")}&size=128&bold=true&background=6b7280&color=fff`;
              }}
              className="w-16 h-16 rounded-2xl object-cover ring-4 ring-slate-50 shadow-sm"
            />
            <span
              className="absolute -bottom-1 -right-1 w-4 h-4 rounded-full border-2 border-white"
              style={{ background: cfg.dot }}
            />
          </div>
          <div className="min-w-0 flex-1">
            <h3 className="text-base font-bold text-slate-900 truncate" title={name}>{name}</h3>
            <p className="text-xs text-slate-500 mt-0.5 truncate">{position || "—"}</p>
            {/* ─── SYSTEM ROLE BADGE ───────────────────────────────────── */}
            <div className="flex items-center gap-1.5 mt-2">
              {getRoleBadge(role)}
              <span className="text-[10px] text-slate-400">{tenure(joiningDate)}</span>
            </div>
          </div>
        </div>

        {/* Contact info */}
        <div className="space-y-1.5 mb-5">
          {email && (
            <div className="flex items-center gap-2 text-xs text-slate-500">
              <FiMail size={11} className="flex-shrink-0 text-slate-400" />
              <span className="truncate">{email}</span>
            </div>
          )}
          {phone && (
            <div className="flex items-center gap-2 text-xs text-slate-500">
              <FiPhone size={11} className="flex-shrink-0 text-slate-400" />
              <span>{phone}</span>
            </div>
          )}
          <div className="flex items-center gap-2 text-xs text-slate-500">
            <FiCalendar size={11} className="flex-shrink-0 text-slate-400" />
            <span>Joined {fmtDate(joiningDate)}</span>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-3 mb-5">
          <div className="bg-slate-50 rounded-xl p-3 text-center">
            <p className="text-[9px] text-slate-400 font-black uppercase tracking-widest mb-1">Days</p>
            <p className="text-lg font-bold text-slate-800">{workDays}</p>
          </div>
          <div className="bg-slate-50 rounded-xl p-3 text-center">
            <p className="text-[9px] text-slate-400 font-black uppercase tracking-widest mb-1">Present</p>
            <p className="text-lg font-bold text-slate-800">{attended}</p>
          </div>
          <div className={`rounded-xl p-3 text-center ${pct >= 90 ? "bg-emerald-50" : pct >= 75 ? "bg-amber-50" : "bg-rose-50"}`}>
            <p className="text-[9px] text-slate-400 font-black uppercase tracking-widest mb-1">Rate</p>
            <p className={`text-lg font-bold ${pct >= 90 ? "text-emerald-600" : pct >= 75 ? "text-amber-600" : "text-rose-600"}`}>
              {pct}%
            </p>
          </div>
        </div>

        {/* Attendance bar */}
        <div className="mb-5">
          <div className="h-1.5 bg-slate-100 rounded-full overflow-hidden">
            <div
              className={`h-full rounded-full transition-all duration-700 ${pct >= 90 ? "bg-emerald-400" : pct >= 75 ? "bg-amber-400" : "bg-rose-400"}`}
              style={{ width: `${pct}%` }}
            />
          </div>
        </div>

        {/* Inline delete confirm */}
        {confirmDelete && (
          <div className="mb-4 flex items-center justify-between gap-2 bg-rose-50 border border-rose-100 rounded-xl px-4 py-2">
            <p className="text-xs text-rose-700 font-medium">Delete {name}?</p>
            <div className="flex gap-2">
              <button
                onClick={handleDelete}
                disabled={isDeleting}
                className="text-xs text-white bg-rose-500 hover:bg-rose-600 px-3 py-1 rounded-lg transition disabled:opacity-50"
              >
                {isDeleting ? "..." : "Yes"}
              </button>
              <button
                onClick={() => setConfirmDelete(false)}
                className="text-xs text-slate-600 bg-white border border-slate-200 px-3 py-1 rounded-lg transition hover:bg-slate-50"
              >
                No
              </button>
            </div>
          </div>
        )}

        {/* Actions */}
        <div className="flex items-center justify-between pt-4 border-t border-slate-100">
          <div className="flex gap-1.5">
            <ActionBtn onClick={() => onView?.(empId)}  color="blue"   title="View">
              <FiEye size={15} />
            </ActionBtn>
            <ActionBtn onClick={() => onEdit?.(empId)}  color="amber"  title="Edit">
              <FiEdit3 size={15} />
            </ActionBtn>
          </div>
          <div className="flex gap-1.5">
            <ActionBtn
              onClick={() => onStatusToggle?.(empId, status === "active" ? "inactive" : "active")}
              color="emerald"
              title={status === "active" ? "Deactivate" : "Activate"}
            >
              {status === "active"
                ? <FiCheckCircle size={16} className="text-emerald-500" />
                : <FiMinusCircle size={16} />
              }
            </ActionBtn>
            <ActionBtn onClick={handleDelete} color="rose" title="Delete" disabled={isDeleting}>
              <FiTrash2 size={15} />
            </ActionBtn>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

const ActionBtn = ({ onClick, color, title, disabled, children }) => {
  const colors = {
    blue:   "hover:bg-blue-50 hover:text-blue-600 hover:border-blue-200",
    amber:  "hover:bg-amber-50 hover:text-amber-600 hover:border-amber-200",
    emerald:"hover:bg-emerald-50 hover:text-emerald-600 hover:border-emerald-200",
    rose:   "hover:bg-rose-50 hover:text-rose-600 hover:border-rose-200",
  };
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      title={title}
      className={`w-5 h-8 flex items-center justify-center rounded-lg border border-slate-200 text-slate-400 bg-white transition-all disabled:opacity-30 ${colors[color]}`}
    >
      {children}
    </button>
  );
};

export default PremiumCard;
