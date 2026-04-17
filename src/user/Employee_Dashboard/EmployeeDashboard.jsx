import { useState, useEffect, useCallback } from "react";
import { useAuth } from "../../contexts/AuthContext";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import {
  RiTaskLine,
  RiTimeLine,
  RiCalendarCheckLine,
  RiSurveyLine,
  RiRefreshLine,
  RiArrowRightLine,
  RiMegaphoneLine,
  RiCalendarLine,
  RiFolderLine,
  RiCheckboxCircleLine,
  RiAlertLine,
} from "react-icons/ri";
import { SkeletonHeader, SkeletonStats, SkeletonTable } from "../../components/Skeletons";
import { BASE_URL as BASE } from "../../config/api";

// ── Helpers ───────────────────────────────────────────────────────────────────
const getStatusColor = (status) => {
  const map = {
    "Completed":   "bg-emerald-100 text-emerald-700",
    "In Progress": "bg-blue-100 text-blue-700",
    "Todo":        "bg-yellow-100 text-yellow-700",
    "Blocked":     "bg-red-100 text-red-700",
    "Review":      "bg-purple-100 text-purple-700",
  };
  return map[status] || "bg-slate-100 text-slate-700";
};

const getPriorityColor = (priority) => {
  const map = {
    High:   "bg-red-100 text-red-700",
    Medium: "bg-amber-100 text-amber-700",
    Low:    "bg-green-100 text-green-700",
  };
  return map[priority] || "bg-slate-100 text-slate-700";
};

const getAnnouncementPriorityColor = (priority) => {
  const map = {
    High:   "bg-red-100 text-red-700",
    Medium: "bg-amber-100 text-amber-700",
    Low:    "bg-blue-100 text-blue-700",
    Normal: "bg-blue-100 text-blue-700",
  };
  return map[priority] || "bg-slate-100 text-slate-700";
};

// ── Loading Skeleton ──────────────────────────────────────────────────────────
const DashboardSkeleton = () => (
  <div className="space-y-6 animate-pulse">
    {/* Header skeleton */}
    <div className="bg-white rounded-2xl border border-slate-200 p-5 flex items-center justify-between">
      <div className="space-y-2">
        <div className="h-7 w-56 bg-slate-200 rounded-lg" />
        <div className="h-4 w-40 bg-slate-100 rounded-lg" />
      </div>
      <div className="h-8 w-28 bg-slate-200 rounded-xl" />
    </div>
    {/* Stat cards skeleton */}
    <SkeletonStats count={4} />
    {/* Quick actions skeleton */}
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 lg:gap-5">
      {[...Array(4)].map((_, i) => (
        <div key={i} className="h-24 bg-slate-200 rounded-2xl" />
      ))}
    </div>
    {/* Tables skeleton */}
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
      <div className="h-64 bg-slate-200 rounded-2xl" />
      <div className="h-64 bg-slate-200 rounded-2xl" />
    </div>
    <div className="h-32 bg-slate-200 rounded-2xl" />
  </div>
);

