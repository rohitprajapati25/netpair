import React, { useState } from "react";
import Header from "../Header";
import "remixicon/fonts/remixicon.css";
import { NavLink } from "react-router-dom";
import Sidedata from "./Sidedata";
import Dashboard from "../../user/Dash/Dashboard";

const Sidebar = (props) => {
  const [collapsed, setCollapsed] = useState(false);

  const sidebarArray = [
    {
      navipath:"dashboard",
      icon : "ri-dashboard-line",
      data : "Dashboard",
      coll : collapsed
    },
     {
      navipath:"attendance",
      icon : "ri-calendar-check-line",
      data : "Attendance",
      coll : collapsed
    },
     {
      navipath:"leave",
      icon : "ri-survey-line",
      data : "Leave",
      coll : collapsed
    }
  ];
  console.log(sidebarArray);
  
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
                  ? "opacity-0 hover:opacity-100 px-4 text-2xl"
                  : "opacity-100 px-4"
              }
            `}
          ></i>
        </div>

        <div className="p-2">
             {sidebarArray.map(function(elems,ind){
              return <div key={ind}>
                  <Sidedata navipath={elems.navipath} icon={elems.icon} data={elems.data} coll={elems.coll}/>
             
                </div>
              })}
        </div> 
      </div>
      

      <Header />
      
   
      
    </div>
  );
};

export default Sidebar;
