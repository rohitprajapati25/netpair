

import React from "react";

const AttendanceModal = ({ onClose }) => {
  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
      
      <div className="bg-white w-[380px] rounded-2xl shadow-2xl p-6 animate-scaleIn">
        
        {/* Header */}
        <h3 className="text-xl font-semibold text-gray-800 mb-5">
          Mark Attendance
        </h3>

        <div className="space-y-4">
          <input
            type="text"
            placeholder="Employee Name"
            className="w-full border border-gray-300 rounded-lg px-4 py-2
            focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
          />

          <select
            className="w-full border border-gray-300 rounded-lg px-4 py-2
            focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
          >
            <option>Present</option>
            <option>Absent</option>
          </select>
        </div>

        <div className="flex justify-end gap-3 mt-6">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-lg border border-gray-300
            hover:bg-gray-100 transition"
          >
            Cancel
          </button>

          <button
            className="px-5 py-2 rounded-lg text-white
            bg-gradient-to-r from-blue-600 to-indigo-600
            hover:opacity-90 transition shadow-md"
          >
            Save
          </button>
        </div>
      </div>
    </div>
  );
};

export default AttendanceModal;