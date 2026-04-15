import React, { useState } from "react";
import {
  FiEdit3, FiTrash2, FiEye, FiCheckCircle, FiMinusCircle,
  FiMail, FiCalendar, FiPhone, FiBriefcase
} from "react-icons/fi";

// ── helpers ───────────────────────────────────────────────────────────────────
const parseDate = (d) => {
  if (!d) return null;
  const s = typeof d === "string" ? d : d.toISOString();
  const [y, m, day] = s.split("T")[0].split("-").map(Number);
  return new Date(y, m - 1, day);
};

const fmtDate = (d) =>
  parseDate(d)?.toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" }) ?? "—";

const tenure = (joiningDate) => {
  const join = parseDate(joiningDate);
  if (!join) return "";
  const months =
    (new Date().getFullYear() - join.getFullYear()) * 12 +
    (new Date().getMonth() - join.getMonth());
  if (months < 1)  return "New";
  if (months < 12) return `${months}m`;
  const y = Math.floor(months / 12), r = months % 12;
  return r ? `${y}y ${r}m` : `${y}y`;
};

// ── config ────────────────────────────────────────────────────────────────────
const ROLE_CFG = {
  superadmin: { label: "Super Admin", bg: "bg-red-100",     text: "text-red-700",     dot: "bg-red-500"     },
  admin:      { label: "Admin",       bg: "bg-indigo-100",  text: "text-indigo-700",  dot: "bg-indigo-500"  },
  hr:         { label: "HR",          bg: "bg-emerald-100", text: "text-emerald-700", dot: "bg-emerald-500" },
  employee:   { label: "Employee",    bg: "bg-slate-100",   text: "text-slate-600",   dot: "bg-slate-400"   },
};

const STATUS_CFG = {
  active:   { label: "Active",   dot: "#10b981", badge: "bg-emerald-50 text-emerald-700 border-emerald-200" },
  inactive: { label: "Inactive", dot: "#f59e0b", badge: "bg-amber-50   text-amber-700   border-amber-200"   },
};

const DEPT_COLORS = [
  "bg-blue-100 text-blue-700", "bg-purple-100 text-purple-700",
  "bg-pink-100 text-pink-700", "bg-teal-100 text-teal-700",
  "bg-orange-100 text-orange-700", "bg-cyan-100 text-cyan-700",
];
const deptColor = (dept = "") =>
  DEPT_COLORS[dept.split("").reduce((a, c) => a + c.charCodeAt(0), 0) % DEPT_COLORS.length];

