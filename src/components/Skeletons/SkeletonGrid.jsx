import React from "react";

// Matches PremiumCard shape exactly
const SkeletonGrid = ({ count = 8 }) => (
  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
    {Array.from({ length: count }).map((_, i) => (
      <div key={i} className="bg-white rounded-2xl border border-slate-200 overflow-hidden animate-pulse">
        {/* accent bar */}
        <div className="h-1 bg-slate-200 w-full"></div>
        <div className="p-4 space-y-4">
          {/* avatar + name row */}
          <div className="flex items-center gap-3 pr-16">
            <div className="w-14 h-14 bg-slate-200 rounded-xl shrink-0"></div>
            <div className="flex-1 space-y-2">
              <div className="h-4 bg-slate-200 rounded w-3/4"></div>
              <div className="h-3 bg-slate-200 rounded w-1/2"></div>
              <div className="h-5 bg-slate-200 rounded w-16 mt-1"></div>
            </div>
          </div>
          {/* info rows */}
          <div className="space-y-2">
            <div className="h-3 bg-slate-200 rounded w-full"></div>
            <div className="h-3 bg-slate-200 rounded w-3/4"></div>
            <div className="h-3 bg-slate-200 rounded w-2/3"></div>
          </div>
          {/* tags */}
          <div className="flex gap-2">
            <div className="h-5 bg-slate-200 rounded-md w-20"></div>
            <div className="h-5 bg-slate-200 rounded-md w-16"></div>
          </div>
          {/* action buttons */}
          <div className="flex items-center justify-between pt-3 border-t border-slate-100">
            <div className="flex gap-1">
              <div className="w-8 h-8 bg-slate-200 rounded-lg"></div>
              <div className="w-8 h-8 bg-slate-200 rounded-lg"></div>
            </div>
            <div className="flex gap-1">
              <div className="w-8 h-8 bg-slate-200 rounded-lg"></div>
              <div className="w-8 h-8 bg-slate-200 rounded-lg"></div>
            </div>
          </div>
        </div>
      </div>
    ))}
  </div>
);

export default SkeletonGrid;
