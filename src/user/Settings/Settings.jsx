import React, { useState, useEffect, useCallback } from "react";
import { useAuth } from "../../contexts/AuthContext";
import axios from "axios";
import {
  RiUserSettingsLine, RiLockPasswordLine, RiShieldCheckLine,
  RiMailLine, RiPhoneLine, RiSave3Line, RiEyeLine, RiEyeOffLine,
  RiCheckLine, RiCloseLine, RiAlertLine, RiLogoutBoxLine,
  RiTimeLine, RiDeviceLine, RiLoader4Line, RiInformationLine
} from "react-icons/ri";

// ── API base ──────────────────────────────────────────────────────────────────
const getEndpoint = (role) => {
  if (role === "superadmin" || role === "admin") return "/api/admin";
  if (role === "hr") return "/api/hr";
  return "/api/employees";
};

// ── Password strength ─────────────────────────────────────────────────────────
const getPasswordStrength = (pwd) => {
  if (!pwd) return { score: 0, label: "", color: "" };
  let score = 0;
  if (pwd.length >= 8)  score++;
  if (pwd.length >= 12) score++;
  if (/[A-Z]/.test(pwd)) score++;
  if (/[0-9]/.test(pwd)) score++;
  if (/[^A-Za-z0-9]/.test(pwd)) score++;
  if (score <= 1) return { score, label: "Weak",   color: "bg-red-500",    text: "text-red-600"    };
  if (score <= 2) return { score, label: "Fair",   color: "bg-orange-500", text: "text-orange-600" };
  if (score <= 3) return { score, label: "Good",   color: "bg-yellow-500", text: "text-yellow-600" };
  if (score <= 4) return { score, label: "Strong", color: "bg-blue-500",   text: "text-blue-600"   };
  return              { score, label: "Very Strong", color: "bg-emerald-500", text: "text-emerald-600" };
};

// ── Toast component ───────────────────────────────────────────────────────────
const Toast = ({ message, type, onClose }) => {
  useEffect(() => {
    const t = setTimeout(onClose, 3500);
    return () => clearTimeout(t);
  }, [onClose]);

  const styles = {
    success: "bg-emerald-600 text-white",
    error:   "bg-red-600 text-white",
    info:    "bg-blue-600 text-white",
  };

  return (
    <div className={`fixed bottom-6 right-6 z-50 flex items-center gap-3 px-5 py-3.5 rounded-2xl shadow-2xl font-semibold text-sm ${styles[type]} animate-fade-in`}>
      {type === "success" ? <RiCheckLine size={18} /> : type === "error" ? <RiCloseLine size={18} /> : <RiInformationLine size={18} />}
      {message}
    </div>
  );
};

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

// ── Input field ───────────────────────────────────────────────────────────────
const Field = ({ label, icon: Icon, children, hint }) => (
  <div className="space-y-1.5">
    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">{label}</label>
    <div className="relative">
      {Icon && <Icon className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={16} />}
      {children}
    </div>
    {hint && <p className="text-[10px] text-slate-400 ml-1">{hint}</p>}
  </div>
);

const inputCls = (hasIcon = true, readOnly = false) =>
  `w-full ${hasIcon ? "pl-11" : "px-4"} pr-4 py-3 bg-slate-50 border-2 border-slate-100 rounded-xl text-sm font-medium outline-none transition-all
  ${readOnly ? "cursor-not-allowed opacity-60" : "focus:bg-white focus:border-blue-500"}`;

