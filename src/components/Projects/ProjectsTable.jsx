// import React from "react";

// const statusStyle = (status) => {
//   if (status === "Completed") return "bg-green-100 text-green-700";
//   if (status === "Ongoing") return "bg-blue-100 text-blue-700";
//   return "bg-yellow-100 text-yellow-700";
// };

// const ProjectsTable = ({ data, onDelete, onEdit }) => {
//   return (
//     <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-x-auto">
//       <table className="w-full min-w-[800px]">
//         <thead className="bg-gray-50 text-gray-600 text-sm">
//           <tr>
//             <th className="px-6 py-4 text-left font-semibold">Project Name</th>
//             <th className="px-6 py-4 text-center font-semibold">Start Date</th>
//             <th className="px-6 py-4 text-center font-semibold">End Date</th>
//             <th className="px-6 py-4 text-center font-semibold">Status</th>
//             <th className="px-6 py-4 text-center font-semibold">Actions</th>
//           </tr>
//         </thead>
//         <tbody className="text-sm">
//           {data.map((p) => (
//             <tr key={p.id} className="border-t hover:bg-blue-50/40 transition">
//               <td className="px-6 py-4 flex items-center gap-3">
//                 <div className="w-9 h-9 rounded-full bg-blue-100 flex items-center justify-center">
//                   <i className="ri-folder-line text-blue-600"></i>
//                 </div>
//                 <span className="font-medium text-gray-800">{p.name}</span>
//               </td>
//               <td className="px-6 py-4 text-center">{p.start}</td>
//               <td className="px-6 py-4 text-center">{p.end}</td>
//               <td className="px-6 py-4 text-center">
//                 <span className={`px-3 py-1 rounded-full text-xs font-semibold ${statusStyle(p.status)}`}>
//                   {p.status}
//                 </span>
//               </td>
//               <td className="px-6 py-4">
//                 <div className="flex justify-center gap-2 text-sm">
                 
//                   <button 
//                     onClick={() => onEdit(p)}
//                     className="p-2 rounded-lg hover:bg-green-100 transition"
//                   >
//                     <i className="ri-edit-line cursor-pointer text-blue-600 hover:scale-110"></i>
//                   </button>
//                   <button 
//                     onClick={() => onDelete(p.id)}
//                     className="p-2 rounded-lg hover:bg-red-100 transition"
//                   >
//                     <i className="ri-delete-bin-line text-red-600"></i>
//                   </button>
//                 </div>
//               </td>
//             </tr>
//           ))}
//         </tbody>
//       </table>
//     </div>
//   );
// };

// export default ProjectsTable;


import React from "react";
import { RiEditLine, RiDeleteBinLine, RiEyeLine } from "react-icons/ri";

