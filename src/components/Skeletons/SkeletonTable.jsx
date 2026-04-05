import React from "react";

/**
 * @component SkeletonTable
 * @description Loading skeleton for table layouts
 * @param {number} rows - Number of skeleton rows (default: 5)
 */
const SkeletonTable = ({ rows = 5 }) => {
  return (
    <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden">
      {/* Table Header */}
      <div className="grid grid-cols-5 bg-slate-50 p-4 border-b border-slate-200 gap-4">
        {Array.from({ length: 5 }).map((_, i) => (
          <div key={i} className="h-4 bg-slate-200 rounded animate-pulse"></div>
        ))}
      </div>

      {/* Table Rows */}
      {Array.from({ length: rows }).map((_, rowIdx) => (
        <div key={rowIdx} className="grid grid-cols-5 p-4 border-b border-slate-100 gap-4 hover:bg-slate-50/50">
          {Array.from({ length: 5 }).map((_, colIdx) => (
            <div key={colIdx} className="h-4 bg-slate-200 rounded animate-pulse"></div>
          ))}
        </div>
      ))}
    </div>
  );
};

export default SkeletonTable;
