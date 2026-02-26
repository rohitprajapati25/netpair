import React, { useState } from "react";

const Table = () => {

  const [search, setSearch] = useState("");

  const data = [
    {
      name: "Rohit Prajapati",
      dept: "Development",
      attendance: "Present",
      checkin: "09:30 AM",
      task: "Dashboard UI",
      taskStatus: "In Progress",
      leave: "-",
      mode: "Office",
    },
    {
      name: "Amit Shah",
      dept: "HR",
      attendance: "Late",
      checkin: "10:10 AM",
      task: "Employee Hiring",
      taskStatus: "Pending",
      leave: "Applied",
      mode: "Remote",
    },
    {
      name: "Neha Patel",
      dept: "Design",
      attendance: "Absent",
      checkin: "-",
      task: "-",
      taskStatus: "-",
      leave: "Approved",
      mode: "-",
    },
  ];

  const filtered = data.filter((emp) =>
    emp.name.toLowerCase().includes(search.toLowerCase())
  );

  const badge = (type, value) => {
    if (type === "attendance") {
      if (value === "Present") return "bg-green-100 text-green-700";
      if (value === "Late") return "bg-yellow-100 text-yellow-700";
      return "bg-red-100 text-red-700";
    }

    if (type === "task") {
      if (value === "Completed") return "bg-green-100 text-green-700";
      if (value === "In Progress") return "bg-blue-100 text-blue-700";
      return "bg-gray-100 text-gray-600";
    }

    if (type === "leave") {
      if (value === "Approved") return "bg-purple-100 text-purple-700";
      if (value === "Applied") return "bg-orange-100 text-orange-700";
    }

    return "bg-gray-100 text-gray-600";
  };

  return (
    <div className="w-full bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden p-6">

      <div className="flex justify-between mb-5">
        <h2 className="text-xl font-semibold">
          Workforce Live Activity
        </h2>

        <input
          type="text"
          placeholder="Search employee..."
          value={search}
          onChange={(e)=>setSearch(e.target.value)}
          className="border px-4 py-2 rounded-lg text-sm"
        />
      </div>

      <div className="w-full bg-white rounded-2xl border border-gray-300 shadow-sm overflow-hidden">
        <table className="w-full text-sm">

          <thead className="bg-gray-50 border-b">
            <tr>
              <th className="p-4 text-left">Employee</th>
              <th className="p-4">Dept</th>
              <th className="p-4">Attendance</th>
              <th className="p-4">Check-In</th>
              <th className="p-4">Task</th>
              <th className="p-4">Task Status</th>
              <th className="p-4">Leave</th>
              <th className="p-4">Mode</th>
            </tr>
          </thead>

          <tbody>
            {filtered.map((emp, i)=>(
              <tr key={i} className="border-b hover:bg-blue-50/40">

                <td className="p-4 font-medium">{emp.name}</td>
                <td className="p-4 text-center">{emp.dept}</td>

                <td className="p-4 text-center">
                  <span className={`px-3 py-1 rounded-full text-xs font-semibold ${badge("attendance",emp.attendance)}`}>
                    {emp.attendance}
                  </span>
                </td>

                <td className="p-4 text-center">{emp.checkin}</td>

                <td className="p-4 text-center">{emp.task}</td>

                <td className="p-4 text-center">
                  <span className={`px-3 py-1 rounded-full text-xs ${badge("task",emp.taskStatus)}`}>
                    {emp.taskStatus}
                  </span>
                </td>

                <td className="p-4 text-center">
                  <span className={`px-3 py-1 rounded-full text-xs ${badge("leave",emp.leave)}`}>
                    {emp.leave}
                  </span>
                </td>

                <td className="p-4 text-center">{emp.mode}</td>

                

              </tr>
            ))}
          </tbody>

        </table>
      </div>
    </div>
  );
};

export default Table;