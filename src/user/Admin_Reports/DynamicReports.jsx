import React, { useState, useEffect, useCallback } from "react";
import { useAuth } from "../../contexts/AuthContext";

import axios from 'axios';
import { 
  RiTeamLine, RiUserLine, RiComputerLine, RiFolderOpenLine, 
  RiSurveyLine, RiTaskLine, RiFileDownloadLine, RiFilter3Line, RiRefreshLine
} from "react-icons/ri";
import { SkeletonHeader, SkeletonFilter, SkeletonStats, SkeletonTable } from "../../components/Skeletons";
import DataStateHandler from "../../components/Layout/DataStateHandler";
import PieChartSimple from "../../components/Charts/PieChartSimple";
import AreaChartSimple from "../../components/Charts/AreaChartSimple";
import BarCharts from "../../components/Charts/BarCharts";
import { exportToCSV, formatDataForExport } from "../../utils/exportUtils.js";
import API_URL from "../../config/api";

const DynamicReports = () => {
  const { token } = useAuth();
  const [activeTab, setActiveTab] = useState('attendance');
  const [chartData, setChartData] = useState([]); 
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [stats, setStats] = useState({
    totalEmployees: 0,
    presentToday: 0,
    totalAssets: 0,
    activeProjects: 0,
    pendingLeaves: 0,
    tasksCompleted: 0
  });
  const [tabData, setTabData] = useState({
    attendance: [],
    projects: [],
    leaves: [],
    tasks: []
  });
  const [filters, setFilters] = useState({
    dateRange: 'week',
    department: "All",
  });

  const fetchReportsData = useCallback(async () => {
    if (!token) return;
    
    try {
      setLoading(true);
      setError(null);

      const params = new URLSearchParams({
        tab: activeTab,
        dateRange: filters.dateRange,
        department: filters.department
      });

      const response = await axios.get(`${API_URL}/admin/reports?${params}`, {
        headers: { Authorization: `Bearer ${token}` }
      });

      if (response.data.success) {
        setStats(response.data.stats || stats);
        setTabData(prev => ({
          ...prev,
          [activeTab]: response.data.data || []
        }));
        setChartData(response.data.chartData || []); 
      }
    } catch (err) {
      console.error('Dynamic reports error:', err);
      setError(err.response?.data?.message || 'Failed to load dynamic reports');
    } finally {
      setLoading(false);
    }
  }, [token, activeTab, filters.dateRange, filters.department]);

  useEffect(() => {
    const timeout = setTimeout(() => {
      fetchReportsData();
    }, 300);
    return () => clearTimeout(timeout);
  }, [fetchReportsData]);

  useEffect(() => {
    fetchReportsData();
  }, [fetchReportsData]);

  const ReportCard = ({ title, value, change, color, icon, trend }) => (
    <div className={`relative overflow-hidden rounded-2xl p-6 text-white shadow-md hover:shadow-2xl transition-all duration-300 hover:-translate-y-1 group bg-gradient-to-r ${color}`}>
      <div className="flex items-center justify-between relative z-10">
        <div>
          <p className="text-sm opacity-90 tracking-wide font-medium">{title}</p>
          <h2 className="text-3xl font-black mt-1">{value?.toLocaleString?.() || 0}</h2>
          <span className={`text-xs font-bold mt-1 inline-flex items-center gap-1 ${
            trend === 'up' ? 'text-emerald-200' : 'text-rose-200'
          }`}>
            {change}{trend === 'up' ? '↑' : '↓'} last period
          </span>
        </div>
        <div className="bg-white/25 backdrop-blur-sm p-4 rounded-xl group-hover:scale-110 transition-all">
          <i className={`${icon} text-2xl`}></i>
        </div>
      </div>
    </div>
  );

  const handleExport = () => {
    const data = tabData[activeTab] || [];
    const filename = `ims-${activeTab}-report-${new Date().toISOString().split('T')[0]}.csv`;
    exportToCSV(formatDataForExport(data, activeTab), filename);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 p-6 lg:p-10">
        <div className="max-w-7xl mx-auto space-y-10">
          <SkeletonHeader />
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <SkeletonStats />
            <SkeletonStats />
            <SkeletonStats />
          </div>
          <div className="space-y-6">
            <SkeletonFilter />
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <SkeletonTable rows={4} />
              <SkeletonTable rows={4} />
              <SkeletonTable rows={4} />
            </div>
          </div>
        </div>
      </div>
    );
  }

  const TabButton = ({ tab, active }) => (
    <button
      onClick={() => setActiveTab(tab)}
      className={`flex-1 py-4 px-6 font-bold text-sm uppercase tracking-wide transition-all border-b-4 ${
        active
          ? 'bg-gradient-to-r from-emerald-500 to-green-600 text-white border-emerald-500 shadow-lg'
          : 'text-slate-600 hover:text-slate-900 hover:bg-white/50 border-transparent hover:border-slate-200'
      }`}
    >
      {tab.charAt(0).toUpperCase() + tab.slice(1)}
    </button>
  );

  return (
    <DataStateHandler
      error={error}
      isEmpty={tabData[activeTab]?.length === 0}
      emptyLabel={`No ${activeTab} data`}
      emptyDescription={`Dynamic ${activeTab} records will appear here when available for selected filters`}
      onRetry={fetchReportsData}
    >
      <div className="min-h-screen bg-slate-50/50 p-6 lg:p-10 flex flex-col gap-8">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl md:text-4xl font-black text-slate-800 tracking-tight">
              Reports & Analytics Dashboard
            </h1>
            <p className="text-slate-500 font-medium text-sm mt-1">
              Real-time dynamic insights • Auto-refreshes on data changes
            </p>
          </div>
          <button 
            onClick={handleExport}
            disabled={tabData[activeTab]?.length === 0}
            className="bg-gradient-to-r from-emerald-600 to-green-600 hover:from-emerald-700 hover:to-green-700 disabled:opacity-50 disabled:cursor-not-allowed text-white px-8 py-3 rounded-2xl shadow-lg hover:shadow-xl transition-all font-bold flex items-center gap-2 whitespace-nowrap disabled:shadow-none"
          >
            <RiFileDownloadLine size={20} />
            Export {activeTab.charAt(0).toUpperCase() + activeTab.slice(1)} Data
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          <ReportCard 
            title="Total Team Members" 
            value={stats.totalEmployees}
            change="+2%" 
            color="from-emerald-500 to-teal-600" 
            icon="ri-team-line" 
            trend="up"
          />
          <ReportCard 
title="Present"

            value={stats.presentToday}
            change="-1%" 
            color="from-blue-500 to-cyan-600" 
            icon="ri-user-check-line" 
            trend="down"
          />
          <ReportCard 
            title="Total Assets" 
            value={stats.totalAssets}
            change="+3%" 
            color="from-purple-500 to-violet-600" 
            icon="ri-computer-line" 
            trend="up"
          />
          <ReportCard 
            title="Active Projects" 
            value={stats.activeProjects}
            change="+1%" 
            color="from-orange-500 to-amber-600" 
            icon="ri-folder-open-line" 
            trend="up"
          />
          <ReportCard 
            title="Pending Leaves" 
            value={stats.pendingLeaves}
            change="+2%" 
            color="from-pink-500 to-rose-600" 
            icon="ri-survey-line" 
            trend="up"
          />
          <ReportCard 
            title="Tasks Completed" 
            value={stats.tasksCompleted}
            change="+15%" 
            color="from-indigo-500 to-purple-600" 
            icon="ri-task-line" 
            trend="up"
          />
        </div>

        <div className="bg-white/80 backdrop-blur-sm rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
          <div className="flex border-b border-slate-200 bg-gradient-to-r from-slate-50">
            <TabButton tab="attendance" active={activeTab === 'attendance'} />
            <TabButton tab="projects" active={activeTab === 'projects'} />
            <TabButton tab="leaves" active={activeTab === 'leaves'} />
            <TabButton tab="tasks" active={activeTab === 'tasks'} />
          </div>
        </div>

        <div className="bg-white/80 backdrop-blur p-6 rounded-3xl border border-slate-200 shadow-lg">
          <div className="flex flex-wrap items-end gap-6">
            <div className="flex-1 min-w-[200px]">
              <label className="block text-xs font-black uppercase tracking-wider text-slate-500 mb-2">Date Range</label>
              <select 
                value={filters.dateRange}
                onChange={(e) => setFilters(prev => ({ ...prev, dateRange: e.target.value }))}
                className="w-full px-4 py-3 border border-slate-200 rounded-2xl bg-white/50 font-semibold focus:ring-4 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all"
              >
                <option value="today">Today</option>
                <option value="week">This Week</option>
                <option value="month">This Month</option>
                <option value="all">All Time</option>
              </select>
            </div>
            <div className="flex-1 min-w-[200px]">
              <label className="block text-xs font-black uppercase tracking-wider text-slate-500 mb-2">Department</label>
              <select 
                value={filters.department}
                onChange={(e) => setFilters(prev => ({ ...prev, department: e.target.value }))}
                className="w-full px-4 py-3 border border-slate-200 rounded-2xl bg-white/50 font-semibold focus:ring-4 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all"
              >
                <option>All Departments</option>
                <option>Development</option>
                <option>HR</option>
                <option>Admin</option>
                <option>Finance</option>
              </select>
            </div>
            <button 
              onClick={fetchReportsData}
              className="h-14 px-8 bg-gradient-to-r from-emerald-600 to-green-600 hover:from-emerald-700 hover:to-green-600 text-white font-bold rounded-2xl shadow-lg hover:shadow-xl flex items-center gap-2 transition-all whitespace-nowrap"
            >
              <RiFilter3Line size={20} />
              Apply Filters
            </button>
            <button 
              onClick={fetchReportsData}
              className="h-14 px-8 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-2xl shadow-sm flex items-center gap-2 transition-all whitespace-nowrap"
            >
              <RiRefreshLine size={20} />
              Refresh Live Data
            </button>
          </div>
        </div>

        {activeTab === 'attendance' && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <PieChartSimple data={response?.data?.chartData || []} />
            <AreaChartSimple data={tabData[activeTab] || []} />
            <BarCharts data={tabData[activeTab] || []} />
          </div>
        )}

        {activeTab === 'attendance' && renderAttendanceTable(tabData.attendance)}
        {activeTab === 'projects' && renderProjectsTable(tabData.projects)}
        {activeTab === 'leaves' && renderLeavesTable(tabData.leaves)}
        {activeTab === 'tasks' && renderTasksTable(tabData.tasks)}
      </div>
    </DataStateHandler>
  );
};

