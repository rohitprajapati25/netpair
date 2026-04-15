import React, { createContext, useContext, useState, useEffect, useCallback } from "react";

// ── All manageable pages with metadata ───────────────────────────────────────
export const ALL_PAGES = [
  // Admin-manageable pages
  { key: "dashboard",     label: "Dashboard",          icon: "ri-dashboard-fill",      group: "Overview",    roles: ["admin", "hr"] },
  { key: "employees",     label: "Employees",          icon: "ri-team-fill",            group: "People",      roles: ["admin", "hr"] },
  { key: "hrs",           label: "HR Team",            icon: "ri-user-star-fill",       group: "People",      roles: ["admin"] },
  { key: "attendance",    label: "Attendance",         icon: "ri-calendar-check-fill",  group: "Operations",  roles: ["admin", "hr"] },
  { key: "leave",         label: "Leave",              icon: "ri-survey-fill",          group: "Operations",  roles: ["admin", "hr"] },
  { key: "projects",      label: "Projects",           icon: "ri-folders-fill",         group: "Operations",  roles: ["admin", "hr"] },
  { key: "tasktimesheet", label: "Tasks & Timesheets", icon: "ri-task-fill",            group: "Operations",  roles: ["admin", "hr"] },
  { key: "assets",        label: "Assets",             icon: "ri-computer-fill",        group: "Operations",  roles: ["admin"] },
  { key: "reports",       label: "Reports",            icon: "ri-file-chart-fill",      group: "Insights",    roles: ["admin"] },
  { key: "announcements", label: "Announcements",      icon: "ri-megaphone-fill",       group: "Insights",    roles: ["admin", "hr", "employee"] },
  { key: "calendar",      label: "Holiday Calendar",   icon: "ri-calendar-event-fill",  group: "Insights",    roles: ["admin", "hr", "employee"] },

  // Employee-manageable pages
  { key: "employee-dashboard", label: "Employee Dashboard", icon: "ri-dashboard-fill",  group: "Overview",  roles: ["employee"] },
  { key: "my-tasks",      label: "My Tasks",           icon: "ri-checkbox-circle-fill", group: "My Work",     roles: ["employee"] },
  { key: "my-projects",   label: "My Projects",        icon: "ri-folders-fill",         group: "My Work",     roles: ["employee"] },
  { key: "my-leave",      label: "My Leave",           icon: "ri-survey-line",          group: "My Work",     roles: ["employee"] },
  { key: "my-attendance", label: "My Attendance",      icon: "ri-calendar-check-line",  group: "My Work",     roles: ["employee"] },
];

// ── Default permissions (what each role can see by default) ──────────────────
const DEFAULT_PERMISSIONS = {
  admin: {
    dashboard: true, employees: true, hrs: true,
    attendance: true, leave: true, projects: true,
    tasktimesheet: true, assets: true, reports: true, announcements: true, calendar: true,
  },
  hr: {
    dashboard: true, employees: true,
    attendance: true, leave: true, projects: true,
    tasktimesheet: true, announcements: true, calendar: true,
  },
  employee: {
    "employee-dashboard": true,
    "my-tasks": true, "my-leave": true, "my-attendance": true, "my-projects": true,
    announcements: true, calendar: true,
  },
};

const STORAGE_KEY = "ims_access_permissions";

// ── Context ───────────────────────────────────────────────────────────────────
const AccessControlContext = createContext(null);

export const AccessControlProvider = ({ children }) => {
  const [permissions, setPermissions] = useState(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      return stored ? JSON.parse(stored) : DEFAULT_PERMISSIONS;
    } catch {
      return DEFAULT_PERMISSIONS;
    }
  });

  // Persist to localStorage whenever permissions change
  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(permissions));
  }, [permissions]);

  // Toggle a single page permission for a role
  const togglePermission = useCallback((role, pageKey) => {
    setPermissions(prev => ({
      ...prev,
      [role]: {
        ...prev[role],
        [pageKey]: !prev[role]?.[pageKey],
      },
    }));
  }, []);

  // Set all permissions for a role at once
  const setRolePermissions = useCallback((role, perms) => {
    setPermissions(prev => ({ ...prev, [role]: perms }));
  }, []);

  // Reset a role to defaults
  const resetRole = useCallback((role) => {
    setPermissions(prev => ({ ...prev, [role]: DEFAULT_PERMISSIONS[role] || {} }));
  }, []);

  // Reset all to defaults
  const resetAll = useCallback(() => {
    setPermissions(DEFAULT_PERMISSIONS);
  }, []);

  // Check if a role has access to a page
  const hasAccess = useCallback((role, pageKey) => {
    if (!role) return false;
    const r = role.toLowerCase();
    // SuperAdmin always has full access
    if (r === "superadmin") return true;
    return permissions[r]?.[pageKey] === true;
  }, [permissions]);

  // Get allowed page keys for a role
  const getAllowedPages = useCallback((role) => {
    if (!role) return [];
    const r = role.toLowerCase();
    if (r === "superadmin") return ALL_PAGES.map(p => p.key);
    return Object.entries(permissions[r] || {})
      .filter(([, v]) => v === true)
      .map(([k]) => k);
  }, [permissions]);

  return (
    <AccessControlContext.Provider value={{
      permissions,
      togglePermission,
      setRolePermissions,
      resetRole,
      resetAll,
      hasAccess,
      getAllowedPages,
      DEFAULT_PERMISSIONS,
    }}>
      {children}
    </AccessControlContext.Provider>
  );
};

export const useAccessControl = () => {
  const ctx = useContext(AccessControlContext);
  if (!ctx) throw new Error("useAccessControl must be used inside AccessControlProvider");
  return ctx;
};
