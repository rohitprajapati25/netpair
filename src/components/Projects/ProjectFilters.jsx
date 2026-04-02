// import React from "react";

// const ProjectFilters = ({ projects, setData }) => {
//   const handleSearch = (e) => {
//     const value = e.target.value.toLowerCase();
//     const filtered = projects.filter((p) =>
//       p.name.toLowerCase().includes(value)
//     );
//     setData(filtered);
//   };

//   const handleStatus = (e) => {
//     const value = e.target.value;
//     if (value === "All") {
//       setData(projects);
//       return;
//     }
//     const filtered = projects.filter((p) => p.status === value);
//     setData(filtered);
//   };

//   return (
//     <div className="bg-white p-4 rounded-xl shadow flex gap-4 flex-wrap">
//       <input
//         type="text"
//         placeholder="Search project..."
//         onChange={handleSearch}
//         className="border px-3 py-2 rounded-lg border-gray-300 outline-none focus:border-blue-500"
//       />
//       <select
//         onChange={handleStatus}
//         className="border px-3 py-2 rounded-lg border-gray-300 outline-none focus:border-blue-500"
//       >
//         <option value="All">All Status</option>
//         <option value="Ongoing">Ongoing</option>
//         <option value="Completed">Completed</option>
//         <option value="On Hold">On Hold</option>
//       </select>
//     </div>
//   );
// };

// export default ProjectFilters;


import React from "react";
import { RiSearchLine, RiFilter3Line, RiRestartLine } from "react-icons/ri";

const ProjectFilters = ({ filters, setFilters, totalResults }) => {
  const resetFilters = () => {
    setFilters({ search: "", status: "All", priority: "All", project_type: "All", department: "All", createdBy: "All" });
  };

  return (
    <div className="p-6 border-b border-slate-100 bg-white rounded-t-2xl">
      <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6">
        
        <div className="flex-1 flex flex-col gap-4">
          <div className="relative max-w-md">
            <RiSearchLine className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 text-lg" />
            <input
              value={filters.search}
              onChange={(e) => setFilters({ ...filters, search: e.target.value })}
              type="text"
              placeholder="Search by project name..."
              className="w-full pl-11 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm 
                         focus:bg-white focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 outline-none transition-all"
            />
          </div>
          <div className="flex items-center gap-2 text-slate-400 text-[11px] font-bold uppercase tracking-widest ml-1">
            <RiFilter3Line size={14} />
            <span>{totalResults} Projects Filtered</span>
          </div>
        </div>

        <div className="flex flex-wrap items-end gap-4">
          <div className="flex flex-col gap-1.5 w-full sm:w-44">
            <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">Status</label>
            <select
              value={filters.status}
              onChange={(e) => setFilters({ ...filters, status: e.target.value })}
              className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold 
                         text-slate-600 outline-none focus:border-blue-500 cursor-pointer transition-all"
            >
              <option value="All">All Status</option>
              <option value="Ongoing">Ongoing</option>
              <option value="Completed">Completed</option>
              <option value="On Hold">On Hold</option>
              <option value="Cancelled">Cancelled</option>
            </select>
          </div>

          <div className="flex flex-col gap-1.5 w-full sm:w-44">
            <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">Priority</label>
            <select
              value={filters.priority}
              onChange={(e) => setFilters({ ...filters, priority: e.target.value })}
              className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold 
                         text-slate-600 outline-none focus:border-blue-500 cursor-pointer transition-all"
            >
              <option value="All">All Priority</option>
              <option value="Low">Low</option>
              <option value="Medium">Medium</option>
              <option value="High">High</option>
              <option value="Critical">Critical</option>
            </select>
          </div>

          <div className="flex flex-col gap-1.5 w-full sm:w-44">
            <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">Type</label>
            <select
              value={filters.project_type}
              onChange={(e) => setFilters({ ...filters, project_type: e.target.value })}
              className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold 
                         text-slate-600 outline-none focus:border-blue-500 cursor-pointer transition-all"
            >
              <option value="All">All Types</option>
              <option value="Internal">Internal</option>
              <option value="Client">Client</option>
              <option value="Product">Product</option>
            </select>
          </div>

          <button
            onClick={resetFilters}
            className="h-[42px] px-5 flex items-center gap-2 text-sm font-bold text-slate-500 
                       hover:text-rose-600 hover:bg-rose-50 rounded-xl transition-all"
          >
            <RiRestartLine size={18} />
            Reset
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProjectFilters;