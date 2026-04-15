import React from "react";

const SkeletonTable = ({ rows = 5, cols = 5 }) => (
  <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden animate-pulse">
    {/* header */}
    <div className="flex gap-4 px-5 py-4 border-b border-slate-100 bg-slate-50">
      {Array.from({ length: cols }).map((_, i) => (
        <div key={i} className="h-3 bg-slate-200 rounded flex-1"></div>
      ))}
    </div>
    {/* rows */}
    {Array.from({ length: rows }).map((_, r) => (
      <div key={r} className="flex gap-4 px-5 py-4 border-b border-slate-50">
        {/* first col: avatar + text */}
        <div className="flex items-center gap-3 flex-[2]">
          <div className="w-8 h-8 bg-slate-200 rounded-full shrink-0"></div>
          <div className="flex-1 space-y-1.5">
            <div className="h-3 bg-slate-200 rounded w-3/4"></div>
            <div className="h-2.5 bg-slate-200 rounded w-1/2"></div>
          </div>
        </div>
        {Array.from({ length: cols - 2 }).map((_, c) => (
          <div key={c} className="h-3 bg-slate-200 rounded flex-1 self-center"></div>
        ))}
        {/* last col: action buttons */}
        <div className="flex gap-1 justify-end flex-1">
          <div className="w-7 h-7 bg-slate-200 rounded-lg"></div>
          <div className="w-7 h-7 bg-slate-200 rounded-lg"></div>
        </div>
      </div>
    ))}
  </div>
);

export default SkeletonTable;