const TabButton = ({ tab, active }) => (
  <button
    onClick={() => setActiveTab(tab)}
    className={`flex-1 py-4 px-6 font-bold text-sm uppercase tracking-wide transition-all border-b-4 ${
      active
        ? 'bg-gradient-to-r from-emerald-500 to-green-600 text-white border-emerald-500 shadow-lg'
        : 'text-slate-600 hover:text-slate-900 hover:bg-white/50 border-transparent hover:border-slate-200'
    }`}
  >
    {tab.charAt(0).toUpperCase() + tab.slice(1)}
  </button>
);

const renderAttendanceTable = (data) => (
  <div className="bg-white/80 backdrop-blur rounded-3xl border border-slate-200 shadow-xl overflow-hidden">
    <div className="p-8 border-b border-slate-100 bg-gradient-to-r from-emerald-50 to-green-50/50">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-black text-slate-800 flex items-center gap-3">
          Live Attendance Records
        </h2>
        <span className="text-sm font-bold px-4 py-2 bg-emerald-100 text-emerald-800 rounded-2xl shadow-sm">
          {data.length} Records Found
        </span>
      </div>
    </div>
    <div className="overflow-x-auto">
      <table className="w-full divide-y divide-slate-200">
        <thead className="bg-slate-50">
          <tr>
            <th className="px-8 py-4 text-left text-xs font-black uppercase tracking-wider text-slate-500">Employee</th>
            <th className="px-8 py-4 text-center text-xs font-black uppercase tracking-wider text-slate-500">Date</th>
            <th className="px-8 py-4 text-center text-xs font-black uppercase tracking-wider text-slate-500">Check-In</th>
            <th className="px-8 py-4 text-center text-xs font-black uppercase tracking-wider text-slate-500">Status</th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-slate-100">
          {data.slice(0, 5).map((record) => (
            <tr key={record._id} className="hover:bg-emerald-50/30 transition-colors">
              <td className="px-8 py-5">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-gradient-to-br from-emerald-400 to-green-500 rounded-full flex items-center justify-center shadow-lg">
                    <span className="text-white font-bold text-sm">
                      {record.employee?.name?.[0]?.toUpperCase() || 'U'}
                    </span>
                  </div>
                  <div>
                    <p className="font-semibold text-slate-800">{record.employee?.name}</p>
                    <p className="text-xs text-slate-500">{record.employee?.department}</p>
                  </div>
                </div>
              </td>
              <td className="px-8 py-5 text-center font-mono text-sm text-slate-700">
                {new Date(record.date).toLocaleDateString('en-IN')}
              </td>
              <td className="px-8 py-5 text-center">
                <span className="px-4 py-2 bg-slate-100 text-slate-800 text-xs font-bold rounded-xl font-mono">
                  {record.checkIn || 'Pending'}
                </span>
              </td>
              <td className="px-8 py-5 text-center">
                <StatusBadge status={record.status} />
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  </div>
);

const StatusBadge = ({ status }) => (
  <span className={`px-4 py-2 text-xs font-black rounded-2xl uppercase tracking-wide border shadow-sm ${
    status === 'Present' ? 'bg-emerald-100 text-emerald-800' :
    status === 'Late' ? 'bg-amber-100 text-amber-800' :
    status === 'Absent' ? 'bg-rose-100 text-rose-800' :
    'bg-slate-100 text-slate-800'
  }`}>
    {status || 'Pending'}
  </span>
);

const renderProjectsTable = (data) => (
  <div className="bg-white/80 backdrop-blur rounded-3xl border border-slate-200 shadow-xl p-8">
    <h2 className="text-2xl font-black text-slate-800 mb-6">Active Projects ({data.length})</h2>
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {data.slice(0, 6).map((project) => (
        <div key={project._id} className="p-6 bg-gradient-to-br from-slate-50 to-blue-50 rounded-2xl border hover:shadow-xl transition-all">
          <h3 className="font-bold text-slate-800 mb-3">{project.name}</h3>
          <div className="w-full bg-slate-200 rounded-full h-3 mb-3 overflow-hidden">
            <div 
              className="h-full bg-gradient-to-r from-emerald-500 to-teal-600 rounded-full transition-all" 
              style={{ width: `${project.progress || 0}%` }}
            />
          </div>
          <div className="flex justify-between items-center">
            <span className="text-2xl font-black text-emerald-600">
              {project.progress || 0}%
            </span>
            <StatusBadge status={project.status} />
          </div>
        </div>
      ))}
    </div>
  </div>
);

const renderLeavesTable = renderProjectsTable;
const renderTasksTable = renderProjectsTable;

export default DynamicReports;
