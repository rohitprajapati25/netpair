import React from "react";

/**
 * @component SkeletonModal
 * @description Loading skeleton for modal/form content
 */
const SkeletonModal = () => {
  return (
    <div className="space-y-6 animate-pulse">
      {/* Form Fields */}
      {Array.from({ length: 4 }).map((_, i) => (
        <div key={i} className="space-y-2">
          <div className="h-4 bg-slate-200 rounded w-1/4"></div>
          <div className="h-10 bg-slate-200 rounded-xl"></div>
        </div>
      ))}

      {/* Buttons */}
      <div className="flex gap-4 mt-6">
        <div className="flex-1 h-12 bg-slate-200 rounded-2xl"></div>
        <div className="flex-1 h-12 bg-slate-200 rounded-2xl"></div>
      </div>
    </div>
  );
};

export default SkeletonModal;
