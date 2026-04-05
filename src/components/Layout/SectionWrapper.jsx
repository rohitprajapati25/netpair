import React from "react";

/**
 * @component SectionWrapper
 * @description Common wrapper for page sections with consistent spacing and styling
 * @param {JSX} children - Section content
 * @param {string} className - Additional CSS classes
 * @param {boolean} withBg - Show white background (default: true)
 */
const SectionWrapper = ({ children, className = "", withBg = true }) => {
  return (
    <div
      className={`
        ${withBg ? "bg-white rounded-[2rem] border border-slate-200 shadow-sm" : ""}
        p-6 lg:p-8
        ${className}
      `}
    >
      {children}
    </div>
  );
};

export default SectionWrapper;
