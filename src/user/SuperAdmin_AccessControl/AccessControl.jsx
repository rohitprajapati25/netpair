import { useState } from "react";
import { useAccessControl, ALL_PAGES } from "../../contexts/AccessControlContext";
import {
  RiShieldCheckLine, RiRefreshLine, RiSaveLine,
  RiUserSettingsLine, RiUserStarLine, RiUserLine,
  RiCheckboxCircleLine, RiCloseCircleLine,
  RiLockUnlockLine, RiLock2Line,
  RiInformationLine, RiShieldLine,
  RiArrowDownSLine, RiArrowUpSLine,
  RiCheckLine, RiSearchLine,
} from "react-icons/ri";

// ─── Role meta ────────────────────────────────────────────────────────────────
const ROLE_META = {
  admin: {
    label: "Admin",
    desc: "Manages employees, operations and reports",
    Icon: RiUserSettingsLine,
    gradient: "from-violet-600 to-indigo-600",
    light: "bg-indigo-50 text-indigo-700 border-indigo-200",
    dot: "bg-indigo-500",
    toggleOn: "bg-indigo-600",
    ring: "focus-visible:ring-indigo-400",
    accent: "text-indigo-600",
    bar: "bg-indigo-500",
  },
  hr: {
    label: "HR Manager",
    desc: "Handles people, attendance and leave",
    Icon: RiUserStarLine,
    gradient: "from-emerald-600 to-teal-600",
    light: "bg-emerald-50 text-emerald-700 border-emerald-200",
    dot: "bg-emerald-500",
    toggleOn: "bg-emerald-600",
    ring: "focus-visible:ring-emerald-400",
    accent: "text-emerald-600",
    bar: "bg-emerald-500",
  },
  employee: {
    label: "Employee",
    desc: "Views own tasks, leave and attendance",
    Icon: RiUserLine,
    gradient: "from-slate-600 to-slate-700",
    light: "bg-slate-100 text-slate-600 border-slate-200",
    dot: "bg-slate-400",
    toggleOn: "bg-slate-600",
    ring: "focus-visible:ring-slate-400",
    accent: "text-slate-600",
    bar: "bg-slate-500",
  },
};

// ─── Group pages by group key ─────────────────────────────────────────────────
const groupByGroup = (pages) => {
  const map = {};
  pages.forEach((p) => {
    if (!map[p.group]) map[p.group] = [];
    map[p.group].push(p);
  });
  return map;
};

// ─── Toggle Switch ────────────────────────────────────────────────────────────
const Toggle = ({ checked, onChange, onColor = "bg-blue-600", disabled = false }) => (
  <button
    type="button"
    role="switch"
    aria-checked={checked}
    onClick={onChange}
    disabled={disabled}
    className={`
      relative inline-flex h-6 w-11 shrink-0 items-center rounded-full
      transition-colors duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-1
      ${checked ? onColor : "bg-slate-200"}
      ${disabled ? "opacity-40 cursor-not-allowed" : "cursor-pointer"}
    `}
  >
    <span
      className={`
        inline-block h-4 w-4 rounded-full bg-white shadow-sm
        transition-transform duration-200
        ${checked ? "translate-x-6" : "translate-x-1"}
      `}
    />
  </button>
);

// ─── Permission Row ───────────────────────────────────────────────────────────
const PermRow = ({ page, isOn, onToggle, meta }) => (
  <div
    className={`
      flex items-center justify-between px-4 py-3 rounded-xl border transition-all duration-150
      ${isOn
        ? "bg-white border-slate-200 shadow-sm"
        : "bg-slate-50 border-slate-100 opacity-60"}
    `}
  >
    <div className="flex items-center gap-3 min-w-0">
      <div
        className={`
          w-8 h-8 rounded-lg flex items-center justify-center shrink-0 transition-all
          ${isOn ? "bg-slate-100" : "bg-slate-200"}
        `}
      >
        <i className={`${page.icon} text-sm ${isOn ? "text-slate-600" : "text-slate-400"}`} />
      </div>
      <div className="min-w-0">
        <p className={`text-sm font-semibold truncate ${isOn ? "text-slate-800" : "text-slate-400"}`}>
          {page.label}
        </p>
        <p className="text-[10px] text-slate-400 font-mono">/{page.key}</p>
      </div>
    </div>

    <div className="flex items-center gap-3 shrink-0 ml-3">
      <span
        className={`
          hidden sm:inline-block text-[9px] font-black uppercase tracking-wider px-2 py-0.5 rounded-full border
          ${isOn
            ? "bg-emerald-50 text-emerald-600 border-emerald-200"
            : "bg-slate-100 text-slate-400 border-slate-200"}
        `}
      >
        {isOn ? "Enabled" : "Disabled"}
      </span>
      <Toggle checked={isOn} onChange={onToggle} onColor={meta.toggleOn} />
    </div>
  </div>
);

