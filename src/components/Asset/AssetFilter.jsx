import React from "react";
import { RiSearchLine, RiFilter3Line, RiRestartLine } from "react-icons/ri";

const AssetFilter = ({ filters, setFilters, totalResults }) => {
  const resetFilters = () => {
    setFilters({ search: "", category: "All", status: "All" });
  };

  return (
    <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 mb-6">
      <div className="flex flex-col lg:flex-row lg:items-center gap-4 mb-6">
        <div className="relative flex-1 max-w-md">
          <RiSearchLine className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
          <input
            value={filters.search}
            onChange={(e) => setFilters({ ...filters, search: e.target.value })}
            placeholder="Search assets, serial, assignee..."
            className="w-full pl-11 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm font-bold focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all"
          />
        </div>
        
        <div className="flex items-center gap-2 text-slate-400 text-sm font-bold uppercase tracking-wider">
          <RiFilter3Line size={16} />
          <span>{totalResults} Assets Found</span>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        <div className="flex flex-col gap-1.5">
          <label className="text-xs font-bold text-slate-500 uppercase tracking-wide ml-1">Category</label>
          <select
            value={filters.category}
            onChange={(e) => setFilters({ ...filters, category: e.target.value })}
            className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm font-bold focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all"
          >
            <option value="All">All Categories</option>
            <option value="IT Asset">IT Assets</option>
            <option value="Furniture">Furniture</option>
            <option value="Electronics">Electronics</option>
            <option value="Office Supplies">Office Supplies</option>
          </select>
        </div>

        <div className="flex flex-col gap-1.5">
          <label className="text-xs font-bold text-slate-500 uppercase tracking-wide ml-1">Status</label>
          <select
            value={filters.status}
            onChange={(e) => setFilters({ ...filters, status: e.target.value })}
            className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm font-bold focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all"
          >
            <option value="All">All Status</option>
            <option value="Available">Available</option>
            <option value="Assigned">Assigned</option>
            <option value="Damaged">Damaged</option>
            <option value="Disposed">Disposed</option>
          </select>
        </div>

        <div className="flex items-center gap-3 pt-6 lg:pt-0">
          <button
            onClick={resetFilters}
            className="px-6 py-3 bg-slate-100 hover:bg-slate-200 text-slate-600 font-bold rounded-xl transition-all flex items-center gap-2 shadow-sm"
          >
            <RiRestartLine size={16} />
            Reset
          </button>
        </div>
      </div>
    </div>
  );
};

export default AssetFilter;

