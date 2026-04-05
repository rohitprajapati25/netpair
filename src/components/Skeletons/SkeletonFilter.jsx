import React from "react";

/**
 * @component SkeletonFilter
 * @description Loading skeleton for filter bar
 */
const SkeletonFilter = () => {
  return (
    <div className="bg-white p-3 rounded-[2rem] border border-slate-200 shadow-sm flex flex-col lg:flex-row gap-4 items-center animate-pulse">
      <div className="relative flex-1 w-full h-12 bg-slate-200 rounded-2xl"></div>
      <div className="flex items-center gap-3 w-full lg:w-auto flex-wrap">
        <div className="h-12 bg-slate-200 rounded-2xl w-40"></div>
        <div className="h-12 bg-slate-200 rounded-xl w-20"></div>
        <div className="h-12 bg-slate-200 rounded-xl w-12"></div>
      </div>
    </div>
  );
};

export default SkeletonFilter;
