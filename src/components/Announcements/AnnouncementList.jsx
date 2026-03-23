// const AnnouncementList = ({ data, onSelect, onDelete }) => {
//   if (!data.length)
//     return <p className="text-gray-400">No announcements yet.</p>;

//   return (
//     <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-5">

//       {data.map((a) => (
//         <div
//           key={a.id}
//           onClick={() => onSelect(a)}
//           className="bg-white p-5 rounded-2xl border shadow-sm
//           hover:shadow-xl cursor-pointer transition">

//           <div className="flex justify-between">
//             <h3 className="font-semibold line-clamp-1">{a.title}</h3>

//             <i
//               onClick={(e)=>{
//                 e.stopPropagation();
//                 onDelete(a.id);
//               }}
//               className="ri-delete-bin-line text-red-500"
//             ></i>
//           </div>

//           <p className="text-gray-600 mt-2 line-clamp-3">
//             {a.msg}
//           </p>

//           <div className="text-xs text-gray-400 mt-4 flex justify-between">
//             <span>{a.date}</span>
//             <span>{a.time}</span>
//           </div>

//         </div>
//       ))}

//     </div>
//   );
// };

// export default AnnouncementList;


import React from "react";
import { RiDeleteBin6Line, RiTimeLine, RiCalendarLine, RiMegaphoneLine, RiGroupLine } from "react-icons/ri";

const AnnouncementList = ({ data, onSelect, onDelete }) => {
  if (!data.length)
    return (
      <div className="flex flex-col items-center justify-center py-20 bg-white rounded-[2.5rem] border-2 border-dashed border-slate-200 text-slate-400">
        <RiMegaphoneLine size={48} className="opacity-20 mb-4" />
        <p className="font-bold tracking-tight text-lg">No announcements found.</p>
      </div>
    );

  // Role color logic
  const getRoleStyle = (role) => {
    switch (role) {
      case 'Intern': return 'bg-amber-50 text-amber-600 border-amber-100';
      case 'HR': return 'bg-rose-50 text-rose-600 border-rose-100';
      case 'Developer': return 'bg-indigo-50 text-indigo-600 border-indigo-100';
      case 'Manager': return 'bg-emerald-50 text-emerald-600 border-emerald-100';
      default: return 'bg-blue-50 text-blue-600 border-blue-100';
    }
  };

  return (
    <div className="grid md:grid-cols-2 gap-6">
      {data.map((a) => (
        <div
          key={a.id}
          onClick={() => onSelect(a)}
          className="group bg-white p-6 rounded-[2rem] border border-slate-100 shadow-sm hover:shadow-xl transition-all relative overflow-hidden cursor-pointer"
        >
          <div className="flex justify-between items-start mb-4">
             {/* Role Badge */}
            <span className={`px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-wider border flex items-center gap-1 ${getRoleStyle(a.targetRole)}`}>
              <RiGroupLine size={12} /> {a.targetRole}
            </span>
            
            <button
              onClick={(e) => {
                e.stopPropagation();
                onDelete(a.id);
              }}
              className="p-2 text-slate-300 hover:text-rose-500 transition-all"
            >
              <RiDeleteBin6Line size={18} />
            </button>
          </div>

          <h3 className="font-black text-slate-800 text-lg line-clamp-1 group-hover:text-blue-600 transition-colors">
            {a.title}
          </h3>

          <p className="text-slate-500 mt-2 text-sm font-medium line-clamp-2 leading-relaxed italic">
            "{a.msg}"
          </p>

          <div className="mt-6 pt-4 border-t border-slate-50 flex justify-between items-center text-[10px] font-black text-slate-400 uppercase tracking-widest">
            <span className="flex items-center gap-1"><RiCalendarLine /> {a.date}</span>
            <span className="flex items-center gap-1"><RiTimeLine /> {a.time}</span>
          </div>
        </div>
      ))}
    </div>
  );
};

export default AnnouncementList;