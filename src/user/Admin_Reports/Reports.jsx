import React, { useState, useEffect, useCallback, useMemo } from "react";
import useDebounce from "../../hooks/useDebounce.js";
import { useAuth } from "../../contexts/AuthContext";
import axios from "axios";
import {
  RiTeamLine, RiFileDownloadLine, RiRefreshLine, RiCalendarCheckLine,
  RiProjectorLine, RiTaskLine, RiTimeLine, RiComputerLine, RiSurveyLine,
  RiBarChartLine, RiPieChartLine, RiLineChartLine, RiFileTextLine,
  RiArrowUpLine, RiArrowDownLine, RiEqualLine, RiAlertLine,
  RiCheckboxCircleLine, RiTimerLine, RiMoneyDollarCircleLine,
  RiSearchLine, RiPrinterLine
} from "react-icons/ri";
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell, Legend,
  AreaChart, Area
} from "recharts";
import ReportsFilterBar from "../../components/Layout/ReportsFilterBar.jsx";
import DataStateHandler from "../../components/Layout/DataStateHandler";
import { exportToCSV, formatDataForExport, exportToPDF, exportToExcel } from "../../utils/exportUtils.js";
import { SkeletonHeader, SkeletonStats } from "../../components/Skeletons";
import API_URL from "../../config/api";

