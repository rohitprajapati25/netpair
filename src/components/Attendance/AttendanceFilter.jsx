import React from "react";
import AttendanceTable from "./AttendanceTable";
import { RiSearchLine, RiFilter3Line, RiRestartLine } from "react-icons/ri";

const AttendanceFilter = ({ attendanceData, filters, onFilterChange, onRefresh, loading }) => {
  const handleReset = () => {
    onFilterChange({
      search: "",
      department: "All",
      status: "All",
      mode: "All",
      fromDate: "",
      toDate: "",
    });
  };

  const filteredData = React.useMemo(() => {
    // Client-side for small data, server for large
    // Since server filtering now handles, use data.length for count
    return attendanceData;
  }, [attendanceData]);

  return (
    <div className="flex flex-col">
      <div className="p-6 border-b border-slate-100 bg-white">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div className="relative flex-1 max-w-md">
            <RiSearchLine className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 text-lg" />
            <input
              value={filters.search}
              type="text"
              placeholder="Search by employee name..."
              className="w-full pl-11 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm 
                         focus:bg-white focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 outline-none transition-all"
              onChange={(e) => onFilterChange("search", e.target.value)}
              disabled={loading}
            />
          </div>

          <div className="flex items-center gap-3">
            <button 
              onClick={handleReset}
              disabled={loading}
              className="flex items-center gap-2 px-4 py-2.5 text-sm font-bold text-slate-500 hover:text-rose-600 hover:bg-rose-50 rounded-xl transition-all disabled:opacity-50"
            >
              <RiRestartLine size={18} />
              Reset
            </button>
            <div className="h-8 w-px bg-slate-200 mx-2 hidden lg:block" />
            <div className="flex items-center gap-2 text-slate-400 text-sm font-bold">
              <RiFilter3Line size={18} />
              <span>{loading ? 'Loading...' : `${attendanceData.length} Results Found`}</span>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 mt-6">
          <FilterSelect 
            label="Department" 
            value={filters.department} 
            options={["All", "Development", "HR", "Design", "Testing", "Support"]}
            onChange={(val) => onFilterChange("department", val)}
            disabled={loading}
          />
          <FilterSelect 
            label="Status" 
            value={filters.status} 
            options={["All", "Present", "Absent", "Late", "Leave"]}
            onChange={(val) => onFilterChange("status", val)}
            disabled={loading}
          />
          <FilterSelect 
            label="Work Mode" 
            value={filters.mode} 
            options={["All", "Office", "WFH", "Remote"]}
            onChange={(val) => onFilterChange("mode", val)}
            disabled={loading}
          />
          
          <div className="flex flex-col gap-1.5">
            <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">From Date</label>
            <input 
              type="date" 
              value={filters.fromDate}
              className="border border-slate-200 rounded-xl px-3 py-2 text-xs font-bold text-slate-600 outline-none focus:border-blue-500 bg-slate-50 focus:bg-white disabled:bg-slate-100 disabled:cursor-not-allowed"
              onChange={(e) => onFilterChange("fromDate", e.target.value)}
              disabled={loading}
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">To Date</label>
            <input 
              type="date" 
              value={filters.toDate}
              className="border border-slate-200 rounded-xl px-3 py-2 text-xs font-bold text-slate-600 outline-none focus:border-blue-500 bg-slate-50 focus:bg-white disabled:bg-slate-100 disabled:cursor-not-allowed"
              onChange={(e) => onFilterChange("toDate", e.target.value)}
              disabled={loading}
            />
          </div>
        </div>
      </div>



    </div>
  );
};

const FilterSelect = ({ label, value, options, onChange, disabled }) => (
  <div className="flex flex-col gap-1.5">
    <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">{label}</label>
    <select 
      value={value}
      onChange={(e) => onChange(e.target.value)}
      disabled={disabled}
      className="border border-slate-200 rounded-xl px-3 py-2 text-xs font-bold text-slate-600 outline-none focus:border-blue-500 bg-slate-50 focus:bg-white cursor-pointer disabled:bg-slate-100 disabled:cursor-not-allowed"
    >
      {options.map(opt => <option key={opt} value={opt}>{opt}</option>)}
    </select>
  </div>
);

export default AttendanceFilter;

