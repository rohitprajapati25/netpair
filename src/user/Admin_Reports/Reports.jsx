import React from "react";

const Reports = () => {
  return (
    <div className="relative h-full m-1 p-6
      bg-gradient-to-br from-slate-50 to-gray-100
      flex flex-col gap-6 overflow-y-auto rounded-2xl">

      <h1 className="text-2xl font-semibold">Reports & Analytics</h1>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-5">
        <ReportCard title="Employees" value="40" color="from-blue-500 to-blue-700" icon="ri-team-line"/>
        <ReportCard title="Present Today" value="32" color="from-green-500 to-green-700" icon="ri-user-follow-line"/>
        <ReportCard title="Assets Assigned" value="25" color="from-purple-500 to-purple-700" icon="ri-computer-line"/>
        <ReportCard title="Tasks Completed" value="18" color="from-orange-500 to-orange-700" icon="ri-task-line"/>
      </div>

      <div className="bg-white p-4 rounded-xl shadow flex flex-wrap gap-4 border">
        <input type="date" className="border p-2 rounded-lg outline-none"/>
        
        <select className="border p-2 rounded-lg outline-none">
          <option>All Departments</option>
          <option>Development</option>
          <option>HR</option>
          <option>Admin</option>
        </select>

        <button className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2 rounded-lg transition">
          Apply Filter
        </button>
      </div>

      <div className="bg-white rounded-xl shadow p-5 border">
        <h2 className="text-lg font-semibold mb-4">Attendance Report</h2>

        <div className="overflow-x-auto rounded-lg">
          <table className="w-full">
            <thead className="bg-gray-100">
              <tr>
                <th className="p-3">Employee</th>
                <th className="p-3">Date</th>
                <th className="p-3">Check In</th>
                <th className="p-3">Check Out</th>
                <th className="p-3">Status</th>
              </tr>
            </thead>

            <tbody>
              <tr className="text-center hover:bg-gray-50 border-b">
                <td className="p-3">Rohit</td>
                <td className="p-3">09-02-2026</td>
                <td className="p-3">09:30</td>
                <td className="p-3">06:00</td>
                <td className="p-3 text-green-600 font-semibold">
                  Present
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
};


const ReportCard = ({ title, value, color, icon }) => (
  <div className={`bg-gradient-to-r ${color} text-white rounded-2xl shadow-lg p-5 flex items-center justify-between hover:scale-[1.03] transition duration-300`}>

    <div>
      <p className="text-sm opacity-90">{title}</p>
      <h2 className="text-3xl font-bold">{value}</h2>
    </div>

    <div className="bg-white/20 p-3 rounded-2xl">
      <i className={`${icon} text-2xl`}></i>
    </div>

  </div>
);

export default Reports;