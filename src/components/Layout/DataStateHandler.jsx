import React from "react";
import { RiInboxLine, RiErrorWarningLine } from "react-icons/ri";


/**
 * @component DataStateHandler
 * @description Unified component for error and empty states
 * @description (Loading state should be handled by parent with skeletons)
 * @param {boolean} loading - Loading state (handled by parent)
 * @param {string} error - Error message
 * @param {boolean} isEmpty - Empty data state
 * @param {string} emptyLabel - Empty message
 * @param {function} onRetry - Retry handler for errors
 * @param {JSX} children - Main content to display
 */
const DataStateHandler = ({
  loading,
  error,
  isEmpty,
  emptyLabel = "No data found",
  emptyDescription = "Try adjusting your filters or add new items",
  onRetry,
  children,
}) => {
  // Note: Loading state is handled by parent with skeleton components
  if (loading) {
    return null; // Parent component should show skeletons
  }

  if (error) {
    return (
      <div className="bg-rose-50 border border-rose-100 p-8 rounded-3xl text-center">
        <div className="flex items-center justify-center mb-4">
          <RiErrorWarningLine className="text-rose-600" size={40} />
        </div>
        <p className="text-rose-600 font-bold mb-2">{error}</p>
        {onRetry && (
          <button
            onClick={onRetry}
            className="mt-4 bg-rose-600 hover:bg-rose-700 text-white px-6 py-2 rounded-xl font-bold transition-all"
          >
            Try Again
          </button>
        )}
      </div>
    );
  }

  if (isEmpty) {
    return (
      <div className="text-center py-16 bg-white rounded-[3rem] border-2 border-dashed border-slate-200">
        <div className="flex items-center justify-center mb-4">
          <RiInboxLine className="text-slate-300" size={48} />

        </div>
        <p className="text-slate-400 font-bold text-lg mb-1">{emptyLabel}</p>
        <p className="text-slate-400 text-sm">{emptyDescription}</p>
      </div>
    );
  }

  return children;
};

export default DataStateHandler;
