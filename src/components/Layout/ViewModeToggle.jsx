import React from "react";

/**
 * @component ViewModeToggle
 * @description Toggle between card and table view modes
 * @param {string} viewMode - Current view mode ('card' or 'table')
 * @param {function} setViewMode - View mode setter
 * @param {JSX} cardIcon - Icon for card view
 * @param {JSX} tableIcon - Icon for table view
 * @param {string} focusColor - Focus color (indigo, emerald, blue)
 */
const ViewModeToggle = ({ 
  viewMode, 
  setViewMode, 
  cardIcon,
  tableIcon,
  focusColor = "indigo"
}) => {
  const focusClass = {
    indigo: "text-indigo-600",
    emerald: "text-emerald-600",
    blue: "text-blue-600"
  }[focusColor];

  return (
    <div className="flex bg-slate-100 p-1 rounded-xl">
      <button
        onClick={() => setViewMode("card")}
        className={`p-2 rounded-lg transition-all ${
          viewMode === "card"
            ? `bg-white shadow-sm ${focusClass}`
            : "text-slate-400 hover:text-slate-600"
        }`}
        title="Card View"
      >
        {cardIcon}
      </button>
      <button
        onClick={() => setViewMode("table")}
        className={`p-2 rounded-lg transition-all ${
          viewMode === "table"
            ? `bg-white shadow-sm ${focusClass}`
            : "text-slate-400 hover:text-slate-600"
        }`}
        title="Table View"
      >
        {tableIcon}
      </button>
    </div>
  );
};

export default ViewModeToggle;
