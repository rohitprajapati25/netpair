import React from 'react';
import { RiEdit2Line, RiDeleteBinLine } from "react-icons/ri";

const AssetsTable = ({ data = [], onEdit, onDelete, loading = false }) => {
  const getStatusStyle = (status) => {
    switch (status) {
      case "Assigned": return "bg-emerald-100 text-emerald-800 border-emerald-200";
      case "Available": return "bg-blue-100 text-blue-800 border-blue-200";
      case "Damaged": return "bg-rose-100 text-rose-800 border-rose-200";
      case "Disposed": return "bg-gray-100 text-gray-800 border-gray-200";
      default: return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  if (loading) {
    return (
      <div className="animate-pulse bg-slate-50">
        <div className="overflow-hidden rounded-xl">
          <table className="w-full">
            <thead className="bg-slate-50/50">
              <tr>
                <th className="px-8 py-5"></th>
                <th className="px-8 py-5"></th>
                <th className="px-8 py-5"></th>
                <th className="px-8 py-5"></th>
                <th className="px-8 py-5"></th>
              </tr>
            </thead>
            <tbody>
              {[...Array(8)].map((_, i) => (
                <tr key={i} className="divide-y divide-slate-50">
                  <td className="px-8 py-5">
                    <div className="flex items-center gap-4 h-12">
                      <div className="w-10 h-10 bg-slate-200 rounded-xl"></div>
                      <div className="space-y-1">
                        <div className="h-4 bg-slate-200 rounded w-24"></div>
                        <div className="h-3 bg-slate-200 rounded w-16"></div>
                      </div>
                    </div>
                  </td>
                  <td className="px-8 py-5 text-center">
                    <div className="h-8 bg-slate-200 rounded-full w-20 mx-auto"></div>
                  </td>
                  <td className="px-8 py-5 text-center">
                    <div className="h-10 bg-slate-200 rounded-lg w-24 mx-auto"></div>
                  </td>
                  <td className="px-8 py-5 text-center">
                    <div className="h-8 bg-slate-200 rounded-full w-16 mx-auto"></div>
                  </td>
                  <td className="px-8 py-5 text-right">
                    <div className="flex justify-end gap-2 h-10">
                      <div className="w-10 h-10 bg-slate-200 rounded-xl"></div>
                      <div className="w-10 h-10 bg-slate-200 rounded-xl"></div>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    );
  }

  return (
    <div className="overflow-x-auto" style={{WebkitOverflowScrolling:'touch'}}>
      <table className="w-full">
        <thead>
          <tr className="bg-slate-50/50 text-[10px] font-black uppercase tracking-widest text-slate-400 border-b border-slate-100">
            <th className="px-8 py-5">Asset Details</th>
            <th className="px-8 py-5 text-center">Category</th>
            <th className="px-8 py-5 text-center">Assignee</th>
            <th className="px-8 py-5 text-center">Status</th>
            <th className="px-8 py-5 text-right">Actions</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-50">
          {data.map((asset) => (
            <tr key={asset._id} className="hover:bg-blue-50/30 transition-colors">
              <td className="px-8 py-5">
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-xl bg-slate-100 flex items-center justify-center text-slate-500 border border-slate-200">
                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z"/>
                    </svg>
                  </div>
                  <div>
                    <p className="font-bold text-slate-700 text-sm leading-tight">{asset.name}</p>
                    <p className="text-[11px] text-slate-400 font-bold uppercase tracking-tighter mt-0.5">{asset.assetId}</p>
                  </div>
                </div>
              </td>
              <td className="px-8 py-5 text-center">
                <span className="inline-flex items-center gap-1 text-xs font-bold text-slate-600 bg-slate-100 px-3 py-1 rounded-lg">
                  <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M5 4a3 3 0 00-3 3v6a3 3 0 003 3h10a3 3 0 003-3V7a3 3 0 00-3-3H5zm-1 9v-1h5v1H4z" clipRule="evenodd" />
                  </svg>
                  {asset.category}
                </span>
              </td>
              <td className="px-8 py-5 text-center font-semibold text-slate-600 text-sm">
                {asset.assignedTo?.name || <span className="text-slate-300 italic">—</span>}
              </td>
              <td className="px-8 py-5 text-center">
                <span className={`px-3 py-1.5 rounded-xl text-[10px] font-black border uppercase tracking-wider ${getStatusStyle(asset.status)}`}>
                  {asset.status}
                </span>
              </td>
              <td className="px-8 py-5 text-right">
                <div className="flex justify-end gap-2">
                  <button 
                    onClick={() => onEdit(asset)} 
                    className="p-2.5 text-blue-600 hover:bg-blue-50 rounded-xl shadow-sm border border-blue-100 transition-all hover:scale-105"
                    title="Edit Asset"
                  >
                    <RiEdit2Line size={18} />
                  </button>
                  <button 
                    onClick={() => onDelete(asset._id)} 
                    className="p-2.5 text-rose-500 hover:bg-rose-50 rounded-xl shadow-sm border border-rose-100 transition-all hover:scale-105"
                    title="Delete Asset"
                  >
                    <RiDeleteBinLine size={18} />
                  </button>
                </div>
              </td>
            </tr>
          ))}
          {data.length === 0 && (
            <tr>
              <td colSpan={5} className="px-8 py-12 text-center">
                <div className="text-slate-400 space-y-2">
                  <svg className="w-12 h-12 mx-auto text-slate-300 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                  </svg>
                  <p className="text-lg font-medium">No Assets Found</p>
                  <p className="text-sm">Add your first asset or adjust filters</p>
                </div>
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

export default AssetsTable;

