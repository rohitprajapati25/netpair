import React, { useState } from "react";
import { useAccessControl, ALL_PAGES } from "../../contexts/AccessControlContext";
import {
  RiShieldCheckLine, RiRefreshLine, RiSaveLine,
  RiUserSettingsLine, RiUserStarLine, RiUserLine,
  RiCheckboxCircleLine, RiCloseCircleLine, RiInformationLine,
  RiLockUnlockLine, RiLock2Line, RiEyeLine, RiEyeOffLine,
} from "react-icons/ri";

// ── Role config ───────────────────────────────────────────────────────────────
const ROLE_CONFIG = {
  admin: {
    label: "Admin",
    desc: "Manages employees, operations and reports",
    icon: RiUserSettingsLine,
    color: "from-indigo-500 to-blue-600",
    badge: "bg-indigo-100 text-indigo-700 border-indigo-200",
    dot: "bg-indigo-500",
    ring: "ring-indigo-200",
    toggleOn: "bg-indigo-600",
  },
  hr: {
    label: "HR Manager",
    desc: "Handles people, attendance and leave",
    icon: RiUserStarLine,
    color: "from-emerald-500 to-teal-600",
    badge: "bg-emerald-100 text-emerald-700 border-emerald-200",
    dot: "bg-emerald-500",
    ring: "ring-emerald-200",
    toggleOn: "bg-emerald-600",
  },
  employee: {
    label: "Employee",
    desc: "Views own tasks, leave and attendance",
    icon: RiUserLine,
    color: "from-slate-500 to-slate-700",
    badge: "bg-slate-100 text-slate-600 border-slate-200",
    dot: "bg-slate-400",
    ring: "ring-slate-200",
    toggleOn: "bg-slate-600",
  },
};

// ── Group pages ───────────────────────────────────────────────────────────────
const groupPages = (role) => {
  const pages = ALL_PAGES.filter(p => p.roles.includes(role));
  const groups = {};
  pages.forEach(p => {
    if (!groups[p.group]) groups[p.group] = [];
    groups[p.group].push(p);
  });
  return groups;
};

// ── Toggle Switch ─────────────────────────────────────────────────────────────
const Toggle = ({ checked, onChange, color = "bg-blue-600", disabled = false }) => (
  <button
    type="button"
    onClick={onChange}
    disabled={disabled}
    className={`relative inline-flex h-6 w-11 items-center rounded-full transition-all duration-200 focus:outline-none
      ${checked ? color : "bg-slate-200"}
      ${disabled ? "opacity-40 cursor-not-allowed" : "cursor-pointer hover:opacity-90"}`}
    role="switch"
    aria-checked={checked}
  >
    <span
      className={`inline-block h-4 w-4 transform rounded-full bg-white shadow-md transition-transform duration-200
        ${checked ? "translate-x-6" : "translate-x-1"}`}
    />
  </button>
);

