import React, { useState, useEffect, useCallback, useMemo } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";
import PremiumCard from "../../components/Employee/PremiumCard";
import EmployeeModal from "../../components/Employee/EmployeeModal";
import EmployeeTable from "../../components/Employee/EmployeeTable";
import {
  RiUserAddLine, RiLayoutGridFill, RiListUnordered,
  RiRefreshLine, RiLoader4Line, RiArrowLeftSLine, RiArrowRightSLine,
  RiTeamLine, RiUserFollowLine, RiUserUnfollowLine, RiBriefcaseLine,
} from "react-icons/ri";
import { PageHeader, FilterBar, DataStateHandler } from "../../components/Layout";
import { SkeletonHeader, SkeletonFilter, SkeletonGrid, SkeletonTable } from "../../components/Skeletons";
import API_URL from "../../config/api";

const authHeaders = () => ({ headers: { Authorization: `Bearer ${localStorage.getItem("token")}` } });
const LIMIT = 12;

const HRs = () => {
  const navigate = useNavigate();
  const { role: userRole } = useAuth();
  const isSuperAdmin = userRole?.toLowerCase() === "superadmin";

  const [hrs,          setHrs]          = useState([]);
  const [loading,      setLoading]      = useState(true);
  const [error,        setError]        = useState(null);
  const [search,       setSearch]       = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [deptFilter,   setDeptFilter]   = useState("all");
  const [empTypeFilter,setEmpTypeFilter]= useState("all");
  const [page,         setPage]         = useState(1);
  const [totalPages,   setTotalPages]   = useState(1);
  const [totalCount,   setTotalCount]   = useState(0);
  const [selectedHR,   setSelectedHR]   = useState(null);
  const [modalMode,    setModalMode]    = useState("view");
  const [viewMode,     setViewMode]     = useState("card");

  const fetchHRs = useCallback(async () => {
    try {
      setLoading(true); setError(null);
      const params = new URLSearchParams({
        page: page.toString(), limit: LIMIT.toString(),
        ...(search       && { search }),
        ...(statusFilter !== "all" && { status: statusFilter }),
      });
      const res = await axios.get(`${API_URL}/hr?${params}`, authHeaders());
      setHrs(res.data.hrs || res.data.employees || []);
      setTotalCount(res.data.pagination?.total || res.data.total || 0);
      setTotalPages(res.data.pagination?.pages || Math.ceil((res.data.pagination?.total || 0) / LIMIT) || 1);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to fetch HR team");
    } finally {
      setLoading(false);
    }
  }, [search, statusFilter, page]);

  useEffect(() => {
    const t = setTimeout(fetchHRs, 400);
    return () => clearTimeout(t);
  }, [fetchHRs]);

  useEffect(() => { setPage(1); }, [search, statusFilter, deptFilter, empTypeFilter]);

  // Client-side filter for dept + empType (backend doesn't support these)
  const filteredHRs = useMemo(() => hrs.filter(h => {
    if (deptFilter    !== "all" && h.department    !== deptFilter)    return false;
    if (empTypeFilter !== "all" && h.employmentType !== empTypeFilter) return false;
    return true;
  }), [hrs, deptFilter, empTypeFilter]);

  // Unique departments from loaded data
  const departments = useMemo(() => {
    const set = new Set(hrs.map(h => h.department).filter(Boolean));
    return Array.from(set).sort();
  }, [hrs]);

  const handleStatusToggle = async (id, newStatus) => {
    // Optimistic update
    setHrs(prev => prev.map(h => h._id === id ? { ...h, status: newStatus } : h));
    try {
      await axios.put(`${API_URL}/hr/${id}`, { status: newStatus }, authHeaders());
    } catch (err) {
      // Revert on failure
      setHrs(prev => prev.map(h => h._id === id ? { ...h, status: newStatus === "active" ? "inactive" : "active" } : h));
      alert(err.response?.data?.message || "Status update failed");
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this HR member?")) return;
    try {
      await axios.delete(`${API_URL}/hr/${id}`, authHeaders());
      setHrs(prev => prev.filter(h => h._id !== id));
      setTotalCount(c => Math.max(0, c - 1));
    } catch (err) { alert(err.response?.data?.message || "Delete failed"); }
  };

  const handleSave = async (values) => {
    try {
      const res = await axios.put(`${API_URL}/hr/${selectedHR._id}`, values, authHeaders());
      const updated = res.data.hr || res.data.employee || res.data;
      setHrs(prev => prev.map(h => h._id === selectedHR._id ? { ...h, ...updated } : h));
      closeModal();
    } catch (err) { alert(err.response?.data?.message || "Update failed"); }
  };

  const openModal  = (hr, mode) => { setSelectedHR(hr); setModalMode(mode); };
  const closeModal = ()          => { setSelectedHR(null); setModalMode("view"); };

  const activeCount   = hrs.filter(h => h.status === "active"   || h.status === "Active").length;
  const inactiveCount = hrs.filter(h => h.status === "inactive" || h.status === "Inactive").length;
  const fullTimeCount = hrs.filter(h => h.employmentType === "Full Time").length;

  if (loading && hrs.length === 0) {
    return (
      <div className="space-y-6">
        <SkeletonHeader />
        <SkeletonFilter />
        {viewMode === "card" ? <SkeletonGrid count={8} /> : <SkeletonTable rows={6} />}
      </div>
    );
  }

  return (
    <div className="space-y-5">

      <PageHeader
        title="HR Team Management"
        description={`${totalCount} HR team members`}
        action={{ label: "Add HR Member", icon: <RiUserAddLine size={18} />, onClick: () => navigate("/employee/registration") }}
      />

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        {[
          { icon: RiTeamLine,         label: "Total HR",   value: totalCount,   bg: "from-emerald-500 to-teal-600"   },
          { icon: RiUserFollowLine,   label: "Active",     value: activeCount,  bg: "from-blue-500 to-indigo-600"    },
          { icon: RiUserUnfollowLine, label: "Inactive",   value: inactiveCount,bg: "from-amber-500 to-orange-500"   },
          { icon: RiBriefcaseLine,    label: "Full Time",  value: fullTimeCount, bg: "from-purple-500 to-pink-600"   },
        ].map((s, i) => (
          <div key={i} className={`flex items-center justify-between p-4 lg:p-5 rounded-2xl bg-gradient-to-r ${s.bg} text-white shadow-md hover:shadow-xl hover:-translate-y-0.5 transition-all duration-200`}>
            <div>
              <p className="text-xs opacity-90 font-semibold">{s.label}</p>
              <h2 className="text-2xl lg:text-3xl font-black mt-1">{s.value}</h2>
            </div>
            <div className="bg-white/20 p-2.5 lg:p-3 rounded-xl text-xl lg:text-2xl">
              <s.icon size={22} />
            </div>
          </div>
        ))}
      </div>

      <FilterBar
        searchValue={search}
        setSearchValue={val => setSearch(val)}
        searchPlaceholder="Search by name or email..."
        filters={[
          {
            value: statusFilter,
            onChange: val => setStatusFilter(val),
            options: [
              { value: "all",      label: "All Status" },
              { value: "active",   label: "Active"     },
              { value: "inactive", label: "Inactive"   },
            ],
          },
          {
            value: deptFilter,
            onChange: val => setDeptFilter(val),
            options: [
              { value: "all", label: "All Depts" },
              ...departments.map(d => ({ value: d, label: d })),
            ],
          },
          {
            value: empTypeFilter,
            onChange: val => setEmpTypeFilter(val),
            options: [
              { value: "all",        label: "All Types"  },
              { value: "Full Time",  label: "Full Time"  },
              { value: "Part Time",  label: "Part Time"  },
              { value: "Intern",     label: "Intern"     },
              { value: "Contract",   label: "Contract"   },
            ],
          },
        ]}
        actions={{
          toggle:  { value: viewMode, onChange: setViewMode, cardIcon: <RiLayoutGridFill size={18} />, tableIcon: <RiListUnordered size={18} /> },
          refresh: { onClick: fetchHRs, icon: loading ? <RiLoader4Line size={18} className="animate-spin" /> : <RiRefreshLine size={18} /> },
        }}
      />

      <DataStateHandler
        loading={loading && hrs.length === 0}
        error={error}
        isEmpty={!filteredHRs.length}
        emptyLabel="No HR members found"
        emptyDescription="Add your first HR team member."
        onRetry={fetchHRs}
      >
        {viewMode === "card" ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {filteredHRs.map((hr, i) => (
              <PremiumCard key={hr._id || i} {...hr}
                onView={() => openModal(hr, "view")}
                onEdit={() => openModal(hr, "edit")}
                onDelete={isSuperAdmin ? handleDelete : null}
                onStatusToggle={handleStatusToggle}
              />
            ))}
          </div>
        ) : (
          <EmployeeTable
            employees={filteredHRs}
            onView={id => { const h = filteredHRs.find(h => h._id === id); if (h) openModal(h, "view"); }}
            onEdit={id => { const h = filteredHRs.find(h => h._id === id); if (h) openModal(h, "edit"); }}
            onDelete={isSuperAdmin ? handleDelete : null}
            onStatusToggle={handleStatusToggle}
          />
        )}
      </DataStateHandler>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-between bg-white rounded-xl border border-slate-200 px-4 py-3">
          <span className="text-xs text-slate-500 font-medium">
            Page <span className="font-black text-slate-800">{page}</span> of {totalPages}
            &nbsp;·&nbsp;{totalCount} total
          </span>
          <div className="flex items-center gap-1">
            <button onClick={() => setPage(p => Math.max(p - 1, 1))} disabled={page === 1}
              className="p-1.5 border border-slate-200 rounded-lg disabled:opacity-40 hover:bg-slate-50 transition-colors">
              <RiArrowLeftSLine size={16} />
            </button>
            {Array.from({ length: Math.min(totalPages, 5) }, (_, i) => {
              const p = page <= 3 ? i + 1 : page + i - 2;
              if (p < 1 || p > totalPages) return null;
              return (
                <button key={p} onClick={() => setPage(p)}
                  className={`w-8 h-8 text-xs font-bold rounded-lg transition-colors ${p === page ? "bg-emerald-500 text-white" : "border border-slate-200 text-slate-600 hover:bg-slate-50"}`}>
                  {p}
                </button>
              );
            })}
            <button onClick={() => setPage(p => Math.min(p + 1, totalPages))} disabled={page === totalPages}
              className="p-1.5 border border-slate-200 rounded-lg disabled:opacity-40 hover:bg-slate-50 transition-colors">
              <RiArrowRightSLine size={16} />
            </button>
          </div>
        </div>
      )}

      <EmployeeModal isOpen={!!selectedHR} onClose={closeModal} employee={selectedHR} onSave={handleSave} mode={modalMode} />
    </div>
  );
};

export default HRs;
