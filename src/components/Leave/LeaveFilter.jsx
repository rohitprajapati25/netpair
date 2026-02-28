import React from "react";

const LeaveFilters = ({ filters, setFilters }) => {

  const resetFilters = () => {
    setFilters({
      search: "",
      status: "All",
      type: "All",
    });
  };

  return (
    <div className="bg-white p-5 rounded-2xl shadow-sm border border-gray-200 mb-6 flex flex-col lg:flex-row gap-4 justify-between">

      <input
        value={filters.search}
        onChange={(e)=>setFilters({...filters,search:e.target.value})}
        type="text"
        placeholder="Search employee..."
        className="w-full lg:w-72 px-4 py-2.5 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500"
      />

      <div className="flex flex-wrap gap-3">

        <select
          value={filters.status}
          onChange={(e)=>setFilters({...filters,status:e.target.value})}
          className="px-4 py-2.5 rounded-lg border border-gray-300"
        >
          <option value="All">All Status</option>
          <option>Pending</option>
          <option>Approved</option>
          <option>Rejected</option>
        </select>

        <select
          value={filters.type}
          onChange={(e)=>setFilters({...filters,type:e.target.value})}
          className="px-4 py-2.5 rounded-lg border border-gray-300"
        >
          <option value="All">All Leave Type</option>
          <option>Casual</option>
          <option>Sick</option>
          <option>Paid</option>
        </select>

        <button
          onClick={resetFilters}
          className="px-4 py-2.5 bg-gray-200 rounded-lg hover:bg-gray-300"
        >
          Reset
        </button>

      </div>
    </div>
  );
};

export default LeaveFilters;