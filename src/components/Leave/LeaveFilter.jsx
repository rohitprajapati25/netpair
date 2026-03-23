// import React from "react";

// const LeaveFilters = ({ filters, setFilters }) => {

//   const resetFilters = () => {
//     setFilters({
//       search: "",
//       status: "All",
//       type: "All",
//     });
//   };

//   return (
//     <div className="bg-white p-5 rounded-2xl shadow-sm border border-gray-200 mb-6 flex flex-col lg:flex-row gap-4 justify-between">

//       <input
//         value={filters.search}
//         onChange={(e)=>setFilters({...filters,search:e.target.value})}
//         type="text"
//         placeholder="Search employee..."
//         className="w-full lg:w-72 px-4 py-2.5 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500"
//       />

//       <div className="flex flex-wrap gap-3">

//         <select
//           value={filters.status}
//           onChange={(e)=>setFilters({...filters,status:e.target.value})}
//           className="px-4 py-2.5 rounded-lg border border-gray-300"
//         >
//           <option value="All">All Status</option>
//           <option>Pending</option>
//           <option>Approved</option>
//           <option>Rejected</option>
//         </select>

//         <select
//           value={filters.type}
//           onChange={(e)=>setFilters({...filters,type:e.target.value})}
//           className="px-4 py-2.5 rounded-lg border border-gray-300"
//         >
//           <option value="All">All Leave Type</option>
//           <option>Casual</option>
//           <option>Sick</option>
//           <option>Paid</option>
//         </select>

//         <button
//           onClick={resetFilters}
//           className="px-4 py-2.5 bg-gray-200 rounded-lg hover:bg-gray-300"
//         >
//           Reset
//         </button>

//       </div>
//     </div>
//   );
// };

// export default LeaveFilters;
import React from "react";
import { RiSearchLine, RiFilter3Line, RiRestartLine } from "react-icons/ri";

const LeaveFilters = ({ filters, setFilters, totalResults }) => {
  
  const resetFilters = () => {
    setFilters({
      search: "",
      status: "All",
      type: "All",
    });
  };

  const handleChange = (key, value) => {
    setFilters(prev => ({ ...prev, [key]: value }));
  };

  return (
    <div className="p-6 border-b border-slate-100 bg-white">
      <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6">
        
        {/* Left Section: Search & Counters */}
        <div className="flex-1 flex flex-col gap-4">
          <div className="relative max-w-md">
            <RiSearchLine className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 text-lg" />
            <input
              value={filters.search}
              onChange={(e) => handleChange("search", e.target.value)}
              type="text"
              placeholder="Search employee by name..."
              className="w-full pl-11 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm 
                         focus:bg-white focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 outline-none transition-all"
            />
          </div>
          
          <div className="flex items-center gap-2 text-slate-400 text-[11px] font-bold uppercase tracking-widest ml-1">
            <RiFilter3Line size={14} />
            <span>Showing {totalResults} Leave Requests</span>
          </div>
        </div>

        {/* Right Section: Selectors & Actions */}
        <div className="flex flex-wrap items-end gap-4">
          
          <FilterGroup 
            label="Leave Status" 
            value={filters.status}
            options={["All", "Pending", "Approved", "Rejected"]}
            onChange={(val) => handleChange("status", val)}
          />

          <FilterGroup 
            label="Leave Type" 
            value={filters.type}
            options={["All", "Casual", "Sick", "Emergency"]}
            onChange={(val) => handleChange("type", val)}
          />

          <button
            onClick={resetFilters}
            className="h-[42px] px-5 flex items-center gap-2 text-sm font-bold text-slate-500 
                       hover:text-rose-600 hover:bg-rose-50 rounded-xl transition-all active:scale-95"
          >
            <RiRestartLine size={18} />
            Reset
          </button>
        </div>
      </div>
    </div>
  );
};


const FilterGroup = ({ label, value, options, onChange }) => (
  <div className="flex flex-col gap-1.5 w-full sm:w-40">
    <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">
      {label}
    </label>
    <select
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className="w-full px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold 
                 text-slate-600 outline-none focus:border-blue-500 focus:bg-white cursor-pointer transition-all"
    >
      {options.map((opt) => (
        <option key={opt} value={opt}>
          {opt === "All" ? `All ${label.split(" ")[1]}s` : opt}
        </option>
      ))}
    </select>
  </div>
);

export default LeaveFilters;