import React from "react";

/**
 * @component SkeletonStats
 * @description Loading skeleton for stats cards
 * @param {number} count - Number of stat skeletons (default: 4)
 */
const SkeletonStats = ({ count = 4 }) => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
      {Array.from({ length: count }).map((_, i) => (
        <div key={i} className="p-6 rounded-2xl bg-slate-200 animate-pulse h-32"></div>
      ))}
    </div>
  );
};

export default SkeletonStats;
