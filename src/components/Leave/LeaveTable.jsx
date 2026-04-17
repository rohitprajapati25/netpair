// import React, { useState } from "react";

// const LeaveTable = ({ data, onStatusChange }) => {

//   const [editLeave, setEditLeave] = useState(null);
//   const [newStatus, setNewStatus] = useState("");

//   const statusStyle = (status) => {
//     switch (status) {
//       case "Approved":
//         return "bg-green-100 text-green-700";
//       case "Rejected":
//         return "bg-red-100 text-red-700";
//       default:
//         return "bg-yellow-100 text-yellow-700";
//     }
//   };

//   const openEditPopup = (leave) => {
//     setEditLeave(leave);
//     setNewStatus(leave.status);
//   };

//   const closePopup = () => {
//     setEditLeave(null);
//   };

//   const saveStatus = () => {
//     onStatusChange(editLeave.id, newStatus);
//     closePopup();
//   };

//   return (
//     <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-x-auto">
//       <table className="w-full min-w-[900px]">

//         <thead className="bg-gray-50 text-gray-600 text-sm">
//           <tr>
//             <th className="px-6 py-4 text-left">Employee</th>
//             <th className="px-6 py-4 text-center">Type</th>
//             <th className="px-6 py-4 text-center">From</th>
//             <th className="px-6 py-4 text-center">To</th>
//             <th className="px-6 py-4 text-center">Days</th>
//             <th className="px-6 py-4 text-center">Status</th>
//             <th className="px-6 py-4 text-center">Action</th>
//           </tr>
//         </thead>

//         <tbody>
//           {data.map((leave) => (
//             <tr key={leave.id} className="border-t hover:bg-blue-50/40">

//               <td className="px-6 py-4 font-medium">{leave.name}</td>
//               <td className="px-6 py-4 text-center">{leave.type}</td>
//               <td className="px-6 py-4 text-center">{leave.from}</td>
//               <td className="px-6 py-4 text-center">{leave.to}</td>
//               <td className="px-6 py-4 text-center font-semibold">{leave.days}</td>

//               <td className="px-6 py-4 text-center">
//                 <span className={`px-3 py-1 rounded-full text-xs font-semibold ${statusStyle(leave.status)}`}>
//                   {leave.status}
//                 </span>
//               </td>

//               <td className="px-6 py-4">
//                 <div className="flex justify-center gap-2">

//                   {leave.status === "Pending" && (
//                     <div className="flex items-center justify-center gap-2">
//                       <button
//                         onClick={() => onStatusChange(leave.id, "Approved")}
//                         className="p-2 rounded-lg hover:bg-blue-100 transition">
//                         <i className="ri-check-line text-green-600 cursor-pointer hover:scale-110"></i>
//                       </button>

//                       <button
//                         onClick={() => onStatusChange(leave.id, "Rejected")}
//                         className="p-2 rounded-lg hover:bg-blue-100 transition">
//                         <i className="ri-close-line text-red-600 cursor-pointer hover:scale-110"></i>
//                       </button>
//                     </div>
//                   )}


//                  <button className="p-2 rounded-lg hover:bg-green-100 transition" onClick={() => openEditPopup(leave)}>
//                     <i className="ri-edit-line text-green-600"></i>
//                   </button>
//                 </div>
//               </td>

//             </tr>
//           ))}
//         </tbody>

//       </table>

//       {editLeave && (
//         <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
//           <div className="bg-white rounded-2xl p-6 w-[320px] shadow-xl">

//             <h2 className="text-lg font-semibold mb-4 text-center">
//               Edit Leave Status
//             </h2>

//             <select
//               value={newStatus}
//               onChange={(e) => setNewStatus(e.target.value)}
//               className="w-full border rounded-lg px-4 py-2 mb-5" >
//               <option value="Pending">Pending</option>
//               <option value="Approved">Approved</option>
//               <option value="Rejected">Rejected</option>
//             </select>

//             <div className="flex justify-end gap-3">
//               <button
//                 onClick={closePopup}
//                 className="px-4 py-2 border rounded-lg" >
//                 Cancel
//               </button>

//               <button
//                 onClick={saveStatus}
//                 className="px-4 py-2 bg-blue-600 text-white rounded-lg" >
//                 Save
//               </button>
//             </div>

//           </div>
//         </div>
//       )}

//     </div>
//   );
// };

// export default LeaveTable;


import React, { useState } from "react";
import { RiCheckLine, RiCloseLine, RiEditLine, RiArrowLeftSLine, RiArrowRightSLine } from "react-icons/ri";

