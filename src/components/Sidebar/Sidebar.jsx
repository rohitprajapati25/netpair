import React, { useState, useEffect } from "react";
import { useAuth } from "../../contexts/AuthContext";
import { useAccessControl } from "../../contexts/AccessControlContext";
import Header from "../Header";
import "remixicon/fonts/remixicon.css";
import Sidedata from "./Sidedata";
import logo  from "../../assets/imgs/logo.png";
import logo2 from "../../assets/imgs/logo2.png";

// ── Role-based nav config ─────────────────────────────────────────────────────
const NAV_GROUPS = {
  superadmin: [
    {
      label: "Overview",
      items: [
        { navpath: "dashboard",      icon: "ri-dashboard-fill",      data: "Dashboard" },
      ],
    },
    {
      label: "People",
      items: [
        { navpath: "employees",      icon: "ri-team-fill",            data: "Employees" },
        { navpath: "hrs",            icon: "ri-user-star-fill",       data: "HR Team" },
        { navpath: "admins",         icon: "ri-shield-user-fill",     data: "Admins" },
      ],
    },
    {
      label: "Operations",
      items: [
        { navpath: "attendance",     icon: "ri-calendar-check-fill",  data: "Attendance" },
        { navpath: "leave",          icon: "ri-survey-fill",          data: "Leave" },
        { navpath: "projects",       icon: "ri-folders-fill",         data: "Projects" },
        { navpath: "tasktimesheet",  icon: "ri-task-fill",            data: "Tasks & Timesheets" },
        { navpath: "assets",         icon: "ri-computer-fill",        data: "Assets" },
      ],
    },
    {
      label: "Insights",
      items: [
        { navpath: "reports",        icon: "ri-file-chart-fill",      data: "Reports" },
        { navpath: "announcements",  icon: "ri-megaphone-fill",       data: "Announcements" },
        { navpath: "audit-logs",     icon: "ri-file-list-3-fill",     data: "Audit Logs" },
        { navpath: "calendar",       icon: "ri-calendar-event-fill",  data: "Holiday Calendar" },
      ],
    },
    {
      label: "System",
      items: [
        { navpath: "access-control", icon: "ri-shield-keyhole-fill",  data: "Access Control" },
        { navpath: "settings",       icon: "ri-settings-4-fill",      data: "Settings" },
      ],
    },
  ],

  admin: [
    {
      label: "Overview",
      items: [
        { navpath: "dashboard",      icon: "ri-dashboard-fill",      data: "Dashboard" },
      ],
    },
    {
      label: "People",
      items: [
        { navpath: "employees",      icon: "ri-team-fill",            data: "Employees" },
        { navpath: "hrs",            icon: "ri-user-star-fill",       data: "HR Team" },
      ],
    },
    {
      label: "Operations",
      items: [
        { navpath: "attendance",     icon: "ri-calendar-check-fill",  data: "Attendance" },
        { navpath: "leave",          icon: "ri-survey-fill",          data: "Leave" },
        { navpath: "projects",       icon: "ri-folders-fill",         data: "Projects" },
        { navpath: "tasktimesheet",  icon: "ri-task-fill",            data: "Tasks & Timesheets" },
        { navpath: "assets",         icon: "ri-computer-fill",        data: "Assets" },
      ],
    },
    {
      label: "Insights",
      items: [
        { navpath: "reports",        icon: "ri-file-chart-fill",      data: "Reports" },
        { navpath: "announcements",  icon: "ri-megaphone-fill",       data: "Announcements" },
        { navpath: "calendar",       icon: "ri-calendar-event-fill",  data: "Holiday Calendar" },
      ],
    },
    {
      label: "Account",
      items: [
        { navpath: "settings",       icon: "ri-settings-4-fill",      data: "Settings" },
      ],
    },
  ],

  hr: [
    {
      label: "Overview",
      items: [
        { navpath: "dashboard",      icon: "ri-dashboard-fill",      data: "Dashboard" },
      ],
    },
    {
      label: "People",
      items: [
        { navpath: "employees",      icon: "ri-team-fill",            data: "Employees" },
      ],
    },
    {
      label: "Operations",
      items: [
        { navpath: "attendance",     icon: "ri-calendar-check-fill",  data: "Attendance" },
        { navpath: "leave",          icon: "ri-survey-fill",          data: "Leave" },
        { navpath: "projects",       icon: "ri-folders-fill",         data: "Projects" },
        { navpath: "tasktimesheet",  icon: "ri-task-fill",            data: "Tasks & Timesheets" },
      ],
    },
    {
      label: "Insights",
      items: [
        { navpath: "announcements",  icon: "ri-megaphone-fill",       data: "Announcements" },
        { navpath: "calendar",       icon: "ri-calendar-event-fill",  data: "Holiday Calendar" },
      ],
    },
    {
      label: "Account",
      items: [
        { navpath: "settings",       icon: "ri-settings-4-fill",      data: "Settings" },
      ],
    },
  ],

  employee: [
    {
      label: "Overview",
      items: [
        { navpath: "employee-dashboard", icon: "ri-dashboard-fill",       data: "Dashboard" },
      ],
    },
    {
      label: "My Work",
      items: [
        { navpath: "my-tasks",           icon: "ri-checkbox-circle-fill", data: "My Tasks" },
        { navpath: "my-projects",        icon: "ri-folders-fill",         data: "My Projects" },
        { navpath: "my-leave",           icon: "ri-survey-line",          data: "My Leave" },
        { navpath: "my-attendance",      icon: "ri-calendar-check-line",  data: "My Attendance" },
      ],
    },
    {
      label: "Info",
      items: [
        { navpath: "announcements",      icon: "ri-megaphone-fill",       data: "Announcements" },
        { navpath: "calendar",           icon: "ri-calendar-event-fill",  data: "Holiday Calendar" },
      ],
    },
    {
      label: "Account",
      items: [
        { navpath: "settings",           icon: "ri-settings-4-fill",      data: "Settings" },
      ],
    },
  ],
};