// ── component ─────────────────────────────────────────────────────────────────
const PremiumCard = ({
  _id, id, name, email, phone,
  department, designation,
  role = "employee", status = "active",
  joiningDate, employmentType, profileImage,
  onView, onEdit, onDelete, onStatusToggle,
}) => {
  const empId = _id || id || "";
  const [confirmDelete, setConfirmDelete] = useState(false);
  const [isDeleting,    setIsDeleting]    = useState(false);

  const sCfg = STATUS_CFG[status?.toLowerCase()] ?? STATUS_CFG.active;
  const rCfg = ROLE_CFG[role?.toLowerCase()]     ?? ROLE_CFG.employee;

  const avatar =
    profileImage ||
    `https://ui-avatars.com/api/?name=${encodeURIComponent(name || "U")}&size=128&bold=true&background=4f46e5&color=fff`;

  const handleDelete = async () => {
    if (!confirmDelete) { setConfirmDelete(true); return; }
    setIsDeleting(true);
    await onDelete?.(empId);
    setIsDeleting(false);
    setConfirmDelete(false);
  };

  return (
    <div className="relative bg-white rounded-2xl border border-slate-200 shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all duration-200 overflow-hidden flex flex-col">

      {/* accent bar */}
      <div className={`h-1 w-full ${status?.toLowerCase() === "active"
        ? "bg-gradient-to-r from-emerald-400 to-teal-500"
        : "bg-gradient-to-r from-amber-400 to-orange-400"}`}
      />

      {/* status badge */}
      <div className={`absolute top-3 right-3 flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold border ${sCfg.badge}`}>
        <span className="w-1.5 h-1.5 rounded-full" style={{ background: sCfg.dot }} />
        {sCfg.label}
      </div>

      <div className="p-4 flex flex-col flex-1 gap-3">

        {/* avatar + name */}
        <div className="flex items-center gap-3 pr-16">
          <img
            src={avatar}
            alt={name}
            onError={e => { e.currentTarget.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(name || "U")}&size=128&bold=true&background=6b7280&color=fff`; }}
            className="w-12 h-12 rounded-xl object-cover ring-2 ring-slate-100 shrink-0"
          />
          <div className="min-w-0">
            <h3 className="text-sm font-bold text-slate-900 truncate">{name || "—"}</h3>
            <p className="text-xs text-slate-500 truncate">{designation || "—"}</p>
            <span className={`inline-flex items-center gap-1 mt-1 px-2 py-0.5 rounded-md text-[10px] font-bold ${rCfg.bg} ${rCfg.text}`}>
              <span className={`w-1.5 h-1.5 rounded-full ${rCfg.dot}`} />
              {rCfg.label}
            </span>
          </div>
        </div>

        {/* info */}
        <div className="space-y-1.5 text-xs text-slate-500">
          {email && (
            <div className="flex items-center gap-2 min-w-0">
              <FiMail size={11} className="shrink-0 text-slate-400" />
              <span className="truncate">{email}</span>
            </div>
          )}
          {phone && (
            <div className="flex items-center gap-2">
              <FiPhone size={11} className="shrink-0 text-slate-400" />
              <span>{phone}</span>
            </div>
          )}
          <div className="flex items-center gap-2">
            <FiCalendar size={11} className="shrink-0 text-slate-400" />
            <span>{fmtDate(joiningDate)}</span>
            {tenure(joiningDate) && (
              <span className="ml-auto text-slate-400 font-medium">{tenure(joiningDate)}</span>
            )}
          </div>
        </div>

        {/* tags */}
        <div className="flex flex-wrap gap-1.5">
          {department && (
            <span className={`px-2 py-0.5 rounded-md text-[10px] font-bold ${deptColor(department)}`}>
              {department}
            </span>
          )}
          {employmentType && (
            <span className="px-2 py-0.5 rounded-md text-[10px] font-bold bg-slate-100 text-slate-600">
              {employmentType}
            </span>
          )}
        </div>

        {/* delete confirm */}
        {confirmDelete && (
          <div className="flex items-center justify-between gap-2 bg-rose-50 border border-rose-100 rounded-xl px-3 py-2">
            <p className="text-xs text-rose-700 font-semibold">Delete {name?.split(" ")[0]}?</p>
            <div className="flex gap-1.5">
              <button onClick={handleDelete} disabled={isDeleting}
                className="text-xs text-white bg-rose-500 hover:bg-rose-600 px-3 py-1 rounded-lg transition disabled:opacity-50 font-semibold">
                {isDeleting ? "..." : "Yes"}
              </button>
              <button onClick={() => setConfirmDelete(false)}
                className="text-xs text-slate-600 bg-white border border-slate-200 px-3 py-1 rounded-lg hover:bg-slate-50 font-semibold">
                No
              </button>
            </div>
          </div>
        )}

        {/* actions */}
        <div className="flex items-center justify-between pt-3 border-t border-slate-100 mt-auto">
          <div className="flex gap-1">
            <Btn onClick={() => onView?.(empId)}  color="blue"  title="View"><FiEye size={14} /></Btn>
            {onEdit && <Btn onClick={() => onEdit?.(empId)}  color="amber" title="Edit"><FiEdit3 size={14} /></Btn>}
          </div>
          <div className="flex gap-1">
            {onStatusToggle && (
              <Btn
                onClick={() => onStatusToggle?.(empId, status?.toLowerCase() === "active" ? "inactive" : "active")}
                color="emerald"
                title={status?.toLowerCase() === "active" ? "Deactivate" : "Activate"}
              >
                {status?.toLowerCase() === "active"
                  ? <FiCheckCircle size={15} className="text-emerald-500" />
                  : <FiMinusCircle size={15} className="text-amber-500" />}
              </Btn>
            )}
            {onDelete && (
              <Btn onClick={handleDelete} color="rose" title="Delete" disabled={isDeleting}>
                <FiTrash2 size={14} />
              </Btn>
            )}
          </div>
        </div>

      </div>
    </div>
  );
};

const Btn = ({ onClick, color, title, disabled, children }) => {
  const s = {
    blue:    "hover:bg-blue-50    hover:text-blue-600    hover:border-blue-200",
    amber:   "hover:bg-amber-50   hover:text-amber-600   hover:border-amber-200",
    emerald: "hover:bg-emerald-50 hover:text-emerald-600 hover:border-emerald-200",
    rose:    "hover:bg-rose-50    hover:text-rose-600    hover:border-rose-200",
  };
  return (
    <button onClick={onClick} disabled={disabled} title={title}
      className={`w-8 h-8 flex items-center justify-center rounded-lg border border-slate-200 text-slate-400 bg-white transition-all disabled:opacity-30 active:scale-95 ${s[color]}`}>
      {children}
    </button>
  );
};

export default PremiumCard;
