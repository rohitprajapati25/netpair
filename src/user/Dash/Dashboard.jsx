import React, { useState, useCallback, useMemo } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import axios from 'axios';
import {
  RiTeamLine, RiUserFollowLine, RiTaskLine, RiFileList3Line,
  RiCalendarCheckLine, RiProjectorLine, RiRefreshLine,
  RiArrowRightLine, RiEyeLine, RiUserUnfollowLine, RiTimeLine,
  RiSurveyLine, RiComputerLine, RiAlertLine
} from 'react-icons/ri';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer, PieChart, Pie, Cell,
  AreaChart, Area
} from 'recharts';
import { SkeletonHeader, SkeletonStats, SkeletonTable } from '../../components/Skeletons';
import SystemHealth from '../../components/Dashboard/SystemHealth';
import API_URL from '../../config/api';

const API = API_URL.replace(/\/api$/, '') + '/api/admin';

// ── Fetch all dashboard data in one Promise.all ───────────────────────────────
const fetchDashboard = async (token, role) => {
  const headers = { Authorization: `Bearer ${token}` };
  const isEmployee = role === 'employee';

  const requests = [
    axios.get(`${API}/dashboard/stats`, { headers }).catch(() => null),
    isEmployee ? null : axios.get(`${API}/dashboard/activity`, { headers }).catch(() => null),
    isEmployee ? null : axios.get(`${API}/dashboard/attendance-trend`, { headers }).catch(() => null),
  ];

  const [statsRes, activityRes, trendRes] = await Promise.all(requests);

  return {
    stats:           statsRes?.data?.stats           || {},
    activity:        activityRes?.data?.activity     || [],
    attendanceTrend: trendRes?.data?.trend           || [],
  };
};

