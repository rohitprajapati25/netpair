import React, { useState, useEffect, useCallback, useMemo } from "react";
import { useAuth } from "../../contexts/AuthContext";
import axios from "axios";
import {
  RiRefreshLine,
  RiFolderLine,
  RiSearchLine,
  RiFilterLine,
  RiTeamLine,
  RiCalendarLine,
  RiProgress3Line,
} from "react-icons/ri";
import { SkeletonHeader, SkeletonStats, SkeletonGrid } from "../../components/Skeletons";

const BASE = "http://localhost:5000";

// ── Helpers ───────────────────────────────────────────────────────────────────
const getStatusBadge = (status) => {
  const map = {
    Ongoing:    "bg-blue-100 text-blue-700 border-blue-200",
    Completed:  "bg-emerald-100 text-emerald-700 border-emerald-200",
    "On Hold":  "bg-amber-100 text-amber-700 border-amber-200",
    Planning:   "bg-purple-100 text-purple-700 border-purple-200",
    Cancelled:  "bg-red-100 text-red-700 border-red-200",
  };
  return map[status] || "bg-slate-100 text-slate-700 border-slate-200";
};

const getPriorityBadge = (priority) => {
  const map = {
    High:   "bg-red-100 text-red-700",
    Medium: "bg-amber-100 text-amber-700",
    Low:    "bg-green-100 text-green-700",
  };
  return map[priority] || "bg-slate-100 text-slate-700";
};

const getProgressColor = (pct) => {
  if (pct >= 80) return "from-emerald-400 to-green-500";
  if (pct >= 50) return "from-blue-400 to-indigo-500";
  if (pct >= 25) return "from-amber-400 to-orange-500";
  return "from-red-400 to-rose-500";
};

