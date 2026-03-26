import React, { useState } from "react";
import axios from 'axios';
import { useAuth } from "../../contexts/AuthContext";
import { RiArrowLeftSLine, RiArrowRightSLine, RiTimeLine, RiEditLine, RiDeleteBinLine } from "react-icons/ri";

const AttendanceTable = ({ data, onRefresh, onEdit, loading }) => {
  const { token } = useAuth();
  const [currentPage, setCurrentPage] = useState(1);
  const [deleteLoading, setDeleteLoading] = useState({});
  const recordsPerPage = 10;

  const totalPages = Math.ceil(data.length / recordsPerPage);
  const currentRecords = data.slice(
    (currentPage - 1) * recordsPerPage,
    currentPage * recordsPerPage
  );

  const calculateHours = (checkIn, checkOut) => {
    if (!checkIn || !checkOut || checkIn === "-" || checkOut === "-") return "--";
    const [h1, m1] = checkIn.split(":").map(Number);
    const [h2, m2] = checkOut.split(":").map(Number);
    let diff = (h2 * 60 + m2) - (h1 * 60 + m1);
    if (diff < 0) diff += 1440; 
    return `${Math.floor(diff / 60)}h ${diff % 60}m`;
  };

  const getStatusBadge = (status) => ({
    Present: "bg-emerald-50 text-emerald-700 border-emerald-100",
    Absent: "bg-rose-50 text-rose-700 border-rose-100",
    Late: "bg-amber-50 text-amber-700 border-amber-100",
    Leave: "bg-blue-50 text-blue-700 border-blue-100",
  }[status] || "bg-slate-50 text-slate-600 border-slate-100");

  const handleDelete = async (itemId) => {
    if (!confirm('Delete this attendance record? This action cannot be undone.')) return;
    
    try {
      setDeleteLoading(prev => ({...prev, [itemId]: true}));
      await axios.delete(`/api/admin/attendance/${itemId}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (onRefresh) onRefresh();
    } catch (err) {
      alert(err.response?.data?.message || 'Delete failed');
    } finally {
      setDeleteLoading(prev => ({...prev, [itemId]: false}));
    }
  };

  const handleEdit = (item) => {
    if (onEdit) onEdit(item);
  };

  if (loading || !data.length) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-slate-500">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-slate-400 mb-4"></div>
        <p className="text-lg font-semibold">Loading attendance records...</p>
        <p className="text-sm mt-1">Please wait while we fetch latest data</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col w-full">
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-slate-50/50 border-b border-slate-200">
              <th className="px-6 py-5 text-[11px] font-bold uppercase tracking-widest text-slate-400">Employee / Dept</th>
              <th className="px-8 py-5 text-[11px] font-bold uppercase tracking-widest text-slate-400 text-center">In-Out Timeline</th>
              <th className="px-8 py-5 text-[11px] font-bold uppercase tracking-widest text-slate-400 text-center">Work Mode</th>
              <th className="px-8 py-5 text-[11px] font-bold uppercase tracking-widest text-slate-400 text-center">Net Hours</th>
              <th className="px-8 py-5 text-[11px] font-bold uppercase tracking-widest text-slate-400 text-center">Status</th>
              <th className="px-4 py-5 text-[11px] font-bold uppercase tracking-widest text-slate-400 text-center w-24">Actions</th>
            </tr>
          </thead>

          <tbody className="divide-y divide-slate-100">
            {currentRecords.map((item) => {
              const totalHrs = calculateHours(item.in, item.out);
              const isDeleting = deleteLoading[item.id];
              return (
                <tr key={item.id} className="group hover:bg-blue-50/30 transition-all duration-200">
                  <td className="px-6 py-5">
                    <div className="flex flex-col">
                      <span className="text-sm font-bold text-slate-800 group-hover:text-blue-600 transition-colors">{item.name}</span>
                      <span className="text-[11px] font-semibold text-slate-400 mt-0.5">{item.dept} • {item.date}</span>
                    </div>
                  </td>

                  <td className="px-8 py-5">
                    <div className="flex items-center justify-center gap-4">
                      <div className="text-center">
                        <p className="text-xs font-bold text-slate-700">{item.in || "--"}</p>
                        <p className="text-[9px] font-black text-slate-300 uppercase">Start</p>
                      </div>
                      <div className="h-px w-6 bg-slate-200" />
                      <div className="text-center">
                        <p className="text-xs font-bold text-slate-700">{item.out || "--"}</p>
                        <p className="text-[9px] font-black text-slate-300 uppercase">End</p>
                      </div>
                    </div>
                  </td>

                  <td className="px-8 py-5 text-center">
                    <span className={`px-2.5 py-1 rounded-lg text-[10px] font-bold border ${
                      item.mode === "WFH" ? "bg-purple-50 text-purple-600 border-purple-100" : "bg-indigo-50 text-indigo-600 border-indigo-100"
                    }`}>
                      {item.mode || "OFFLINE"}
                    </span>
                  </td>

                  <td className="px-8 py-5 text-center">
                    <div className="inline-flex items-center gap-1.5 text-sm font-mono font-bold text-slate-700">
                      <RiTimeLine className="text-slate-300" />
                      {totalHrs}
                    </div>
                  </td>

                  <td className="px-8 py-5 text-center">
                    <span className={`inline-flex px-3 py-1.5 rounded-full text-[10px] font-black border uppercase tracking-widest shadow-sm ${getStatusBadge(item.status)}`}>
                      {item.status}
                    </span>
                  </td>

                  <td className="px-4 py-5 text-center">
                    <div className="flex items-center gap-1 justify-center">
                      <button
                        onClick={() => handleEdit(item)}
                        className="p-2 text-slate-500 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-all group/edit"
                        title="Edit record"
                      >
                        <RiEditLine size={16} className="group-hover/edit:rotate-12" />
                      </button>
                      <button
                        onClick={() => handleDelete(item.id)}
                        disabled={isDeleting}
                        className="p-2 text-slate-500 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-all disabled:opacity-40"
                        title="Delete record"
                      >
                        {isDeleting ? (
                          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-rose-600"></div>
                        ) : (
                          <RiDeleteBinLine size={16} />
                        )}
                      </button>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      <div className="px-8 py-5 border-t border-slate-100 flex items-center justify-between bg-slate-50/20">
        <p className="text-xs font-bold text-slate-400">
          Showing <span className="text-slate-900">{((currentPage - 1) * 10) + 1}</span> to <span className="text-slate-900">{Math.min(currentPage * 10, data.length)}</span> of <span className="text-slate-900">{data.length}</span> records
        </p>

        <div className="flex items-center gap-1">
          <button
            disabled={currentPage === 1}
            onClick={() => setCurrentPage(p => p - 1)}
            className="p-2 rounded-xl border border-slate-200 hover:bg-white disabled:opacity-30 transition-all"
          >
            <RiArrowLeftSLine size={20} />
          </button>
          
          <div className="flex gap-1 px-2">
            {[...Array(totalPages)].map((_, i) => (
              <button
                key={i}
                onClick={() => setCurrentPage(i + 1)}
                className={`h-9 w-9 rounded-xl text-xs font-bold transition-all ${
                  currentPage === i + 1 
                  ? "bg-blue-600 text-white shadow-lg shadow-blue-100" 
                  : "text-slate-400 hover:bg-slate-100"
                }`}
              >
                {i + 1}
              </button>
            ))}
          </div>

          <button
            disabled={currentPage === totalPages}
            onClick={() => setCurrentPage(p => p + 1)}
            className="p-2 rounded-xl border border-slate-200 hover:bg-white disabled:opacity-30 transition-all"
          >
            <RiArrowRightSLine size={20} />
          </button>
        </div>
      </div>
    </div>
  );
};

export default AttendanceTable;

