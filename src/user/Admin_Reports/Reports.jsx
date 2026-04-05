import React, { useState, useEffect } from "react";
import { SkeletonHeader, SkeletonFilter, SkeletonStats, SkeletonTable } from "../../components/Skeletons";
import { 
  RiTeamLine, 
  RiUserFollowLine, 
  RiComputerLine, 
  RiTaskLine, 
  RiFileDownloadLine,
  RiFilter3Line,
  RiCalendarCheckLine
} from "react-icons/ri";

const Reports = () => {
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({
    date: "",
    department: "All",
  });

  // Simulate API delay
  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 1500);
    return () => clearTimeout(timer);
  }, []);

  const attendanceData = [
    { id: 1, employee: "Rohit", date: "09-02-2026", checkIn: "09:30", checkOut: "06:00", status: "Present" },
    { id: 2, employee: "Amit", date: "09-02-2026", checkIn: "10:10", checkOut: "-", status: "Late" },
    { id: 3, employee: "Neha", date: "09-02-2026", checkIn: "-", checkOut: "-", status: "Absent" },
  ];

  const getStatusStyle = (status) => {
    const styles = {
      Present: "bg-emerald-50 text-emerald-700 border-emerald-100",
      Late: "bg-amber-50 text-amber-700 border-amber-100",
      Absent: "bg-rose-50 text-rose-700 border-rose-100",
    };
    return styles[status] || "bg-slate-50 text-slate-500 border-slate-100";
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50/50 p-6 lg:p-10">
        <div className="max-w-7xl mx-auto space-y-8">
          <SkeletonHeader />
          <SkeletonStats count={4} />
          <SkeletonFilter />
          <SkeletonTable rows={6} />
        </div>
      </div>
    );
  }

  const ReportCard = ({ title, value, color, icon }) => (
    <div className={`relative overflow-hidden rounded-2xl p-6 text-white bg-gradient-to-r ${color} shadow-md hover:shadow-2xl transition-all duration-300 hover:-translate-y-1 group`}>
      <div className="flex items-center justify-between relative z-10">
        <div>
          <p className="text-sm opacity-80 tracking-wide">{title}</p>
          <h2 className="text-4xl font-bold mt-1">{value}</h2>
        </div>
        <div className="bg-white/20 backdrop-blur-md p-4 rounded-xl transition duration-300">
          <i className={`${icon} text-2xl`}></i>
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-slate-50/50 p-6 lg:p-10 flex flex-col gap-8">
      
      {/* Header Section */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-black text-slate-800 tracking-tight">Reports & Analytics</h1>
          <p className="text-slate-500 font-medium text-sm">Real-time insight into organizational performance</p>
        </div>
        <button className="bg-slate-900 text-white px-6 py-3 rounded-2xl hover:bg-blue-600 shadow-lg shadow-slate-200 transition-all font-bold flex items-center gap-2 active:scale-95">
          <RiFileDownloadLine size={20} /> Export Dataset
        </button>
      </div>

      {/* Analytics Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <ReportCard title="Employees" value="40" color="from-blue-500 to-blue-700" icon="RiTeamLine" />
        <ReportCard title="Present Today" value="32" color="from-emerald-500 to-emerald-700" icon="RiUserFollowLine" />
        <ReportCard title="Assets Assigned" value="25" color="from-purple-500 to-purple-700" icon="RiComputerLine" />
        <ReportCard title="Tasks Completed" value="18" color="from-orange-500 to-orange-700" icon="RiTaskLine" />
      </div>

      {/* Filter Toolbar */}
      <div className="bg-white p-6 rounded-[2rem] border border-slate-100 shadow-sm flex flex-wrap items-end gap-6">
        <div className="flex-1 min-w-[200px] space-y-2">
          <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Select Period</label>
          <input
            type="date"
            className="w-full px-5 py-3 bg-slate-50 border border-slate-200 rounded-2xl text-sm font-bold focus:bg-white focus:ring-4 focus:ring-blue-500/5 outline-none transition-all"
            onChange={(e) => setFilters({ ...filters, date: e.target.value })}
          />
        </div>

        <div className="flex-1 min-w-[200px] space-y-2">
          <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Department View</label>
          <select
            className="w-full px-5 py-3 bg-slate-50 border border-slate-200 rounded-2xl text-sm font-bold text-slate-600 outline-none cursor-pointer"
            onChange={(e) => setFilters({ ...filters, department: e.target.value })}
          >
            <option>All Departments</option>
            <option>Development</option>
            <option>HR & Culture</option>
            <option>Administration</option>
          </select>
        </div>

        <button className="h-[48px] px-8 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-2xl transition-all flex items-center gap-2">
          <RiFilter3Line size={18} /> Apply
        </button>
      </div>

      {/* Attendance Table */}
      <div className="bg-white rounded-[2rem] border border-slate-100 shadow-sm overflow-hidden">
        <div className="p-6 border-b border-slate-50 flex items-center justify-between bg-slate-50/30">
          <h2 className="text-lg font-black text-slate-800 flex items-center gap-2">
            <RiCalendarCheckLine className="text-blue-500" /> Attendance Ledger
          </h2>
          <span className="text-[10px] font-bold text-slate-400 uppercase bg-white px-3 py-1 rounded-full border border-slate-100">Live Feed</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="text-[10px] font-black uppercase tracking-widest text-slate-400 border-b border-slate-50">
                <th className="px-8 py-5">Employee Name</th>
                <th className="px-8 py-5 text-center">Log Date</th>
                <th className="px-8 py-5 text-center">Check-In</th>
                <th className="px-8 py-5 text-center">Check-Out</th>
                <th className="px-8 py-5 text-right">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {attendanceData.map((item) => (
                <tr key={item.id} className="hover:bg-blue-50/30 transition-colors group">
                  <td className="px-8 py-5">
                    <span className="font-bold text-slate-700 text-sm">{item.employee}</span>
                  </td>
                  <td className="px-8 py-5 text-center font-semibold text-slate-500 text-xs">{item.date}</td>
                  <td className="px-8 py-5 text-center font-black text-slate-600 text-xs tracking-tighter">{item.checkIn}</td>
                  <td className="px-8 py-5 text-center font-black text-slate-600 text-xs tracking-tighter">{item.checkOut}</td>
                  <td className="px-8 py-5 text-right">
                    <span className={`px-4 py-1.5 rounded-xl text-[10px] font-black border uppercase tracking-wider ${getStatusStyle(item.status)}`}>
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

export default Reports;
