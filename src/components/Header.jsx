import React, { useState, useEffect, useRef } from 'react';
import { Outlet, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import axios from 'axios';

// ── Route label map ───────────────────────────────────────────────────────────
const ROUTE_LABELS = {
  '/dashboard':          'Dashboard',
  '/employees':          'Employees',
  '/hrs':                'HR Team',
  '/admins':             'Admins',
  '/attendance':         'Attendance',
  '/leave':              'Leave Management',
  '/projects':           'Projects',
  '/tasktimesheet':      'Tasks & Timesheets',
  '/assets':             'Assets',
  '/reports':            'Reports',
  '/announcements':      'Announcements',
  '/audit-logs':         'Audit Logs',
  '/access-control':     'Access Control',
  '/settings':           'Settings',
  // Employee routes
  '/employee-dashboard': 'My Dashboard',
  '/my-tasks':           'My Tasks',
  '/my-leave':           'My Leave',
  '/my-attendance':      'My Attendance',
  '/my-projects':        'My Projects',
  '/calendar':           'Holiday Calendar',
};

// ── Role colors ───────────────────────────────────────────────────────────────
const ROLE_STYLE = {
  superadmin: { label: 'Super Admin', bg: 'bg-red-100',     text: 'text-red-700'     },
  admin:      { label: 'Admin',       bg: 'bg-indigo-100',  text: 'text-indigo-700'  },
  hr:         { label: 'HR Manager',  bg: 'bg-emerald-100', text: 'text-emerald-700' },
  employee:   { label: 'Employee',    bg: 'bg-slate-100',   text: 'text-slate-600'   },
};

// ── Live clock ────────────────────────────────────────────────────────────────
const useClock = () => {
  const [time, setTime] = useState(new Date());
  useEffect(() => {
    const t = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(t);
  }, []);
  return time;
};

// ── Click outside hook ────────────────────────────────────────────────────────
const useClickOutside = (ref, cb) => {
  useEffect(() => {
    const handler = (e) => { if (ref.current && !ref.current.contains(e.target)) cb(); };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, [ref, cb]);
};

// ── Main component ────────────────────────────────────────────────────────────
const Header = ({ onMenuClick }) => {
  const { user, token, logout } = useAuth();
  const location  = useLocation();
  const navigate  = useNavigate();
  const now       = useClock();

  const [profileOpen,      setProfileOpen]      = useState(false);
  const [notifOpen,        setNotifOpen]        = useState(false);
  const [notifications,    setNotifications]    = useState([]);
  const [unreadCount,      setUnreadCount]      = useState(0);
  const [notifLoading,     setNotifLoading]     = useState(false);

  const profileRef = useRef(null);
  const notifRef   = useRef(null);

  useClickOutside(profileRef, () => setProfileOpen(false));
  useClickOutside(notifRef,   () => setNotifOpen(false));

  const name      = user?.name  || 'User';
  const role      = user?.role?.toLowerCase() || 'employee';
  const roleCfg   = ROLE_STYLE[role] || ROLE_STYLE.employee;
  const pageLabel = ROUTE_LABELS[location.pathname] || '';
  const firstName = name.split(' ')[0];

  const isAdminRole    = role === 'superadmin' || role === 'admin';
  const isEmployeeRole = role === 'employee';

  // ── Fetch notifications ────────────────────────────────────────────────────
  // Admin/SuperAdmin → audit log HIGH alerts
  // Employee         → unread announcements
  const fetchNotifications = async () => {
    if (!token) return;
    try {
      setNotifLoading(true);
      if (isAdminRole) {
        const res = await axios.get(
          'http://localhost:5000/api/admin/audit-logs?limit=8&severity=HIGH&dateRange=today',
          { headers: { Authorization: `Bearer ${token}` } }
        );
        const logs = res.data.logs || [];
        setNotifications(logs);
        setUnreadCount(logs.length);
      } else {
        // Employee / HR — show latest announcements
        const res = await axios.get(
          'http://localhost:5000/api/admin/announcements?limit=8',
          { headers: { Authorization: `Bearer ${token}` } }
        );
        const items = res.data.announcements || [];
        setNotifications(items);
        setUnreadCount(items.length);
      }
    } catch {
      // silent
    } finally {
      setNotifLoading(false);
    }
  };

  useEffect(() => {
    fetchNotifications();
    // Refresh every 2 minutes
    const t = setInterval(fetchNotifications, 120000);
    return () => clearInterval(t);
  }, [token]);

  const handleNotifOpen = () => {
    setNotifOpen(v => !v);
    setProfileOpen(false);
    if (!notifOpen) setUnreadCount(0);
  };

  const handleProfileOpen = () => {
    setProfileOpen(v => !v);
    setNotifOpen(false);
  };

  const severityColor = (s) => ({
    HIGH:    'bg-red-100    text-red-700',
    WARNING: 'bg-amber-100  text-amber-700',
    INFO:    'bg-blue-100   text-blue-700',
  }[s] || 'bg-slate-100 text-slate-600');

  return (
    <div className="flex-1 flex flex-col h-full overflow-hidden">

      {/* ── TOP NAVBAR ── */}
      <header className="h-16 w-full flex items-center justify-between px-4 lg:px-6 bg-white border-b border-slate-200 shrink-0 gap-3">

        {/* ── Left ── */}
        <div className="flex items-center gap-3 min-w-0">
          {/* Mobile hamburger */}
          <button onClick={onMenuClick}
            className="lg:hidden p-2 rounded-xl hover:bg-slate-100 text-slate-600 shrink-0"
            aria-label="Open menu">
            <i className="ri-menu-line text-xl"></i>
          </button>

          {/* Page label / breadcrumb */}
          <div className="min-w-0">
            {pageLabel ? (
              <>
                <h2 className="text-sm lg:text-base font-black text-slate-800 leading-tight truncate">
                  {pageLabel}
                </h2>
                <p className="hidden sm:block text-[10px] text-slate-400 font-semibold">
                  {now.toLocaleDateString('en-US', { weekday: 'short', day: 'numeric', month: 'short', year: 'numeric' })}
                  &nbsp;·&nbsp;
                  <span className="font-black text-slate-600 tabular-nums">
                    {now.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', second: '2-digit' })}
                  </span>
                </p>
              </>
            ) : (
              <p className="text-sm font-black text-slate-800">
                Hello, {firstName} 👋
              </p>
            )}
          </div>
        </div>

        {/* ── Right ── */}
        <div className="flex items-center gap-1.5 lg:gap-2 shrink-0">

          {/* Quick nav shortcuts — desktop only, role-based */}
          {isAdminRole ? (
            <div className="hidden xl:flex items-center gap-1 mr-2">
              {[
                { path: '/attendance', icon: 'ri-calendar-check-line', label: 'Attendance' },
                { path: '/leave',      icon: 'ri-survey-line',          label: 'Leave'      },
                { path: '/reports',    icon: 'ri-file-chart-line',      label: 'Reports'    },
              ].map(item => (
                <button key={item.path}
                  onClick={() => navigate(item.path)}
                  title={item.label}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold transition-all ${
                    location.pathname === item.path
                      ? 'bg-blue-600 text-white shadow-sm'
                      : 'text-slate-500 hover:bg-slate-100 hover:text-slate-800'
                  }`}>
                  <i className={`${item.icon} text-sm`}></i>
                  <span className="hidden 2xl:inline">{item.label}</span>
                </button>
              ))}
            </div>
          ) : role === 'hr' ? (
            <div className="hidden xl:flex items-center gap-1 mr-2">
              {[
                { path: '/attendance', icon: 'ri-calendar-check-line', label: 'Attendance' },
                { path: '/leave',      icon: 'ri-survey-line',          label: 'Leave'      },
                { path: '/employees',  icon: 'ri-team-line',            label: 'Employees'  },
              ].map(item => (
                <button key={item.path}
                  onClick={() => navigate(item.path)}
                  title={item.label}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold transition-all ${
                    location.pathname === item.path
                      ? 'bg-emerald-600 text-white shadow-sm'
                      : 'text-slate-500 hover:bg-slate-100 hover:text-slate-800'
                  }`}>
                  <i className={`${item.icon} text-sm`}></i>
                  <span className="hidden 2xl:inline">{item.label}</span>
                </button>
              ))}
            </div>
          ) : isEmployeeRole ? (
            <div className="hidden xl:flex items-center gap-1 mr-2">
              {[
                { path: '/my-tasks',      icon: 'ri-checkbox-circle-line', label: 'My Tasks'   },
                { path: '/my-leave',      icon: 'ri-survey-line',           label: 'My Leave'   },
                { path: '/my-attendance', icon: 'ri-calendar-check-line',   label: 'Attendance' },
              ].map(item => (
                <button key={item.path}
                  onClick={() => navigate(item.path)}
                  title={item.label}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold transition-all ${
                    location.pathname === item.path
                      ? 'bg-indigo-600 text-white shadow-sm'
                      : 'text-slate-500 hover:bg-slate-100 hover:text-slate-800'
                  }`}>
                  <i className={`${item.icon} text-sm`}></i>
                  <span className="hidden 2xl:inline">{item.label}</span>
                </button>
              ))}
            </div>
          ) : null}

          {/* Notifications bell — all roles */}
          <div className="relative" ref={notifRef}>
            <button
              onClick={handleNotifOpen}
              className="relative p-2.5 rounded-xl hover:bg-slate-100 text-slate-500 hover:text-slate-800 transition-all"
              title={isAdminRole ? 'System Alerts' : 'Announcements'}
            >
              <i className="ri-notification-3-line text-lg"></i>
              {unreadCount > 0 && (
                <span className="absolute top-1.5 right-1.5 w-4 h-4 bg-red-500 text-white text-[9px] font-black rounded-full flex items-center justify-center leading-none">
                  {unreadCount > 9 ? '9+' : unreadCount}
                </span>
              )}
            </button>

            {/* Notification panel */}
            {notifOpen && (
              <div className="absolute right-0 top-full mt-2 w-80 bg-white rounded-2xl border border-slate-200 shadow-2xl z-50 overflow-hidden">

                {/* Panel header */}
                <div className="flex items-center justify-between px-4 py-3 border-b border-slate-100">
                  <h3 className="font-bold text-slate-800 text-sm">
                    {isAdminRole ? 'System Alerts' : 'Announcements'}
                  </h3>
                  <span className="text-[10px] text-slate-400 font-semibold">
                    {isAdminRole ? 'Today · HIGH severity' : `${notifications.length} latest`}
                  </span>
                </div>

                {/* Panel body */}
                <div className="max-h-80 overflow-y-auto custom-scrollbar">
                  {notifLoading ? (
                    <div className="flex items-center justify-center py-8">
                      <div className="w-5 h-5 border-2 border-blue-500 border-t-transparent rounded-full animate-spin" />
                    </div>

                  ) : notifications.length === 0 ? (
                    <div className="flex flex-col items-center justify-center py-10 text-slate-400">
                      <i className={`${isAdminRole ? 'ri-shield-check-line' : 'ri-megaphone-line'} text-3xl mb-2 ${isAdminRole ? 'text-emerald-400' : 'text-slate-300'}`}></i>
                      <p className="text-sm font-semibold text-slate-500">
                        {isAdminRole ? 'All clear!' : 'No announcements'}
                      </p>
                      <p className="text-xs mt-0.5 text-slate-400">
                        {isAdminRole ? 'No high-severity alerts today' : 'Check back later'}
                      </p>
                    </div>

                  ) : isAdminRole ? (
                    // ── Admin/SuperAdmin — audit log HIGH alerts ──────────────
                    notifications.map((n, i) => (
                      <div key={i} className="flex items-start gap-3 px-4 py-3 hover:bg-slate-50 transition-colors border-b border-slate-50 last:border-0">
                        <div className={`px-1.5 py-0.5 rounded text-[9px] font-black uppercase shrink-0 mt-0.5 ${severityColor(n.severity)}`}>
                          {n.severity}
                        </div>
                        <div className="min-w-0 flex-1">
                          <p className="text-xs font-semibold text-slate-800 truncate">
                            {(n.action || '').replace(/_/g, ' ')}
                          </p>
                          <p className="text-[10px] text-slate-400 truncate">{n.details}</p>
                          <p className="text-[9px] text-slate-300 mt-0.5">
                            {n.timestamp ? new Date(n.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : ''}
                          </p>
                        </div>
                      </div>
                    ))

                  ) : (
                    // ── Employee / HR — announcements with sender info ─────────
                    notifications.map((ann, i) => {
                      const priorityStyle = {
                        urgent:    'bg-red-100 text-red-700',
                        important: 'bg-amber-100 text-amber-700',
                        normal:    'bg-blue-100 text-blue-700',
                      }[ann.priority?.toLowerCase()] || 'bg-slate-100 text-slate-600';

                      const senderName   = ann.createdBy?.name || 'Admin';
                      const senderRole   = ann.createdBy?.role || 'admin';
                      const senderInitial = senderName.charAt(0).toUpperCase();

                      const senderBg = {
                        superadmin: 'from-red-500 to-rose-600',
                        admin:      'from-indigo-500 to-blue-600',
                        hr:         'from-emerald-500 to-teal-600',
                      }[senderRole?.toLowerCase()] || 'from-slate-500 to-slate-700';

                      const senderLabel = {
                        superadmin: 'Super Admin',
                        admin:      'Admin',
                        hr:         'HR',
                      }[senderRole?.toLowerCase()] || senderRole;

                      return (
                        <div
                          key={i}
                          className="flex items-start gap-3 px-4 py-3 hover:bg-slate-50 transition-colors border-b border-slate-50 last:border-0 cursor-pointer"
                          onClick={() => { setNotifOpen(false); navigate('/announcements'); }}
                        >
                          {/* Sender avatar */}
                          <div className={`w-8 h-8 bg-gradient-to-br ${senderBg} rounded-full flex items-center justify-center text-white text-xs font-bold shrink-0 mt-0.5`}>
                            {senderInitial}
                          </div>

                          {/* Content */}
                          <div className="min-w-0 flex-1">
                            {/* Title + priority badge */}
                            <div className="flex items-center justify-between gap-1.5 mb-0.5">
                              <p className="text-xs font-bold text-slate-800 truncate flex-1">
                                {ann.title}
                              </p>
                              <span className={`px-1.5 py-0.5 rounded text-[9px] font-black uppercase shrink-0 ${priorityStyle}`}>
                                {ann.priority || 'normal'}
                              </span>
                            </div>

                            {/* Message preview */}
                            <p className="text-[10px] text-slate-500 truncate leading-relaxed">
                              {ann.message}
                            </p>

                            {/* Sender name + time */}
                            <div className="flex items-center gap-1.5 mt-1">
                              <span className="text-[9px] font-bold text-slate-500">
                                {senderName}
                              </span>
                              <span className="text-[9px] text-slate-300">·</span>
                              <span className="text-[9px] text-slate-400 capitalize">
                                {senderLabel}
                              </span>
                              <span className="text-[9px] text-slate-300">·</span>
                              <span className="text-[9px] text-slate-400">
                                {ann.createdAt
                                  ? new Date(ann.createdAt).toLocaleDateString('en-US', { day: '2-digit', month: 'short' })
                                  : ''}
                              </span>
                            </div>
                          </div>
                        </div>
                      );
                    })
                  )}
                </div>

                {/* Panel footer */}
                <div className="px-4 py-2.5 border-t border-slate-100 bg-slate-50">
                  <button
                    onClick={() => { setNotifOpen(false); navigate(isAdminRole ? '/audit-logs' : '/announcements'); }}
                    className="w-full text-xs font-bold text-blue-600 hover:text-blue-700 transition-colors text-center"
                  >
                    {isAdminRole ? 'View all in Audit Logs →' : 'View all Announcements →'}
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Settings shortcut */}
          <button
            onClick={() => navigate('/settings')}
            title="Settings"
            className={`p-2.5 rounded-xl transition-all ${
              location.pathname === '/settings'
                ? 'bg-blue-600 text-white'
                : 'hover:bg-slate-100 text-slate-500 hover:text-slate-800'
            }`}>
            <i className="ri-settings-3-line text-lg"></i>
          </button>

          {/* Divider */}
          <div className="w-px h-6 bg-slate-200 mx-1" />

          {/* Profile dropdown */}
          <div className="relative" ref={profileRef}>
            <button
              onClick={handleProfileOpen}
              className="flex items-center gap-2 p-1.5 pr-3 rounded-2xl border border-slate-200 bg-slate-50 hover:bg-slate-100 transition-colors"
            >
              <img
                src={`https://ui-avatars.com/api/?name=${encodeURIComponent(name)}&background=4f46e5&color=fff&size=128&bold=true`}
                className="w-8 h-8 rounded-xl object-cover shrink-0"
                alt={name}
              />
              <div className="hidden sm:flex flex-col text-left">
                <p className="text-xs font-black text-slate-700 leading-none truncate max-w-[100px]">{name}</p>
                <span className={`text-[9px] font-black uppercase tracking-tight mt-0.5 px-1.5 py-0.5 rounded ${roleCfg.bg} ${roleCfg.text}`}>
                  {roleCfg.label}
                </span>
              </div>
              <i className={`ri-arrow-down-s-line text-slate-400 text-sm hidden sm:block transition-transform duration-200 ${profileOpen ? 'rotate-180' : ''}`}></i>
            </button>

            {/* Profile dropdown */}
            {profileOpen && (
              <div className="absolute right-0 top-full mt-2 w-52 bg-white rounded-2xl border border-slate-200 shadow-2xl z-50 overflow-hidden">
                {/* User info */}
                <div className="p-4 border-b border-slate-100 bg-gradient-to-br from-slate-50 to-white">
                  <div className="flex items-center gap-3">
                    <img
                      src={`https://ui-avatars.com/api/?name=${encodeURIComponent(name)}&background=4f46e5&color=fff&size=128&bold=true`}
                      className="w-10 h-10 rounded-xl object-cover"
                      alt={name}
                    />
                    <div className="min-w-0">
                      <p className="font-bold text-slate-800 text-sm truncate">{name}</p>
                      <span className={`text-[9px] font-black uppercase tracking-tight px-1.5 py-0.5 rounded ${roleCfg.bg} ${roleCfg.text}`}>
                        {roleCfg.label}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Menu items */}
                <div className="p-1.5">
                  <MenuItem icon="ri-user-settings-line" label="Profile Settings"
                    onClick={() => { setProfileOpen(false); navigate('/settings'); }} />
                  {isAdminRole && (
                    <MenuItem icon="ri-file-chart-line" label="Reports"
                      onClick={() => { setProfileOpen(false); navigate('/reports'); }} />
                  )}
                  {isEmployeeRole && (
                    <MenuItem icon="ri-dashboard-line" label="My Dashboard"
                      onClick={() => { setProfileOpen(false); navigate('/employee-dashboard'); }} />
                  )}
                </div>

                {/* Sign out */}
                <div className="p-1.5 border-t border-slate-100">
                  <button
                    onClick={() => { setProfileOpen(false); logout(); }}
                    className="w-full flex items-center gap-3 px-3 py-2.5 text-sm font-semibold text-rose-600 hover:bg-rose-50 rounded-xl transition-colors"
                  >
                    <i className="ri-logout-circle-r-line text-base"></i>
                    Sign Out
                  </button>
                </div>
              </div>
            )}
          </div>

        </div>
      </header>

      {/* ── PAGE CONTENT ── */}
      <div className="flex-1 overflow-y-auto custom-scrollbar">
        <div className="p-4 md:p-6 lg:p-8 max-w-[1600px] mx-auto">
          <Outlet />
        </div>
      </div>
    </div>
  );
};

const MenuItem = ({ icon, label, onClick }) => (
  <button onClick={onClick}
    className="w-full flex items-center gap-3 px-3 py-2.5 text-sm font-semibold text-slate-700 hover:bg-slate-100 rounded-xl transition-colors text-left">
    <i className={`${icon} text-base text-slate-400`}></i>
    {label}
  </button>
);

export default Header;
