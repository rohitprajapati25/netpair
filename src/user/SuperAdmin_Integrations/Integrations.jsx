import { useState } from "react";
import {
  RiPlugLine, RiMailSendLine, RiSlackLine, RiGithubLine,
  RiGoogleLine, RiCheckLine, RiCloseLine, RiExternalLinkLine,
  RiRefreshLine, RiInformationLine,
} from "react-icons/ri";

// ── Integration Card ──────────────────────────────────────────────────────────
const IntegrationCard = ({ name, desc, icon: Icon, iconBg, connected, onToggle, comingSoon }) => {
  const [loading, setLoading] = useState(false);

  const handleToggle = async () => {
    if (comingSoon) return;
    setLoading(true);
    await new Promise(r => setTimeout(r, 800)); // simulate API call
    onToggle();
    setLoading(false);
  };

  return (
    <div className={`bg-white rounded-2xl border shadow-sm p-5 flex flex-col gap-4 transition-all hover:shadow-md ${
      connected ? "border-emerald-200" : "border-slate-200"
    }`}>
      {/* Header */}
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className={`w-11 h-11 rounded-xl flex items-center justify-center shrink-0 ${iconBg}`}>
            <Icon size={22} className="text-white" />
          </div>
          <div>
            <h3 className="font-bold text-slate-800 text-sm">{name}</h3>
            {comingSoon && (
              <span className="text-[9px] font-black uppercase tracking-wider text-amber-600 bg-amber-50 border border-amber-200 px-2 py-0.5 rounded-full">
                Coming Soon
              </span>
            )}
          </div>
        </div>
        {/* Status dot */}
        <div className={`flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-bold border ${
          connected
            ? "bg-emerald-50 text-emerald-700 border-emerald-200"
            : "bg-slate-100 text-slate-500 border-slate-200"
        }`}>
          <span className={`w-1.5 h-1.5 rounded-full ${connected ? "bg-emerald-500" : "bg-slate-400"}`} />
          {connected ? "Connected" : "Disconnected"}
        </div>
      </div>

      {/* Description */}
      <p className="text-xs text-slate-500 leading-relaxed">{desc}</p>

      {/* Action */}
      <button
        onClick={handleToggle}
        disabled={loading || comingSoon}
        className={`flex items-center justify-center gap-2 py-2.5 rounded-xl font-bold text-sm transition-all disabled:opacity-50 ${
          comingSoon
            ? "bg-slate-100 text-slate-400 cursor-not-allowed"
            : connected
            ? "bg-red-50 hover:bg-red-100 text-red-600 border border-red-200"
            : "bg-blue-600 hover:bg-blue-700 text-white shadow-md"
        }`}
      >
        {loading ? (
          <RiRefreshLine className="animate-spin" size={15} />
        ) : connected ? (
          <><RiCloseLine size={15} /> Disconnect</>
        ) : comingSoon ? (
          "Not Available Yet"
        ) : (
          <><RiPlugLine size={15} /> Connect</>
        )}
      </button>
    </div>
  );
};

