import React, { useState } from "react";

const Table = () => {

  const [search, setSearch] = useState("");

  const employees = [
    {
      name: "Rohit Prajapati",
      dept: "Development",
      status: "Present",
      checkin: "09:30 AM",
      mode: "Office",
    },
    {
      name: "Ravi Prajapati",
      dept: "Development",
      status: "Absent",
      checkin: "-",
      mode: "-",
    },
    {
      name: "Amit Shah",
      dept: "HR",
      status: "Present",
      checkin: "09:10 AM",
      mode: "Remote",
    },
    {
      name: "Neha Patel",
      dept: "Design",
      status: "Present",
      checkin: "09:45 AM",
      mode: "Office",
    },
    {
      name: "Jay Mehta",
      dept: "QA",
      status: "Absent",
      checkin: "-",
      mode: "-",
    },
  ];

  const filteredData = employees.filter((emp) =>
    emp.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6 w-full">

      <div className="flex flex-wrap gap-3 items-center justify-between mb-5">
        <h2 className="text-xl font-semibold text-gray-800">
          Employee Attendance
        </h2>

        <input
          type="text"
          placeholder="Search employee..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="border rounded-lg px-4 py-2 text-sm
          focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      <div className="overflow-auto max-h-[400px] rounded-xl border border-gray-300">
        <table className="w-full text-sm">
          <thead className="sticky top-0 bg-gray-50 border-b text-gray-600">
            <tr>
              <th className="px-6 py-3 text-left">Employee</th>
              <th className="px-6 py-3 text-left">Department</th>
              <th className="px-6 py-3 text-center">Status</th>
              <th className="px-6 py-3 text-center">Check-in</th>
              <th className="px-6 py-3 text-center">Mode</th>
            </tr>
          </thead>

          <tbody>
            {filteredData.map((emp, index) => (
              <tr
                key={index}
                className="border-b hover:bg-blue-50/40 transition"
              >
                <td className="px-6 py-4 font-medium text-gray-800">
                  {emp.name}
                </td>

                <td className="px-6 py-4">{emp.dept}</td>

                <td className="px-6 py-4 text-center">
                  <span
                    className={`px-3 py-1 rounded-full text-xs font-semibold
                    ${
                      emp.status === "Present"
                        ? "bg-green-100 text-green-700"
                        : "bg-red-100 text-red-700"
                    }`}
                  >
                    {emp.status}
                  </span>
                </td>

                <td className="px-6 py-4 text-center">
                  {emp.checkin}
                </td>

                <td className="px-6 py-4 text-center">
                  <span
                    className={`px-3 py-1 rounded-full text-xs font-semibold
                    ${
                      emp.mode === "Remote"
                        ? "bg-purple-100 text-purple-700"
                        : "bg-blue-100 text-blue-700"
                    }`}
                  >
                    {emp.mode}
                  </span>
                </td>
              </tr>
            ))}

            {filteredData.length === 0 && (
              <tr>
                <td
                  colSpan="5"
                  className="text-center py-10 text-gray-400"
                >
                  No employee found
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Table;