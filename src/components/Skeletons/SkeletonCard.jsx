import React from "react";

/**
 * @component SkeletonCard
 * @description Loading skeleton for card components
 */
const SkeletonCard = () => {
  return (
    <div className="animate-pulse">
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
  );
};

export default SkeletonCard;
