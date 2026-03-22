

import React from "react";

const AttendanceModal = ({ onClose }) => {
  // return (
  //   <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
      
  //     <div className="bg-white w-[380px] rounded-2xl shadow-2xl p-6 animate-scaleIn">
        
  //       <h3 className="text-xl font-semibold text-gray-800 mb-5">
  //         Mark Attendance
  //       </h3>

  //       <div className="space-y-4">
  //         <input
  //           type="text"
  //           placeholder="Employee Name"
  //           className="w-full border border-gray-300 rounded-lg px-4 py-2
  //           focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
  //         />

  //         <select
  //           className="w-full border border-gray-300 rounded-lg px-4 py-2
  //           focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
  //         >
  //           <option>Present</option>
  //           <option>Absent</option>
  //         </select>
  //       </div>

  //       <div className="flex justify-end gap-3 mt-6">
  //         <button
  //           onClick={onClose}
  //           className="px-4 py-2 rounded-lg border border-gray-300
  //           hover:bg-gray-100 transition"
  //         >
  //           Cancel
  //         </button>

  //         <button
  //           className="px-5 py-2 rounded-lg text-white
  //           bg-gradient-to-r from-blue-600 to-indigo-600
  //           hover:opacity-90 transition shadow-md"
  //         >
  //           Save
  //         </button>
  //       </div>
  //     </div>
  //   </div>
  // );

  return (
    <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-[2px] flex items-center justify-center z-[100] p-4">
      <div className="bg-white w-full max-w-md rounded-2xl shadow-2xl p-8 transform transition-all">
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-xl font-bold text-slate-800">Mark Attendance</h3>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-600"><i className="ri-close-line text-2xl"></i></button>
        </div>

        <div className="space-y-5">
          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-1.5">Employee Name</label>
            <input type="text" placeholder="e.g. Rohit Prajapati" className="w-full border border-slate-200 rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-blue-500/20" />
          </div>

          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-1.5">Status</label>
            <select className="w-full border border-slate-200 rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-blue-500/20 bg-white">
              <option>Present</option>
              <option>Absent</option>
              <option>Late</option>
              <option>On Leave</option>
            </select>
          </div>
        </div>

        <div className="flex gap-3 mt-8">
          <button onClick={onClose} className="flex-1 px-4 py-3 rounded-xl border border-slate-200 font-medium text-slate-600 hover:bg-slate-50 transition">
            Cancel
          </button>
          <button className="flex-1 px-4 py-3 rounded-xl bg-blue-600 text-white font-medium hover:bg-blue-700 shadow-lg shadow-blue-500/30 transition">
            Save Record
          </button>
        </div>
      </div>
    </div>
  );
};

export default AttendanceModal;