// ── Project Card ──────────────────────────────────────────────────────────────
const ProjectCard = ({ project }) => {
  const progress = project.progress || 0;

  return (
    <div className="bg-white rounded-2xl border border-slate-200 shadow-sm hover:shadow-lg hover:-translate-y-0.5 transition-all duration-200 overflow-hidden flex flex-col">
      {/* Card header accent */}
      <div className={`h-1.5 w-full bg-gradient-to-r ${getProgressColor(progress)}`} />

      <div className="p-5 flex flex-col flex-1 gap-3">
        {/* Title + badges */}
        <div>
          <div className="flex items-start justify-between gap-2 mb-2">
            <h3 className="font-black text-slate-800 text-base leading-snug flex-1">
              {project.name}
            </h3>
            <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold border shrink-0 ${getStatusBadge(project.status)}`}>
              {project.status}
            </span>
          </div>
          {project.priority && (
            <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${getPriorityBadge(project.priority)}`}>
              {project.priority} Priority
            </span>
          )}
        </div>

        {/* Description */}
        {project.description && (
          <p className="text-xs text-slate-500 leading-relaxed line-clamp-2">
            {project.description}
          </p>
        )}

        {/* Progress bar */}
        <div>
          <div className="flex items-center justify-between mb-1.5">
            <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Progress</span>
            <span className="text-xs font-black text-slate-700">{progress}%</span>
          </div>
          <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
            <div
              className={`h-full rounded-full bg-gradient-to-r ${getProgressColor(progress)} transition-all duration-500`}
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>

        {/* Meta info */}
        <div className="grid grid-cols-2 gap-2 mt-auto pt-2 border-t border-slate-100">
          {project.department && (
            <div className="flex items-center gap-1.5 text-xs text-slate-500">
              <RiFolderLine className="text-slate-400 shrink-0" />
              <span className="truncate">{project.department}</span>
            </div>
          )}
          {(project.assignedEmployees?.length > 0) && (
            <div className="flex items-center gap-1.5 text-xs text-slate-500">
              <RiTeamLine className="text-slate-400 shrink-0" />
              <span>{project.assignedEmployees.length} member{project.assignedEmployees.length !== 1 ? "s" : ""}</span>
            </div>
          )}
          {project.startDate && (
            <div className="flex items-center gap-1.5 text-xs text-slate-500 col-span-2">
              <RiCalendarLine className="text-slate-400 shrink-0" />
              <span>
                {new Date(project.startDate).toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" })}
                {project.endDate && (
                  <> → {new Date(project.endDate).toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" })}</>
                )}
              </span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

// ── Empty State ───────────────────────────────────────────────────────────────
const EmptyState = ({ filtered }) => (
  <div className="col-span-full flex flex-col items-center justify-center py-20 text-slate-400">
    <div className="w-16 h-16 bg-slate-100 rounded-2xl flex items-center justify-center mb-4">
      <RiFolderLine className="text-3xl text-slate-300" />
    </div>
    <p className="text-base font-bold text-slate-500">
      {filtered ? "No projects match your filters" : "No projects assigned yet"}
    </p>
    <p className="text-sm mt-1">
      {filtered ? "Try adjusting your search or status filter" : "Projects assigned to you will appear here"}
    </p>
  </div>
);

// ── Main Component ────────────────────────────────────────────────────────────
const MyProjects = () => {
  const { token, user } = useAuth();

  const [projects, setProjects]   = useState([]);
  const [loading, setLoading]     = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [search, setSearch]       = useState("");
  const [statusFilter, setStatusFilter] = useState("All");

  // ── Fetch ─────────────────────────────────────────────────────────────────
  const fetchProjects = useCallback(async () => {
    if (!token) return;
    try {
      const res = await axios.get(`${BASE}/api/admin/projects?limit=1000`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const all = res.data?.projects || res.data || [];
      setProjects(all);
    } catch (err) {
      console.error("MyProjects fetch error:", err);
      setProjects([]);
    } finally {
      setLoading(false);
    }
  }, [token]);

  const handleRefresh = async () => {
    setRefreshing(true);
    await fetchProjects();
    setRefreshing(false);
  };

  useEffect(() => {
    fetchProjects();
  }, [fetchProjects]);

  // ── Filter to only projects where this employee is assigned ──────────────
  const myUserId = user?._id || user?.id;

  const assignedProjects = useMemo(() => {
    if (!myUserId) return projects;
    return projects.filter((p) => {
      const assigned = p.assignedEmployees || [];
      return assigned.some(
        (e) =>
          e === myUserId ||
          e?._id === myUserId ||
          e?.id === myUserId ||
          e?.employee === myUserId ||
          e?.employee?._id === myUserId
      );
    });
  }, [projects, myUserId]);

  // ── Client-side filter ────────────────────────────────────────────────────
  const filteredProjects = useMemo(() => {
    let result = assignedProjects;

    if (statusFilter !== "All") {
      result = result.filter((p) => p.status === statusFilter);
    }

    if (search.trim()) {
      const q = search.toLowerCase();
      result = result.filter(
        (p) =>
          p.name?.toLowerCase().includes(q) ||
          p.description?.toLowerCase().includes(q)
      );
    }

    return result;
  }, [assignedProjects, statusFilter, search]);

  // ── Stats ─────────────────────────────────────────────────────────────────
  const totalAssigned = assignedProjects.length;
  const ongoingCount  = assignedProjects.filter((p) => p.status === "Ongoing").length;
  const completedCount = assignedProjects.filter((p) => p.status === "Completed").length;

  const statCards = [
    {
      label: "Total Assigned",
      value: totalAssigned,
      bg: "from-blue-500 to-indigo-600",
      icon: "ri-folders-fill",
    },
    {
      label: "Ongoing",
      value: ongoingCount,
      bg: "from-purple-500 to-pink-600",
      icon: "ri-progress-3-line",
    },
    {
      label: "Completed",
      value: completedCount,
      bg: "from-emerald-500 to-green-600",
      icon: "ri-checkbox-circle-fill",
    },
  ];

  const STATUS_OPTIONS = ["All", "Ongoing", "Completed", "On Hold", "Planning", "Cancelled"];
  const isFiltered = search.trim() !== "" || statusFilter !== "All";

  // ── Loading ───────────────────────────────────────────────────────────────
  if (loading) {
    return (
      <div className="space-y-6">
        <SkeletonHeader />
        <SkeletonStats count={3} />
        <div className="h-14 bg-slate-200 rounded-2xl animate-pulse" />
        <SkeletonGrid count={6} />
      </div>
    );
  }

  return (
    <div className="space-y-6">

      {/* ── Header ── */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl lg:text-3xl font-black text-slate-800 tracking-tight">
            My Projects
          </h1>
          <p className="text-slate-500 text-sm mt-0.5">
            Projects you're assigned to
          </p>
        </div>
        <button
          onClick={handleRefresh}
          disabled={refreshing}
          className="self-start sm:self-auto flex items-center gap-2 px-4 py-2.5 bg-white border border-slate-200 hover:border-slate-300 text-slate-700 font-semibold rounded-xl shadow-sm hover:shadow transition-all disabled:opacity-50 text-sm"
        >
          <RiRefreshLine className={refreshing ? "animate-spin" : ""} />
          {refreshing ? "Refreshing..." : "Refresh"}
        </button>
      </div>

      {/* ── Stat Cards ── */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 lg:gap-5">
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

      {/* ── Filter Bar ── */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-4 flex flex-col sm:flex-row gap-3">
        {/* Search */}
        <div className="relative flex-1">
          <RiSearchLine className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder="Search projects..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-4 py-2.5 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none text-sm"
          />
        </div>

        {/* Status filter */}
        <div className="relative">
          <RiFilterLine className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="pl-9 pr-8 py-2.5 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none text-sm bg-white appearance-none cursor-pointer min-w-[140px]"
          >
            {STATUS_OPTIONS.map((s) => (
              <option key={s} value={s}>{s === "All" ? "All Statuses" : s}</option>
            ))}
          </select>
        </div>

        {/* Results count */}
        <div className="flex items-center px-3 py-2.5 bg-slate-50 rounded-xl border border-slate-200 text-xs font-semibold text-slate-500 shrink-0">
          {filteredProjects.length} project{filteredProjects.length !== 1 ? "s" : ""}
        </div>
      </div>

      {/* ── Project Cards Grid ── */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 lg:gap-5">
        {filteredProjects.length === 0 ? (
          <EmptyState filtered={isFiltered} />
        ) : (
          filteredProjects.map((project) => (
            <ProjectCard key={project._id || project.id} project={project} />
          ))
        )}
      </div>

    </div>
  );
};

export default MyProjects;