// ── Dashboard ─────────────────────────────────────────────────────────────────
const Dashboard = () => {
  const { token, user } = useAuth();
  const navigate = useNavigate();
  const role = user?.role?.toLowerCase() || 'employee';

  // ── Single React Query — caches result for 5 min, no re-fetch on nav ───────
  const { data, isLoading, refetch, isRefetching } = useQuery({
    queryKey: ['dashboard', role],
    queryFn:  () => fetchDashboard(token, role),
    enabled:  !!token,
    staleTime: 2 * 60 * 1000,   // dashboard data fresh for 2 min
  });

  const stats           = data?.stats           || {};
  const activity        = data?.activity        || [];
  const attendanceTrend = data?.attendanceTrend || [];

  // ── Stat cards per role ────────────────────────────────────────────────────
  const statCards = useMemo(() => {
    switch (role) {
      case 'superadmin':
        return [
          { icon: RiTeamLine,       value: stats.totalEmployees || 0, label: 'Total Employees', color: 'from-blue-500 to-indigo-600',   link: '/employees',  trend: null },
          { icon: RiUserFollowLine, value: stats.presentToday   || 0, label: 'Present Today',   color: 'from-emerald-500 to-green-600', link: '/attendance', trend: stats.attendanceRate },
          { icon: RiProjectorLine,  value: stats.activeProjects || 0, label: 'Active Projects', color: 'from-purple-500 to-pink-600',   link: '/projects',   trend: null },
          { icon: RiAlertLine,      value: stats.systemAlerts   || 0, label: 'System Alerts',   color: 'from-orange-500 to-red-500',    link: '/audit-logs', trend: null },
        ];
      case 'admin':
        return [
          { icon: RiTeamLine,       value: stats.totalEmployees || 0, label: 'Total Employees', color: 'from-blue-500 to-indigo-600',   link: '/employees',     trend: null },
          { icon: RiUserFollowLine, value: stats.presentToday   || 0, label: 'Present Today',   color: 'from-emerald-500 to-green-600', link: '/attendance',    trend: stats.attendanceRate },
          { icon: RiTaskLine,       value: stats.activeTasks    || 0, label: 'Active Tasks',    color: 'from-purple-500 to-pink-600',   link: '/tasktimesheet', trend: null },
          { icon: RiSurveyLine,     value: stats.pendingLeaves  || 0, label: 'Pending Leaves',  color: 'from-orange-500 to-red-500',    link: '/leave',         trend: null },
        ];
      case 'hr':
        return [
          { icon: RiUserFollowLine,    value: stats.presentToday  || 0, label: 'Present Today',   color: 'from-emerald-500 to-green-600', link: '/attendance',    trend: null },
          { icon: RiSurveyLine,        value: stats.pendingLeaves || 0, label: 'Pending Leaves',  color: 'from-blue-500 to-indigo-600',   link: '/leave',         trend: null },
          { icon: RiTaskLine,          value: stats.activeTasks   || 0, label: 'Active Tasks',    color: 'from-purple-500 to-pink-600',   link: '/tasktimesheet', trend: null },
          { icon: RiProjectorLine,     value: stats.activeProjects|| 0, label: 'Active Projects', color: 'from-orange-500 to-red-500',    link: '/projects',      trend: null },
        ];
      default:
        return [
          { icon: RiTaskLine,          value: stats.myTasks      || 0, label: 'My Tasks',        color: 'from-blue-500 to-indigo-600',   link: '/my-tasks',      trend: null },
          { icon: RiSurveyLine,        value: stats.myLeaves     || 0, label: 'My Leaves',       color: 'from-emerald-500 to-green-600', link: '/my-leave',      trend: null },
          { icon: RiCalendarCheckLine, value: stats.myAttendance || 0, label: 'Days Present',    color: 'from-purple-500 to-pink-600',   link: '/my-attendance', trend: null },
          { icon: RiFileList3Line,     value: stats.myTimesheets || 0, label: 'Timesheets',      color: 'from-orange-500 to-red-500',    link: '/my-tasks',      trend: null },
        ];
    }
  }, [stats, role]);

  // ── Pie data — colors always matched by name ──────────────────────────────
  const pieData = useMemo(() => {
    const present = attendanceTrend.reduce((s, d) => s + (d.Present || 0), 0);
    const absent  = attendanceTrend.reduce((s, d) => s + (d.Absent  || 0), 0);
    const late    = attendanceTrend.reduce((s, d) => s + (d.Late    || 0), 0);

    const all = [
      { name: 'Present', value: present, color: '#10b981' }, // always green
      { name: 'Absent',  value: absent,  color: '#ef4444' }, // always red
      { name: 'Late',    value: late,    color: '#f59e0b' }, // always amber
    ].filter(d => d.value > 0);

    return all.length ? all : [{ name: 'No Data', value: 1, color: '#e2e8f0' }];
  }, [attendanceTrend]);

  // ── Area data ──────────────────────────────────────────────────────────────
  const areaData = useMemo(() => {
    if (attendanceTrend.length) {
      return attendanceTrend.map(d => ({
        day:   d.day,
        value: (d.Present || 0) + (d.Late || 0),
      }));
    }
    return ['Mon','Tue','Wed','Thu','Fri','Sat','Sun'].map(day => ({ day, value: 0 }));
  }, [attendanceTrend]);

  const titleMap = {
    superadmin: 'System Dashboard',
    admin:      'Management Dashboard',
    hr:         'HR Dashboard',
    employee:   'My Workspace',
  };

  const loading    = isLoading;
  const refreshing = isRefetching;

  // ── Loading ────────────────────────────────────────────────────────────────
  if (loading) {
    return (
      <div className="space-y-6">
        <SkeletonHeader />
        <SkeletonStats count={4} />
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
          <div className="lg:col-span-2 bg-slate-200 rounded-2xl h-72 animate-pulse" />
          <div className="bg-slate-200 rounded-2xl h-72 animate-pulse" />
        </div>
        <SkeletonTable rows={5} />
      </div>
    );
  }

  return (
    <div className="space-y-6">

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl lg:text-3xl font-black text-slate-900 tracking-tight">
            {titleMap[role] || 'Dashboard'}
          </h1>
          <p className="text-slate-500 text-sm mt-0.5">
            {new Date().toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
          </p>
        </div>
        <button onClick={() => refetch()} disabled={refreshing}
          className="self-start sm:self-auto flex items-center gap-2 px-4 py-2.5 bg-white border border-slate-200 hover:border-slate-300 text-slate-700 font-semibold rounded-xl shadow-sm hover:shadow transition-all disabled:opacity-50 text-sm">
          <RiRefreshLine className={refreshing ? 'animate-spin' : ''} />
          {refreshing ? 'Refreshing...' : 'Refresh'}
        </button>
      </div>

      {/* Stat Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 lg:gap-5">
        {statCards.map((stat, i) => (
          <div key={i} onClick={() => stat.link && navigate(stat.link)}
            className={`group rounded-2xl p-4 lg:p-5 flex items-center gap-3 shadow-md hover:-translate-y-0.5 hover:shadow-xl transition-all duration-200 cursor-pointer bg-gradient-to-br ${stat.color} text-white`}>
            <div className="flex items-center justify-center h-10 w-10 lg:h-12 lg:w-12 rounded-xl bg-white/20 shrink-0">
              <stat.icon className="text-lg lg:text-xl" />
            </div>
            <div className="min-w-0 flex-1">
              <p className="text-xl lg:text-2xl font-black leading-none">{stat.value}</p>
              <p className="text-[10px] lg:text-xs opacity-90 font-semibold mt-1 leading-tight">{stat.label}</p>
              {stat.trend != null && (
                <p className="text-[10px] opacity-80 mt-0.5">{stat.trend}% this week</p>
              )}
            </div>
            <RiArrowRightLine className="text-sm opacity-0 group-hover:opacity-100 transition-opacity shrink-0" />
          </div>
        ))}
      </div>

      {/* Extra info row — admin/superadmin only */}
      {(role === 'admin' || role === 'superadmin') && (
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {[
            { label: 'Absent Today',       value: stats.absentToday       || 0, bg: 'from-red-500 to-rose-600',      icon: RiUserUnfollowLine },
            { label: 'Late Today',         value: stats.lateToday         || 0, bg: 'from-amber-500 to-orange-500',  icon: RiTimeLine },
            { label: 'Pending Timesheets', value: stats.pendingTimesheets || 0, bg: 'from-blue-500 to-indigo-600',   icon: RiFileList3Line },
            { label: 'Total Assets',       value: stats.totalAssets       || 0, bg: 'from-slate-500 to-slate-700',   icon: RiComputerLine },
          ].map((item, i) => (
            <div key={i} className={`relative overflow-hidden rounded-2xl text-white p-4 bg-gradient-to-r ${item.bg} shadow-md hover:shadow-xl hover:-translate-y-0.5 transition-all duration-200 flex items-center justify-between`}>
              <div>
                <p className="text-xs opacity-90 font-semibold">{item.label}</p>
                <p className="text-2xl font-black mt-1">{item.value}</p>
              </div>
              <div className="bg-white/20 p-2.5 rounded-xl">
                <item.icon size={18} />
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Charts — non-employee only */}
      {role !== 'employee' && (
        <>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">

            {/* Bar Chart */}
            <div className="lg:col-span-2 bg-white rounded-2xl border border-slate-200 shadow-sm p-5">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h3 className="text-base font-bold text-slate-900">Attendance — Last 7 Days</h3>
                  <p className="text-xs text-slate-400 mt-0.5">Present · Absent · Late per day</p>
                </div>
                <button onClick={() => navigate('/attendance')}
                  className="flex items-center gap-1.5 text-blue-600 hover:text-blue-700 font-semibold text-xs transition-colors">
                  <RiEyeLine /> View All
                </button>
              </div>
              <ResponsiveContainer width="100%" height={220}>
                <BarChart data={attendanceTrend} margin={{ top: 5, right: 5, left: -20, bottom: 5 }} barGap={2} barCategoryGap="30%">
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                  <XAxis dataKey="day" axisLine={false} tickLine={false} tick={{ fill: '#94a3b8', fontSize: 11 }} />
                  <YAxis axisLine={false} tickLine={false} tick={{ fill: '#cbd5e1', fontSize: 11 }} allowDecimals={false} />
                  <Tooltip contentStyle={{ borderRadius: 12, border: '1px solid #e2e8f0', boxShadow: '0 4px 20px rgba(0,0,0,0.08)' }} cursor={{ fill: '#f8fafc' }} />
                  <Bar dataKey="Present" fill="#10b981" radius={[4, 4, 0, 0]} barSize={14} />
                  <Bar dataKey="Absent"  fill="#ef4444" radius={[4, 4, 0, 0]} barSize={14} />
                  <Bar dataKey="Late"    fill="#f59e0b" radius={[4, 4, 0, 0]} barSize={14} />
                </BarChart>
              </ResponsiveContainer>
              <div className="flex items-center gap-4 mt-3 pt-3 border-t border-slate-100">
                {[['#10b981','Present'],['#ef4444','Absent'],['#f59e0b','Late']].map(([color, label]) => (
                  <div key={label} className="flex items-center gap-1.5">
                    <div className="w-2.5 h-2.5 rounded-sm" style={{ background: color }} />
                    <span className="text-xs font-semibold text-slate-500">{label}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Pie Chart */}
            <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-5">
              <div className="mb-3">
                <h3 className="text-base font-bold text-slate-900">Week Summary</h3>
                <p className="text-xs text-slate-400 mt-0.5">7-day attendance breakdown</p>
              </div>
              <ResponsiveContainer width="100%" height={180}>
                <PieChart>
                  <Pie data={pieData} cx="50%" cy="50%" innerRadius={50} outerRadius={75} paddingAngle={3} dataKey="value">
                    {pieData.map((entry, i) => (
                      <Cell key={i} fill={entry.color} stroke="white" strokeWidth={2} />
                    ))}
                  </Pie>
                  <Tooltip contentStyle={{ borderRadius: 10, border: '1px solid #e2e8f0' }} />
                </PieChart>
              </ResponsiveContainer>
              <div className="space-y-2 mt-2">
                {pieData.map(d => (
                  <div key={d.name} className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className="w-2.5 h-2.5 rounded-full" style={{ background: d.color }} />
                      <span className="text-xs font-semibold text-slate-600">{d.name}</span>
                    </div>
                    <span className="text-xs font-black text-slate-800">{d.value}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Bottom Row */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">

            {/* Area Chart */}
            <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-5">
              <div className="mb-4">
                <h3 className="text-base font-bold text-slate-900">Presence Trend</h3>
                <p className="text-xs text-slate-400 mt-0.5">Present + Late per day</p>
              </div>
              <ResponsiveContainer width="100%" height={180}>
                <AreaChart data={areaData} margin={{ top: 5, right: 5, left: -20, bottom: 0 }}>
                  <defs>
                    <linearGradient id="areaGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%"  stopColor="#10b981" stopOpacity={0.3} />
                      <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                  <XAxis dataKey="day" axisLine={false} tickLine={false} tick={{ fill: '#94a3b8', fontSize: 10 }} />
                  <YAxis axisLine={false} tickLine={false} tick={{ fill: '#cbd5e1', fontSize: 10 }} allowDecimals={false} />
                  <Tooltip contentStyle={{ borderRadius: 10, border: '1px solid #e2e8f0' }} />
                  <Area type="monotone" dataKey="value" stroke="#10b981" strokeWidth={2.5} fill="url(#areaGrad)" dot={false} name="Present" />
                </AreaChart>
              </ResponsiveContainer>
            </div>

            {/* Activity Feed */}
            <div className="lg:col-span-2 bg-white rounded-2xl border border-slate-200 shadow-sm p-5">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h3 className="text-base font-bold text-slate-900">Recent Activity</h3>
                  <p className="text-xs text-slate-400 mt-0.5">Latest system events</p>
                </div>
                <button onClick={() => navigate(role === 'superadmin' ? '/audit-logs' : '/reports')}
                  className="flex items-center gap-1.5 text-blue-600 hover:text-blue-700 font-semibold text-xs transition-colors">
                  <RiEyeLine /> View All
                </button>
              </div>
              <ActivityFeed data={activity} />
            </div>
          </div>

          {/* System Health — admin/superadmin only */}
          {(role === 'admin' || role === 'superadmin') && <SystemHealth />}
        </>
      )}

      {/* Employee quick links */}
      {role === 'employee' && (
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {[
            { label: 'Apply for Leave',  desc: 'Submit a new leave request',    icon: RiSurveyLine,        link: '/my-leave',      color: 'bg-blue-50    border-blue-200    text-blue-700'    },
            { label: 'Log Timesheet',    desc: 'Record your work hours',        icon: RiTimeLine,          link: '/my-tasks',      color: 'bg-purple-50  border-purple-200  text-purple-700'  },
            { label: 'View Attendance',  desc: 'Check your attendance history', icon: RiCalendarCheckLine, link: '/my-attendance', color: 'bg-emerald-50 border-emerald-200 text-emerald-700' },
          ].map((item, i) => (
            <button key={i} onClick={() => navigate(item.link)}
              className={`flex items-center gap-4 p-4 rounded-2xl border ${item.color} hover:shadow-md transition-all text-left`}>
              <div className="p-3 bg-white rounded-xl shadow-sm">
                <item.icon size={20} />
              </div>
              <div>
                <p className="font-bold text-sm">{item.label}</p>
                <p className="text-xs opacity-70 mt-0.5">{item.desc}</p>
              </div>
            </button>
          ))}
        </div>
      )}

    </div>
  );
};

// ── Activity Feed ─────────────────────────────────────────────────────────────
const ActivityFeed = ({ data = [] }) => {
  if (!data.length) {
    return (
      <div className="flex flex-col items-center justify-center py-10 text-slate-400">
        <span className="text-4xl mb-2">📋</span>
        <p className="text-sm font-medium">No recent activity</p>
        <p className="text-xs mt-1">Activity will appear here as actions are performed</p>
      </div>
    );
  }

  const STATUS_STYLE = {
    success: 'bg-emerald-100 text-emerald-700',
    error:   'bg-red-100    text-red-700',
    info:    'bg-blue-100   text-blue-700',
  };

  return (
    <div className="space-y-1 overflow-y-auto max-h-[280px] custom-scrollbar">
      {data.slice(0, 10).map((item, i) => (
        <div key={i} className="flex items-start gap-3 p-2.5 rounded-xl hover:bg-slate-50 transition-colors">
          <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-full flex items-center justify-center text-white text-xs font-bold shrink-0 mt-0.5">
            {(item.user?.name || 'S').charAt(0).toUpperCase()}
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center justify-between gap-2">
              <p className="text-sm font-semibold text-slate-800 truncate">{item.action || '—'}</p>
              <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase shrink-0 ${STATUS_STYLE[item.status] || STATUS_STYLE.info}`}>
                {item.status || 'info'}
              </span>
            </div>
            <div className="flex items-center gap-2 mt-0.5">
              <span className="text-xs text-slate-400 truncate">{item.description || item.resource || ''}</span>
              {item.timestamp && (
                <span className="text-[10px] text-slate-300 shrink-0">
                  {new Date(item.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </span>
              )}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default Dashboard;
