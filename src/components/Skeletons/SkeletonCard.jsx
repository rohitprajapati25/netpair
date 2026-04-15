import React from "react";

const SkeletonCard = () => (
  <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden animate-pulse">
    <div className="h-1 bg-slate-200 w-full"></div>
    <div className="p-4 space-y-3">
      <div className="flex items-center gap-3">
        <div className="w-12 h-12 bg-slate-200 rounded-xl shrink-0"></div>
        <div className="flex-1 space-y-2">
          <div className="h-4 bg-slate-200 rounded w-3/4"></div>
          <div className="h-3 bg-slate-200 rounded w-1/2"></div>
        </div>
      </div>
      <div className="space-y-2">
        <div className="h-3 bg-slate-200 rounded w-full"></div>
        <div className="h-3 bg-slate-200 rounded w-2/3"></div>
      </div>
      <div className="flex gap-2 pt-2 border-t border-slate-100">
        <div className="h-8 bg-slate-200 rounded-lg flex-1"></div>
        <div className="h-8 bg-slate-200 rounded-lg flex-1"></div>
      </div>
    </div>
  </div>
);

export default SkeletonCard;
