import React from "react";

const AttendanceTable = ({ data }) => {
  return (
    <div className="w-full bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">

      <div className="overflow-x-auto max-h-[420px] overflow-y-auto">

        <table className="w-full text-sm">
          
          <thead className="bg-gray-50 sticky top-0 z-10">
            <tr className="text-left text-gray-600">
              <th className="px-6 py-4 font-semibold">Employee</th>
              <th className="px-6 py-4 font-semibold">Date</th>
              <th className="px-6 py-4 font-semibold">Check In</th>
              <th className="px-6 py-4 font-semibold">Check Out</th>
              <th className="px-6 py-4 font-semibold">Status</th>
            </tr>
          </thead>

          <tbody>
            {data.map((item) => (
              <tr
                key={item.id}
                className="border-t hover:bg-gray-50 transition"
              >
                <td className="px-6 py-4 font-medium text-gray-800">
                  {item.name}
                </td>

                <td className="px-6 py-4 text-gray-600">
                  {item.date}
                </td>

                <td className="px-6 py-4">
                  {item.in}
                </td>

                <td className="px-6 py-4">
                  {item.out}
                </td>

                <td className="px-6 py-4">
                  <span
                    className={`px-3 py-1 rounded-full text-xs font-semibold
                    ${
                      item.status === "Present"
                        ? "bg-green-100 text-green-700"
                        : "bg-red-100 text-red-700"
                    }`}
                  >
                    {item.status}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>

        </table>
      </div>
    </div>
  );
};

export default AttendanceTable;