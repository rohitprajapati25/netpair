import React from "react";

const SkeletonFilter = () => (
  <div className="bg-white p-3 rounded-2xl border border-slate-200 shadow-sm flex flex-col sm:flex-row gap-3 items-center animate-pulse">
    <div className="flex-1 w-full h-10 bg-slate-200 rounded-xl"></div>
    <div className="flex items-center gap-2 w-full sm:w-auto">
      <div className="h-10 bg-slate-200 rounded-xl w-32"></div>
      <div className="h-10 bg-slate-200 rounded-xl w-10"></div>
      <div className="h-10 bg-slate-200 rounded-xl w-10"></div>
    </div>
  </div>
);

export default SkeletonFilter;
