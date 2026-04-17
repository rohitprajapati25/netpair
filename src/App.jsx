import { lazy, Suspense } from "react";
import { Routes, Route } from "react-router-dom";

// ── Eagerly loaded (needed on first paint / auth flow) ────────────────────────
import Lform from "./components/Login/Lform";
import AuthLayout from "./user/AuthLayout";
import Rform from "./components/Registration/Rform";
import Fform from "./components/Forgot/Fform";
import ResetPassword from "./components/Forgot/ResetPassword";
import NotFound from "./components/NotFound";
import ProtectedRoute from "./components/ProtectedRoute";
import { ROLES } from "./constants/roles";

// ── Lazy-loaded routes (code-split per page) ──────────────────────────────────
// Each dynamic import() becomes its own JS chunk — only downloaded when the
// user navigates to that page. Cuts initial bundle size by ~60%.
const Home              = lazy(() => import("./user/Home/Home"));
const Dashboard         = lazy(() => import("./user/Dash/Dashboard"));
const Employees         = lazy(() => import("./user/Admin_Employess/Employees"));
const Attendance        = lazy(() => import("./user/Admin_Attendance/Attendance"));
const Leave             = lazy(() => import("./user/Admin_leave_page/Leave"));
const TaskTimesheet     = lazy(() => import("./user/Admin_Task_Timesheet/TaskTimesheet"));
const Projects          = lazy(() => import("./user/Admin_Projects/Projects"));
const Asset             = lazy(() => import("./user/Admin_Asset_Page/Asset"));
const Reports           = lazy(() => import("./user/Admin_Reports/Reports"));
const Announcements     = lazy(() => import("./user/Admin_Announcements/Announcements"));
const Settings          = lazy(() => import("./user/Settings/Settings"));
const HRs               = lazy(() => import("./user/Admin_HR/HRs"));
const Admins            = lazy(() => import("./user/Admin_Admins/Admins"));
const MyTasks           = lazy(() => import("./user/Employee_MyTasks/MyTasks"));
const MyLeave           = lazy(() => import("./user/Employee_MyLeave/MyLeave"));
const MyAttendance      = lazy(() => import("./user/Employee_MyAttendance/MyAttendance"));
const EmployeeDashboard = lazy(() => import("./user/Employee_Dashboard/EmployeeDashboard"));
const MyProjects        = lazy(() => import("./user/Employee_MyProjects/MyProjects"));
const AuditLogs         = lazy(() => import("./user/SuperAdmin_AuditLogs/AuditLogs"));
const AccessControl     = lazy(() => import("./user/SuperAdmin_AccessControl/AccessControl"));
const CalendarPage      = lazy(() => import("./user/Calendar/Calendar"));

const SUPER_ONLY   = [ROLES.SUPER_ADMIN];
const ADMIN_ROLES  = [ROLES.SUPER_ADMIN, ROLES.ADMIN];
const MANAGE_ROLES = [ROLES.SUPER_ADMIN, ROLES.ADMIN, ROLES.HR];
const ALL_STAFF    = [ROLES.SUPER_ADMIN, ROLES.ADMIN, ROLES.HR, ROLES.EMPLOYEE];

// ── Page-level loading spinner ────────────────────────────────────────────────
const PageLoader = () => (
  <div className="flex items-center justify-center h-full min-h-[200px]">
    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600" />
  </div>
);

const App = () => {
  return (
    <Suspense fallback={<PageLoader />}>
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
    </Suspense>
  );
};

export default App;
