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
    <div className={`flex flex-col ${align === "row" ? "sm:flex-row sm:items-center" : ""} justify-between gap-3`}>
      <div>
        <h1 className="text-2xl lg:text-3xl font-black text-slate-800 tracking-tight">{title}</h1>
        <p className="text-slate-500 font-medium text-sm">{description}</p>
      </div>

      {action && (
        <button
          onClick={action.onClick}
          className="w-auto self-start sm:self-auto flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-5 py-2.5 rounded-xl font-bold shadow-md transition-all active:scale-95 text-sm whitespace-nowrap"
        >
          {action.icon && <span>{action.icon}</span>}
          <span>{action.label}</span>
        </button>
      )}
    </div>
  );
};

export default PageHeader;