// ── Always-visible pages per role (cannot be disabled by Access Control) ──────
const ALWAYS_VISIBLE_MAP = {
  superadmin: null, // all pages — handled separately
  admin:      new Set(["dashboard", "settings"]),
  hr:         new Set(["dashboard", "settings"]),
  employee:   new Set(["employee-dashboard", "my-tasks", "my-leave", "my-attendance", "my-projects", "calendar", "settings"]),
};

// ── SidebarContent — defined OUTSIDE Sidebar to prevent remounting ────────────
const SidebarContent = ({ groups, collapsed, setCollapsed, setMobileOpen, onNavClick }) => (
  <>
    {/* ── Logo / Toggle Header ── */}
    <div className={`h-16 lg:h-20 flex items-center border-b border-slate-100 shrink-0 ${
      collapsed ? "justify-center px-2" : "justify-between px-4"
    }`}>

      {collapsed ? (
        /* ── COLLAPSED: logo2 is the clickable expand trigger (ChatGPT style) ── */
        <button
          onClick={() => setCollapsed(false)}
          className="flex items-center justify-center w-10 h-10 rounded-xl hover:bg-slate-100 transition-all duration-200 group"
          title="Expand sidebar"
        >
          <img
            src={logo2}
            alt="Expand"
            className="w-8 h-8 object-contain group-hover:scale-110 transition-transform duration-200"
          />
        </button>
      ) : (
        /* ── EXPANDED: full logo + collapse arrow button ── */
        <>
          <img
            src={logo}
            alt="NetPair IMS"
            className="h-8 lg:h-9 w-auto object-contain"
          />
          <div className="flex items-center gap-1">
            {/* Desktop collapse button */}
            <button
              onClick={() => setCollapsed(true)}
              className="hidden lg:flex items-center justify-center p-2 rounded-xl hover:bg-slate-100 transition-all text-slate-400 hover:text-slate-700"
              title="Collapse sidebar"
            >
              <i className="ri-indent-decrease text-lg"></i>
            </button>
            {/* Mobile close button */}
            <button
              onClick={() => setMobileOpen(false)}
              className="lg:hidden flex items-center justify-center p-2 rounded-xl hover:bg-slate-100 text-slate-500"
            >
              <i className="ri-close-line text-xl"></i>
            </button>
          </div>
        </>
      )}
    </div>

    {/* ── Nav Groups ── */}
    <nav className="flex-1 overflow-y-auto overflow-x-hidden py-3 custom-scrollbar">
      {groups.map((group, gi) => (
        <div key={gi} className={gi > 0 ? "mt-1" : ""}>
          {/* Group label — only when expanded */}
          {!collapsed && (
            <p className="px-5 pt-3 pb-1.5 text-[9px] font-black text-slate-400 uppercase tracking-widest">
              {group.label}
            </p>
          )}
          {/* Divider between groups when collapsed */}
          {collapsed && gi > 0 && (
            <div className="mx-3 my-2 border-t border-slate-100" />
          )}

          <div className={collapsed ? "flex flex-col items-center gap-0.5 px-2" : "px-3 space-y-0.5"}>
            {group.items.map((item, idx) => (
              <Sidedata
                key={idx}
                navpath={item.navpath}
                icon={item.icon}
                data={item.data}
                coll={collapsed}
                onNavClick={onNavClick}
              />
            ))}
          </div>
        </div>
      ))}
    </nav>

    {/* ── Footer ── */}
    {!collapsed && (
      <div className="p-4 border-t border-slate-100 shrink-0">
        <p className="text-[9px] font-black text-slate-300 uppercase tracking-widest text-center">
          v1.0 · NetPair Infotech
        </p>
      </div>
    )}
  </>
);

