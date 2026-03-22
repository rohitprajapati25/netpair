// import React, { useState } from "react";
// import AttendanceTable from "../Attendance/AttendanceTable";

// const AttendanceFilter = ({ attendanceData }) => {

//   const [filters, setFilters] = useState({
//     search: "",
//     department: "All",
//     status: "All",
//     mode: "All",
//     fromDate: "",
//     toDate: "",
//   });


//   const filteredData = attendanceData.filter((item) => {
//     return (
//       item.name.toLowerCase().includes(filters.search.toLowerCase()) &&(filters.department === "All" || item.dept === filters.department) &&
//       (filters.status === "All" || item.status === filters.status) &&(filters.mode === "All" || item.mode === filters.mode) &&
//       (!filters.fromDate || item.date >= filters.fromDate) &&(!filters.toDate || item.date <= filters.toDate)
//     );
//   });

//   const resetFilters = () => {
    
//     setFilters({
//       search: "",
//       department: "All",
//       status: "All",
//       mode: "All",
//       fromDate: "",
//       toDate: "",
//     });
//   };
  

//   return (
//     <div className="flex flex-col gap-5">
//       <div className="bg-white p-5 rounded-2xl border border-gray-200 shadow-sm flex flex-col gap-4">

//         <input
//           value={filters.search}
//           type="text"
//           placeholder="Search employee name..."
//           className="border border-gray-300 rounded-lg px-4 py-2"
//           onChange={(e)=>
//             setFilters({...filters, search:e.target.value})
//           }
//         />

    

//         <div className="flex flex-wrap gap-3">

//           <select
//           value={filters.department}

//             onChange={(e)=>
//               setFilters({...filters, department:e.target.value})
//             }
//             className="border border-gray-300 rounded-lg px-3 py-2">
//             <option value="All">All Departments</option>
//             <option>Development</option>
//             <option>HR</option>
//             <option>Design</option>
//             <option>QA</option>
//           </select>

//           <select
//           value={filters.status}

//             onChange={(e)=>
//               setFilters({...filters, status:e.target.value})
//             }
//             className="border border-gray-300 rounded-lg px-3 py-2">
//             <option value="All">All Status</option>
//             <option>Present</option>
//             <option>Absent</option>
//             <option>Late</option>
//             <option>Leave</option>
//           </select>

//           <select
//           value={filters.mode}

//             onChange={(e)=>
//               setFilters({...filters, mode:e.target.value})
//             }
//             className="border border-gray-300 rounded-lg px-3 py-2">
//             <option value="All">All Mode</option>
//             <option>Office</option>
//             <option>Remote</option>
//           </select>
            
//           <input type="date"
//           value={filters.fromDate}

//             onChange={(e)=>
//               setFilters({...filters, fromDate:e.target.value})
//             }
//             className="border border-gray-300 rounded-lg px-3 py-2"
//           />

//           <input type="date"
//           value={filters.toDate}

//             onChange={(e)=>
//               setFilters({...filters, toDate:e.target.value})
//             }
//             className="border border-gray-300 rounded-lg px-3 py-2"
//           />
            
//           <button
            
//             onClick = {resetFilters}
//             className="bg-gray-300 hover:bg-gray-200 active:border px-4 py-2 rounded-lg">
//             Reset
//           </button>

//         </div>
//       </div>

//       <AttendanceTable data={filteredData} />
//     </div>
//   );
// };

// export default AttendanceFilter;


import React, { useState, useMemo } from "react";
import AttendanceTable from "../Attendance/AttendanceTable";
import { RiSearchLine, RiFilter3Line, RiRestartLine } from "react-icons/ri";

