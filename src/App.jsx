import React from "react";
import { Routes, Route } from "react-router-dom";

import Home from "./user/Home/Home";
import Lform from "./components/Login/Lform";
import AuthLayout from "./user/AuthLayout";
import Rform from "./components/Registration/Rform";
import Fform from "./components/Forgot/Fform";
import ResetPassword from "./components/Forgot/ResetPassword";

import Dashboard from "./user/Dash/Dashboard";
import Employees from "./user/Admin_Employess/Employees";
import Attendance from "./user/Admin_Attendance/Attendance";
import Leave from "./user/Admin_leave_page/Leave";
import TaskTimesheet from "./user/Admin_Task_Timesheet/TaskTimesheet";
import Projects from "./user/Admin_Projects/Projects";
import Asset from "./user/Admin_Asset_Page/Asset";
import Reports from "./user/Admin_Reports/Reports";
import Announcements from "./user/Admin_Announcements/Announcements";
import Settings from "./user/Settings/Settings";
import HRs from "./user/Admin_HR/HRs";
import Admins from "./user/Admin_Admins/Admins";
import MyTasks from "./user/Employee_MyTasks/MyTasks";
import MyLeave from "./user/Employee_MyLeave/MyLeave";
import MyAttendance from "./user/Employee_MyAttendance/MyAttendance";
import EmployeeDashboard from "./user/Employee_Dashboard/EmployeeDashboard";
import MyProjects from "./user/Employee_MyProjects/MyProjects";
import AuditLogs from "./user/SuperAdmin_AuditLogs/AuditLogs";
import AccessControl from "./user/SuperAdmin_AccessControl/AccessControl";
import CalendarPage from "./user/Calendar/Calendar";

import NotFound from "./components/NotFound";
import ProtectedRoute from "./components/ProtectedRoute";
import { ROLES } from "./constants/roles";

const SUPER_ONLY   = [ROLES.SUPER_ADMIN];
const ADMIN_ROLES  = [ROLES.SUPER_ADMIN, ROLES.ADMIN];
const MANAGE_ROLES = [ROLES.SUPER_ADMIN, ROLES.ADMIN, ROLES.HR];
const ALL_STAFF    = [ROLES.SUPER_ADMIN, ROLES.ADMIN, ROLES.HR, ROLES.EMPLOYEE];

const App = () => {
  return (
    <Routes>
      {/* Public */}
      <Route path="/" element={<AuthLayout><Lform /></AuthLayout>} />
      <Route path="/employee/registration" element={<AuthLayout><Rform /></AuthLayout>} />
      <Route path="/forgot" element={<AuthLayout><Fform /></AuthLayout>} />
      <Route path="/reset-password/:token" element={<AuthLayout><ResetPassword /></AuthLayout>} />

      {/* Protected layout shell */}
      <Route element={<ProtectedRoute><Home /></ProtectedRoute>}>

        <Route path="/dashboard" element={
          <ProtectedRoute allowedRoles={MANAGE_ROLES} pageKey="dashboard"><Dashboard /></ProtectedRoute>
        } />
        <Route path="/employees" element={
          <ProtectedRoute allowedRoles={MANAGE_ROLES} pageKey="employees"><Employees /></ProtectedRoute>
        } />
        <Route path="/hrs" element={
          <ProtectedRoute allowedRoles={ADMIN_ROLES} pageKey="hrs"><HRs /></ProtectedRoute>
        } />
        <Route path="/admins" element={
          <ProtectedRoute allowedRoles={SUPER_ONLY}><Admins /></ProtectedRoute>
        } />
        <Route path="/audit-logs" element={
          <ProtectedRoute allowedRoles={SUPER_ONLY}><AuditLogs /></ProtectedRoute>
        } />
        <Route path="/access-control" element={
          <ProtectedRoute allowedRoles={SUPER_ONLY}><AccessControl /></ProtectedRoute>
        } />
        <Route path="/assets" element={
          <ProtectedRoute allowedRoles={ADMIN_ROLES} pageKey="assets"><Asset /></ProtectedRoute>
        } />
        <Route path="/reports" element={
          <ProtectedRoute allowedRoles={ADMIN_ROLES} pageKey="reports"><Reports /></ProtectedRoute>
        } />
        <Route path="/announcements" element={
          <ProtectedRoute allowedRoles={ALL_STAFF} pageKey="announcements"><Announcements /></ProtectedRoute>
        } />
        <Route path="/attendance" element={
          <ProtectedRoute allowedRoles={MANAGE_ROLES} pageKey="attendance"><Attendance /></ProtectedRoute>
        } />
        <Route path="/leave" element={
          <ProtectedRoute allowedRoles={MANAGE_ROLES} pageKey="leave"><Leave /></ProtectedRoute>
        } />
        <Route path="/projects" element={
          <ProtectedRoute allowedRoles={MANAGE_ROLES} pageKey="projects"><Projects /></ProtectedRoute>
        } />
        <Route path="/tasktimesheet" element={
          <ProtectedRoute allowedRoles={MANAGE_ROLES} pageKey="tasktimesheet"><TaskTimesheet /></ProtectedRoute>
        } />
        <Route path="/employee-dashboard" element={
          <ProtectedRoute allowedRoles={[ROLES.EMPLOYEE]} pageKey="employee-dashboard"><EmployeeDashboard /></ProtectedRoute>
        } />
        <Route path="/my-tasks" element={
          <ProtectedRoute allowedRoles={[ROLES.EMPLOYEE]} pageKey="my-tasks"><MyTasks /></ProtectedRoute>
        } />
        <Route path="/my-leave" element={
          <ProtectedRoute allowedRoles={[ROLES.EMPLOYEE]} pageKey="my-leave"><MyLeave /></ProtectedRoute>
        } />
        <Route path="/my-attendance" element={
          <ProtectedRoute allowedRoles={[ROLES.EMPLOYEE]} pageKey="my-attendance"><MyAttendance /></ProtectedRoute>
        } />
        <Route path="/my-projects" element={
          <ProtectedRoute allowedRoles={[ROLES.EMPLOYEE]} pageKey="my-projects"><MyProjects /></ProtectedRoute>
        } />
        <Route path="/settings" element={
          <ProtectedRoute allowedRoles={ALL_STAFF}><Settings /></ProtectedRoute>
        } />
        <Route path="/calendar" element={
          <ProtectedRoute allowedRoles={ALL_STAFF} pageKey="calendar"><CalendarPage /></ProtectedRoute>
        } />
      </Route>

      <Route path="*" element={<NotFound />} />
    </Routes>
  );
};

export default App;
