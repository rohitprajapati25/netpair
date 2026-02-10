import React from "react";

const Reports = () => {
  return (
    <div className="relative h-[100%] m-1 pb-10 pt-5 w-auto bg-white flex flex-col items-bitween pl-5 pr-5 justify-strat gap-3 min-h-full overflow-y-auto rounded-xl">

      
      <h1 className="text-2xl font-semibold mb-6">Reports & Analytics</h1>

      
      <div className="grid grid-cols-1 md:grid-cols-4 gap-5 mb-6">
        <ReportCard title="Employees" value="40" />
        <ReportCard title="Present Today" value="32" />
        <ReportCard title="Assets Assigned" value="25" />
        <ReportCard title="Tasks Completed" value="18" />
      </div>

      <div className="bg-white p-4 rounded-xl shadow mb-6 flex flex-wrap gap-4 border-2 border-gray-400">
        <input type="date" className="border p-2 rounded" />
        <select className="border p-2 rounded">
          <option>All Departments</option>
          <option>Development</option>
          <option>HR</option>
          <option>Admin</option>
        </select>
        <button className="bg-blue-600 text-white px-4 py-2 rounded">
          Apply Filter
        </button>
      </div>

      <div className="bg-white rounded-xl shadow p-5 border-2 border-gray-400">
        <h2 className="text-lg font-semibold mb-4">Attendance Report</h2>

        <div className="overflow-x-auto rounded-lg">
          <table className="w-full">
            <thead className="bg-gray-100">
              <tr className="border-b">
                <th className="p-3 ">Employee</th>
                <th className="p-3 ">Date</th>
                <th className="p-3 ">Check In</th>
                <th className="p-3 ">Check Out</th>
                <th className="p-3 ">Status</th>
              </tr>
            </thead>
            <tbody>
              <tr className="text-center hover:bg-gray-50 border-b">
                <td className="p-3 ">Rohit</td>
                <td className="p-3 ">09‑02‑2026</td>
                <td className="p-3 ">09:30</td>
                <td className="p-3 ">06:00</td>
                <td className="p-3  text-green-600 font-semibold">
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

const ReportCard = ({ title, value }) => (
  <div className="bg-white border-2 border-gray-400 rounded-xl flex items-center shadow hover:shadow-lg transition duration-300 p-5 gap-4">
    <i className="ri-bar-chart-fill text-3xl text-black"></i>
    <div>
      <p className="text-black text-2xl font-bold">{title}</p>
      <h2 className="text-2xl text-center">{value}</h2>
    </div>
  </div>
);

export default Reports;
