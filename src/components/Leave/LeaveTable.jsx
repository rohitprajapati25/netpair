import React, { useState } from "react";

const LeaveTable = ({ data, onStatusChange }) => {

  const [editLeave, setEditLeave] = useState(null);
  const [newStatus, setNewStatus] = useState("");

  const statusStyle = (status) => {
    switch (status) {
      case "Approved":
        return "bg-green-100 text-green-700";
      case "Rejected":
        return "bg-red-100 text-red-700";
      default:
        return "bg-yellow-100 text-yellow-700";
    }
  };

  const openEditPopup = (leave) => {
    setEditLeave(leave);
    setNewStatus(leave.status);
  };

  const closePopup = () => {
    setEditLeave(null);
  };

  const saveStatus = () => {
    onStatusChange(editLeave.id, newStatus);
    closePopup();
  };

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-x-auto">
      <table className="w-full min-w-[900px]">

        <thead className="bg-gray-50 text-gray-600 text-sm">
          <tr>
            <th className="px-6 py-4 text-left">Employee</th>
            <th className="px-6 py-4 text-center">Type</th>
            <th className="px-6 py-4 text-center">From</th>
            <th className="px-6 py-4 text-center">To</th>
            <th className="px-6 py-4 text-center">Days</th>
            <th className="px-6 py-4 text-center">Status</th>
            <th className="px-6 py-4 text-center">Action</th>
          </tr>
        </thead>

        <tbody>
          {data.map((leave) => (
            <tr key={leave.id} className="border-t hover:bg-blue-50/40">

              <td className="px-6 py-4 font-medium">{leave.name}</td>
              <td className="px-6 py-4 text-center">{leave.type}</td>
              <td className="px-6 py-4 text-center">{leave.from}</td>
              <td className="px-6 py-4 text-center">{leave.to}</td>
              <td className="px-6 py-4 text-center font-semibold">{leave.days}</td>

              <td className="px-6 py-4 text-center">
                <span className={`px-3 py-1 rounded-full text-xs font-semibold ${statusStyle(leave.status)}`}>
                  {leave.status}
                </span>
              </td>

              <td className="px-6 py-4">
                <div className="flex justify-center gap-2">

                  {leave.status === "Pending" && (
                    <div className="flex items-center justify-center gap-2">
                      <button
                        onClick={() => onStatusChange(leave.id, "Approved")}
                        className="p-2 rounded-lg hover:bg-blue-100 transition">
                        <i className="ri-check-line text-green-600 cursor-pointer hover:scale-110"></i>
                      </button>

                      <button
                        onClick={() => onStatusChange(leave.id, "Rejected")}
                        className="p-2 rounded-lg hover:bg-blue-100 transition">
                        <i className="ri-close-line text-red-600 cursor-pointer hover:scale-110"></i>
                      </button>
                    </div>
                  )}


                 <button className="p-2 rounded-lg hover:bg-green-100 transition" onClick={() => openEditPopup(leave)}>
                    <i className="ri-edit-line text-green-600"></i>
                  </button>
                </div>
              </td>

            </tr>
          ))}
        </tbody>

      </table>

      {editLeave && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl p-6 w-[320px] shadow-xl">

            <h2 className="text-lg font-semibold mb-4 text-center">
              Edit Leave Status
            </h2>

            <select
              value={newStatus}
              onChange={(e) => setNewStatus(e.target.value)}
              className="w-full border rounded-lg px-4 py-2 mb-5" >
              <option value="Pending">Pending</option>
              <option value="Approved">Approved</option>
              <option value="Rejected">Rejected</option>
            </select>

            <div className="flex justify-end gap-3">
              <button
                onClick={closePopup}
                className="px-4 py-2 border rounded-lg" >
                Cancel
              </button>

              <button
                onClick={saveStatus}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg" >
                Save
              </button>
            </div>

          </div>
        </div>
      )}

    </div>
  );
};

export default LeaveTable;