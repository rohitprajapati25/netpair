import React, { useState } from "react";
import { useAuth } from "../../contexts/AuthContext";
import Header from "../Header";
import "remixicon/fonts/remixicon.css";
import Sidedata from "./Sidedata";

const Sidebar = () => {
  const [collapsed, setCollapsed] = useState(false);
  const { role, user } = useAuth();

  const sidebarArray = [
    { navpath: "dashboard", icon: "ri-dashboard-line", data: "Dashboard" },
    { navpath: "employees", icon: "ri-user-2-line", data: "Employees" },
    { navpath: "attendance", icon: "ri-calendar-check-line", data: "Attendance" },
    { navpath: "leave", icon: "ri-survey-line", data: "Leave" },
    { navpath: "projects", icon: "ri-folder-line", data: "Projects" },
    { navpath: "tasktimesheet", icon: "ri-task-line", data: "Tasks-Timesheet" },
    { navpath: "assets", icon: "ri-archive-stack-line", data: "Assets" },
    { navpath: "reports", icon: "ri-survey-line", data: "Reports" },
    { navpath: "announcements", icon: "ri-megaphone-line", data: "Announcements" },
    { navpath: "settings", icon: "ri-equalizer-line", data: "Settings" },
  ];

  const roleAccess = {
    superadmin: ["dashboard", "employees", "attendance", "leave", "projects", "tasktimesheet", "assets", "reports", "announcements", "settings"],
    admin: ["dashboard", "employees", "attendance", "leave", "projects", "reports", "announcements"],
    hr: ["dashboard", "attendance", "leave", "projects", "tasktimesheet"],
    employee: ["dashboard", "leave", "tasktimesheet"],
  };

  const currentRole = role?.toLowerCase() || "";
  const allowedPaths = roleAccess[currentRole] || [];
  const filteredSidebar = sidebarArray.filter((item) => allowedPaths.includes(item.navpath));

  return (
    <div className="flex">
      <div
        className={`h-full bg-white border-r border-gray-300 transition-all duration-300 ${
          collapsed ? "w-20" : "w-72"
        }`}
      >
        {/* Logo Area */}
        <div className={`h-15 flex items-center border-b border-gray-300 px-3 relative group ${collapsed ? "justify-center" : "justify-between"}`}>
          
          <img
            src="/src/assets/imgs/image-removebg-preview.png"
            className={`h-10 transition-all duration-300 ${collapsed ? "block" : "block"}`}
            alt="logo"
          />

          <i
            onClick={() => setCollapsed(!collapsed)}
            className={`ri-layout-left-line text-2xl hover:bg-gray-200 p-1 px-3.5 rounded-lg cursor-e-resize
              ${collapsed 
                ? "absolute px-3.5 flex items-center justify-center opacity-0 group-hover:opacity-100 bg-white z-10" 
                : "relative opacity-100 bg-white"
              }`}
          ></i>

        </div>

        <div className="overflow-y-auto h-[100vh] p-2">
          {filteredSidebar.length > 0 &&
            filteredSidebar.map((item, index) => (
              <div className="mt-1" key={index}>
                <Sidedata
                  navpath={item.navpath}
                  icon={item.icon}
                  data={item.data}
                  coll={collapsed}
                />
              </div>
            ))}
        </div>
      </div>

      <Header />
    </div>
  );
};

export default Sidebar;