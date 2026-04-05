import React from "react";

/**
 * @component SkeletonGrid
 * @description Loading skeleton grid for card layouts
 * @param {number} count - Number of skeleton cards to show (default: 4)
 */
const SkeletonGrid = ({ count = 4 }) => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
      {Array.from({ length: count }).map((_, i) => (
        <div key={i} className="animate-pulse">
          <div className="bg-slate-200 h-40 rounded-t-2xl"></div>
          <div className="bg-white p-4 rounded-b-2xl space-y-3">
            <div className="h-4 bg-slate-200 rounded w-3/4"></div>
            <div className="h-4 bg-slate-200 rounded w-1/2"></div>
            <div className="flex gap-2 mt-4">
              <div className="h-8 bg-slate-200 rounded flex-1"></div>
              <div className="h-8 bg-slate-200 rounded flex-1"></div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default SkeletonGrid;
