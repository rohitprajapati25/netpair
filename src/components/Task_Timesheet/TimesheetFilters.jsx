import React from "react";

const TimesheetFilters = () => (
  <div
    className="bg-white rounded-2xl shadow-sm border border-gray-200
    p-4 mb-6 flex flex-wrap items-center gap-4" >

    <div className="flex items-center gap-2 border border-gray-300 rounded-lg px-3 py-2 w-64 focus-within:ring-2 focus-within:ring-blue-500">
      <i className="ri-search-line text-gray-500"></i>
      <input
        type="text"
        placeholder="Search task or employee..."
        className="outline-none w-full text-sm"
      />
    </div>

    <div className="flex items-center gap-2 border border-gray-300 rounded-lg px-3 py-2">
      <i className="ri-filter-3-line text-gray-500"></i>
      <select className="outline-none text-sm bg-transparent">
        <option>Status</option>
        <option>Completed</option>
        <option>In Progress</option>
      </select>
    </div>

  </div>
);

export default TimesheetFilters;