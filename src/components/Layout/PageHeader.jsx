import React from "react";

/**
 * @component PageHeader
 * @description Reusable page header with title, description, and optional action button
 * @param {string} title - Page title
 * @param {string} description - Page description
 * @param {Object} action - Action button config {label, onClick, icon?: JSX}
 * @param {boolean} align - Alignment: 'col' (column) or 'row' (default)
 */
const PageHeader = ({ title, description, action, align = "row" }) => {
  return (
    <div className={`flex flex-col ${align === "row" ? "md:flex-row md:items-end" : ""} justify-between gap-6`}>
      <div>
        <h1 className="text-3xl font-black text-slate-800 tracking-tight">{title}</h1>
        <p className="text-slate-500 font-medium text-sm">{description}</p>
      </div>
      
      {action && (
        <button
          onClick={action.onClick}
          className="flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-6 py-3.5 rounded-2xl font-bold shadow-xl transition-all active:scale-95 whitespace-nowrap"
        >
          {action.icon && <span>{action.icon}</span>}
          <span>{action.label}</span>
        </button>
      )}
    </div>
  );
};

export default PageHeader;
