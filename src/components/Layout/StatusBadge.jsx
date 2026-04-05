import React from "react";

/**
 * @component StatusBadge
 * @description Reusable status badge with color variants
 * @param {string} status - Status value
 * @param {Object} statusConfig - Config mapping {status: {label, color, textColor}}
 */
const StatusBadge = ({ status, statusConfig = {} }) => {
  const config = statusConfig[status?.toLowerCase()] || {
    label: status,
    color: "bg-slate-100",
    textColor: "text-slate-600",
  };

  return (
    <span className={`inline-block px-3 py-1 rounded-full text-xs font-bold ${config.color} ${config.textColor}`}>
      {config.label}
    </span>
  );
};

export default StatusBadge;
