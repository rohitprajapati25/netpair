import React from "react";
import { RiSearchLine } from "react-icons/ri";

/**
 * @component FilterBar
 * @description Reusable filter bar with search, dropdowns, and action buttons
 * @param {string} searchValue - Current search value
 * @param {function} setSearchValue - Search update handler
 * @param {string} searchPlaceholder - Search input placeholder
 * @param {Array} filters - Filter config [{label, value, options, onChange}]
 * @param {Object} actions - Action buttons {refresh?: {onClick, icon}, toggle?: {value, onChange, icon}}
 */
const FilterBar = ({ 
  searchValue, 
  setSearchValue, 
  searchPlaceholder = "Search...",
  filters = [],
  actions = {},
  focusColor = "indigo" // indigo, emerald, blue
}) => {
  const ringColor = {
    indigo: "focus:ring-indigo-500/20",
    emerald: "focus:ring-emerald-500/20",
    blue: "focus:ring-blue-500/20"
  }[focusColor];

  return (
    <div className="bg-white p-3 rounded-[2rem] border border-slate-200 shadow-sm flex flex-col lg:flex-row gap-4 items-center">
      {/* Search Input */}
      <div className="relative flex-1 w-full">
        <RiSearchLine className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
        <input
          type="text"
          placeholder={searchPlaceholder}
          value={searchValue}
          onChange={(e) => setSearchValue(e.target.value)}
          className={`w-full pl-12 pr-4 py-3 bg-slate-50 border-none rounded-2xl focus:ring-2 ${ringColor} transition-all font-medium text-slate-700 placeholder:text-slate-400 outline-none`}
        />
      </div>

      {/* Filters */}
      <div className="flex items-center gap-3 w-full lg:w-auto flex-wrap">
        {filters.map((filter, idx) => (
          <select
            key={idx}
            value={filter.value}
            onChange={(e) => filter.onChange(e.target.value)}
            className={`flex-1 lg:w-40 px-4 py-3 bg-slate-50 border-none rounded-2xl font-bold text-slate-600 focus:ring-2 ${ringColor} appearance-none outline-none`}
          >
            {filter.options.map((opt, i) => (
              <option key={i} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </select>
        ))}

        {/* View Toggle */}
        {actions.toggle && (
          <div className="flex bg-slate-100 p-1 rounded-xl">
            <button
              onClick={() => actions.toggle.onChange("card")}
              className={`p-2 rounded-lg transition-all ${
                actions.toggle.value === "card"
                  ? "bg-white shadow-sm text-indigo-600"
                  : "text-slate-400 hover:text-slate-600"
              }`}
            >
              {actions.toggle.cardIcon}
            </button>
            <button
              onClick={() => actions.toggle.onChange("table")}
              className={`p-2 rounded-lg transition-all ${
                actions.toggle.value === "table"
                  ? "bg-white shadow-sm text-indigo-600"
                  : "text-slate-400 hover:text-slate-600"
              }`}
            >
              {actions.toggle.tableIcon}
            </button>
          </div>
        )}

        {/* Refresh Button */}
        {actions.refresh && (
          <button
            onClick={actions.refresh.onClick}
            className={`p-3 text-slate-400 hover:text-${focusColor}-600 transition-colors`}
          >
            {actions.refresh.icon}
          </button>
        )}
      </div>
    </div>
  );
};

export default FilterBar;
