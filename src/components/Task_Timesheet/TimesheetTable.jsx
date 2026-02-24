import React from "react";

const statusStyle = (status) => {
  if (status === "Completed")
    return "bg-green-100 text-green-700";
  if (status === "In Progress")
    return "bg-blue-100 text-blue-700";
  return "bg-gray-100 text-gray-600";
};

const TimesheetTable = ({ data }) => (
  <div
    className="bg-white rounded-2xl shadow-sm
    border border-gray-200 overflow-x-auto w-full"
  >
    <table className="w-full min-w-[750px]">

      {/* HEADER */}
      <thead className="bg-gray-50 text-gray-600 text-sm">
        <tr>
          <th className="px-6 py-4 text-left font-semibold">Employee</th>
          <th className="px-6 py-4 text-left font-semibold">Task</th>
          <th className="px-6 py-4 text-center font-semibold">Date</th>
          <th className="px-6 py-4 text-center font-semibold">Hours</th>
          <th className="px-6 py-4 text-center font-semibold">Status</th>
        </tr>
      </thead>

      {/* BODY */}
      <tbody className="text-sm">
        {data.map((t) => (
          <tr
            key={t.id}
            className="border-t hover:bg-blue-50/40 transition"
          >
            <td className="px-6 py-4 font-medium text-gray-800">
              <div className="flex items-center gap-2">
                <i className="ri-user-line text-gray-500"></i>
                {t.employee}
              </div>
            </td>

            <td className="px-6 py-4">{t.task}</td>

            <td className="px-6 py-4 text-center">{t.date}</td>

            <td className="px-6 py-4 text-center font-semibold">
              {t.hours}h
            </td>

            <td className="px-6 py-4 text-center">
              <span
                className={`px-3 py-1 rounded-full text-xs font-semibold ${statusStyle(
                  t.status
                )}`}
              >
                {t.status}
              </span>
            </td>
          </tr>
        ))}
      </tbody>

    </table>
  </div>
);

export default TimesheetTable;