const LeaveTable = ({ data, onStatusChange }) => {
  const [currentPage, setCurrentPage] = useState(1);
  const [editLeave, setEditLeave] = useState(null);
  const [newStatus, setNewStatus] = useState("");
  const recordsPerPage = 10;

  // Pagination Logic
  const totalPages = Math.ceil(data.length / recordsPerPage);
  const currentRecords = data.slice((currentPage - 1) * recordsPerPage, currentPage * recordsPerPage);

  const getStatusStyle = (status) => {
    const themes = {
      Approved: "bg-emerald-50 text-emerald-700 border-emerald-100",
      Rejected: "bg-rose-50 text-rose-700 border-rose-100",
      Pending: "bg-amber-50 text-amber-700 border-amber-100",
    };
    return themes[status] || "bg-slate-50 text-slate-600 border-slate-100";
  };

  const saveStatus = () => {
    onStatusChange(editLeave.id, newStatus);
    setEditLeave(null);
  };

  return (
    <div className="w-full flex flex-col">
      <div className="overflow-x-auto" style={{WebkitOverflowScrolling:'touch'}}>
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-slate-50/50">
              <th className="px-8 py-4 text-[11px] font-bold uppercase tracking-widest text-slate-400 border-b border-slate-100">Employee</th>
              <th className="px-8 py-4 text-[11px] font-bold uppercase tracking-widest text-slate-400 text-center border-b border-slate-100">Leave Type</th>
              <th className="px-8 py-4 text-[11px] font-bold uppercase tracking-widest text-slate-400 text-center border-b border-slate-100">Duration (Timeline)</th>
              <th className="px-8 py-4 text-[11px] font-bold uppercase tracking-widest text-slate-400 text-center border-b border-slate-100">Days</th>
              <th className="px-8 py-4 text-[11px] font-bold uppercase tracking-widest text-slate-400 text-center border-b border-slate-100">Status</th>
              <th className="px-8 py-4 text-[11px] font-bold uppercase tracking-widest text-slate-400 text-center border-b border-slate-100">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {currentRecords.map((leave) => (
              <tr key={leave.id} className="group hover:bg-slate-50/50 transition-colors">
                <td className="px-8 py-5">
                  <span className="text-sm font-bold text-slate-800 group-hover:text-blue-600 transition-colors">{leave.name}</span>
                </td>
                <td className="px-8 py-5 text-center">
                  <span className="px-2.5 py-1 bg-slate-100 text-slate-600 rounded-md text-[10px] font-extrabold uppercase tracking-tight italic">
                    {leave.type}
                  </span>
                </td>
                <td className="px-8 py-5">
                  <div className="flex items-center justify-center gap-3 text-xs font-bold text-slate-600">
                    <span>{leave.from}</span>
                    <span className="text-slate-300">→</span>
                    <span>{leave.to}</span>
                  </div>
                </td>
                <td className="px-8 py-5 text-center">
                  <span className="text-sm font-mono font-black text-slate-700">{leave.days}d</span>
                </td>
                <td className="px-8 py-5 text-center">
                  <span className={`px-3 py-1 rounded-full text-[10px] font-black border uppercase tracking-widest ${getStatusStyle(leave.status)}`}>
                    {leave.status}
                  </span>
                </td>
                <td className="px-8 py-5">
                  <div className="flex justify-center gap-2">
                    {leave.status === "Pending" && (
                      <>
                        <button onClick={() => onStatusChange(leave.id, "Approved")} className="p-2 text-emerald-600 hover:bg-emerald-50 rounded-lg transition-all" title="Approve">
                          <RiCheckLine size={20} />
                        </button>
                        <button onClick={() => onStatusChange(leave.id, "Rejected")} className="p-2 text-rose-600 hover:bg-rose-50 rounded-lg transition-all" title="Reject">
                          <RiCloseLine size={20} />
                        </button>
                      </>
                    )}
                    <button onClick={() => { setEditLeave(leave); setNewStatus(leave.status); }} className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-all">
                      <RiEditLine size={18} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Pagination Footer */}
      <div className="px-8 py-4 border-t border-slate-100 flex items-center justify-between bg-slate-50/20">
        <p className="text-xs font-bold text-slate-400 uppercase tracking-tighter">
          Showing <span className="text-slate-900">{((currentPage - 1) * 10) + 1} - {Math.min(currentPage * 10, data.length)}</span> of {data.length} Requests
        </p>
        <div className="flex items-center gap-2">
          <button disabled={currentPage === 1} onClick={() => setCurrentPage(p => p - 1)} className="p-2 rounded-xl border border-slate-200 disabled:opacity-30 transition-all"><RiArrowLeftSLine size={20} /></button>
          <span className="text-xs font-bold px-4">Page {currentPage} of {totalPages}</span>
          <button disabled={currentPage === totalPages} onClick={() => setCurrentPage(p => p + 1)} className="p-2 rounded-xl border border-slate-200 disabled:opacity-30 transition-all"><RiArrowRightSLine size={20} /></button>
        </div>
      </div>

      {/* Modal / Popup */}
      {editLeave && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center z-50 p-3 sm:p-4">
          <div className="bg-white rounded-2xl p-5 sm:p-8 w-full max-w-sm shadow-2xl scale-in-center">
            <h2 className="text-lg sm:text-xl font-black text-slate-800 mb-2">Update Status</h2>
            <p className="text-sm text-slate-500 mb-6 font-medium">Changing status for <span className="text-blue-600 font-bold">{editLeave.name}</span></p>
            <select
              value={newStatus}
              onChange={(e) => setNewStatus(e.target.value)}
              className="w-full border-2 border-slate-100 rounded-2xl px-4 py-3 mb-8 font-bold text-slate-700 focus:border-blue-500 outline-none"
            >
              <option value="Pending">🕒 Pending</option>
              <option value="Approved">✅ Approved</option>
              <option value="Rejected">❌ Rejected</option>
            </select>
            <div className="flex gap-3">
              <button onClick={() => setEditLeave(null)} className="flex-1 py-3 font-bold text-slate-500 bg-slate-100 rounded-2xl hover:bg-slate-200 transition-all">Cancel</button>
              <button onClick={saveStatus} className="flex-1 py-3 font-bold text-white bg-blue-600 rounded-2xl shadow-lg shadow-blue-200 hover:bg-blue-700 transition-all">Save Changes</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default LeaveTable;