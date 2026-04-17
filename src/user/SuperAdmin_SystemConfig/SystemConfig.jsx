import { useState } from "react";
import {
  RiSettings4Line, RiServerLine, RiShieldLine, RiMailLine,
  RiTimeLine, RiGlobalLine, RiSaveLine, RiCheckLine,
  RiInformationLine,
} from "react-icons/ri";

// ── Section wrapper ───────────────────────────────────────────────────────────
const Section = ({ title, icon: Icon, iconColor = "text-blue-600", children }) => (
  <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
    <div className="flex items-center gap-3 px-6 py-4 border-b border-slate-100">
      <div className={`p-2 rounded-xl bg-slate-50 ${iconColor}`}>
        <Icon size={18} />
      </div>
      <h2 className="font-bold text-slate-800">{title}</h2>
    </div>
    <div className="p-6">{children}</div>
  </div>
);

// ── Field wrapper ─────────────────────────────────────────────────────────────
const Field = ({ label, hint, children }) => (
  <div className="space-y-1.5">
    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">{label}</label>
    {children}
    {hint && <p className="text-[10px] text-slate-400 ml-1">{hint}</p>}
  </div>
);

const inputCls = "w-full px-4 py-3 bg-slate-50 border-2 border-slate-100 rounded-xl text-sm font-medium outline-none transition-all focus:bg-white focus:border-blue-500";

// ── Main Component ────────────────────────────────────────────────────────────
const SystemConfig = () => {
  const [saved, setSaved] = useState(false);
  const [config, setConfig] = useState({
    appName:        "NetPair IMS",
    appUrl:         "https://ims.netpair.in",
    supportEmail:   "support@netpair.in",
    timezone:       "Asia/Kolkata",
    sessionTimeout: "60",
    maxLoginAttempts: "5",
    maintenanceMode: false,
    emailNotifications: true,
    auditLogging: true,
  });

  const handleChange = (key, value) => {
    setConfig(prev => ({ ...prev, [key]: value }));
  };

  const handleSave = () => {
    // In production this would POST to /api/admin/system-config
    setSaved(true);
    setTimeout(() => setSaved(false), 2500);
  };

  return (
    <div className="space-y-6">

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-start gap-3">
          <div className="w-10 h-10 bg-gradient-to-br from-slate-700 to-slate-900 rounded-xl flex items-center justify-center shadow-md shrink-0 mt-0.5">
            <RiSettings4Line size={20} className="text-white" />
          </div>
          <div>
            <h1 className="text-2xl lg:text-3xl font-black text-slate-900 tracking-tight leading-none">
              System Configuration
            </h1>
            <p className="text-slate-500 text-sm mt-1">
              Global settings for the IMS platform · Super Admin only
            </p>
          </div>
        </div>
        <button
          onClick={handleSave}
          className={`flex items-center gap-2 px-5 py-2.5 rounded-xl font-bold text-sm transition-all shadow-sm ${
            saved
              ? "bg-emerald-600 text-white"
              : "bg-blue-600 hover:bg-blue-700 text-white"
          }`}
        >
          {saved ? <><RiCheckLine size={15} /> Saved!</> : <><RiSaveLine size={15} /> Save Changes</>}
        </button>
      </div>

      {/* Info banner */}
      <div className="flex items-start gap-3 px-4 py-3.5 bg-amber-50 border border-amber-200 rounded-xl text-sm text-amber-800">
        <RiInformationLine size={18} className="shrink-0 mt-0.5 text-amber-600" />
        <p>
          Changes here affect the entire platform. Settings are saved to browser storage in this demo.
          In production, these would be persisted to the database.
        </p>
      </div>

      {/* General Settings */}
      <Section title="General Settings" icon={RiGlobalLine}>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          <Field label="Application Name">
            <input
              className={inputCls}
              value={config.appName}
              onChange={e => handleChange("appName", e.target.value)}
              placeholder="NetPair IMS"
            />
          </Field>
          <Field label="Application URL" hint="Used in email links and redirects">
            <input
              className={inputCls}
              value={config.appUrl}
              onChange={e => handleChange("appUrl", e.target.value)}
              placeholder="https://ims.example.com"
            />
          </Field>
          <Field label="Support Email">
            <input
              className={inputCls}
              type="email"
              value={config.supportEmail}
              onChange={e => handleChange("supportEmail", e.target.value)}
              placeholder="support@example.com"
            />
          </Field>
          <Field label="Timezone" hint="Used for attendance and scheduling">
            <select
              className={inputCls}
              value={config.timezone}
              onChange={e => handleChange("timezone", e.target.value)}
            >
              <option value="Asia/Kolkata">Asia/Kolkata (IST +5:30)</option>
              <option value="UTC">UTC</option>
              <option value="America/New_York">America/New_York (EST)</option>
              <option value="Europe/London">Europe/London (GMT)</option>
              <option value="Asia/Dubai">Asia/Dubai (GST +4)</option>
            </select>
          </Field>
        </div>
      </Section>

      {/* Security Settings */}
      <Section title="Security Settings" icon={RiShieldLine} iconColor="text-rose-600">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          <Field label="Session Timeout (minutes)" hint="Users are logged out after this period of inactivity">
            <input
              className={inputCls}
              type="number"
              min="15"
              max="480"
              value={config.sessionTimeout}
              onChange={e => handleChange("sessionTimeout", e.target.value)}
            />
          </Field>
          <Field label="Max Login Attempts" hint="Account locked after this many failed attempts">
            <input
              className={inputCls}
              type="number"
              min="3"
              max="10"
              value={config.maxLoginAttempts}
              onChange={e => handleChange("maxLoginAttempts", e.target.value)}
            />
          </Field>
        </div>
      </Section>

      {/* Feature Toggles */}
      <Section title="Feature Toggles" icon={RiServerLine} iconColor="text-purple-600">
        <div className="space-y-4">
          {[
            {
              key: "maintenanceMode",
              label: "Maintenance Mode",
              desc: "Blocks all non-SuperAdmin logins and shows a maintenance page",
              danger: true,
            },
            {
              key: "emailNotifications",
              label: "Email Notifications",
              desc: "Send email alerts for leave approvals, task assignments, etc.",
              danger: false,
            },
            {
              key: "auditLogging",
              label: "Audit Logging",
              desc: "Record all user actions in the audit log",
              danger: false,
            },
          ].map(({ key, label, desc, danger }) => (
            <div
              key={key}
              className={`flex items-center justify-between p-4 rounded-xl border transition-all ${
                danger && config[key]
                  ? "bg-red-50 border-red-200"
                  : "bg-slate-50 border-slate-200"
              }`}
            >
              <div className="flex-1 min-w-0 mr-4">
                <p className={`font-semibold text-sm ${danger && config[key] ? "text-red-700" : "text-slate-800"}`}>
                  {label}
                </p>
                <p className="text-xs text-slate-500 mt-0.5">{desc}</p>
              </div>
              <button
                type="button"
                role="switch"
                aria-checked={config[key]}
                onClick={() => handleChange(key, !config[key])}
                className={`relative inline-flex h-6 w-11 shrink-0 items-center rounded-full transition-colors duration-200 focus:outline-none ${
                  config[key]
                    ? danger ? "bg-red-500" : "bg-blue-600"
                    : "bg-slate-200"
                }`}
              >
                <span
                  className={`inline-block h-4 w-4 rounded-full bg-white shadow-sm transition-transform duration-200 ${
                    config[key] ? "translate-x-6" : "translate-x-1"
                  }`}
                />
              </button>
            </div>
          ))}
        </div>
      </Section>

    </div>
  );
};

export default SystemConfig;
