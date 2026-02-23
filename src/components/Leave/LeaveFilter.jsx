import React from "react";

const LeaveFilters = () => {
  return (
    <div
      className="bg-white p-5 rounded-2xl shadow-sm
      border border-gray-200 mb-6
      flex flex-col lg:flex-row lg:items-center
      gap-4 justify-between"
    >
      <div className="relative w-full lg:w-72">
        <i className="ri-search-line absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"></i>
        <input
          type="text"
          placeholder="Search employee..."
          className="w-full pl-10 pr-3 py-2.5 rounded-lg
          border border-gray-300
          focus:outline-none focus:ring-2 focus:ring-blue-500
          focus:border-blue-500 transition"
        />
      </div>

      <div className="flex flex-wrap gap-3">

        <div className="relative">
          <i className="ri-equalizer-line absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"></i>
          <select
            className="pl-10 pr-6 py-2.5 rounded-lg
            border border-gray-300
            focus:outline-none focus:ring-2 focus:ring-blue-500
            appearance-none bg-white"
          >
            <option>Status</option>
            <option>Pending</option>
            <option>Approved</option>
            <option>Rejected</option>
          </select>
        </div>

        <div className="relative">
          <i className="ri-calendar-event-line absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"></i>
          <select
            className="pl-10 pr-6 py-2.5 rounded-lg
            border border-gray-300
            focus:outline-none focus:ring-2 focus:ring-blue-500
            appearance-none bg-white"
          >
            <option>Leave Type</option>
            <option>Casual</option>
            <option>Sick</option>
            <option>Paid</option>
          </select>
        </div>

      </div>
    </div>
  );
};

export default LeaveFilters;