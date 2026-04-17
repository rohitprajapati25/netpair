// const AnnouncementModal = ({ data, onClose }) => {
//   return (
//     <div
//       className="fixed inset-0 bg-black/40 flex items-center justify-center"
//       onClick={onClose}
//     >
//       <div
//         className="bg-white p-6 rounded-2xl max-w-lg w-[90%]"
//         onClick={(e)=>e.stopPropagation()}
//       >
//         <button
//           onClick={onClose}
//           className="float-right text-lg">✕</button>

//         <h2 className="text-xl font-bold mb-3">{data.title}</h2>

//         <p className="text-gray-700 whitespace-pre-wrap mb-4">
//           {data.msg}
//         </p>

//         <div className="text-sm text-gray-400">
//           {data.date} • {data.time}
//         </div>
//       </div>
//     </div>
//   );
// };

// export default AnnouncementModal;

import React from "react";
import { RiCloseLine, RiCalendarEventLine } from "react-icons/ri";

const AnnouncementModal = ({ data, onClose }) => {
  return (
    <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center z-[200] p-4" onClick={onClose}>
      <div 
        className="bg-white rounded-2xl max-w-2xl w-full shadow-2xl animate-in zoom-in duration-200 flex flex-col max-h-[92vh] overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Header */}
        <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between bg-slate-50/50 shrink-0">
          <div className="flex items-center gap-3">
             <div className="p-2 bg-blue-100 text-blue-600 rounded-xl"><RiCalendarEventLine size={20}/></div>
             <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Full Announcement</span>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-rose-50 hover:text-rose-500 rounded-xl transition-all text-slate-400">
            <RiCloseLine size={22} />
          </button>
        </div>

        {/* Content — scrollable */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8">
          <h2 className="text-xl sm:text-2xl font-black text-slate-800 tracking-tight mb-4 sm:mb-5 leading-tight">
            {data.title}
          </h2>
          <div className="bg-blue-50/30 p-6 rounded-2xl border border-blue-50">
            <p className="text-slate-700 text-base font-medium whitespace-pre-wrap leading-relaxed">
              {data.msg}
            </p>
          </div>
        </div>

        {/* Footer info */}
        <div className="px-6 py-4 bg-slate-50 border-t border-slate-100 flex justify-between items-center shrink-0">
            <div className="flex gap-4">
               <div className="flex flex-col">
                  <span className="text-[9px] font-black text-slate-400 uppercase">Posted on</span>
                  <span className="text-xs font-bold text-slate-600">{data.date}</span>
               </div>
               <div className="flex flex-col border-l border-slate-200 pl-4">
                  <span className="text-[9px] font-black text-slate-400 uppercase">Time</span>
                  <span className="text-xs font-bold text-slate-600">{data.time}</span>
               </div>
            </div>
            <button onClick={onClose} className="px-5 py-2 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl text-sm transition-all">Close</button>
        </div>
      </div>
    </div>
  );
};

export default AnnouncementModal;