const ProjectsTable = ({ data, onDelete, onEdit, isAdminRole }) => {
  // Debug: console.log('Table isSuperAdmin:', isSuperAdmin);
  const getStatusBadge = (status) => {
    const styles = {
      Pending: "bg-slate-50 text-slate-700 border-slate-100",
      Completed: "bg-emerald-50 text-emerald-700 border-emerald-100",
      Ongoing: "bg-blue-50 text-blue-700 border-blue-100",
      "On Hold": "bg-amber-50 text-amber-700 border-amber-100",
      Cancelled: "bg-rose-50 text-rose-700 border-rose-100",
    };
    return styles[status] || "bg-slate-50 text-slate-600 border-slate-100";
  };

  const getPriorityBadge = (priority) => {
    const styles = {
      Low: "bg-green-50 text-green-700 border border-green-100",
      Medium: "bg-blue-50 text-blue-700 border border-blue-100",
      High: "bg-amber-50 text-amber-700 border border-amber-100",
      Critical: "bg-rose-50 text-rose-700 border border-rose-100",
    };
    return styles[priority] || "bg-slate-50 text-slate-600 border border-slate-100";
  };

  const getProgressBarClass = (progress) => {
    if (progress <= 30) return 'bg-green-500';
    if (progress <= 70) return 'bg-blue-500';
    return 'bg-amber-500';
  };

  return (
    <div className="bg-white rounded-b-2xl border-x border-b border-slate-200 overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full min-w-[1400px] text-left">
          <thead>
            <tr className="bg-slate-50/50 border-b border-slate-100">
<th className="px-6 py-5 text-[11px] font-bold uppercase tracking-widest text-slate-400">Name</th>
              <th className="px-8 py-5 text-[11px] font-bold uppercase tracking-widest text-slate-400">Dept</th>
              <th className="px-8 py-5 text-[11px] font-bold uppercase tracking-widest text-slate-400">Manager</th>
              <th className="px-6 py-5 text-[11px] font-bold uppercase tracking-widest text-slate-400 text-center">Priority</th>
              <th className="px-8 py-5 text-[11px] font-bold uppercase tracking-widest text-slate-400 text-center">Progress</th>
              <th className="px-6 py-5 text-[11px] font-bold uppercase tracking-widest text-slate-400 text-center">Start</th>
              <th className="px-6 py-5 text-[11px] font-bold uppercase tracking-widest text-slate-400 text-center">End</th>
              <th className="px-6 py-5 text-[11px] font-bold uppercase tracking-widest text-slate-400 text-center">Status</th>
              <th className="px-6 py-5 text-[11px] font-bold uppercase tracking-widest text-slate-400 text-center">Created</th>
              <th className="px-8 py-5 text-[11px] font-bold uppercase tracking-widest text-slate-400 text-center">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {data.map((p) => (
              <tr key={p.id} className="group hover:bg-slate-50/50 transition-colors">
                <td className="px-6 py-5 font-medium text-slate-800 max-w-[200px] truncate">
                  {p.name} <span className="text-xs text-slate-400">#{p._id?.slice(-6)}</span>
                </td>
                <td className="px-6 py-5 text-xs text-slate-600">{p.company || 'N/A'}</td>
                <td className="px-6 py-5">
                  <div className="flex items-center gap-1">
                    <div className="w-6 h-6 rounded-full bg-gradient-to-br from-blue-500 to-indigo-500 flex items-center justify-center text-white text-xs font-bold shadow-sm">
                      {p.manager?.name?.charAt(0)?.toUpperCase() || 'U'}
                    </div>
                    <div className="text-xs truncate max-w-[120px]">
                      {p.manager?.name || 'Unassigned'}
                    </div>
                  </div>
                </td>
                <td className="px-4 py-5 text-center">
                  <span className={`inline-flex px-2 py-1 rounded-full text-[10px] font-bold border uppercase tracking-wide ${getPriorityBadge(p.priority)}`}>
                    {p.priority || '—'}
                  </span>
                </td>
                <td className="px-4 py-5 text-center">
                  <div className="w-20 mx-auto bg-slate-100 rounded-full p-1">
                    <div className={`h-2 rounded-full transition-all ${getProgressBarClass(p.computedProgress || p.progress || 0)}`} 
                         style={{width: `${p.computedProgress || p.progress || 0}%`}}></div>
                  </div>
                  <div className="text-xs font-mono mt-1 text-slate-600">{(p.computedProgress || p.progress || 0).toFixed(0)}%</div>
                </td>
                <td className="px-3 py-5 text-xs font-mono text-slate-600 text-center">{p.startDate ? new Date(p.startDate).toLocaleDateString('en-CA') : '—'}</td>
                <td className="px-3 py-5 text-xs font-mono text-slate-600 text-center">{p.endDate ? new Date(p.endDate).toLocaleDateString('en-CA') : '—'}</td>
                <td className="px-4 py-5 text-center">
                  <span className={`inline-flex px-2.5 py-1 rounded-full text-[10px] font-bold border uppercase tracking-wide ${getStatusBadge(p.status)}`}>
                    {p.status}
                  </span>
                </td>
                <td className="px-4 py-5 text-center">
                  <div className="flex items-center justify-center gap-1">
                    <div className="w-5 h-5 rounded-full bg-gradient-to-br from-emerald-500 to-teal-500 flex items-center justify-center text-white text-xs font-bold shadow-sm">
                      {p.createdBy?.name?.charAt(0)?.toUpperCase() || 'C'}
                    </div>
                    <span className="text-xs font-medium text-slate-700 truncate max-w-[80px]">
                      {p.createdBy?.name || 'Admin'}
                    </span>
                  </div>
                </td>
                <td className="px-4 py-5">
                  <div className="flex justify-center gap-1">
{isAdminRole ? (
                      <div className="flex gap-1">
                        <button onClick={() => onEdit(p)} className="p-2 text-blue-600 hover:bg-blue-50/80 rounded-xl transition-all hover:shadow-lg hover:scale-[1.1] active:scale-95 shadow-sm" title="Edit Project">
                          <RiEditLine size={17} />
                        </button>
                        <button onClick={() => onDelete(p._id || p.id)} className="p-2 text-red-600 hover:bg-red-50/80 rounded-xl transition-all hover:shadow-lg hover:scale-[1.1] active:scale-95 shadow-sm" title="Delete Project">
                          <RiDeleteBinLine size={17} />
                        </button>
                      </div>
                    ) : (
                      <span className="p-2.5 text-slate-400 text-xs font-medium flex items-center gap-1 opacity-60 cursor-not-allowed">
                        <RiEyeLine size={15} /> View
                      </span>
                    )}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ProjectsTable;