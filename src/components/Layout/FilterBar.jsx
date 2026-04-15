import React from 'react';
import { RiSearchLine, RiRefreshLine, RiLayoutGridFill, RiListUnordered } from 'react-icons/ri';

/**
 * @component FilterBar
 * @description Reusable filter bar with search, dropdowns, view toggle, and refresh
 * @param {string} searchValue - Current search value
 * @param {function} setSearchValue - Search value setter
 * @param {string} searchPlaceholder - Placeholder text for search input
 * @param {Array} filters - Array of filter configs [{value, onChange, options:[{value,label}]}]
 * @param {Object} actions - Action buttons config {toggle, refresh}
 */
const FilterBar = ({
  searchValue = '',
  setSearchValue,
  searchPlaceholder = 'Search...',
  filters = [],
  actions = {},
}) => {
  return (
    <div className="bg-white p-3 rounded-[2rem] border border-slate-200 shadow-sm flex flex-col lg:flex-row gap-4 items-center">
      {/* Search */}
      {setSearchValue && (
        <div className="relative flex-1 w-full">
          <RiSearchLine className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 text-lg" />
          <input
            type="search"
            placeholder={searchPlaceholder}
            value={searchValue}
            onChange={(e) => setSearchValue(e.target.value)}
            className="w-full pl-11 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl text-sm font-medium focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
          />
        </div>
      )}

      {/* Dynamic Filters */}
      <div className="flex items-center gap-3 w-full lg:w-auto flex-wrap">
        {filters.map((filter, idx) => (
          <select
            key={idx}
            value={filter.value}
            onChange={(e) => filter.onChange(e.target.value)}
            className="bg-slate-50 border border-slate-200 rounded-2xl px-4 py-3 font-semibold text-sm text-slate-700 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
          >
            {(filter.options || []).map((opt) => (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </select>
        ))}

        {/* View Mode Toggle */}
        {actions.toggle && (
          <div className="flex bg-slate-100 p-1 rounded-xl">
            <button
              onClick={() => actions.toggle.onChange('card')}
              className={`p-2 rounded-lg transition-all ${
                actions.toggle.value === 'card'
                  ? 'bg-white shadow-sm text-blue-600'
                  : 'text-slate-400 hover:text-slate-600'
              }`}
              title="Card View"
            >
              {actions.toggle.cardIcon || <RiLayoutGridFill size={18} />}
            </button>
            <button
              onClick={() => actions.toggle.onChange('table')}
              className={`p-2 rounded-lg transition-all ${
                actions.toggle.value === 'table'
                  ? 'bg-white shadow-sm text-blue-600'
                  : 'text-slate-400 hover:text-slate-600'
              }`}
              title="Table View"
            >
              {actions.toggle.tableIcon || <RiListUnordered size={18} />}
            </button>
          </div>
        )}

        {/* Refresh Button */}
        {actions.refresh && (
          <button
            onClick={actions.refresh.onClick}
            className="p-3 bg-slate-100 hover:bg-slate-200 text-slate-600 rounded-xl transition-all"
            title="Refresh"
          >
            {actions.refresh.icon || <RiRefreshLine size={20} />}
          </button>
        )}
      </div>
    </div>
  );
};

export default FilterBar;
