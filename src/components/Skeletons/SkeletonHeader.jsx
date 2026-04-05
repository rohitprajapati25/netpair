import React from "react";

/**
 * @component SkeletonHeader
 * @description Loading skeleton for page header
 */
const SkeletonHeader = () => {
  return (
    <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 animate-pulse">
      <div className="flex-1">
        <div className="h-8 bg-slate-200 rounded w-1/2 mb-3"></div>
        <div className="h-4 bg-slate-200 rounded w-3/4"></div>
      </div>
      <div className="h-12 bg-slate-200 rounded-2xl w-40"></div>
    </div>
  );
};

export default SkeletonHeader;