// ── Main Component ────────────────────────────────────────────────────────────
const Integrations = () => {
  const [connections, setConnections] = useState({
    smtp:   false,
    slack:  false,
    github: false,
    google: false,
  });

  const toggle = (key) => setConnections(prev => ({ ...prev, [key]: !prev[key] }));

  const integrations = [
    {
      key: "smtp",
      name: "SMTP Email",
      desc: "Send transactional emails for leave approvals, password resets, and notifications via your SMTP server.",
      icon: RiMailSendLine,
      iconBg: "bg-gradient-to-br from-blue-500 to-indigo-600",
      comingSoon: false,
    },
    {
      key: "slack",
      name: "Slack",
      desc: "Post notifications to Slack channels when employees apply for leave, tasks are assigned, or timesheets are submitted.",
      icon: RiSlackLine,
      iconBg: "bg-gradient-to-br from-purple-500 to-pink-600",
      comingSoon: true,
    },
    {
      key: "github",
      name: "GitHub",
      desc: "Link GitHub repositories to projects for automatic commit tracking and developer activity reports.",
      icon: RiGithubLine,
      iconBg: "bg-gradient-to-br from-slate-700 to-slate-900",
      comingSoon: true,
    },
    {
      key: "google",
      name: "Google Workspace",
      desc: "Sync Google Calendar with the holiday calendar and enable Google SSO for employee login.",
      icon: RiGoogleLine,
      iconBg: "bg-gradient-to-br from-red-500 to-orange-500",
      comingSoon: true,
    },
  ];

  const connectedCount = Object.values(connections).filter(Boolean).length;

  return (
    <div className="space-y-6">

      {/* Header */}
      <div className="flex items-start gap-3">
        <div className="w-10 h-10 bg-gradient-to-br from-violet-600 to-purple-700 rounded-xl flex items-center justify-center shadow-md shrink-0 mt-0.5">
          <RiPlugLine size={20} className="text-white" />
        </div>
        <div>
          <h1 className="text-2xl lg:text-3xl font-black text-slate-900 tracking-tight leading-none">
            Integrations
          </h1>
          <p className="text-slate-500 text-sm mt-1">
            Connect third-party services to extend IMS functionality
          </p>
        </div>
      </div>

      {/* Stats bar */}
      <div className="flex items-center gap-4 p-4 bg-white rounded-2xl border border-slate-200 shadow-sm">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-emerald-100 rounded-lg flex items-center justify-center">
            <RiCheckLine size={16} className="text-emerald-600" />
          </div>
          <div>
            <p className="text-xs text-slate-500 font-medium">Connected</p>
            <p className="text-lg font-black text-slate-800 leading-none">{connectedCount}</p>
          </div>
        </div>
        <div className="h-8 w-px bg-slate-200" />
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-slate-100 rounded-lg flex items-center justify-center">
            <RiPlugLine size={16} className="text-slate-500" />
          </div>
          <div>
            <p className="text-xs text-slate-500 font-medium">Available</p>
            <p className="text-lg font-black text-slate-800 leading-none">{integrations.length}</p>
          </div>
        </div>
        <div className="ml-auto flex items-center gap-2 text-xs text-slate-400">
          <RiInformationLine size={14} />
          More integrations coming soon
        </div>
      </div>

      {/* Integration cards grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 lg:gap-5">
        {integrations.map(item => (
          <IntegrationCard
            key={item.key}
            {...item}
            connected={connections[item.key]}
            onToggle={() => toggle(item.key)}
          />
        ))}
      </div>

      {/* SMTP Config (shown when connected) */}
      {connections.smtp && (
        <div className="bg-white rounded-2xl border border-emerald-200 shadow-sm overflow-hidden">
          <div className="flex items-center gap-3 px-6 py-4 border-b border-slate-100 bg-emerald-50">
            <RiMailSendLine size={18} className="text-emerald-600" />
            <h2 className="font-bold text-slate-800">SMTP Configuration</h2>
            <span className="ml-auto px-2.5 py-0.5 bg-emerald-100 text-emerald-700 text-[10px] font-bold rounded-full border border-emerald-200">
              Connected
            </span>
          </div>
          <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-5">
            {[
              { label: "SMTP Host",     placeholder: "smtp.gmail.com",  type: "text" },
              { label: "SMTP Port",     placeholder: "587",             type: "number" },
              { label: "Username",      placeholder: "you@example.com", type: "email" },
              { label: "Password",      placeholder: "••••••••",        type: "password" },
              { label: "From Name",     placeholder: "NetPair IMS",     type: "text" },
              { label: "From Email",    placeholder: "noreply@example.com", type: "email" },
            ].map(({ label, placeholder, type }) => (
              <div key={label} className="space-y-1.5">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">{label}</label>
                <input
                  type={type}
                  placeholder={placeholder}
                  className="w-full px-4 py-3 bg-slate-50 border-2 border-slate-100 rounded-xl text-sm font-medium outline-none transition-all focus:bg-white focus:border-blue-500"
                />
              </div>
            ))}
            <div className="md:col-span-2 flex gap-3 pt-2">
              <button className="flex items-center gap-2 px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl text-sm transition-all shadow-md">
                <RiCheckLine size={15} /> Save SMTP Config
              </button>
              <button className="flex items-center gap-2 px-5 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-xl text-sm transition-all">
                <RiMailSendLine size={15} /> Send Test Email
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};

export default Integrations;
