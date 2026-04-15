import React from "react";

const SkeletonStats = ({ count = 4 }) => (
  <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 lg:gap-5">
    {Array.from({ length: count }).map((_, i) => (
      <div key={i} className="rounded-2xl p-4 lg:p-5 bg-slate-200 animate-pulse h-20 lg:h-24"></div>
    ))}
  </div>
);

export default SkeletonStats;
