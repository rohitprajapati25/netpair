import React from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import { useAccessControl } from "../contexts/AccessControlContext";

const ProtectedRoute = ({ children, allowedRoles, pageKey }) => {
  const { user, role, loading } = useAuth();
  const { hasAccess } = useAccessControl();

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-slate-50 gap-4">
        <div className="w-10 h-10 border-3 border-blue-200 border-t-blue-600 rounded-full animate-spin" style={{ borderWidth: 3 }} />
        <p className="text-sm font-semibold text-slate-400">Loading...</p>
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/" replace />;
  }

  const userRole = role?.toLowerCase();

  // 1. Check role-level access (allowedRoles list)
  if (allowedRoles && !allowedRoles.includes(userRole)) {
    return <Navigate to={userRole === "employee" ? "/employee-dashboard" : "/dashboard"} replace />;
  }

  // 2. Check page-level access control (from AccessControl panel)
  //    SuperAdmin always bypasses this check
  if (pageKey && userRole !== "superadmin") {
    if (!hasAccess(userRole, pageKey)) {
      return (
        <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4 text-center px-6">
          <div className="w-16 h-16 bg-red-50 border-2 border-red-100 rounded-2xl flex items-center justify-center">
            <i className="ri-lock-line text-3xl text-red-400"></i>
          </div>
          <div>
            <h2 className="text-xl font-black text-slate-800">Access Restricted</h2>
            <p className="text-slate-500 text-sm mt-1">
              You don't have permission to view this page.
            </p>
            <p className="text-slate-400 text-xs mt-0.5">
              Contact your Super Admin to request access.
            </p>
          </div>
        </div>
      );
    }
  }

  return children;
};

export default ProtectedRoute;
