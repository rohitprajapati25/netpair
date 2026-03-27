import React, { useState, useEffect } from "react";
import axios from "axios";
import { useAuth } from "../../contexts/AuthContext";
import {
  RiArrowLeftSLine,
  RiArrowRightSLine,
  RiTimeLine,
  RiEditLine,
  RiDeleteBinLine,
} from "react-icons/ri";

const AttendanceTable = ({
  data = [],
  onRefresh,
  onEdit,
  loading,
  totalEmployees,
  activeEmployees,
}) => {
  const { token } = useAuth();
  const [currentPage, setCurrentPage] = useState(1);
  const [deleteLoading, setDeleteLoading] = useState({});
  const recordsPerPage = 10;

  // Filter active/Present records only
  const activeRecords = data.filter(item => item.status === "Present");

  const totalPages = Math.ceil(activeRecords.length / recordsPerPage);
  const currentRecords = activeRecords.slice(
    (currentPage - 1) * recordsPerPage,
    currentPage * recordsPerPage
  );

  useEffect(() => {
    setCurrentPage(1); // Reset to first page when data changes
  }, [data]);

  const calculateHours = (checkIn, checkOut) => {
    if (!checkIn || !checkOut || checkIn === "-" || checkOut === "-") return "--";
    const [h1, m1] = checkIn.split(":").map(Number);
    const [h2, m2] = checkOut.split(":").map(Number);
    let diff = (h2 * 60 + m2) - (h1 * 60 + m1);
    if (diff < 0) diff += 1440;
    return `${Math.floor(diff / 60)}h ${diff % 60}m`;
  };

  const getStatusBadge = (status) => ({
    Present: "bg-emerald-100 text-emerald-800 border-emerald-200",
    Absent: "bg-rose-100 text-rose-800 border-rose-200",
    Late: "bg-amber-100 text-amber-800 border-amber-200",
    Leave: "bg-blue-100 text-blue-800 border-blue-200",
  }[status] || "bg-slate-100 text-slate-600 border-slate-200");

  const handleDelete = async (itemId) => {
    if (!confirm("Delete this attendance record?")) return;
    try {
      setDeleteLoading(prev => ({ ...prev, [itemId]: true }));
      await axios.delete(`http://localhost:5000/api/admin/attendance/${itemId}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (onRefresh) onRefresh();
    } catch (err) {
      alert(err.response?.data?.message || "Delete failed");
    } finally {
      setDeleteLoading(prev => ({ ...prev, [itemId]: false }));
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-slate-500">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-slate-400 mb-4" />
        <p className="text-lg font-semibold">Loading attendance...</p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-2xl overflow-hidden shadow-sm border">
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gradient-to-r from-slate-50 to-slate-100">
            <tr>
              <th className="px-6 py-4 text-left text-xs font-bold uppercase tracking-wider text-slate-500">
                Employee / Department
              </th>
              <th className="px-4 py-4 text-center text-xs font-bold uppercase tracking-wider text-slate-500">
                Check In - Out
              </th>
              <th className="px-4 py-4 text-center text-xs font-bold uppercase tracking-wider text-slate-500">
                Mode
              </th>
              <th className="px-4 py-4 text-center text-xs font-bold uppercase tracking-wider text-slate-500">
                Hours
              </th>
              <th className="px-4 py-4 text-center text-xs font-bold uppercase tracking-wider text-slate-500">
                Status
              </th>
              <th className="px-3 py-4 text-center text-xs font-bold uppercase tracking-wider text-slate-500 w-20">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {currentRecords.length > 0 ? (
              currentRecords.map((item) => {
                const totalHrs = calculateHours(item.in, item.out);
                const isDeleting = deleteLoading[item.id];
                return (
                  <tr key={item.id} className="hover:bg-slate-50 transition-colors">
                    <td className="px-6 py-4">
                      <div className="flex items-center space-x-3">
                        <div className="w-10 h-10 bg-gradient-to-br from-blue-400 to-indigo-500 rounded-xl flex items-center justify-center">
                          <span className="text-white font-bold text-sm">
                            {item.name.charAt(0).toUpperCase()}
                          </span>
                        </div>
                        <div>
                          <div className="font-semibold text-slate-900">{item.name}</div>
                          <div className="text-xs text-slate-500">{item.dept}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-4 text-center">
                      <div className="flex items-center justify-center space-x-2 text-xs">
                        <span className="font-mono bg-slate-100 px-2 py-1 rounded">{item.in || '--'}</span>
                        <span className="text-slate-400">→</span>
                        <span className="font-mono bg-slate-100 px-2 py-1 rounded">{item.out || '--'}</span>
                      </div>
                    </td>
                    <td className="px-4 py-4 text-center">
                      <span className={`inline-flex px-2 py-1 rounded-full text-xs font-bold border ${item.mode === "WFH" ? "bg-purple-100 text-purple-800 border-purple-200" : "bg-blue-100 text-blue-800 border-blue-200"}`}>
                        {item.mode || "Office"}
                      </span>
                    </td>
                    <td className="px-4 py-4 text-center">
                      <div className="font-mono font-bold text-slate-900">{totalHrs}</div>
                    </td>
                    <td className="px-4 py-4 text-center">
                      <span className={`inline-flex px-3 py-1 rounded-full text-xs font-bold ${getStatusBadge(item.status)}`}>
                        {item.status || "--"}
                      </span>
                    </td>
                    <td className="px-3 py-4">
                      <div className="flex items-center space-x-1 justify-center">
                        <button
                          onClick={() => handleEdit(item)}
                          title="Edit"
                          className="p-1.5 text-slate-500 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-all"
                        >
                          <RiEditLine size={16} />
                        </button>
                        <button
                          onClick={() => handleDelete(item.id)}
                          disabled={isDeleting}
                          title="Delete"
                          className="p-1.5 text-slate-500 hover:text-red-600 hover:bg-red-50 rounded-lg transition-all disabled:opacity-50"
                        >
                          {isDeleting ? (
                            <div className="w-4 h-4 border-2 border-red-500 border-t-transparent rounded-full animate-spin" />
                          ) : (
                            <RiDeleteBinLine size={16} />
                          )}
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })
            ) : (
              <tr>
                <td colSpan={6} className="px-6 py-12 text-center text-slate-400">
                  <div className="text-lg font-semibold mb-1">No Active Records</div>
                  <div className="text-sm">All employees marked Absent or no attendance today</div>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Footer */}
      <div className="px-6 py-4 border-t bg-slate-50">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 text-xs">
          <div className="text-slate-500 font-medium">
            Active Records: <span className="font-black text-emerald-600">{activeRecords.length}</span> of {data.length} | 
            Total Employees: <span className="font-black">{totalEmployees || "--"}</span> | 
            Active Staff: <span className="font-black text-emerald-600">{activeEmployees || "--"}</span>
          </div>
          {totalPages > 1 && (
            <div className="flex items-center gap-1">
              <button
                disabled={currentPage === 1}
                onClick={() => setCurrentPage(p => p - 1)}
                className="p-1.5 border rounded text-slate-400 hover:text-slate-700 disabled:opacity-50"
              >
                <RiArrowLeftSLine size={16} />
              </button>
              <span className="px-3 py-1 bg-white border rounded text-slate-600 font-medium">
                Page {currentPage} of {totalPages}
              </span>
              <button
                disabled={currentPage === totalPages}
                onClick={() => setCurrentPage(p => p + 1)}
                className="p-1.5 border rounded text-slate-400 hover:text-slate-700 disabled:opacity-50"
              >
                <RiArrowRightSLine size={16} />
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AttendanceTable;

