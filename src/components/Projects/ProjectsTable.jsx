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
import { RiEditLine, RiDeleteBinLine, RiTimeLine } from "react-icons/ri";

const ProjectsTable = ({ data, onDelete, onEdit }) => {
  const getStatusBadge = (status) => {
    const styles = {
      Completed: "bg-emerald-50 text-emerald-700 border-emerald-100",
      Ongoing: "bg-blue-50 text-blue-700 border-blue-100",
      "On Hold": "bg-amber-50 text-amber-700 border-amber-100",
    };
    return styles[status] || "bg-slate-50 text-slate-600 border-slate-100";
  };

  return (
    <div className="bg-white rounded-b-2xl border-x border-b border-slate-200 overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full min-w-[800px] text-left">
          <thead>
            <tr className="bg-slate-50/50 border-b border-slate-100">
              <th className="px-8 py-5 text-[11px] font-bold uppercase tracking-widest text-slate-400">Project Details</th>
              <th className="px-8 py-5 text-[11px] font-bold uppercase tracking-widest text-slate-400 text-center">Duration</th>
              <th className="px-8 py-5 text-[11px] font-bold uppercase tracking-widest text-slate-400 text-center">Status</th>
              <th className="px-8 py-5 text-[11px] font-bold uppercase tracking-widest text-slate-400 text-center">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {data.map((p) => (
              <tr key={p.id} className="group hover:bg-slate-50/50 transition-colors">
                <td className="px-8 py-5">
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-xl bg-blue-50 flex items-center justify-center text-blue-600 font-bold border border-blue-100">
                      {p.name.charAt(0)}
                    </div>
                    <div className="flex flex-col">
                      <span className="text-sm font-bold text-slate-800 group-hover:text-blue-600 transition-colors">{p.name}</span>
                      <span className="text-[10px] text-slate-400 font-semibold uppercase tracking-tighter">ID: #{p.id.toString().slice(-4)}</span>
                    </div>
                  </div>
                </td>
                <td className="px-8 py-5">
                  <div className="flex flex-col items-center gap-1">
                    <div className="flex items-center gap-2 text-xs font-bold text-slate-600">
                      <span>{p.start}</span>
                      <span className="text-slate-300">→</span>
                      <span>{p.end}</span>
                    </div>
                    <div className="flex items-center gap-1 text-[10px] text-slate-400 font-medium">
                      <RiTimeLine />
                      Timeline
                    </div>
                  </div>
                </td>
                <td className="px-8 py-5 text-center">
                  <span className={`inline-flex px-3 py-1 rounded-full text-[10px] font-black border uppercase tracking-widest ${getStatusBadge(p.status)}`}>
                    {p.status}
                  </span>
                </td>
                <td className="px-8 py-5">
                  <div className="flex justify-center gap-2">
                    <button onClick={() => onEdit(p)} className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-all">
                      <RiEditLine size={18} />
                    </button>
                    <button onClick={() => onDelete(p.id)} className="p-2 text-rose-600 hover:bg-rose-50 rounded-lg transition-all">
                      <RiDeleteBinLine size={18} />
                    </button>
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