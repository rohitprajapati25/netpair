import React, { useState } from "react";
import Header from "./Header";
import "remixicon/fonts/remixicon.css";
import { NavLink } from "react-router-dom";

const Sidebar = () => {
  const [collapsed, setCollapsed] = useState(false);

  return (
    <div className="flex">
      <div
        className={`h-screen bg-white border-r border-gray-300
        transition-all duration-300
        ${collapsed ? "w-20" : "w-75"}`}
      >
      
        <div className="h-15 flex items-center justify-between border-b border-gray-300 relative group">

          <img
            src="src/assets/imgs/image-removebg-preview.png"
            className="h-10 px-2"
            alt="logo"
          />

          <i
            onClick={() => setCollapsed(!collapsed)}
            className={`
              ri-layout-left-line absolute right-2 text-2xl
              hover:bg-gray-100 p-1 rounded-lg cursor-e-resize
              transition-opacity duration-200
              ${
                collapsed
                  ? "opacity-0 group-hover:opacity-100 px-4 text-2xl"
                  : "opacity-100 px-4"
              }
            `}
          ></i>
        </div>

        <div className="p-2">
          <NavLink to="/dashboard">
            <div
            className={`h-12 flex items-center p-2 mt-2 rounded
            hover:bg-gray-100 
            ${collapsed ? "justify-center" : "gap-3"}`}
          >
            <i className="ri-dashboard-line text-2xl"></i>
            {!collapsed && <p className="text-lg">Dashboard</p>}
          </div>
          </NavLink>

          <div
            className={`h-12 flex items-center p-2 mt-2 rounded
            hover:bg-gray-100
            ${collapsed ? "justify-center" : "gap-3"}`}
          >
           <i className="ri-calendar-check-line text-2xl"></i>
            {!collapsed && <p className="text-lg">Attendance</p>}
          </div>
        </div>
      </div>
      

      <Header />
      
   
      
    </div>
  );
};

export default Sidebar;
