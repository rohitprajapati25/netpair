import React, { useState } from "react";
import AttendanceTable from "../Attendance/AttendanceTable";

const AttendanceFilter = ({ attendanceData }) => {

  const [filters, setFilters] = useState({
    search: "",
    department: "All",
    status: "All",
    mode: "All",
    fromDate: "",
    toDate: "",
  });


  const filteredData = attendanceData.filter((item) => {
    return (
      item.name.toLowerCase().includes(filters.search.toLowerCase()) &&(filters.department === "All" || item.dept === filters.department) &&
      (filters.status === "All" || item.status === filters.status) &&(filters.mode === "All" || item.mode === filters.mode) &&
      (!filters.fromDate || item.date >= filters.fromDate) &&(!filters.toDate || item.date <= filters.toDate)
    );
  });

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
  

  return (
    <div className="flex flex-col gap-5">
      <div className="bg-white p-5 rounded-2xl border border-gray-200 shadow-sm flex flex-col gap-4">

        <input
          value={filters.search}
          type="text"
          placeholder="Search employee name..."
          className="border border-gray-300 rounded-lg px-4 py-2"
          onChange={(e)=>
            setFilters({...filters, search:e.target.value})
          }
        />

    

        <div className="flex flex-wrap gap-3">

          <select
          value={filters.department}

            onChange={(e)=>
              setFilters({...filters, department:e.target.value})
            }
            className="border border-gray-300 rounded-lg px-3 py-2">
            <option value="All">All Departments</option>
            <option>Development</option>
            <option>HR</option>
            <option>Design</option>
            <option>QA</option>
          </select>

          <select
          value={filters.status}

            onChange={(e)=>
              setFilters({...filters, status:e.target.value})
            }
            className="border border-gray-300 rounded-lg px-3 py-2">
            <option value="All">All Status</option>
            <option>Present</option>
            <option>Absent</option>
            <option>Late</option>
            <option>Leave</option>
          </select>

          <select
          value={filters.mode}

            onChange={(e)=>
              setFilters({...filters, mode:e.target.value})
            }
            className="border border-gray-300 rounded-lg px-3 py-2">
            <option value="All">All Mode</option>
            <option>Office</option>
            <option>Remote</option>
          </select>
            
          <input type="date"
          value={filters.fromDate}

            onChange={(e)=>
              setFilters({...filters, fromDate:e.target.value})
            }
            className="border border-gray-300 rounded-lg px-3 py-2"
          />

          <input type="date"
          value={filters.toDate}

            onChange={(e)=>
              setFilters({...filters, toDate:e.target.value})
            }
            className="border border-gray-300 rounded-lg px-3 py-2"
          />
            
          <button
            
            onClick = {resetFilters}
            className="bg-gray-300 hover:bg-gray-200 active:border px-4 py-2 rounded-lg">
            Reset
          </button>

        </div>
      </div>

      <AttendanceTable data={filteredData} />
    </div>
  );
};

export default AttendanceFilter;