const AttendanceFilter = ({ attendanceData }) => {
  const [filters, setFilters] = useState({
    search: "",
    department: "All",
    status: "All",
    mode: "All",
    fromDate: "",
    toDate: "",
  });

  // Performance Optimization: Only re-filter when data or filters change
  const filteredData = useMemo(() => {
    return attendanceData.filter((item) => {
      const matchesSearch = item.name.toLowerCase().includes(filters.search.toLowerCase());
      const matchesDept = filters.department === "All" || item.dept === filters.department;
      const matchesStatus = filters.status === "All" || item.status === filters.status;
      const matchesMode = filters.mode === "All" || item.mode === filters.mode;
      const matchesFromDate = !filters.fromDate || item.date >= filters.fromDate;
      const matchesToDate = !filters.toDate || item.date <= filters.toDate;

      return matchesSearch && matchesDept && matchesStatus && matchesMode && matchesFromDate && matchesToDate;
    });
  }, [filters, attendanceData]);

  const resetFilters = () => {
    setFilters({
      search: "",
      department: "All",
      status: "All",
      mode: "All",
      fromDate: "",
      toDate: "",
    });
  };

  const handleFilterChange = (key, value) => {
    setFilters(prev => ({ ...prev, [key]: value }));
  };

  return (
    <div className="flex flex-col">
      {/* Filter Toolbar */}
      <div className="p-6 border-b border-slate-100 bg-white">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          
          {/* Left Side: Search Bar */}
          <div className="relative flex-1 max-w-md">
            <RiSearchLine className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 text-lg" />
            <input
              value={filters.search}
              type="text"
              placeholder="Search by employee name..."
              className="w-full pl-11 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm 
                         focus:bg-white focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 outline-none transition-all"
              onChange={(e) => handleFilterChange("search", e.target.value)}
            />
          </div>

          {/* Right Side: Quick Actions */}
          <div className="flex items-center gap-3">
            <button 
              onClick={resetFilters}
              className="flex items-center gap-2 px-4 py-2.5 text-sm font-bold text-slate-500 hover:text-rose-600 hover:bg-rose-50 rounded-xl transition-all"
            >
              <RiRestartLine size={18} />
              Reset
            </button>
            <div className="h-8 w-px bg-slate-200 mx-2 hidden lg:block" />
            <div className="flex items-center gap-2 text-slate-400 text-sm font-bold">
              <RiFilter3Line size={18} />
              <span>{filteredData.length} Results Found</span>
            </div>
          </div>
        </div>

        {/* Secondary Filter Row: Selectors & Dates */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 mt-6">
          <FilterSelect 
            label="Department" 
            value={filters.department} 
            options={["All", "Development", "HR", "Design", "Testing", "Support"]}
            onChange={(val) => handleFilterChange("department", val)}
          />
          <FilterSelect 
            label="Status" 
            value={filters.status} 
            options={["All", "Present", "Absent", "Late", "Leave"]}
            onChange={(val) => handleFilterChange("status", val)}
          />
          <FilterSelect 
            label="Work Mode" 
            value={filters.mode} 
            options={["All", "Office", "WFH", "Remote"]}
            onChange={(val) => handleFilterChange("mode", val)}
          />
          
          <div className="flex flex-col gap-1.5">
            <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">From Date</label>
            <input 
              type="date" 
              value={filters.fromDate}
              className="border border-slate-200 rounded-xl px-3 py-2 text-xs font-bold text-slate-600 outline-none focus:border-blue-500 bg-slate-50 focus:bg-white"
              onChange={(e) => handleFilterChange("fromDate", e.target.value)}
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">To Date</label>
            <input 
              type="date" 
              value={filters.toDate}
              className="border border-slate-200 rounded-xl px-3 py-2 text-xs font-bold text-slate-600 outline-none focus:border-blue-500 bg-slate-50 focus:bg-white"
              onChange={(e) => handleFilterChange("toDate", e.target.value)}
            />
          </div>
        </div>
      </div>

      {/* The Data Table */}
      <AttendanceTable data={filteredData} />
    </div>
  );
};

// Reusable Sub-Component for cleaner code
const FilterSelect = ({ label, value, options, onChange }) => (
  <div className="flex flex-col gap-1.5">
    <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">{label}</label>
    <select 
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className="border border-slate-200 rounded-xl px-3 py-2 text-xs font-bold text-slate-600 outline-none focus:border-blue-500 bg-slate-50 focus:bg-white cursor-pointer"
    >
      {options.map(opt => <option key={opt} value={opt}>{opt}</option>)}
    </select>
  </div>
);

export default AttendanceFilter;