import React from "react";
import { Routes, Route } from "react-router-dom";

import Home from "./user/Home/Home";
import Lform from "./components/Login/Lform";
import AuthLayout from "./user/AuthLayout";
import Rform from "./components/Registration/Rform";
import Fform from "./components/Forgot/Fform";

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

import NotFound from "./components/NotFound";
import ProtectedRoute from "./components/ProtectedRoute";
import { ROLES } from "../../backend/constants/roles";

const App = () => {
  return (
    <Routes>
      <Route path="/" element={<AuthLayout children={<Lform />} />} />
      <Route path="/employee/registration" element={<AuthLayout children={<Rform />} />} />
      <Route path="/forgot" element={<AuthLayout children={<Fform />} />} />

      <Route element={<ProtectedRoute><Home /></ProtectedRoute>}>

        <Route path="/dashboard" element={
          <ProtectedRoute allowedRoles={[ROLES.SUPER_ADMIN, ROLES.ADMIN]}>
            <Dashboard />
          </ProtectedRoute>
        } />

        <Route path="/employees" element={
          <ProtectedRoute allowedRoles={[ROLES.SUPER_ADMIN, ROLES.ADMIN]}>
            <Employees />
          </ProtectedRoute>
        } />
        
        <Route path="/attendance" element={
          <ProtectedRoute allowedRoles={[ROLES.SUPER_ADMIN, ROLES.ADMIN, ROLES.HR]}>
            <Attendance />
          </ProtectedRoute>
        } />
        
        <Route path="/leave" element={<Leave />} />
        <Route path="/projects" element={<Projects />} />
        <Route path="/tasktimesheet" element={<TaskTimesheet />} />
        <Route path="/assets" element={
          <ProtectedRoute allowedRoles={[ROLES.SUPER_ADMIN, ROLES.ADMIN, ROLES.HR]}>
            <Asset />
          </ProtectedRoute>
        } />
        <Route path="/reports" element={
          <ProtectedRoute allowedRoles={[ROLES.SUPER_ADMIN, ROLES.ADMIN, ROLES.HR]}>
            <Reports />
          </ProtectedRoute>
        } />
        <Route path="/announcements" element={
          <ProtectedRoute allowedRoles={[ROLES.SUPER_ADMIN, ROLES.ADMIN]}>
            <Announcements />
          </ProtectedRoute>
        } />
        <Route path="/settings" element={<Settings />} />
      </Route>

      <Route path="*" element={<NotFound />} />
    </Routes>
  );
};

export default App;


// import React from "react";
// import { Routes, Route } from "react-router-dom";

// import Home from "./user/Home/Home";
// import Lform from "./components/Login/Lform";
// import AuthLayout from "./user/AuthLayout";
// import Rform from "./components/Registration/Rform";
// import Fform from "./components/Forgot/Fform";

// import Dashboard from "./user/Dash/Dashboard";
// import Employees from "./user/Admin_Employess/Employees";
// import Attendance from "./user/Admin_Attendance/Attendance";
// import Leave from "./user/Admin_leave_page/Leave";
// import TaskTimesheet from "./user/Admin_Task_Timesheet/TaskTimesheet";
// import Projects from "./user/Admin_Projects/Projects";
// import Asset from "./user/Admin_Asset_Page/Asset";
// import Reports from "./user/Admin_Reports/Reports";
// import Announcements from "./user/Admin_Announcements/Announcements";
// import Settings from "./user/Settings/Settings";

// import NotFound from "./components/NotFound";
// import ProtectedRoute from "./components/ProtectedRoute";

// const App = () => {
//   return (
//     <Routes>
//       {/* ✅ Public Routes */}
//       <Route path="/" element={<AuthLayout children={<Lform />} />} />
//       <Route path="/employee/registration" element={<AuthLayout children={<Rform />} />} />
//       <Route path="/forgot" element={<AuthLayout children={<Fform />} />} />

//       {/* ✅ Common Layout with Sidebar/Header for all logged-in users */}
//       <Route element={<ProtectedRoute><Home /></ProtectedRoute>}>
//         {/* ✅ SuperAdmin & Admin only */}
//         <Route path="/dashboard" element={
//           <ProtectedRoute allowedRoles={["SuperAdmin", "Admin"]}>
//             <Dashboard />
//           </ProtectedRoute>
//         } />
//         <Route path="/employees" element={
//           <ProtectedRoute allowedRoles={["SuperAdmin", "Admin"]}>
//             <Employees />
//           </ProtectedRoute>
//         } />
        
//         {/* ✅ HR + Admin */}
//         <Route path="/attendance" element={
//           <ProtectedRoute allowedRoles={["HR", "Admin", "SuperAdmin"]}>
//             <Attendance />
//           </ProtectedRoute>
//         } />
        
//         {/* ✅ All roles (SuperAdmin, Admin, HR, Employee) */}
//         <Route path="/leave" element={<Leave />} />
//         <Route path="/projects" element={<Projects />} />
//         <Route path="/tasktimesheet" element={<TaskTimesheet />} />
//         <Route path="/assets" element={
//           <ProtectedRoute allowedRoles={["SuperAdmin", "Admin", "HR"]}>
//             <Asset />
//           </ProtectedRoute>
//         } />
//         <Route path="/reports" element={
//           <ProtectedRoute allowedRoles={["SuperAdmin", "Admin"]}>
//             <Reports />
//           </ProtectedRoute>
//         } />
//         <Route path="/announcements" element={
//           <ProtectedRoute allowedRoles={["SuperAdmin", "Admin"]}>
//             <Announcements />
//           </ProtectedRoute>
//         } />
//         <Route path="/settings" element={<Settings />} />
//       </Route>

//       <Route path="*" element={<NotFound />} />
//     </Routes>
//   );
// };

// export default App;