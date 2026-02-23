import React from "react";

const LeaveTable = () => {
  return (
    <div
      className="bg-white rounded-2xl shadow-sm
      border border-gray-200 overflow-x-auto"
    >
      <table className="w-full min-w-[800px]">
        <thead className="bg-gray-50 text-gray-600 text-sm">
          <tr>
            <th className="px-6 py-4 text-left font-semibold">Employee</th>
            <th className="px-6 py-4 text-center font-semibold">Type</th>
            <th className="px-6 py-4 text-center font-semibold">From</th>
            <th className="px-6 py-4 text-center font-semibold">To</th>
            <th className="px-6 py-4 text-center font-semibold">Days</th>
            <th className="px-6 py-4 text-center font-semibold">Status</th>
            <th className="px-6 py-4 text-center font-semibold">Action</th>
          </tr>
        </thead>

        <tbody className="text-sm">
          <tr className="border-t hover:bg-blue-50/40 transition">
            
            <td className="px-6 py-4 flex items-center gap-3">
              <span className="font-medium text-gray-800">
                Rohit Prajapati
              </span>
            </td>

            <td className="px-6 py-4 text-center">Casual</td>
            <td className="px-6 py-4 text-center">12-02-2026</td>
            <td className="px-6 py-4 text-center">14-02-2026</td>
            <td className="px-6 py-4 text-center font-semibold">3</td>

            <td className="px-6 py-4 text-center">
              <span
                className="px-3 py-1 rounded-full text-xs font-semibold
                bg-yellow-100 text-yellow-700"
              >
                Pending
              </span>
            </td>

            <td className="px-6 py-4">
              <div className="flex justify-center gap-2">
                <button
                  className="flex items-center gap-1 px-3 py-1.5
                  bg-green-600 hover:bg-green-700
                  text-white rounded-lg text-xs transition"
                >
                  <i className="ri-check-line"></i>
                  Approve
                </button>

                <button
                  className="flex items-center gap-1 px-3 py-1.5
                  bg-red-600 hover:bg-red-700
                  text-white rounded-lg text-xs transition"
                >
                  <i className="ri-close-line"></i>
                  Reject
                </button>
              </div>
            </td>

          </tr>
        </tbody>
      </table>
    </div>
  );
};

export default LeaveTable;