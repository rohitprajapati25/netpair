import React from "react";

const SkeletonHeader = () => (
  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 animate-pulse">
    <div className="space-y-2">
      <div className="h-8 bg-slate-200 rounded-lg w-48"></div>
      <div className="h-4 bg-slate-200 rounded w-64"></div>
    </div>
    <div className="h-10 bg-slate-200 rounded-xl w-36 self-start sm:self-auto"></div>
  </div>
);

export default SkeletonHeader;