// ── Role Card ─────────────────────────────────────────────────────────────────
const RoleCard = ({ role, cfg, permissions, onToggle, onEnableAll, onDisableAll, onReset }) => {
  const [expanded, setExpanded] = useState(true);
  const groups = groupPages(role);
  const allPages = ALL_PAGES.filter(p => p.roles.includes(role));
  const enabledCount = allPages.filter(p => permissions[role]?.[p.key]).length;
  const totalCount = allPages.length;
  const allEnabled = enabledCount === totalCount;
  const noneEnabled = enabledCount === 0;

  return (
    <div className={`bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden`}>

      {/* Card Header */}
      <div className={`bg-gradient-to-r ${cfg.color} p-5`}>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-white/20 backdrop-blur-sm rounded-xl flex items-center justify-center">
              <cfg.icon size={20} className="text-white" />
            </div>
            <div>
              <h3 className="font-black text-white text-lg leading-none">{cfg.label}</h3>
              <p className="text-white/80 text-xs mt-0.5">{cfg.desc}</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <div className="bg-white/20 px-3 py-1 rounded-full">
              <span className="text-white font-black text-sm">{enabledCount}/{totalCount}</span>
              <span className="text-white/70 text-xs ml-1">pages</span>
            </div>
            <button
              onClick={() => setExpanded(v => !v)}
              className="w-8 h-8 bg-white/20 hover:bg-white/30 rounded-xl flex items-center justify-center transition-all"
            >
              <i className={`ri-arrow-${expanded ? "up" : "down"}-s-line text-white text-lg`}></i>
            </button>
          </div>
        </div>

        {/* Progress bar */}
        <div className="mt-4 bg-white/20 rounded-full h-1.5">
          <div
            className="bg-white rounded-full h-1.5 transition-all duration-500"
            style={{ width: `${totalCount > 0 ? (enabledCount / totalCount) * 100 : 0}%` }}
          />
        </div>
      </div>

      {/* Quick actions */}
      <div className="flex items-center gap-2 px-5 py-3 border-b border-slate-100 bg-slate-50">
        <button
          onClick={onEnableAll}
          className="flex items-center gap-1.5 px-3 py-1.5 bg-emerald-50 hover:bg-emerald-100 text-emerald-700 border border-emerald-200 rounded-xl text-xs font-bold transition-all"
        >
          <RiLockUnlockLine size={13} /> Enable All
        </button>
        <button
          onClick={onDisableAll}
          className="flex items-center gap-1.5 px-3 py-1.5 bg-red-50 hover:bg-red-100 text-red-600 border border-red-200 rounded-xl text-xs font-bold transition-all"
        >
          <RiLock2Line size={13} /> Disable All
        </button>
        <button
          onClick={onReset}
          className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-600 border border-slate-200 rounded-xl text-xs font-bold transition-all ml-auto"
        >
          <RiRefreshLine size={13} /> Reset Default
        </button>
      </div>

      {/* Page toggles */}
      {expanded && (
        <div className="p-5 space-y-5">
          {Object.entries(groups).map(([groupName, pages]) => (
            <div key={groupName}>
              <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-3 flex items-center gap-2">
                <span className="flex-1 border-t border-slate-100"></span>
                {groupName}
                <span className="flex-1 border-t border-slate-100"></span>
              </p>
              <div className="space-y-2">
                {pages.map(page => {
                  const isOn = permissions[role]?.[page.key] === true;
                  return (
                    <div
                      key={page.key}
                      className={`flex items-center justify-between p-3 rounded-xl border transition-all duration-200
                        ${isOn
                          ? "bg-slate-50 border-slate-200"
                          : "bg-white border-slate-100 opacity-60"
                        }`}
                    >
                      <div className="flex items-center gap-3">
                        <div className={`w-8 h-8 rounded-lg flex items-center justify-center transition-all
                          ${isOn ? "bg-white shadow-sm border border-slate-200" : "bg-slate-100"}`}>
                          <i className={`${page.icon} text-sm ${isOn ? "text-slate-600" : "text-slate-400"}`}></i>
                        </div>
                        <div>
                          <p className={`text-sm font-bold transition-colors ${isOn ? "text-slate-800" : "text-slate-400"}`}>
                            {page.label}
                          </p>
                          <p className="text-[10px] text-slate-400">/{page.key}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        {isOn
                          ? <span className="text-[9px] font-black text-emerald-600 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded-full uppercase">Active</span>
                          : <span className="text-[9px] font-black text-slate-400 bg-slate-100 border border-slate-200 px-2 py-0.5 rounded-full uppercase">Hidden</span>
                        }
                        <Toggle
                          checked={isOn}
                          onChange={() => onToggle(role, page.key)}
                          color={cfg.toggleOn}
                        />
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

// ── SuperAdmin Info Card ──────────────────────────────────────────────────────
const SuperAdminCard = () => (
  <div className="bg-gradient-to-r from-red-500 to-rose-600 rounded-2xl p-5 text-white">
    <div className="flex items-center gap-3 mb-3">
      <div className="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center">
        <RiShieldCheckLine size={20} className="text-white" />
      </div>
      <div>
        <h3 className="font-black text-lg leading-none">Super Admin</h3>
        <p className="text-white/80 text-xs mt-0.5">Full system access — cannot be restricted</p>
      </div>
      <div className="ml-auto bg-white/20 px-3 py-1 rounded-full">
        <span className="text-white font-black text-sm">All</span>
        <span className="text-white/70 text-xs ml-1">pages</span>
      </div>
    </div>
    <div className="bg-white/10 rounded-xl p-3 mt-2">
      <div className="flex flex-wrap gap-1.5">
        {["Dashboard","Employees","HR Team","Admins","Attendance","Leave","Projects","Tasks","Assets","Reports","Announcements","Audit Logs","Access Control","Settings"].map(p => (
          <span key={p} className="text-[10px] font-bold bg-white/20 text-white px-2 py-0.5 rounded-full">
            {p}
          </span>
        ))}
      </div>
    </div>
    <div className="mt-3 bg-white/10 rounded-xl p-3 flex items-start gap-2">
      <RiInformationLine size={14} className="text-white/70 shrink-0 mt-0.5" />
      <p className="text-[11px] text-white/80 leading-relaxed">
        SuperAdmin has permanent access to all pages including this Access Control panel. 
        These permissions only apply to Admin, HR, and Employee roles.
      </p>
    </div>
  </div>
);

// ── Comparison Table ──────────────────────────────────────────────────────────
const ComparisonTable = ({ permissions }) => {
  const rows = ALL_PAGES;
  return (
    <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
      <div className="px-5 py-4 border-b border-slate-100 flex items-center gap-3">
        <RiEyeLine size={16} className="text-slate-500" />
        <h3 className="font-bold text-slate-800">Access Overview</h3>
        <span className="ml-auto text-xs text-slate-400">Live preview of current permissions</span>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full min-w-[500px]">
          <thead className="bg-slate-50 border-b border-slate-100">
            <tr>
              <th className="px-5 py-3 text-left text-[10px] font-black text-slate-400 uppercase tracking-wider">Page</th>
              <th className="px-4 py-3 text-center text-[10px] font-black text-red-500 uppercase tracking-wider">SuperAdmin</th>
              <th className="px-4 py-3 text-center text-[10px] font-black text-indigo-500 uppercase tracking-wider">Admin</th>
              <th className="px-4 py-3 text-center text-[10px] font-black text-emerald-500 uppercase tracking-wider">HR</th>
              <th className="px-4 py-3 text-center text-[10px] font-black text-slate-500 uppercase tracking-wider">Employee</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-50">
            {rows.map(page => (
              <tr key={page.key} className="hover:bg-slate-50 transition-colors">
                <td className="px-5 py-2.5">
                  <div className="flex items-center gap-2">
                    <i className={`${page.icon} text-sm text-slate-400`}></i>
                    <span className="text-sm font-semibold text-slate-700">{page.label}</span>
                  </div>
                </td>
                {/* SuperAdmin — always true */}
                <td className="px-4 py-2.5 text-center">
                  <RiCheckboxCircleLine size={18} className="text-red-500 mx-auto" />
                </td>
                {/* Admin */}
                <td className="px-4 py-2.5 text-center">
                  {page.roles.includes("admin")
                    ? permissions.admin?.[page.key]
                      ? <RiCheckboxCircleLine size={18} className="text-indigo-500 mx-auto" />
                      : <RiCloseCircleLine size={18} className="text-slate-300 mx-auto" />
                    : <span className="text-slate-200 text-xs">—</span>
                  }
                </td>
                {/* HR */}
                <td className="px-4 py-2.5 text-center">
                  {page.roles.includes("hr")
                    ? permissions.hr?.[page.key]
                      ? <RiCheckboxCircleLine size={18} className="text-emerald-500 mx-auto" />
                      : <RiCloseCircleLine size={18} className="text-slate-300 mx-auto" />
                    : <span className="text-slate-200 text-xs">—</span>
                  }
                </td>
                {/* Employee */}
                <td className="px-4 py-2.5 text-center">
                  {page.roles.includes("employee")
                    ? permissions.employee?.[page.key]
                      ? <RiCheckboxCircleLine size={18} className="text-slate-500 mx-auto" />
                      : <RiCloseCircleLine size={18} className="text-slate-300 mx-auto" />
                    : <span className="text-slate-200 text-xs">—</span>
                  }
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

// ── Main Page ─────────────────────────────────────────────────────────────────
const AccessControl = () => {
  const {
    permissions,
    togglePermission,
    setRolePermissions,
    resetRole,
    resetAll,
    DEFAULT_PERMISSIONS,
  } = useAccessControl();

  const [saved, setSaved] = useState(false);
  const [activeTab, setActiveTab] = useState("manage"); // "manage" | "compare"

  const handleEnableAll = (role) => {
    const allForRole = {};
    ALL_PAGES.filter(p => p.roles.includes(role)).forEach(p => { allForRole[p.key] = true; });
    setRolePermissions(role, allForRole);
  };

  const handleDisableAll = (role) => {
    const noneForRole = {};
    ALL_PAGES.filter(p => p.roles.includes(role)).forEach(p => { noneForRole[p.key] = false; });
    setRolePermissions(role, noneForRole);
  };

  const handleSave = () => {
    // Already auto-saved to localStorage via context
    setSaved(true);
    setTimeout(() => setSaved(false), 2500);
  };

  const totalEnabled = {
    admin:    ALL_PAGES.filter(p => p.roles.includes("admin")    && permissions.admin?.[p.key]).length,
    hr:       ALL_PAGES.filter(p => p.roles.includes("hr")       && permissions.hr?.[p.key]).length,
    employee: ALL_PAGES.filter(p => p.roles.includes("employee") && permissions.employee?.[p.key]).length,
  };

  return (
    <div className="space-y-6">

      {/* ── Header ── */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl lg:text-3xl font-black text-slate-900 tracking-tight flex items-center gap-3">
            <div className="w-9 h-9 bg-gradient-to-br from-red-500 to-rose-600 rounded-xl flex items-center justify-center shadow-md">
              <RiShieldCheckLine size={18} className="text-white" />
            </div>
            Access Control
          </h1>
          <p className="text-slate-500 text-sm mt-1 ml-12">
            Manage which pages each role can access · Changes apply instantly
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={resetAll}
            className="flex items-center gap-2 px-4 py-2.5 bg-white border border-slate-200 hover:border-slate-300 text-slate-600 font-semibold rounded-xl shadow-sm text-sm transition-all"
          >
            <RiRefreshLine size={15} /> Reset All
          </button>
          <button
            onClick={handleSave}
            className={`flex items-center gap-2 px-5 py-2.5 font-bold rounded-xl shadow-sm text-sm transition-all ${
              saved
                ? "bg-emerald-600 text-white"
                : "bg-blue-600 hover:bg-blue-700 text-white"
            }`}
          >
            {saved
              ? <><RiCheckboxCircleLine size={15} /> Saved!</>
              : <><RiSaveLine size={15} /> Save Changes</>
            }
          </button>
        </div>
      </div>

      {/* ── Stats row ── */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        {[
          { label: "SuperAdmin",  value: "All Pages", bg: "from-red-500 to-rose-600",      icon: "ri-shield-check-fill" },
          { label: "Admin",       value: `${totalEnabled.admin} pages`,    bg: "from-indigo-500 to-blue-600",   icon: "ri-user-settings-fill" },
          { label: "HR Manager",  value: `${totalEnabled.hr} pages`,       bg: "from-emerald-500 to-teal-600",  icon: "ri-user-star-fill" },
          { label: "Employee",    value: `${totalEnabled.employee} pages`,  bg: "from-slate-500 to-slate-700",   icon: "ri-user-fill" },
        ].map((s, i) => (
          <div key={i} className={`rounded-2xl p-4 bg-gradient-to-r ${s.bg} text-white shadow-md flex items-center justify-between`}>
            <div>
              <p className="text-xs opacity-90 font-semibold">{s.label}</p>
              <p className="text-xl font-black mt-0.5">{s.value}</p>
            </div>
            <div className="bg-white/20 p-2.5 rounded-xl">
              <i className={`${s.icon} text-xl`}></i>
            </div>
          </div>
        ))}
      </div>

      {/* ── Tabs ── */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-1.5 flex gap-1">
        {[
          { id: "manage",  label: "Manage Permissions", icon: "ri-toggle-line" },
          { id: "compare", label: "Access Overview",    icon: "ri-table-line" },
        ].map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl font-bold text-sm transition-all ${
              activeTab === tab.id
                ? "bg-gradient-to-r from-slate-800 to-slate-900 text-white shadow-md"
                : "text-slate-500 hover:text-slate-800 hover:bg-slate-50"
            }`}
          >
            <i className={`${tab.icon} text-base`}></i>
            {tab.label}
          </button>
        ))}
      </div>

      {/* ── Manage Tab ── */}
      {activeTab === "manage" && (
        <div className="space-y-5">
          {/* SuperAdmin info */}
          <SuperAdminCard />

          {/* Role cards */}
          {Object.entries(ROLE_CONFIG).map(([role, cfg]) => (
            <RoleCard
              key={role}
              role={role}
              cfg={cfg}
              permissions={permissions}
              onToggle={togglePermission}
              onEnableAll={() => handleEnableAll(role)}
              onDisableAll={() => handleDisableAll(role)}
              onReset={() => resetRole(role)}
            />
          ))}
        </div>
      )}

      {/* ── Compare Tab ── */}
      {activeTab === "compare" && (
        <div className="space-y-5">
          <SuperAdminCard />
          <ComparisonTable permissions={permissions} />
        </div>
      )}

      {/* ── Auto-save notice ── */}
      <div className="flex items-center gap-2 text-xs text-slate-400 justify-center pb-2">
        <RiInformationLine size={13} />
        Changes are auto-saved to browser storage and apply immediately to all sessions
      </div>
    </div>
  );
};

export default AccessControl;
