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
    <div className="bg-white border border-slate-200 rounded-xl shadow-sm overflow-hidden">
      <div className="px-6 py-4 border-b border-slate-100 flex justify-between items-center">
        <h3 className="font-semibold text-slate-800">Workforce Activity</h3>
        <input 
          type="text" 
          placeholder="Filter by name..." 
          className="bg-slate-50 border border-slate-200 text-sm px-4 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/20"
        />
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-left">
          <thead className="bg-slate-50/50 text-slate-500 text-xs uppercase tracking-wider">
            <tr>
              <th className="px-6 py-4 font-medium">Employee</th>
              <th className="px-6 py-4 font-medium">Department</th>
              <th className="px-6 py-4 font-medium text-center">Status</th>
              <th className="px-6 py-4 font-medium text-center">Mode</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {filtered.map((emp, i) => (
              <tr key={i} className="hover:bg-slate-50/50 transition-colors">
                <td className="px-6 py-4 font-medium text-slate-900">{emp.name}</td>
                <td className="px-6 py-4 text-slate-500 text-sm">{emp.dept}</td>
                <td className="px-6 py-4 text-center">
                  <span className={`px-2.5 py-0.5 rounded-full text-[11px] font-bold ${badge("attendance", emp.attendance)}`}>
                    {emp.attendance}
                  </span>
                </td>
                <td className="px-6 py-4 text-center text-slate-500 text-sm">{emp.mode}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Table;