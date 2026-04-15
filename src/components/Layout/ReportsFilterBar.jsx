import React, { useMemo, useCallback } from 'react';
import { RiSearchLine, RiFilter3Line, RiCloseLine, RiLoaderLine } from 'react-icons/ri';

const ReportsFilterBar = React.memo(({
  filters,
  onFilterChange,
  onClear,
  onApply,
  loading,
  className = ''
}) => {
  const departments = ['All', 'Development', 'HR', 'IT', 'Finance', 'Admin', 'Design', 'Testing', 'Support'];

  const activeFilters = useMemo(() => [
    filters.dateRange && filters.dateRange !== 'week' && { key: 'dateRange', value: filters.dateRange, label: 'Period' },
    filters.startDate && { key: 'startDate', value: filters.startDate, label: 'From' },
    filters.endDate && { key: 'endDate', value: filters.endDate, label: 'To' },
    filters.department && filters.department !== 'All' && { key: 'department', value: filters.department, label: 'Department' },
    filters.status && filters.status !== 'All' && { key: 'status', value: filters.status, label: 'Status' }
  ].filter(Boolean), [filters]);



  const removeFilter = useCallback((key) => {
    if (key === 'startDate' || key === 'endDate') {
      onFilterChange(key, '');
    } else if (key === 'department' || key === 'status') {
      onFilterChange(key, 'All');
    } else if (key === 'dateRange') {
      onFilterChange(key, 'week');
    }
  }, [onFilterChange]);

  return (
    <div className={`bg-white/80 backdrop-blur-sm rounded-3xl border border-slate-200/60 shadow-xl p-6 lg:p-8 ${className}`} role="region" aria-label="Reports advanced filters">
      <div className="space-y-6">
        {/* Active Filters Chips */}
        {activeFilters.length > 0 && (
          <div className="flex flex-wrap gap-2" aria-label="Active filters">
            {activeFilters.map((filter) => (
              <button
                key={filter.key}
                onClick={() => removeFilter(filter.key)}
                className="inline-flex items-center gap-1.5 px-4 py-2 bg-emerald-100 hover:bg-emerald-200 text-emerald-800 text-sm font-bold rounded-2xl shadow-sm transition-all border border-emerald-200 backdrop-blur-sm"
                aria-label={`Remove ${filter.label} filter`}
              >
                {filter.label}: <span className="font-black">{filter.value}</span>
                <RiCloseLine className="text-xs -mr-1" />
              </button>
            ))}
          </div>
        )}

        {/* Controls Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4 items-end">

          {/* Department */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-2">Department</label>
            <select 
              value={filters.department || 'All'}
              onChange={(e) => onFilterChange('department', e.target.value)}
              className="w-full px-4 py-3 border border-slate-200 rounded-2xl bg-white/50 focus:ring-4 focus:ring-indigo-500/30 focus:border-indigo-500 font-semibold transition-all shadow-sm text-sm"
              aria-label="Filter by department"
              disabled={loading}
            >
              {departments.map(dept => (
                <option key={dept} value={dept}>{dept}</option>
              ))}
            </select>
          </div>

          {/* Date Range Dropdown */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-2">Date Range</label>
            <select 
              value={filters.dateRange || 'week'}
              onChange={(e) => onFilterChange('dateRange', e.target.value)}
              className="w-full px-4 py-3 border border-slate-200 rounded-2xl bg-white/50 focus:ring-4 focus:ring-indigo-500/30 focus:border-indigo-500 font-semibold transition-all shadow-sm text-sm"
              aria-label="Date range filter"
              disabled={loading}
            >
              <option value="today">Today</option>
              <option value="week">This Week</option>
              <option value="month">This Month</option>
              <option value="all">All Time</option>
            </select>
          </div>

          {/* Status Filter */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-2">Status</label>
            <select 
              value={filters.status || 'All'}
              onChange={(e) => onFilterChange('status', e.target.value)}
              className="w-full px-4 py-3 border border-slate-200 rounded-2xl bg-white/50 focus:ring-4 focus:ring-orange-500/30 focus:border-orange-500 font-semibold transition-all shadow-sm text-sm"
              aria-label="Filter by status"
              disabled={loading}
            >
              <option value="All">All Status</option>
              <option value="Present">Present</option>
              <option value="Active">Active</option>
              <option value="Pending">Pending</option>
              <option value="Completed">Completed</option>
            </select>
          </div>

          {/* Start Date */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-2">Start Date</label>
            <input
              type="date"
              value={filters.startDate || ''}
              onChange={(e) => onFilterChange('startDate', e.target.value)}
              className="w-full px-4 py-3 border border-slate-200 rounded-2xl bg-white/50 focus:ring-4 focus:ring-blue-500/30 focus:border-blue-500 font-semibold transition-all shadow-sm text-sm"
              disabled={loading}
              aria-label="Start date filter"
            />
          </div>

          {/* End Date */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-2">End Date</label>
            <input
              type="date"
              value={filters.endDate || ''}
              onChange={(e) => onFilterChange('endDate', e.target.value)}
              className="w-full px-4 py-3 border border-slate-200 rounded-2xl bg-white/50 focus:ring-4 focus:ring-blue-500/30 focus:border-blue-500 font-semibold transition-all shadow-sm text-sm"
              disabled={loading}
              aria-label="End date filter"
            />
          </div>

          {/* No custom date inputs - Preset only */}



          {/* Actions */}
          <div className="col-span-full flex gap-3 pt-2">
            <button
              onClick={onClear}
              className="flex-1 h-12 px-6 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-2xl shadow-sm transition-all flex items-center justify-center gap-2 disabled:opacity-50"
              disabled={loading}
            >
              Clear All
            </button>
            <button
              onClick={onApply}
              disabled={loading}
              className="flex-1 h-12 px-6 bg-gradient-to-r from-emerald-600 to-emerald-700 hover:from-emerald-700 hover:to-emerald-800 text-white font-bold rounded-2xl shadow-lg hover:shadow-xl transition-all disabled:opacity-50 flex items-center justify-center gap-2"
            >
              {loading ? (
                <RiLoaderLine className="animate-spin" />
              ) : (
                'Apply'
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
});

ReportsFilterBar.displayName = 'ReportsFilterBar';

export default ReportsFilterBar;
