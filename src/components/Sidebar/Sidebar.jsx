// import React, { useState } from "react";
// import { useAuth } from "../../contexts/AuthContext";
// import Header from "../Header";
// import "remixicon/fonts/remixicon.css";
// import Sidedata from "./Sidedata";

// const Sidebar = () => {
//   const [collapsed, setCollapsed] = useState(false);
//   const { role, user } = useAuth();

//   const sidebarArray = [
//     { navpath: "dashboard", icon: "ri-dashboard-line", data: "Dashboard" },
//     { navpath: "employees", icon: "ri-user-2-line", data: "Employees" },
//     { navpath: "attendance", icon: "ri-calendar-check-line", data: "Attendance" },
//     { navpath: "leave", icon: "ri-survey-line", data: "Leave" },
//     { navpath: "projects", icon: "ri-folder-line", data: "Projects" },
//     { navpath: "tasktimesheet", icon: "ri-task-line", data: "Tasks-Timesheet" },
//     { navpath: "assets", icon: "ri-archive-stack-line", data: "Assets" },
//     { navpath: "reports", icon: "ri-survey-line", data: "Reports" },
//     { navpath: "announcements", icon: "ri-megaphone-line", data: "Announcements" },
//     { navpath: "settings", icon: "ri-equalizer-line", data: "Settings" },
//   ];

//   const roleAccess = {
//     superadmin: ["dashboard", "employees", "attendance", "leave", "projects", "tasktimesheet", "assets", "reports", "announcements", "settings"],
//     admin: ["dashboard", "employees", "attendance", "leave", "projects", "reports", "announcements"],
//     hr: ["dashboard", "attendance", "leave", "projects", "tasktimesheet"],
//     employee: ["dashboard", "leave", "tasktimesheet"],
//   };

//   const currentRole = role?.toLowerCase() || "";
//   const allowedPaths = roleAccess[currentRole] || [];
//   const filteredSidebar = sidebarArray.filter((item) => allowedPaths.includes(item.navpath));

//   return (
//     <div className="flex">
//       <div
//         className={`h-full bg-white border-r border-gray-300 transition-all duration-300 ${
//           collapsed ? "w-20" : "w-72"
//         }`}
//       >
//         {/* Logo Area */}
//         <div className={`h-15 flex items-center border-b border-gray-300 px-3 relative group ${collapsed ? "justify-center" : "justify-between"}`}>
          
//           <img
//             src="/src/assets/imgs/image-removebg-preview.png"
//             className={`h-10 transition-all duration-300 ${collapsed ? "block" : "block"}`}
//             alt="logo"
//           />

//           <i
//             onClick={() => setCollapsed(!collapsed)}
//             className={`ri-layout-left-line text-2xl hover:bg-gray-200 p-1 px-3.5 rounded-lg cursor-e-resize
//               ${collapsed 
//                 ? "absolute px-3.5 flex items-center justify-center opacity-0 group-hover:opacity-100 bg-white z-10" 
//                 : "relative opacity-100 bg-white"
//               }`}
//           ></i>

//         </div>

//         <div className="overflow-y-auto h-[100vh] p-2">
//           {filteredSidebar.length > 0 &&
//             filteredSidebar.map((item, index) => (
//               <div className="mt-1" key={index}>
//                 <Sidedata
//                   navpath={item.navpath}
//                   icon={item.icon}
//                   data={item.data}
//                   coll={collapsed}
//                 />
//               </div>
//             ))}
//         </div>
//       </div>

//       <Header />
//     </div>
//   );
// };

// export default Sidebar;


import React, { useState } from "react";
import { useAuth } from "../../contexts/AuthContext";
import Header from "../Header";
import "remixicon/fonts/remixicon.css";
import Sidedata from "./Sidedata";

const Sidebar = () => {
  const [collapsed, setCollapsed] = useState(false);
  const { role } = useAuth();

  const sidebarArray = [
    { navpath: "dashboard", icon: "ri-dashboard-fill", data: "Dashboard" },
    { navpath: "employees", icon: "ri-team-fill", data: "Employees" },
    { navpath: "hrs", icon: "ri-team-fill", data: "Hrs" },
    { navpath: "admins", icon: "ri-team-fill", data: "Admins" },
    { navpath: "attendance", icon: "ri-calendar-check-fill", data: "Attendance" },
    { navpath: "leave", icon: "ri-survey-fill", data: "Leave" },
    { navpath: "projects", icon: "ri-folders-fill", data: "Projects" },
    { navpath: "tasktimesheet", icon: "ri-time-fill", data: "Timesheet" },
    { navpath: "assets", icon: "ri-computer-fill", data: "Assets" },
    { navpath: "reports", icon: "ri-file-chart-fill", data: "Reports" },
    { navpath: "announcements", icon: "ri-megaphone-fill", data: "Announcements" },
    { navpath: "settings", icon: "ri-settings-4-fill", data: "Settings" },
  ];

  const roleAccess = {
    superadmin: ["dashboard", "employees", "hrs" ,"admins", "attendance", "leave", "projects", "tasktimesheet", "assets", "reports", "announcements", "settings"],
    admin: ["dashboard", "employees", "attendance", "leave", "projects", "reports", "announcements"],
    hr: ["dashboard", "attendance", "leave", "projects", "tasktimesheet"],
    employee: ["dashboard", "leave", "tasktimesheet"],
  };

  const currentRole = role?.toLowerCase() || "";
  const allowedPaths = roleAccess[currentRole] || [];
  const filteredSidebar = sidebarArray.filter((item) => allowedPaths.includes(item.navpath));

  return (
    <div className="flex h-screen overflow-hidden bg-slate-50">
      <aside
        className={`h-screen bg-white border-r border-slate-200 transition-all duration-500 ease-in-out flex flex-col z-50 ${
          collapsed ? "w-20" : "w-72"
        }`}
      >
        {/* Logo Section */}
        <div className="h-20 flex items-center px-5 justify-between border-b border-slate-50">
          {!collapsed && (
            <img src="/src/assets/imgs/logo.png" className="h-10 animate-fade-in" alt="logo" />
          )}
          <button 
            onClick={() => setCollapsed(!collapsed)}
            className={`p-2 rounded-xl hover:bg-slate-100 transition-colors text-slate-500 ${collapsed ? "mx-auto" : ""}`}
          >
            <i className={collapsed ? "ri-indent-increase" : "ri-indent-decrease"}></i>
          </button>
        </div>

        {/* Navigation - Custom Scrollbar */}
        <nav className="flex-1 overflow-y-auto overflow-x-hidden p-3 space-y-1 custom-scrollbar">
          {filteredSidebar.map((item, index) => (
            <Sidedata
              key={index}
              navpath={item.navpath}
              icon={item.icon}
              data={item.data}
              coll={collapsed}
            />
          ))}
        </nav>
        
        {/* Sidebar Footer (Optional) */}
        {!collapsed && (
          <div className="p-5 border-t border-slate-50">
            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest text-center">
              v1.0.4 © G97 AutoHub
            </p>
          </div>
        )}
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 flex flex-col h-screen overflow-hidden">
        <Header />
      </main>
    </div>
  );
};

export default Sidebar;