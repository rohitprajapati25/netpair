// import React, { useState } from "react";

// const TimesheetFilters = ({ onFilter }) => {
//   const [search, setSearch] = useState("");
//   const [status, setStatus] = useState("");

//   const handleChange = (s, v) => {
//     if (s === "search") {
//       setSearch(v);
//       onFilter(v, status);
//     } else {
//       setStatus(v);
//       onFilter(search, v);
//     }
//   };

//   return (
//     <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-4 mb-6 flex flex-wrap items-center gap-4">
//       <div className="flex items-center gap-2 border border-gray-300 rounded-lg px-3 py-2 w-64 focus-within:ring-2 focus-within:ring-blue-500">
//         <i className="ri-search-line text-gray-500"></i>
//         <input
//           type="text"
//           placeholder="Search task or employee..."
//           className="outline-none w-full text-sm"
//           onChange={(e) => handleChange("search", e.target.value)}
//         />
//       </div>

//       <div className="flex items-center gap-2 border border-gray-300 rounded-lg px-3 py-2">
//         <i className="ri-filter-3-line text-gray-500"></i>
//         <select 
//           className="outline-none text-sm bg-transparent"
//           onChange={(e) => handleChange("status", e.target.value)}
//         >
//           <option value="">All Status</option>
//           <option>Completed</option>
//           <option>In Progress</option>
//           <option>Pending</option>
//           <option>Approval Pending</option>
//         </select>
//       </div>
//     </div>
//   );
// };

// export default TimesheetFilters;

import React from "react";
import { RiSearchLine, RiFilter3Line, RiRestartLine } from "react-icons/ri";

const TimesheetFilters = ({ filters, setFilters, total, activeTab = "tasks" }) => {
  
  const resetFilters = () => {
    setFilters({ search: "", status: "All" });
  };

  const taskStatuses      = ["All", "Todo", "In Progress", "Review", "Completed", "Blocked"];
  const timesheetStatuses = ["All", "Submitted", "Approved", "Rejected"];
  const statusOptions     = activeTab === "tasks" ? taskStatuses : timesheetStatuses;

  return (
    <div className="p-6 bg-white border-b border-slate-100 rounded-t-3xl">
      <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6">
        
        {/* Left: Search Box */}
        <div className="flex-1 space-y-2">
          <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">
            Search {activeTab === "tasks" ? "Tasks" : "Timesheets"}
          </label>
          <div className="relative max-w-md">
            <RiSearchLine className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 text-lg" />
            <input
              type="text"
              placeholder={`Search by ${activeTab === "tasks" ? "task name or assignee" : "employee or description"}...`}
              className="w-full pl-11 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl text-sm 
                         focus:bg-white focus:ring-4 focus:ring-blue-500/5 focus:border-blue-500 outline-none transition-all"
              value={filters.search}
              onChange={(e) => setFilters({ ...filters, search: e.target.value })}
            />
          </div>
        </div>

        {/* Right: Status & Action Buttons */}
        <div className="flex flex-wrap items-end gap-4">
          
          {/* Status Dropdown */}
          <div className="flex flex-col gap-2 w-full sm:w-56">
            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">
              Status Filter
            </label>
            <select 
              className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl text-sm font-bold 
                         text-slate-600 outline-none cursor-pointer hover:border-blue-300 focus:bg-white transition-all"
              value={filters.status}
              onChange={(e) => setFilters({ ...filters, status: e.target.value })}
            >
              {statusOptions.map((s) => (
                <option key={s} value={s}>{s === "All" ? `All ${activeTab === "tasks" ? "Statuses" : "Statuses"}` : s}</option>
              ))}
            </select>
          </div>

          {/* Reset Button */}
          <button
            onClick={resetFilters}
            className="h-[46px] px-5 flex items-center gap-2 text-sm font-bold text-slate-400 
                       hover:text-rose-600 hover:bg-rose-50 rounded-2xl transition-all active:scale-95"
          >
            <RiRestartLine size={18} />
            Reset
          </button>
        </div>
      </div>

      {/* Counter */}
      <div className="mt-4 flex items-center gap-2 text-[10px] font-bold text-slate-300 uppercase tracking-widest ml-1">
        <RiFilter3Line size={12} />
        <span>Found {total} Matching {activeTab === "tasks" ? "Tasks" : "Timesheets"}</span>
      </div>
    </div>
  );
};

export default TimesheetFilters;