// ── Main Component ────────────────────────────────────────────────────────────
const EmployeeDashboard = () => {
  const { token, user } = useAuth();
  const navigate = useNavigate();

  const [tasks, setTasks]               = useState([]);
  const [timesheets, setTimesheets]     = useState([]);
  const [leaves, setLeaves]             = useState([]);
  const [attendance, setAttendance]     = useState([]);
  const [announcements, setAnnouncements] = useState([]);
  const [loading, setLoading]           = useState(true);
  const [refreshing, setRefreshing]     = useState(false);

  // ── Fetch all data in parallel ────────────────────────────────────────────
  const fetchAll = useCallback(async () => {
    if (!token) return;
    try {
      // Build attendance date range for current month
      const now = new Date();
      const firstDay = new Date(now.getFullYear(), now.getMonth(), 1)
        .toISOString().split("T")[0];
      const today = now.toISOString().split("T")[0];

      const headers = { Authorization: `Bearer ${token}` };

      const [tasksRes, timesheetsRes, leavesRes, attendanceRes, announcementsRes] =
        await Promise.all([
          axios.get(`${BASE}/api/employees/tasks`,                                    { headers }).catch(() => null),
          axios.get(`${BASE}/api/employees/timesheets`,                               { headers }).catch(() => null),
          axios.get(`${BASE}/api/employees/leaves`,                                   { headers }).catch(() => null),
          axios.get(`${BASE}/api/employees/attendance?dateFrom=${firstDay}&dateTo=${today}&limit=100`, { headers }).catch(() => null),
          // Use employee-specific announcements endpoint
          axios.get(`${BASE}/api/employees/announcements?limit=20`,                  { headers }).catch(() => null),
        ]);

      setTasks(tasksRes?.data?.tasks || []);
      setTimesheets(timesheetsRes?.data?.timesheets || []);
      setLeaves(leavesRes?.data?.leaves || []);
      setAttendance(attendanceRes?.data?.records || []);
      setAnnouncements(announcementsRes?.data?.announcements || []);
    } catch (err) {
      console.error("EmployeeDashboard fetch error:", err);
    } finally {
      setLoading(false);
    }
  }, [token]);

  const handleRefresh = async () => {
    setRefreshing(true);
    await fetchAll();
    setRefreshing(false);
  };

  useEffect(() => {
    fetchAll();
  }, [fetchAll]);

  const totalTasks     = tasks.length;
  const hoursLogged    = timesheets.reduce((sum, t) => sum + (t.hours_worked || 0), 0);
  const pendingLeaves  = leaves.filter((l) => l.status === "Pending").length;
  const approvedLeaves = leaves.filter((l) => l.status === "Approved").length;

  const presentCount  = attendance.filter((r) => r.status === "Present").length;
  const totalAttendance = attendance.length;
  const attendancePct = totalAttendance > 0
    ? Math.round((presentCount / totalAttendance) * 100)
    : 0;

  // Attendance mini-summary
  const absentCount = attendance.filter((r) => r.status === "Absent").length;
  const lateCount   = attendance.filter((r) => r.status === "Late").length;

  // Recent tasks (last 5)
  const recentTasks = [...tasks]
    .sort((a, b) => new Date(b.createdAt || 0) - new Date(a.createdAt || 0))
    .slice(0, 5);

  // Recent announcements (last 3)
  const recentAnnouncements = [...announcements]
    .sort((a, b) => new Date(b.createdAt || 0) - new Date(a.createdAt || 0))
    .slice(0, 3);

  const displayName = user?.name || user?.fullName || user?.email || "Employee";
  const displayRole = user?.role || "Employee";

  const statCards = [
    {
      label: "My Tasks",
      value: totalTasks,
      bg: "from-blue-500 to-indigo-600",
      icon: "ri-task-line",
    },
    {
      label: "Hours Logged",
      value: `${hoursLogged % 1 === 0 ? hoursLogged : hoursLogged.toFixed(1)}h`,
      bg: "from-purple-500 to-pink-600",
      icon: "ri-time-line",
    },
    {
      label: "Leaves Taken",
      value: approvedLeaves,
      bg: "from-emerald-500 to-green-600",
      icon: "ri-survey-line",
    },
    {
      label: "Attendance %",
      value: `${attendancePct}%`,
      bg: "from-orange-500 to-red-500",
      icon: "ri-calendar-check-line",
    },
  ];

  // ── Quick actions config ──────────────────────────────────────────────────
  const quickActions = [
    {
      label: "Apply Leave",
      desc: "Submit a leave request",
      icon: RiSurveyLine,
      link: "/my-leave",
      color: "from-blue-500 to-indigo-600",
    },
    {
      label: "Log Timesheet",
      desc: "Record your work hours",
      icon: RiTimeLine,
      link: "/my-tasks",
      color: "from-purple-500 to-pink-600",
    },
    {
      label: "View Attendance",
      desc: "Check your attendance",
      icon: RiCalendarCheckLine,
      link: "/my-attendance",
      color: "from-emerald-500 to-green-600",
    },
    {
      label: "My Projects",
      desc: "Browse assigned projects",
      icon: RiFolderLine,
      link: "/my-projects",
      color: "from-orange-500 to-red-500",
    },
  ];

  // ── Render ────────────────────────────────────────────────────────────────
  if (loading) return <DashboardSkeleton />;

  return (
    <div className="space-y-6">

      {/* ── Welcome Header ── */}
      <div className="bg-gradient-to-r from-blue-600 to-indigo-700 rounded-2xl p-5 lg:p-6 text-white shadow-lg flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <h1 className="text-2xl lg:text-3xl font-black tracking-tight">
              Welcome back, {displayName.split(" ")[0]} 👋
            </h1>
          </div>
          <div className="flex items-center gap-3 flex-wrap">
            <span className="px-2.5 py-0.5 bg-white/20 rounded-full text-xs font-bold uppercase tracking-wider">
              {displayRole}
            </span>
            <span className="text-sm opacity-80">
              {new Date().toLocaleDateString("en-US", {
                weekday: "long",
                year: "numeric",
                month: "long",
                day: "numeric",
              })}
            </span>
            {pendingLeaves > 0 && (
              <span className="px-2.5 py-0.5 bg-amber-400/30 border border-amber-300/40 rounded-full text-xs font-bold">
                {pendingLeaves} leave{pendingLeaves !== 1 ? "s" : ""} pending
              </span>
            )}
          </div>
        </div>
        <button
          onClick={handleRefresh}
          disabled={refreshing}
          className="self-start sm:self-auto flex items-center gap-2 px-4 py-2.5 bg-white/20 hover:bg-white/30 text-white font-semibold rounded-xl transition-all disabled:opacity-50 text-sm border border-white/30"
        >
          <RiRefreshLine className={refreshing ? "animate-spin" : ""} />
          {refreshing ? "Refreshing..." : "Refresh"}
        </button>
      </div>

      {/* ── Stat Cards ── */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 lg:gap-5">
        {statCards.map((s, i) => (
          <div
            key={i}
            className={`relative overflow-hidden rounded-2xl text-white p-4 lg:p-5 bg-gradient-to-r ${s.bg} shadow-md hover:shadow-xl hover:-translate-y-0.5 transition-all duration-200 flex items-center justify-between`}
          >
            <div>
              <p className="text-xs opacity-90 font-semibold">{s.label}</p>
              <h2 className="text-2xl lg:text-3xl font-black mt-1">{s.value}</h2>
            </div>
            <div className="bg-white/20 p-2.5 lg:p-3 rounded-xl text-xl lg:text-2xl">
              <i className={s.icon}></i>
            </div>
          </div>
        ))}
      </div>

      {/* ── Quick Actions ── */}
      <div>
        <h2 className="text-base font-black text-slate-700 uppercase tracking-wider mb-3">
          Quick Actions
        </h2>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 lg:gap-5">
          {quickActions.map((action, i) => (
            <button
              key={i}
              onClick={() => navigate(action.link)}
              className={`group relative overflow-hidden rounded-2xl p-4 lg:p-5 bg-gradient-to-r ${action.color} text-white shadow-md hover:shadow-xl hover:-translate-y-0.5 transition-all duration-200 text-left`}
            >
              <div className="bg-white/20 p-2.5 rounded-xl w-fit mb-3">
                <action.icon className="text-xl" />
              </div>
              <p className="font-bold text-sm leading-tight">{action.label}</p>
              <p className="text-xs opacity-80 mt-0.5">{action.desc}</p>
              <RiArrowRightLine className="absolute bottom-4 right-4 text-lg opacity-0 group-hover:opacity-100 transition-opacity" />
            </button>
          ))}
        </div>
      </div>

      {/* ── Recent Tasks + Announcements ── */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">

        {/* Recent Tasks */}
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
          <div className="flex items-center justify-between px-5 py-4 border-b border-slate-100">
            <div className="flex items-center gap-2">
              <RiTaskLine className="text-blue-600 text-lg" />
              <h3 className="font-black text-slate-800">Recent Tasks</h3>
              <span className="px-2 py-0.5 bg-blue-100 text-blue-700 text-[10px] font-bold rounded-full">
                {recentTasks.length}
              </span>
            </div>
            <button
              onClick={() => navigate("/my-tasks")}
              className="flex items-center gap-1 text-blue-600 hover:text-blue-700 text-xs font-semibold transition-colors"
            >
              View All <RiArrowRightLine />
            </button>
          </div>

          {recentTasks.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12 text-slate-400">
              <RiCheckboxCircleLine className="text-4xl mb-2" />
              <p className="text-sm font-medium">No tasks assigned yet</p>
            </div>
          ) : (
            <div className="divide-y divide-slate-50">
              {recentTasks.map((task) => (
                <div key={task._id} className="px-5 py-3.5 hover:bg-slate-50 transition-colors">
                  <div className="flex items-start justify-between gap-2">
                    <div className="min-w-0 flex-1">
                      <p className="font-semibold text-slate-800 text-sm truncate">
                        {task.task_title || task.title}
                      </p>
                      <p className="text-xs text-slate-400 mt-0.5">
                        {task.due_date
                          ? `Due ${new Date(task.due_date).toLocaleDateString("en-GB")}`
                          : "No due date"}
                      </p>
                    </div>
                    <div className="flex items-center gap-1.5 shrink-0">
                      <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${getPriorityColor(task.priority)}`}>
                        {task.priority || "Medium"}
                      </span>
                      <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${getStatusColor(task.status)}`}>
                        {task.status}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Recent Announcements */}
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
          <div className="flex items-center justify-between px-5 py-4 border-b border-slate-100">
            <div className="flex items-center gap-2">
              <RiMegaphoneLine className="text-purple-600 text-lg" />
              <h3 className="font-black text-slate-800">Announcements</h3>
            </div>
            <button
              onClick={() => navigate("/announcements")}
              className="flex items-center gap-1 text-blue-600 hover:text-blue-700 text-xs font-semibold transition-colors"
            >
              View All <RiArrowRightLine />
            </button>
          </div>

          {recentAnnouncements.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12 text-slate-400">
              <RiMegaphoneLine className="text-4xl mb-2" />
              <p className="text-sm font-medium">No announcements</p>
            </div>
          ) : (
            <div className="divide-y divide-slate-50">
              {recentAnnouncements.map((ann) => (
                <div key={ann._id} className="px-5 py-4 hover:bg-slate-50 transition-colors">
                  <div className="flex items-start justify-between gap-2 mb-1">
                    <p className="font-semibold text-slate-800 text-sm leading-snug flex-1">
                      {ann.title}
                    </p>
                    <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold shrink-0 ${getAnnouncementPriorityColor(ann.priority)}`}>
                      {ann.priority || "Normal"}
                    </span>
                  </div>
                  <p className="text-xs text-slate-400">
                    {ann.createdAt
                      ? new Date(ann.createdAt).toLocaleDateString("en-US", {
                          month: "short",
                          day: "numeric",
                          year: "numeric",
                        })
                      : ""}
                  </p>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* ── This Month Attendance Summary ── */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-5">
        <div className="flex items-center gap-2 mb-4">
          <RiCalendarCheckLine className="text-emerald-600 text-lg" />
          <h3 className="font-black text-slate-800">This Month's Attendance</h3>
          <span className="text-xs text-slate-400 font-medium">
            ({new Date().toLocaleDateString("en-US", { month: "long", year: "numeric" })})
          </span>
        </div>

        {totalAttendance === 0 ? (
          <p className="text-sm text-slate-400 text-center py-4">No attendance records this month</p>
        ) : (
          <div className="flex flex-wrap items-center gap-3">
            <div className="flex items-center gap-2 px-4 py-2.5 bg-emerald-50 border border-emerald-200 rounded-xl">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 shrink-0" />
              <span className="text-sm font-bold text-emerald-700">{presentCount}</span>
              <span className="text-xs text-emerald-600 font-medium">Present</span>
            </div>
            <div className="flex items-center gap-2 px-4 py-2.5 bg-red-50 border border-red-200 rounded-xl">
              <span className="w-2.5 h-2.5 rounded-full bg-red-500 shrink-0" />
              <span className="text-sm font-bold text-red-700">{absentCount}</span>
              <span className="text-xs text-red-600 font-medium">Absent</span>
            </div>
            <div className="flex items-center gap-2 px-4 py-2.5 bg-amber-50 border border-amber-200 rounded-xl">
              <span className="w-2.5 h-2.5 rounded-full bg-amber-500 shrink-0" />
              <span className="text-sm font-bold text-amber-700">{lateCount}</span>
              <span className="text-xs text-amber-600 font-medium">Late</span>
            </div>
            <div className="flex items-center gap-2 px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl">
              <span className="w-2.5 h-2.5 rounded-full bg-slate-400 shrink-0" />
              <span className="text-sm font-bold text-slate-700">{totalAttendance}</span>
              <span className="text-xs text-slate-500 font-medium">Total Days</span>
            </div>
            {/* Progress bar */}
            <div className="flex-1 min-w-[160px]">
              <div className="flex items-center justify-between mb-1">
                <span className="text-xs font-semibold text-slate-500">Attendance Rate</span>
                <span className="text-xs font-black text-slate-700">{attendancePct}%</span>
              </div>
              <div className="h-2.5 bg-slate-100 rounded-full overflow-hidden">
                <div
                  className={`h-full rounded-full transition-all duration-500 ${
                    attendancePct >= 80
                      ? "bg-gradient-to-r from-emerald-400 to-green-500"
                      : attendancePct >= 60
                      ? "bg-gradient-to-r from-amber-400 to-orange-500"
                      : "bg-gradient-to-r from-red-400 to-rose-500"
                  }`}
                  style={{ width: `${attendancePct}%` }}
                />
              </div>
            </div>
          </div>
        )}
      </div>

    </div>
  );
};

export default EmployeeDashboard;