// ── Status badge ──────────────────────────────────────────────────────────────
const StatusBadge = ({ status }) => {
  const styles = {
    Present: "bg-emerald-100 text-emerald-700", Active: "bg-blue-100 text-blue-700",
    Completed: "bg-indigo-100 text-indigo-700", Absent: "bg-rose-100 text-rose-700",
    Pending: "bg-amber-100 text-amber-700", Late: "bg-orange-100 text-orange-700",
    Approved: "bg-emerald-100 text-emerald-700", Rejected: "bg-rose-100 text-rose-700",
    "On Hold": "bg-yellow-100 text-yellow-700", Overdue: "bg-red-100 text-red-700",
  };
  return (
    <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wide ${styles[status] || "bg-slate-100 text-slate-500"}`}>
      {status || "—"}
    </span>
  );
};

// ── Tab config ────────────────────────────────────────────────────────────────
const REPORT_TABS = [
  { id: "attendance", name: "Attendance",   icon: RiCalendarCheckLine, color: "#10b981" },
  { id: "projects",   name: "Projects",     icon: RiProjectorLine,     color: "#3b82f6" },
  { id: "tasks",      name: "Tasks",        icon: RiTaskLine,          color: "#8b5cf6" },
  { id: "timesheets", name: "Timesheets",   icon: RiTimeLine,          color: "#f59e0b" },
  { id: "leave",      name: "Leave",        icon: RiSurveyLine,        color: "#ef4444" },
  { id: "assets",     name: "Assets",       icon: RiComputerLine,      color: "#06b6d4" },
];

const PIE_COLORS = ["#10b981", "#3b82f6", "#f59e0b", "#ef4444", "#8b5cf6", "#06b6d4"];

// Status → fixed color map (always consistent regardless of order)
const STATUS_COLOR_MAP = {
  // Attendance
  present:    "#10b981",
  absent:     "#ef4444",
  late:       "#f59e0b",
  leave:      "#3b82f6",
  "half day": "#8b5cf6",
  // Projects / Tasks
  ongoing:      "#3b82f6",
  active:       "#3b82f6",
  completed:    "#10b981",
  done:         "#10b981",
  "on hold":    "#f59e0b",
  cancelled:    "#ef4444",
  todo:         "#94a3b8",
  "in progress":"#3b82f6",
  blocked:      "#ef4444",
  // Leave / Timesheets
  pending:    "#f59e0b",
  approved:   "#10b981",
  rejected:   "#ef4444",
  submitted:  "#f59e0b",
  // Assets
  available:    "#10b981",
  assigned:     "#3b82f6",
  maintenance:  "#f59e0b",
  damaged:      "#ef4444",
  disposed:     "#94a3b8",
};

const getStatusColor = (name, fallbackIndex) => {
  const key = (name || "").toLowerCase().trim();
  return STATUS_COLOR_MAP[key] || PIE_COLORS[fallbackIndex % PIE_COLORS.length];
};

// ── Main component ────────────────────────────────────────────────────────────
const Reports = () => {
  const { token, user } = useAuth();
  const role = user?.role?.toLowerCase() || "employee";

  const [activeTab, setActiveTab]     = useState("attendance");
  const [loading, setLoading]         = useState(true);
  const [stats, setStats]             = useState({});
  const [tabData, setTabData]         = useState({});
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages]   = useState(1);

  const [filters, setFilters] = useState({
    dateRange: "month", startDate: "", endDate: "",
    department: "All", status: "All",
  });

  const debouncedFilters = useDebounce(filters, 400);

  // ── Fetch ───────────────────────────────────────────────────────────────────
  const fetchData = useCallback(async (resetPage = false) => {
    if (!token) return;
    try {
      setLoading(true);
      const pageNum = resetPage ? 1 : currentPage;
      const res = await axios.get(`${API_URL}/admin/reports`, {
        headers: { Authorization: `Bearer ${token}` },
        params: {
          tab:        activeTab,
          page:       pageNum,
          limit:      50,
          dateRange:  debouncedFilters.dateRange || "month",
          startDate:  debouncedFilters.startDate || "",
          endDate:    debouncedFilters.endDate   || "",
          department: debouncedFilters.department !== "All" ? debouncedFilters.department : "",
          status:     debouncedFilters.status    !== "All" ? debouncedFilters.status    : "",
          role,
        },
      });
      if (res.data.success) {
        setStats(res.data.stats || {});
        setTabData(prev => ({ ...prev, [activeTab]: res.data.data || [] }));
        setTotalPages(res.data.pagination?.totalPages || 1);
        if (resetPage) setCurrentPage(1);
      }
    } catch (err) {
      console.error("Reports fetch error:", err);
      setTabData(prev => ({ ...prev, [activeTab]: [] }));
    } finally {
      setLoading(false);
    }
  }, [token, activeTab, currentPage, debouncedFilters, role]);

  useEffect(() => { fetchData(true); }, [activeTab, debouncedFilters]);

  const currentData = tabData[activeTab] || [];

  // ── Tab-specific bar chart config ────────────────────────────────────────────
  const BAR_CONFIG = {
    attendance: {
      series: [
        { key: "Present", color: "#10b981", match: /^present$/i },
        { key: "Absent",  color: "#ef4444", match: /^absent$/i  },
        { key: "Late",    color: "#f59e0b", match: /^late$/i    },
        { key: "Leave",   color: "#3b82f6", match: /^leave$/i   },
      ],
      dateField: "date",
    },
    projects: {
      series: [
        { key: "Ongoing",   color: "#3b82f6", match: /ongoing/i   },
        { key: "Completed", color: "#10b981", match: /completed/i },
        { key: "On Hold",   color: "#f59e0b", match: /on.hold/i   },
        { key: "Cancelled", color: "#ef4444", match: /cancelled/i },
      ],
      dateField: "createdAt",
    },
    tasks: {
      series: [
        { key: "TODO",        color: "#94a3b8", match: /todo/i        },
        { key: "In Progress", color: "#3b82f6", match: /in.progress/i },
        { key: "Completed",   color: "#10b981", match: /completed/i   },
        { key: "Blocked",     color: "#ef4444", match: /blocked/i     },
      ],
      dateField: "createdAt",
    },
    timesheets: {
      series: [
        { key: "Submitted", color: "#f59e0b", match: /submitted/i },
        { key: "Approved",  color: "#10b981", match: /approved/i  },
        { key: "Rejected",  color: "#ef4444", match: /rejected/i  },
      ],
      dateField: "date",
    },
    leave: {
      series: [
        { key: "Pending",  color: "#f59e0b", match: /pending/i  },
        { key: "Approved", color: "#10b981", match: /approved/i },
        { key: "Rejected", color: "#ef4444", match: /rejected/i },
      ],
      dateField: "createdAt",
    },
    assets: {
      series: [
        { key: "Available",   color: "#10b981", match: /available/i   },
        { key: "Assigned",    color: "#3b82f6", match: /assigned/i    },
        { key: "Maintenance", color: "#f59e0b", match: /maintenance/i },
        { key: "Damaged",     color: "#ef4444", match: /damaged/i     },
      ],
      dateField: "createdAt",
    },
  };

  const tabConfig = BAR_CONFIG[activeTab] || BAR_CONFIG.attendance;

  // ── Bar chart — last 7 days, multi-series by status ──────────────────────────
  const barData = useMemo(() => {
    const map = {};
    for (let i = 6; i >= 0; i--) {
      const d = new Date(); d.setDate(d.getDate() - i);
      const key = d.toLocaleDateString("en-US", { weekday: "short", day: "numeric" });
      const entry = { day: key };
      tabConfig.series.forEach(s => { entry[s.key] = 0; });
      map[key] = entry;
    }
    currentData.forEach(r => {
      const dateVal = r[tabConfig.dateField] || r.date || r.createdAt;
      if (!dateVal) return;
      const key = new Date(dateVal).toLocaleDateString("en-US", { weekday: "short", day: "numeric" });
      if (!map[key]) return;
      const status = (r.status || "").toString();
      const matched = tabConfig.series.find(s => s.match.test(status));
      if (matched) map[key][matched.key]++;
    });
    return Object.values(map);
  }, [currentData, activeTab, tabConfig]);

  // ── Pie chart data — status distribution ────────────────────────────────────
  const pieData = useMemo(() => {
    const map = {};
    currentData.forEach(r => {
      const s = r.status || "Unknown";
      map[s] = (map[s] || 0) + 1;
    });
    const entries = Object.entries(map).map(([name, value], i) => ({
      name,
      value,
      color: getStatusColor(name, i),
    }));
    return entries.length > 0 ? entries : [{ name: "No Data", value: 1, color: "#e2e8f0" }];
  }, [currentData]);

  const areaData = useMemo(() => {
    const map = {};
    currentData.forEach(r => {
      const d = new Date(r.date || r.createdAt);
      if (isNaN(d.getTime())) return;
      const key = d.toLocaleDateString("en-US", { month: "short" });
      map[key] = (map[key] || 0) + 1;
    });
    const months = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];
    return months.map(m => ({ month: m, value: map[m] || 0 }));
  }, [currentData]);

  // ── Stats cards ─────────────────────────────────────────────────────────────
  const statsCards = useMemo(() => {
    const base = [
      { label: "Total Records", value: currentData.length,                                                    color: "from-blue-500 to-indigo-600",   icon: RiTeamLine },
      { label: "Active",        value: currentData.filter(r => /active|present|approved/i.test(r.status || "")).length, color: "from-emerald-500 to-green-600", icon: RiCheckboxCircleLine },
      { label: "Pending",       value: currentData.filter(r => /pending|todo/i.test(r.status || "")).length,  color: "from-amber-500 to-orange-500",  icon: RiTimerLine },
      { label: "Issues",        value: currentData.filter(r => /absent|rejected|failed|overdue/i.test(r.status || "")).length, color: "from-rose-500 to-red-600", icon: RiAlertLine },
    ];
    return base;
  }, [currentData]);

  // ── Export ──────────────────────────────────────────────────────────────────
  const handleExport = (format) => {
    const filename = `IMS-${activeTab}-${new Date().toISOString().slice(0, 10)}`;
    const formatted = formatDataForExport(currentData, activeTab);
    if (format === "csv")   exportToCSV(formatted, `${filename}.csv`);
    if (format === "excel") exportToExcel(formatted, `${filename}.xlsx`);
    if (format === "pdf")   exportToPDF(formatted, `${filename}.pdf`);
    if (format === "json") {
      const blob = new Blob([JSON.stringify(currentData, null, 2)], { type: "application/json" });
      const a = document.createElement("a"); a.href = URL.createObjectURL(blob);
      a.download = `${filename}.json`; a.click();
    }
  };

  const activeTabConfig = REPORT_TABS.find(t => t.id === activeTab);

  // ── Loading ─────────────────────────────────────────────────────────────────
  if (loading && !currentData.length && Object.keys(stats).length === 0) {
    return (
      <div className="space-y-6">
        <SkeletonHeader />
        <SkeletonStats count={4} />
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
          <div className="lg:col-span-2 bg-slate-200 rounded-2xl h-72 animate-pulse" />
          <div className="bg-slate-200 rounded-2xl h-72 animate-pulse" />
        </div>
        <div className="bg-slate-200 rounded-2xl h-64 animate-pulse" />
      </div>
    );
  }

  return (
    <div className="space-y-6">

      {/* ── Header ── */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl lg:text-3xl font-black text-slate-900 tracking-tight">
            Reports & Analytics
          </h1>
          <p className="text-slate-500 text-sm mt-0.5">
            Business intelligence · {currentData.length} records loaded
          </p>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => fetchData(true)}
            disabled={loading}
            className="flex items-center gap-2 px-4 py-2.5 bg-white border border-slate-200 hover:border-slate-300 text-slate-700 font-semibold rounded-xl shadow-sm text-sm transition-all disabled:opacity-50"
          >
            <RiRefreshLine className={loading ? "animate-spin" : ""} />
            Refresh
          </button>

          {/* Export dropdown */}
          <div className="relative group">
            <button className="flex items-center gap-2 px-4 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold rounded-xl shadow-sm text-sm transition-all">
              <RiFileDownloadLine /> Export
            </button>
            <div className="absolute right-0 top-full mt-1 w-44 bg-white rounded-xl border border-slate-200 shadow-xl z-50 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all">
              {[
                { id: "csv",   label: "Export CSV"   },
                { id: "excel", label: "Export Excel" },
                { id: "pdf",   label: "Export PDF"   },
                { id: "json",  label: "Export JSON"  },
              ].map(opt => (
                <button key={opt.id} onClick={() => handleExport(opt.id)}
                  className="w-full text-left px-4 py-2.5 text-sm font-semibold text-slate-700 hover:bg-slate-50 first:rounded-t-xl last:rounded-b-xl transition-colors">
                  {opt.label}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* ── Filters ── */}
      <ReportsFilterBar
        filters={filters}
        onFilterChange={(key, val) => { setFilters(p => ({ ...p, [key]: val })); setCurrentPage(1); }}
        onClear={() => setFilters({ dateRange: "month", startDate: "", endDate: "", department: "All", status: "All" })}
        onApply={() => fetchData(true)}
        loading={loading}
      />

      {/* ── Tabs ── */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-1.5">
        <div className="flex gap-1 overflow-x-auto">
          {REPORT_TABS.map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex-shrink-0 flex items-center gap-2 px-4 py-2.5 rounded-xl font-semibold text-sm transition-all ${
                activeTab === tab.id
                  ? "bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-md"
                  : "text-slate-500 hover:text-slate-800 hover:bg-slate-100"
              }`}
            >
              <tab.icon size={15} />
              {tab.name}
            </button>
          ))}
        </div>
      </div>

      {/* ── Stats ── */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 lg:gap-5">
        {statsCards.map((s, i) => (
          <div key={i} className={`rounded-2xl p-4 lg:p-5 flex items-center gap-3 bg-gradient-to-br ${s.color} text-white shadow-md`}>
            <div className="p-2.5 bg-white/20 rounded-xl shrink-0">
              <s.icon className="text-lg" />
            </div>
            <div className="min-w-0">
              <p className="text-xl lg:text-2xl font-black leading-none">{s.value}</p>
              <p className="text-[10px] lg:text-xs opacity-90 font-semibold mt-0.5 leading-tight">{s.label}</p>
            </div>
          </div>
        ))}
      </div>

      {/* ── Charts Row ── */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">

        {/* Bar Chart — 7-day trend */}
        <div className="lg:col-span-2 bg-white rounded-2xl border border-slate-200 shadow-sm p-5">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="font-bold text-slate-900 text-base">{activeTabConfig?.name} — Last 7 Days</h3>
              <p className="text-xs text-slate-400 mt-0.5">Daily breakdown by status</p>
            </div>
            {/* Legend */}
            <div className="flex flex-wrap gap-2 justify-end">
              {tabConfig.series.map(s => (
                <div key={s.key} className="flex items-center gap-1">
                  <div className="w-2.5 h-2.5 rounded-sm" style={{ background: s.color }} />
                  <span className="text-[10px] font-semibold text-slate-500">{s.key}</span>
                </div>
              ))}
            </div>
          </div>
          <ResponsiveContainer width="100%" height={220}>
            <BarChart data={barData} margin={{ top: 5, right: 5, left: -20, bottom: 5 }} barGap={2} barCategoryGap="25%">
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
              <XAxis dataKey="day" axisLine={false} tickLine={false} tick={{ fill: "#94a3b8", fontSize: 11 }} />
              <YAxis axisLine={false} tickLine={false} tick={{ fill: "#cbd5e1", fontSize: 11 }} allowDecimals={false} />
              <Tooltip
                contentStyle={{ borderRadius: 10, border: "1px solid #e2e8f0", boxShadow: "0 4px 20px rgba(0,0,0,0.08)" }}
                cursor={{ fill: "#f8fafc" }}
              />
              {tabConfig.series.map(s => (
                <Bar key={s.key} dataKey={s.key} fill={s.color} radius={[4, 4, 0, 0]} barSize={14} />
              ))}
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Pie Chart — status distribution */}
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-5">
          <div className="mb-3">
            <h3 className="font-bold text-slate-900 text-base">Status Breakdown</h3>
            <p className="text-xs text-slate-400 mt-0.5">{currentData.length} total records</p>
          </div>
          <ResponsiveContainer width="100%" height={180}>
            <PieChart>
              <Pie data={pieData} cx="50%" cy="50%" innerRadius={50} outerRadius={75} paddingAngle={3} dataKey="value">
                {pieData.map((entry, i) => (
                  <Cell key={i} fill={entry.color} stroke="white" strokeWidth={2} />
                ))}
              </Pie>
              <Tooltip contentStyle={{ borderRadius: 10, border: "1px solid #e2e8f0" }} />
            </PieChart>
          </ResponsiveContainer>
          {/* Legend */}
          <div className="space-y-1.5 mt-2">
            {pieData.slice(0, 4).map((d, i) => (
              <div key={d.name} className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-2.5 h-2.5 rounded-full shrink-0" style={{ background: d.color }} />
                  <span className="text-xs font-medium text-slate-600 truncate max-w-[100px]">{d.name}</span>
                </div>
                <span className="text-xs font-black text-slate-800">{d.value}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ── Area Chart — monthly trend ── */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-5">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="font-bold text-slate-900 text-base">Monthly Trend</h3>
            <p className="text-xs text-slate-400 mt-0.5">Records per month this year</p>
          </div>
        </div>
        <ResponsiveContainer width="100%" height={160}>
          <AreaChart data={areaData} margin={{ top: 5, right: 5, left: -20, bottom: 0 }}>
            <defs>
              <linearGradient id="areaGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%"  stopColor={activeTabConfig?.color || "#6366f1"} stopOpacity={0.25} />
                <stop offset="95%" stopColor={activeTabConfig?.color || "#6366f1"} stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
            <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{ fill: "#94a3b8", fontSize: 10 }} />
            <YAxis axisLine={false} tickLine={false} tick={{ fill: "#cbd5e1", fontSize: 10 }} allowDecimals={false} />
            <Tooltip contentStyle={{ borderRadius: 10, border: "1px solid #e2e8f0" }} />
            <Area type="monotone" dataKey="value" stroke={activeTabConfig?.color || "#6366f1"} strokeWidth={2.5} fill="url(#areaGrad)" dot={false} name="Records" />
          </AreaChart>
        </ResponsiveContainer>
      </div>

      {/* ── Data Table ── */}
      <DataStateHandler
        isEmpty={!currentData.length}
        isLoading={loading}
        emptyLabel={`${activeTabConfig?.name} Data`}
        onRetry={() => fetchData(true)}
      >
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
          {/* Table header */}
          <div className="flex items-center justify-between px-5 py-4 border-b border-slate-100">
            <h2 className="font-bold text-slate-900 flex items-center gap-2">
              {activeTabConfig?.icon && <activeTabConfig.icon size={16} style={{ color: activeTabConfig.color }} />}
              {activeTabConfig?.name} Records
              <span className="px-2.5 py-0.5 bg-emerald-100 text-emerald-700 text-xs font-bold rounded-full">
                {currentData.length}
              </span>
            </h2>
            <span className="text-xs text-slate-400">
              Updated {new Date().toLocaleTimeString()}
            </span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full min-w-[600px]">
              <thead className="bg-slate-50 border-b border-slate-100">
                <tr>
                  {["#", "Name / Title", "Department", "Status", "Date", ""].map((h, i) => (
                    <th key={i} className="px-5 py-3 text-left text-[10px] font-black text-slate-400 uppercase tracking-wider">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {currentData.map((item, idx) => (
                  <tr key={idx} className="hover:bg-slate-50 transition-colors">
                    <td className="px-5 py-3 font-mono text-xs text-slate-400">
                      #{item._id?.slice(-6) || String(idx + 1).padStart(3, "0")}
                    </td>
                    <td className="px-5 py-3">
                      <p className="font-semibold text-slate-800 text-sm">
                        {item.name || item.title || item.task_title || item.employee?.name || "—"}
                      </p>
                      <p className="text-xs text-slate-400 truncate max-w-[200px]">
                        {item.description || item.work_description || item.leaveType || ""}
                      </p>
                    </td>
                    <td className="px-5 py-3 text-sm text-slate-600">
                      {item.department || item.employee?.department || item.category || "—"}
                    </td>
                    <td className="px-5 py-3">
                      <StatusBadge status={item.status} />
                    </td>
                    <td className="px-5 py-3 text-xs text-slate-500">
                      {item.date || item.createdAt
                        ? new Date(item.date || item.createdAt).toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" })
                        : "—"}
                    </td>
                    <td className="px-5 py-3">
                      <button
                        onClick={() => exportToCSV(formatDataForExport([item], activeTab), `record-${item._id?.slice(-6)}.csv`)}
                        className="p-1.5 bg-slate-100 hover:bg-emerald-100 hover:text-emerald-600 text-slate-400 rounded-lg transition-colors"
                        title="Export row"
                      >
                        <RiFileDownloadLine size={13} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="px-5 py-3 border-t border-slate-100 bg-slate-50 flex items-center justify-between">
              <span className="text-xs text-slate-500 font-medium">
                Page {currentPage} of {totalPages}
              </span>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setCurrentPage(p => Math.max(p - 1, 1))}
                  disabled={currentPage === 1}
                  className="px-4 py-2 bg-white border border-slate-200 rounded-xl text-sm font-semibold disabled:opacity-40 hover:bg-slate-50 transition-colors"
                >
                  Previous
                </button>
                <button
                  onClick={() => setCurrentPage(p => Math.min(p + 1, totalPages))}
                  disabled={currentPage === totalPages}
                  className="px-4 py-2 bg-emerald-600 text-white rounded-xl text-sm font-semibold disabled:opacity-40 hover:bg-emerald-700 transition-colors"
                >
                  Next
                </button>
              </div>
            </div>
          )}
        </div>
      </DataStateHandler>

    </div>
  );
};

export default Reports;