// ─── Role Card ────────────────────────────────────────────────────────────────
const RoleCard = ({ role, permissions, onToggle, onEnableAll, onDisableAll, onReset, search }) => {
  const meta = ROLE_META[role];
  const [open, setOpen] = useState(true);

  const rolePages = ALL_PAGES.filter((p) => p.roles.includes(role));
  const filtered = search
    ? rolePages.filter((p) => p.label.toLowerCase().includes(search.toLowerCase()))
    : rolePages;

  const enabledCount = rolePages.filter((p) => permissions[role]?.[p.key]).length;
  const pct = rolePages.length > 0 ? Math.round((enabledCount / rolePages.length) * 100) : 0;

  const groups = groupByGroup(filtered);

  return (
    <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">

      {/* ── Card header ── */}
      <div className={`bg-gradient-to-r ${meta.gradient} px-5 py-4`}>
        <div className="flex items-center justify-between gap-3">
          <div className="flex items-center gap-3 min-w-0">
            <div className="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center shrink-0">
              <meta.Icon size={20} className="text-white" />
            </div>
            <div className="min-w-0">
              <h3 className="font-black text-white text-base leading-none">{meta.label}</h3>
              <p className="text-white/75 text-xs mt-0.5 truncate">{meta.desc}</p>
            </div>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            {/* Counter pill */}
            <div className="bg-white/20 px-3 py-1 rounded-full text-white text-sm font-black">
              {enabledCount}
              <span className="text-white/60 font-normal text-xs">/{rolePages.length}</span>
            </div>
            {/* Expand toggle */}
            <button
              onClick={() => setOpen((v) => !v)}
              className="w-8 h-8 bg-white/20 hover:bg-white/30 rounded-xl flex items-center justify-center transition-all"
              aria-label={open ? "Collapse" : "Expand"}
            >
              {open
                ? <RiArrowUpSLine size={18} className="text-white" />
                : <RiArrowDownSLine size={18} className="text-white" />}
            </button>
          </div>
        </div>

        {/* Progress bar */}
        <div className="mt-3 h-1.5 bg-white/20 rounded-full overflow-hidden">
          <div
            className="h-full bg-white rounded-full transition-all duration-500"
            style={{ width: `${pct}%` }}
          />
        </div>
        <p className="text-white/60 text-[10px] mt-1">{pct}% access enabled</p>
      </div>

      {/* ── Quick actions bar ── */}
      <div className="flex items-center gap-2 px-4 py-2.5 bg-slate-50 border-b border-slate-100">
        <button
          onClick={onEnableAll}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-emerald-50 hover:bg-emerald-100 text-emerald-700 border border-emerald-200 text-xs font-bold transition-all"
        >
          <RiLockUnlockLine size={12} /> Enable All
        </button>
        <button
          onClick={onDisableAll}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-red-50 hover:bg-red-100 text-red-600 border border-red-200 text-xs font-bold transition-all"
        >
          <RiLock2Line size={12} /> Disable All
        </button>
        <button
          onClick={onReset}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white hover:bg-slate-100 text-slate-500 border border-slate-200 text-xs font-bold transition-all ml-auto"
        >
          <RiRefreshLine size={12} /> Reset
        </button>
      </div>

      {/* ── Permission rows ── */}
      {open && (
        <div className="p-4 space-y-5">
          {Object.keys(groups).length === 0 && (
            <p className="text-center text-slate-400 text-sm py-4">No pages match your search</p>
          )}
          {Object.entries(groups).map(([groupName, pages]) => (
            <div key={groupName}>
              {/* Group label */}
              <div className="flex items-center gap-2 mb-2.5">
                <span className="h-px flex-1 bg-slate-100" />
                <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest">
                  {groupName}
                </span>
                <span className="h-px flex-1 bg-slate-100" />
              </div>
              <div className="space-y-2">
                {pages.map((page) => (
                  <PermRow
                    key={page.key}
                    page={page}
                    isOn={permissions[role]?.[page.key] === true}
                    onToggle={() => onToggle(role, page.key)}
                    meta={meta}
                  />
                ))}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

// ─── SuperAdmin Banner ────────────────────────────────────────────────────────
const SuperAdminBanner = () => (
  <div className="bg-gradient-to-r from-rose-600 to-red-600 rounded-2xl p-5 text-white">
    <div className="flex items-start gap-4">
      <div className="w-11 h-11 bg-white/20 rounded-xl flex items-center justify-center shrink-0">
        <RiShieldCheckLine size={22} className="text-white" />
      </div>
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-3 flex-wrap">
          <h3 className="font-black text-lg leading-none">Super Admin</h3>
          <span className="bg-white/20 text-white text-[10px] font-black uppercase tracking-wider px-2.5 py-1 rounded-full">
            Full Access · Unrestricted
          </span>
        </div>
        <p className="text-white/75 text-xs mt-1.5">
          Super Admin has permanent access to every page including this panel. These controls only apply to Admin, HR, and Employee roles.
        </p>
        {/* Page chips */}
        <div className="flex flex-wrap gap-1.5 mt-3">
          {["Dashboard","Employees","HR Team","Admins","Attendance","Leave","Projects","Tasks","Assets","Reports","Announcements","Audit Logs","Access Control","Calendar","Settings"].map((p) => (
            <span key={p} className="text-[10px] font-semibold bg-white/15 text-white px-2 py-0.5 rounded-full">
              {p}
            </span>
          ))}
        </div>
      </div>
    </div>
  </div>
);

// ─── Access Matrix Table ──────────────────────────────────────────────────────
const AccessMatrix = ({ permissions }) => {
  const [search, setSearch] = useState("");
  const rows = search
    ? ALL_PAGES.filter((p) => p.label.toLowerCase().includes(search.toLowerCase()))
    : ALL_PAGES;

  const COL = [
    { role: "superadmin", label: "Super Admin", color: "text-rose-500",    always: true },
    { role: "admin",      label: "Admin",       color: "text-indigo-500",  always: false },
    { role: "hr",         label: "HR",          color: "text-emerald-500", always: false },
    { role: "employee",   label: "Employee",    color: "text-slate-500",   always: false },
  ];

  return (
    <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 px-5 py-4 border-b border-slate-100">
        <div>
          <h3 className="font-bold text-slate-800">Access Matrix</h3>
          <p className="text-xs text-slate-400 mt-0.5">Live view of all role permissions</p>
        </div>
        <div className="relative w-full sm:w-56">
          <RiSearchLine className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={14} />
          <input
            type="text"
            placeholder="Filter pages..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-8 pr-3 py-2 text-xs border border-slate-200 rounded-xl outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-100 transition-all"
          />
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full min-w-[520px]">
          <thead className="bg-slate-50 border-b border-slate-100">
            <tr>
              <th className="px-5 py-3 text-left text-[10px] font-black text-slate-400 uppercase tracking-wider w-48">
                Page
              </th>
              {COL.map((c) => (
                <th key={c.role} className={`px-4 py-3 text-center text-[10px] font-black uppercase tracking-wider ${c.color}`}>
                  {c.label}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-50">
            {rows.map((page) => (
              <tr key={page.key} className="hover:bg-slate-50 transition-colors group">
                <td className="px-5 py-3">
                  <div className="flex items-center gap-2.5">
                    <div className="w-7 h-7 bg-slate-100 rounded-lg flex items-center justify-center shrink-0">
                      <i className={`${page.icon} text-xs text-slate-500`} />
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-slate-700">{page.label}</p>
                      <p className="text-[9px] text-slate-400 font-mono">/{page.key}</p>
                    </div>
                  </div>
                </td>
                {COL.map((c) => {
                  const applicable = c.always || page.roles.includes(c.role);
                  const granted = c.always
                    ? true
                    : permissions[c.role]?.[page.key] === true;

                  return (
                    <td key={c.role} className="px-4 py-3 text-center">
                      {applicable ? (
                        granted
                          ? <RiCheckboxCircleLine size={18} className={`mx-auto ${c.color}`} />
                          : <RiCloseCircleLine size={18} className="mx-auto text-slate-300" />
                      ) : (
                        <span className="text-slate-200 text-xs select-none">—</span>
                      )}
                    </td>
                  );
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Legend */}
      <div className="flex items-center gap-5 px-5 py-3 border-t border-slate-100 bg-slate-50">
        <div className="flex items-center gap-1.5">
          <RiCheckboxCircleLine size={14} className="text-emerald-500" />
          <span className="text-[10px] text-slate-500 font-semibold">Access granted</span>
        </div>
        <div className="flex items-center gap-1.5">
          <RiCloseCircleLine size={14} className="text-slate-300" />
          <span className="text-[10px] text-slate-500 font-semibold">Access denied</span>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="text-slate-300 text-xs font-bold">—</span>
          <span className="text-[10px] text-slate-500 font-semibold">Not applicable</span>
        </div>
      </div>
    </div>
  );
};

// ─── Summary Stats ────────────────────────────────────────────────────────────
const SummaryStats = ({ permissions }) => {
  const cards = [
    {
      role: null,
      label: "Super Admin",
      value: "All Pages",
      sub: "Unrestricted",
      gradient: "from-rose-500 to-red-600",
      icon: "ri-shield-check-fill",
    },
    {
      role: "admin",
      label: "Admin",
      gradient: "from-violet-500 to-indigo-600",
      icon: "ri-user-settings-fill",
    },
    {
      role: "hr",
      label: "HR Manager",
      gradient: "from-emerald-500 to-teal-600",
      icon: "ri-user-star-fill",
    },
    {
      role: "employee",
      label: "Employee",
      gradient: "from-slate-500 to-slate-700",
      icon: "ri-user-fill",
    },
  ];

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
      {cards.map((c, i) => {
        const rolePages = c.role ? ALL_PAGES.filter((p) => p.roles.includes(c.role)) : [];
        const enabled = c.role
          ? rolePages.filter((p) => permissions[c.role]?.[p.key]).length
          : null;
        const total = rolePages.length;
        const pct = total > 0 ? Math.round((enabled / total) * 100) : 100;

        return (
          <div
            key={i}
            className={`rounded-2xl p-4 bg-gradient-to-br ${c.gradient} text-white shadow-md flex items-center justify-between gap-3`}
          >
            <div className="min-w-0">
              <p className="text-white/80 text-xs font-semibold truncate">{c.label}</p>
              <p className="text-xl font-black mt-0.5 leading-none">
                {c.role ? `${enabled}/${total}` : c.value}
              </p>
              <p className="text-white/60 text-[10px] mt-0.5">
                {c.role ? `${pct}% enabled` : c.sub}
              </p>
            </div>
            <div className="bg-white/20 p-2.5 rounded-xl shrink-0">
              <i className={`${c.icon} text-xl`} />
            </div>
          </div>
        );
      })}
    </div>
  );
};

// ─── Main Page ────────────────────────────────────────────────────────────────
const AccessControl = () => {
  const {
    permissions,
    togglePermission,
    setRolePermissions,
    resetRole,
    resetAll,
  } = useAccessControl();

  const [activeTab, setActiveTab] = useState("manage");
  const [search, setSearch] = useState("");
  const [saved, setSaved] = useState(false);
  const [confirmReset, setConfirmReset] = useState(false);

  const handleEnableAll = (role) => {
    const all = {};
    ALL_PAGES.filter((p) => p.roles.includes(role)).forEach((p) => { all[p.key] = true; });
    setRolePermissions(role, all);
  };

  const handleDisableAll = (role) => {
    const none = {};
    ALL_PAGES.filter((p) => p.roles.includes(role)).forEach((p) => { none[p.key] = false; });
    setRolePermissions(role, none);
  };

  const handleSave = () => {
    // Context auto-saves to localStorage; this just shows feedback
    setSaved(true);
    setTimeout(() => setSaved(false), 2500);
  };

  const handleResetAll = () => {
    if (confirmReset) {
      resetAll();
      setConfirmReset(false);
    } else {
      setConfirmReset(true);
      setTimeout(() => setConfirmReset(false), 3000);
    }
  };

  const TABS = [
    { id: "manage",  label: "Manage Permissions", icon: "ri-toggle-line" },
    { id: "matrix",  label: "Access Matrix",       icon: "ri-table-line" },
  ];

  return (
    <div className="space-y-6">

      {/* ── Page Header ── */}
      <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
        <div className="flex items-start gap-3">
          <div className="w-10 h-10 bg-gradient-to-br from-rose-500 to-red-600 rounded-xl flex items-center justify-center shadow-md shrink-0 mt-0.5">
            <RiShieldLine size={20} className="text-white" />
          </div>
          <div>
            <h1 className="text-2xl lg:text-3xl font-black text-slate-900 tracking-tight leading-none">
              Access Control
            </h1>
            <p className="text-slate-500 text-sm mt-1">
              Define which pages each role can access · Changes apply instantly
            </p>
          </div>
        </div>

        {/* Action buttons */}
        <div className="flex items-center gap-2 shrink-0">
          <button
            onClick={handleResetAll}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-xl border font-semibold text-sm transition-all shadow-sm ${
              confirmReset
                ? "bg-red-600 text-white border-red-600 hover:bg-red-700"
                : "bg-white text-slate-600 border-slate-200 hover:border-slate-300"
            }`}
          >
            <RiRefreshLine size={15} />
            {confirmReset ? "Confirm Reset?" : "Reset All"}
          </button>
          <button
            onClick={handleSave}
            className={`flex items-center gap-2 px-5 py-2.5 rounded-xl font-bold text-sm transition-all shadow-sm ${
              saved
                ? "bg-emerald-600 text-white"
                : "bg-blue-600 hover:bg-blue-700 text-white"
            }`}
          >
            {saved
              ? <><RiCheckLine size={15} /> Saved!</>
              : <><RiSaveLine size={15} /> Save Changes</>}
          </button>
        </div>
      </div>

      {/* ── Summary Stats ── */}
      <SummaryStats permissions={permissions} />

      {/* ── Tabs ── */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-1.5 flex gap-1">
        {TABS.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl font-bold text-sm transition-all ${
              activeTab === tab.id
                ? "bg-slate-900 text-white shadow-md"
                : "text-slate-500 hover:text-slate-800 hover:bg-slate-50"
            }`}
          >
            <i className={`${tab.icon} text-base`} />
            {tab.label}
          </button>
        ))}
      </div>

      {/* ── Manage Tab ── */}
      {activeTab === "manage" && (
        <div className="space-y-5">
          {/* SuperAdmin banner */}
          <SuperAdminBanner />

          {/* Global search */}
          <div className="relative">
            <RiSearchLine className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
            <input
              type="text"
              placeholder="Search pages across all roles..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-11 pr-4 py-3 bg-white border border-slate-200 rounded-xl text-sm outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-100 transition-all shadow-sm"
            />
          </div>

          {/* Role cards */}
          {Object.keys(ROLE_META).map((role) => (
            <RoleCard
              key={role}
              role={role}
              permissions={permissions}
              onToggle={togglePermission}
              onEnableAll={() => handleEnableAll(role)}
              onDisableAll={() => handleDisableAll(role)}
              onReset={() => resetRole(role)}
              search={search}
            />
          ))}

          {/* Auto-save notice */}
          <div className="flex items-center justify-center gap-2 text-xs text-slate-400 pb-1">
            <RiInformationLine size={13} />
            Changes are auto-saved to browser storage and apply immediately
          </div>
        </div>
      )}

      {/* ── Matrix Tab ── */}
      {activeTab === "matrix" && (
        <div className="space-y-5">
          <SuperAdminBanner />
          <AccessMatrix permissions={permissions} />
        </div>
      )}
    </div>
  );
};

export default AccessControl;