// ── Main component ────────────────────────────────────────────────────────────
const Settings = () => {
  const { user, token, role, logout } = useAuth();

  const [activeTab, setActiveTab]   = useState("profile");
  const [loading, setLoading]       = useState(true);
  const [saving, setSaving]         = useState(false);
  const [toast, setToast]           = useState(null);

  // Profile state
  const [profile, setProfile] = useState({
    name: "", email: "", phone: "", designation: "", department: "", employmentType: "",
  });
  const [dirty, setDirty] = useState(false);

  // Password state
  const [passwords, setPasswords] = useState({
    currentPassword: "", newPassword: "", confirmPassword: "",
  });
  const [showPwd, setShowPwd] = useState({ current: false, new: false, confirm: false });
  const [pwdLoading, setPwdLoading] = useState(false);

  const showToast = useCallback((message, type = "success") => {
    setToast({ message, type });
  }, []);

  // ── Fetch profile ───────────────────────────────────────────────────────────
  useEffect(() => {
    const fetchProfile = async () => {
      try {
        setLoading(true);
        const base = getEndpoint(role);
        const res = await axios.get(`http://localhost:5000${base}/profile`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (res.data.success) {
          const data = res.data.profile || res.data.user || {};
          setProfile({
            name:           data.name           || user?.name           || "",
            email:          data.email          || user?.email          || "",
            phone:          data.phone          || user?.phone          || "",
            designation:    data.designation    || user?.designation    || "",
            department:     data.department     || user?.department     || "",
            employmentType: data.employmentType || "",
          });
        }
      } catch {
        // Fallback to context data
        setProfile({
          name:           user?.name           || "",
          email:          user?.email          || "",
          phone:          user?.phone          || "",
          designation:    user?.designation    || "",
          department:     user?.department     || "",
          employmentType: "",
        });
      } finally {
        setLoading(false);
      }
    };
    if (token) fetchProfile();
  }, [token, role, user]);

  // ── Save profile ────────────────────────────────────────────────────────────
  const handleSaveProfile = async () => {
    if (!profile.name.trim()) return showToast("Name cannot be empty", "error");
    try {
      setSaving(true);
      const base = getEndpoint(role);
      const res = await axios.put(
        `http://localhost:5000${base}/profile`,
        { name: profile.name, phone: profile.phone, designation: profile.designation, department: profile.department },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      if (res.data.success) {
        setDirty(false);
        showToast("Profile updated successfully");
      }
    } catch (err) {
      showToast(err.response?.data?.message || "Failed to update profile", "error");
    } finally {
      setSaving(false);
    }
  };

  // ── Change password ─────────────────────────────────────────────────────────
  const handleChangePassword = async () => {
    if (!passwords.currentPassword) return showToast("Enter current password", "error");
    if (passwords.newPassword.length < 8) return showToast("New password must be at least 8 characters", "error");
    if (passwords.newPassword !== passwords.confirmPassword) return showToast("Passwords don't match", "error");
    const strength = getPasswordStrength(passwords.newPassword);
    if (strength.score < 2) return showToast("Password is too weak", "error");

    try {
      setPwdLoading(true);
      const base = getEndpoint(role);
      const res = await axios.post(
        `http://localhost:5000${base}/password`,
        { currentPassword: passwords.currentPassword, newPassword: passwords.newPassword },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      if (res.data.success) {
        setPasswords({ currentPassword: "", newPassword: "", confirmPassword: "" });
        showToast("Password changed successfully");
      }
    } catch (err) {
      showToast(err.response?.data?.message || "Failed to change password", "error");
    } finally {
      setPwdLoading(false);
    }
  };

  const pwdStrength = getPasswordStrength(passwords.newPassword);

  const ROLE_LABEL = { superadmin: "Super Admin", admin: "Admin", hr: "HR Manager", employee: "Employee" };
  const ROLE_COLOR = { superadmin: "bg-red-100 text-red-700", admin: "bg-indigo-100 text-indigo-700", hr: "bg-emerald-100 text-emerald-700", employee: "bg-slate-100 text-slate-600" };

  const TABS = [
    { id: "profile",  label: "Profile",  icon: RiUserSettingsLine },
    { id: "security", label: "Security", icon: RiLockPasswordLine },
    { id: "account",  label: "Account",  icon: RiShieldCheckLine  },
  ];

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="animate-pulse">
          <div className="h-8 bg-slate-200 rounded-lg w-40 mb-2"></div>
          <div className="h-4 bg-slate-200 rounded w-64"></div>
        </div>
        <div className="grid grid-cols-1 xl:grid-cols-12 gap-6">
          <div className="xl:col-span-3 h-80 bg-slate-200 rounded-2xl animate-pulse"></div>
          <div className="xl:col-span-9 h-80 bg-slate-200 rounded-2xl animate-pulse"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">

      {/* Toast */}
      {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}

      {/* Header */}
      <div>
        <h1 className="text-2xl lg:text-3xl font-black text-slate-900 tracking-tight">Settings</h1>
        <p className="text-slate-500 text-sm mt-0.5">Manage your account, security and preferences</p>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-12 gap-6 items-start">

        {/* ── Left: Profile Card ── */}
        <div className="xl:col-span-3 space-y-4">
          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 flex flex-col items-center text-center">
            {/* Avatar */}
            <div className="relative mb-4">
              <img
                src={`https://ui-avatars.com/api/?name=${encodeURIComponent(profile.name || "User")}&background=4f46e5&color=fff&size=256&bold=true`}
                alt="avatar"
                className="w-24 h-24 rounded-2xl object-cover ring-4 ring-slate-100 shadow-md"
              />
              <div className="absolute -bottom-1 -right-1 w-5 h-5 bg-emerald-500 rounded-full border-2 border-white"></div>
            </div>

            <h2 className="font-black text-slate-900 text-lg leading-tight">{profile.name || "User"}</h2>
            <p className="text-slate-500 text-xs mt-0.5">{profile.email}</p>

            <span className={`mt-3 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider ${ROLE_COLOR[role] || ROLE_COLOR.employee}`}>
              {ROLE_LABEL[role] || role}
            </span>

            {profile.department && (
              <p className="mt-2 text-xs text-slate-400">{profile.department}</p>
            )}
            {profile.designation && (
              <p className="text-xs text-slate-400">{profile.designation}</p>
            )}
          </div>

          {/* Tab Navigation */}
          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-2 space-y-1">
            {TABS.map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`w-full flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-semibold transition-all ${
                  activeTab === tab.id
                    ? "bg-blue-600 text-white shadow-md"
                    : "text-slate-600 hover:bg-slate-50"
                }`}
              >
                <tab.icon size={16} />
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        {/* ── Right: Tab Content ── */}
        <div className="xl:col-span-9 space-y-5">

          {/* ── PROFILE TAB ── */}
          {activeTab === "profile" && (
            <Section title="Profile Information" icon={RiUserSettingsLine}>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <Field label="Full Name" icon={RiUserSettingsLine}>
                  <input
                    className={inputCls()}
                    value={profile.name}
                    onChange={e => { setProfile(p => ({ ...p, name: e.target.value })); setDirty(true); }}
                    placeholder="Your full name"
                  />
                </Field>

                <Field label="Email Address" icon={RiMailLine} hint="Email cannot be changed">
                  <input className={inputCls(true, true)} value={profile.email} readOnly />
                </Field>

                <Field label="Phone Number" icon={RiPhoneLine}>
                  <input
                    className={inputCls()}
                    value={profile.phone}
                    onChange={e => { setProfile(p => ({ ...p, phone: e.target.value })); setDirty(true); }}
                    placeholder="+91 9876543210"
                    type="tel"
                  />
                </Field>

                {role !== "superadmin" && (
                  <Field label="Designation">
                    <input
                      className={inputCls(false)}
                      value={profile.designation}
                      onChange={e => { setProfile(p => ({ ...p, designation: e.target.value })); setDirty(true); }}
                      placeholder="Your job title"
                    />
                  </Field>
                )}

                {(role === "employee" || role === "hr") && (
                  <Field label="Department">
                    <input
                      className={inputCls(false, true)}
                      value={profile.department}
                      readOnly
                    />
                  </Field>
                )}

                {profile.employmentType && (
                  <Field label="Employment Type">
                    <input className={inputCls(false, true)} value={profile.employmentType} readOnly />
                  </Field>
                )}
              </div>

              <div className="flex justify-end mt-6 pt-5 border-t border-slate-100">
                <button
                  onClick={handleSaveProfile}
                  disabled={saving || !dirty}
                  className="flex items-center gap-2 px-6 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl shadow-md transition-all disabled:opacity-50 disabled:cursor-not-allowed text-sm"
                >
                  {saving ? <RiLoader4Line className="animate-spin" size={16} /> : <RiSave3Line size={16} />}
                  {saving ? "Saving..." : "Save Changes"}
                </button>
              </div>
            </Section>
          )}

          {/* ── SECURITY TAB ── */}
          {activeTab === "security" && (
            <Section title="Change Password" icon={RiLockPasswordLine} iconColor="text-rose-600">
              <div className="space-y-4 max-w-md">
                {/* Current password */}
                <Field label="Current Password">
                  <input
                    type={showPwd.current ? "text" : "password"}
                    className={inputCls(false)}
                    value={passwords.currentPassword}
                    onChange={e => setPasswords(p => ({ ...p, currentPassword: e.target.value }))}
                    placeholder="Enter current password"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPwd(p => ({ ...p, current: !p.current }))}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                  >
                    {showPwd.current ? <RiEyeOffLine size={16} /> : <RiEyeLine size={16} />}
                  </button>
                </Field>

                {/* New password */}
                <Field label="New Password">
                  <input
                    type={showPwd.new ? "text" : "password"}
                    className={inputCls(false)}
                    value={passwords.newPassword}
                    onChange={e => setPasswords(p => ({ ...p, newPassword: e.target.value }))}
                    placeholder="Min 8 characters"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPwd(p => ({ ...p, new: !p.new }))}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                  >
                    {showPwd.new ? <RiEyeOffLine size={16} /> : <RiEyeLine size={16} />}
                  </button>
                </Field>

                {/* Strength bar */}
                {passwords.newPassword && (
                  <div className="space-y-1.5">
                    <div className="flex gap-1">
                      {[1,2,3,4,5].map(i => (
                        <div key={i} className={`h-1.5 flex-1 rounded-full transition-all ${i <= pwdStrength.score ? pwdStrength.color : "bg-slate-200"}`} />
                      ))}
                    </div>
                    <p className={`text-[10px] font-bold ${pwdStrength.text}`}>{pwdStrength.label}</p>
                  </div>
                )}

                {/* Confirm password */}
                <Field label="Confirm New Password">
                  <input
                    type={showPwd.confirm ? "text" : "password"}
                    className={`${inputCls(false)} ${
                      passwords.confirmPassword && passwords.newPassword !== passwords.confirmPassword
                        ? "border-red-300 focus:border-red-500"
                        : passwords.confirmPassword && passwords.newPassword === passwords.confirmPassword
                        ? "border-emerald-300 focus:border-emerald-500"
                        : ""
                    }`}
                    value={passwords.confirmPassword}
                    onChange={e => setPasswords(p => ({ ...p, confirmPassword: e.target.value }))}
                    placeholder="Re-enter new password"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPwd(p => ({ ...p, confirm: !p.confirm }))}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                  >
                    {showPwd.confirm ? <RiEyeOffLine size={16} /> : <RiEyeLine size={16} />}
                  </button>
                  {passwords.confirmPassword && passwords.newPassword !== passwords.confirmPassword && (
                    <p className="text-[10px] text-red-500 font-bold mt-1 ml-1">Passwords don't match</p>
                  )}
                </Field>

                {/* Password rules */}
                <div className="bg-slate-50 rounded-xl p-4 space-y-1.5">
                  {[
                    ["At least 8 characters",          passwords.newPassword.length >= 8],
                    ["Contains uppercase letter",       /[A-Z]/.test(passwords.newPassword)],
                    ["Contains number",                 /[0-9]/.test(passwords.newPassword)],
                    ["Contains special character",      /[^A-Za-z0-9]/.test(passwords.newPassword)],
                  ].map(([rule, met]) => (
                    <div key={rule} className="flex items-center gap-2">
                      {met
                        ? <RiCheckLine size={12} className="text-emerald-500 shrink-0" />
                        : <RiCloseLine size={12} className="text-slate-300 shrink-0" />
                      }
                      <span className={`text-[11px] font-medium ${met ? "text-emerald-600" : "text-slate-400"}`}>{rule}</span>
                    </div>
                  ))}
                </div>

                <button
                  onClick={handleChangePassword}
                  disabled={pwdLoading || !passwords.currentPassword || !passwords.newPassword || passwords.newPassword !== passwords.confirmPassword}
                  className="flex items-center gap-2 px-6 py-2.5 bg-rose-600 hover:bg-rose-700 text-white font-bold rounded-xl shadow-md transition-all disabled:opacity-50 disabled:cursor-not-allowed text-sm"
                >
                  {pwdLoading ? <RiLoader4Line className="animate-spin" size={16} /> : <RiLockPasswordLine size={16} />}
                  {pwdLoading ? "Updating..." : "Update Password"}
                </button>
              </div>
            </Section>
          )}

          {/* ── ACCOUNT TAB ── */}
          {activeTab === "account" && (
            <div className="space-y-5">
              {/* Session info */}
              <Section title="Session Information" icon={RiDeviceLine} iconColor="text-slate-600">
                <div className="space-y-3">
                  {[
                    { icon: RiTimeLine,   label: "Session Started", value: new Date().toLocaleString() },
                    { icon: RiDeviceLine, label: "Device",          value: navigator.userAgent.includes("Windows") ? "Windows PC" : navigator.userAgent.includes("Mac") ? "Mac" : "Unknown Device" },
                    { icon: RiShieldCheckLine, label: "Account Status", value: "Active" },
                  ].map(({ icon: Icon, label, value }) => (
                    <div key={label} className="flex items-center justify-between p-4 bg-slate-50 rounded-xl">
                      <div className="flex items-center gap-3">
                        <Icon size={16} className="text-slate-400" />
                        <span className="text-sm font-semibold text-slate-700">{label}</span>
                      </div>
                      <span className="text-sm text-slate-500 font-medium">{value}</span>
                    </div>
                  ))}
                </div>
              </Section>

              {/* Danger zone */}
              <Section title="Danger Zone" icon={RiAlertLine} iconColor="text-red-600">
                <div className="space-y-4">
                  <div className="flex items-center justify-between p-4 bg-red-50 border border-red-100 rounded-xl">
                    <div>
                      <p className="font-bold text-slate-800 text-sm">Sign Out</p>
                      <p className="text-xs text-slate-500 mt-0.5">Sign out from this device</p>
                    </div>
                    <button
                      onClick={logout}
                      className="flex items-center gap-2 px-4 py-2 bg-red-600 hover:bg-red-700 text-white font-bold rounded-xl text-sm transition-all"
                    >
                      <RiLogoutBoxLine size={15} /> Sign Out
                    </button>
                  </div>
                </div>
              </Section>
            </div>
          )}

        </div>
      </div>
    </div>
  );
};

export default Settings;
