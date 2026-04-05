import React from "react";

/**
 * @component StatsGrid
 * @description Reusable stats cards grid
 * @param {Array} stats - Stats array [{icon, num, tot, color}]
 * @param {string} className - Additional CSS classes
 */
const StatsGrid = ({ stats = [], className = "" }) => {
  return (
    <div className={`grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 ${className}`}>
      {stats.map((stat, idx) => (
        <div
          key={idx}
          className={`p-6 rounded-2xl bg-gradient-to-br ${stat.color} text-white shadow-lg`}
        >
          <div className="flex items-center justify-between mb-4">
            <div className="text-4xl font-black">{stat.num}</div>
            {stat.icon && <span className="text-4xl opacity-30">{stat.icon}</span>}
          </div>
          <p className="text-sm font-semibold opacity-90">{stat.tot}</p>
          {stat.change && (
            <p className={`text-xs mt-2 ${stat.change > 0 ? "text-green-100" : "text-red-100"}`}>
              {stat.change > 0 ? "↑" : "↓"} {Math.abs(stat.change)}% this month
            </p>
          )}
        </div>
      ))}
    </div>
  );
};

export default StatsGrid;