// ── Main Sidebar component ────────────────────────────────────────────────────
const Sidebar = () => {
  const [collapsed,  setCollapsed]  = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const { role } = useAuth();
  const { getAllowedPages } = useAccessControl();

  // Close mobile drawer on resize to desktop
  useEffect(() => {
    const onResize = () => { if (window.innerWidth >= 1024) setMobileOpen(false); };
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, []);

  const currentRole = role?.toLowerCase() || "employee";
  const rawGroups   = NAV_GROUPS[currentRole] || NAV_GROUPS.employee;
  const alwaysSet   = ALWAYS_VISIBLE_MAP[currentRole];
  const allowedPages = getAllowedPages(currentRole);

  // Build filtered groups
  const groups = rawGroups
    .map(group => ({
      ...group,
      items: group.items.filter(item =>
        // SuperAdmin: alwaysSet is null → show everything
        alwaysSet === null ||
        alwaysSet.has(item.navpath) ||
        allowedPages.includes(item.navpath)
      ),
    }))
    .filter(group => group.items.length > 0);

  const sharedProps = { groups, collapsed, setCollapsed, setMobileOpen };

  return (
    <div className="flex h-screen w-screen overflow-hidden bg-slate-50">

      {/* ── DESKTOP SIDEBAR ── */}
      <aside className={`
        hidden lg:flex flex-col h-screen bg-white border-r border-slate-200
        transition-all duration-300 ease-in-out shrink-0
        ${collapsed ? "w-[72px]" : "w-64 xl:w-72"}
      `}>
        <SidebarContent {...sharedProps} />
      </aside>

      {/* ── MOBILE OVERLAY ── */}
      {mobileOpen && (
        <div
          className="fixed inset-0 bg-black/40 z-40 lg:hidden"
          onClick={() => setMobileOpen(false)}
        />
      )}

      {/* ── MOBILE DRAWER ── */}
      <aside className={`
        fixed top-0 left-0 h-full w-72 bg-white border-r border-slate-200
        z-50 flex flex-col transition-transform duration-300 ease-in-out lg:hidden
        ${mobileOpen ? "translate-x-0" : "-translate-x-full"}
      `}>
        <SidebarContent {...sharedProps} onNavClick={() => setMobileOpen(false)} />
      </aside>

      {/* ── MAIN CONTENT (Header + Outlet) ── */}
      <main className="flex-1 flex flex-col h-screen overflow-hidden min-w-0">
        <Header onMenuClick={() => setMobileOpen(true)} />
      </main>
    </div>
  );
};

export default Sidebar;
