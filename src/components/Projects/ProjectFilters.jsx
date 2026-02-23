import React from "react";

const ProjectFilters = () => {
  return (
    <div className="bg-white p-4 rounded-xl shadow mb-6 flex flex-wrap items-center gap-4 border-2 border-gray-300 w-full">

      {/* Search */}
      <div className="flex items-center border border-gray-400 px-3 py-2 rounded-lg w-full sm:w-60 gap-2">
        <i className="ri-search-line text-gray-500"></i>
        <input
          type="text"
          placeholder="Search project..."
          className="outline-none w-full"
        />
      </div>

      {/* Status Filter */}
      <div className="flex items-center border border-gray-400 px-3 py-2 rounded-lg gap-2">
        <i className="ri-filter-3-line text-gray-500"></i>
        <select className="outline-none bg-transparent">
          <option>Status</option>
          <option>Ongoing</option>
          <option>Completed</option>
          <option>On Hold</option>
        </select>
      </div>

      {/* Priority Filter */}
      <div className="flex items-center border border-gray-400 px-3 py-2 rounded-lg gap-2">
        <i className="ri-flag-line text-gray-500"></i>
        <select className="outline-none bg-transparent">
          <option>Priority</option>
          <option>High</option>
          <option>Medium</option>
          <option>Low</option>
        </select>
      </div>

    </div>
  );
};

export default ProjectFilters;