import React, { useState } from "react";

const Reports = () => {

  const [filters, setFilters] = useState({
    date: "",
    department: "All",
  });

  const attendanceData = [
    {
      id: 1,
      employee: "Rohit",
      date: "09-02-2026",
      checkIn: "09:30",
      checkOut: "06:00",
      status: "Present",
    },
    {
      id: 2,
      employee: "Amit",
      date: "09-02-2026",
      checkIn: "10:10",
      checkOut: "-",
      status: "Late",
    },
    {
      id: 3,
      employee: "Neha",
      date: "09-02-2026",
      checkIn: "-",
      checkOut: "-",
      status: "Absent",
    },
  ];

  const statusStyle = (status) => {
    switch (status) {
      case "Present":
        return "bg-green-100 text-green-700";
      case "Late":
        return "bg-yellow-100 text-yellow-700";
      case "Absent":
        return "bg-red-100 text-red-700";
      default:
        return "bg-gray-100 text-gray-600";
    }
  };

  return (
    <div className="relative h-full m-1 p-6
      bg-gradient-to-br from-slate-50 to-gray-100
      flex flex-col gap-6 overflow-y-auto rounded-2xl grid-cols-1">

      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <h1 className="text-2xl font-semibold">
          Reports & Analytics
        </h1>

        <button className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition">
          Export Report
        </button>
      </div>

      <div className="grid
  grid-cols-1
  sm:grid-cols-2
  lg:grid-cols-4
  gap-5
  w-full
  p-3 gap-5">
        <ReportCard title="Employees" value="40" color="from-blue-500 to-blue-700" icon="ri-team-line"/>
        <ReportCard title="Present Today" value="32" color="from-green-500 to-green-700" icon="ri-user-follow-line"/>
        <ReportCard title="Assets Assigned" value="25" color="from-purple-500 to-purple-700" icon="ri-computer-line"/>
        <ReportCard title="Tasks Completed" value="18" color="from-orange-500 to-orange-700" icon="ri-task-line"/>
      </div>

      <div className="bg-white p-5 rounded-xl shadow border flex flex-wrap gap-4 items-end">

        <div className="flex flex-col">
          <label className="text-sm text-gray-500">Date</label>
          <input
            type="date"
            className="border p-2 rounded-lg outline-none"
            onChange={(e)=>setFilters({...filters,date:e.target.value})}
          />
        </div>

        <div className="flex flex-col">
          <label className="text-sm text-gray-500">Department</label>
          <select
            className="border p-2 rounded-lg outline-none"
            onChange={(e)=>setFilters({...filters,department:e.target.value})}
          >
            <option>All</option>
            <option>Development</option>
            <option>HR</option>
            <option>Admin</option>
          </select>
        </div>

        <button className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2 rounded-lg transition">
          Apply Filter
        </button>
      </div>

      {/* ATTENDANCE REPORT */}
      <div className="bg-white rounded-xl shadow p-5 border">

        <h2 className="text-lg font-semibold mb-4">
          Attendance Report
        </h2>

        <div className="overflow-x-auto">
          <table className="w-full text-sm">

            <thead className="bg-gray-100 text-gray-600">
              <tr>
                <th className="p-3 text-left">Employee</th>
                <th className="p-3 text-center">Date</th>
                <th className="p-3 text-center">Check In</th>
                <th className="p-3 text-center">Check Out</th>
                <th className="p-3 text-center">Status</th>
              </tr>
            </thead>

            <tbody>
              {attendanceData.map((item)=>(
                <tr key={item.id} className="border-b hover:bg-blue-50 transition text-center">

                  <td className="p-3 text-left font-medium">
                    {item.employee}
                  </td>

                  <td className="p-3">{item.date}</td>
                  <td className="p-3">{item.checkIn}</td>
                  <td className="p-3">{item.checkOut}</td>

                  <td className="p-3">
                    <span className={`px-3 py-1 rounded-full text-xs font-semibold ${statusStyle(item.status)}`}>
                      {item.status}
                    </span>
                  </td>

                </tr>
              ))}
            </tbody>

          </table>
        </div>
      </div>

    </div>
  );
};

const ReportCard = ({ title, value, color, icon }) => (
  <div
    className={`relative overflow-hidden rounded-2xl
    p-6 text-white bg-gradient-to-r ${color}
    shadow-md hover:shadow-2xl transition-all duration-300
    hover:-translate-y-1 group`}
  >

    <div className="flex items-center justify-between relative z-10">

      <div>
        <p className="text-sm opacity-80 tracking-wide">
          {title}
        </p>

        <h2 className="text-4xl font-bold mt-1">
          {value}
        </h2>
      </div>

      <div className="bg-white/20 backdrop-blur-md p-4 rounded-xl
        transition duration-300">
        <i className={`${icon} text-2xl`}></i>
      </div>

    </div>

  </div>
);

export default Reports;