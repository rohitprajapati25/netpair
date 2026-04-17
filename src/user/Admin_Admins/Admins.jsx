import React, { useState, useEffect, useCallback } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";
import PremiumCard from "../../components/Employee/PremiumCard";
import EmployeeModal from "../../components/Employee/EmployeeModal";
import EmployeeTable from "../../components/Employee/EmployeeTable";
import {
  RiUserAddLine, RiLayoutGridFill, RiListUnordered,
  RiRefreshLine, RiLoader4Line, RiArrowLeftSLine, RiArrowRightSLine,
  RiShieldUserLine, RiUserFollowLine, RiUserUnfollowLine
} from "react-icons/ri";
import { PageHeader, FilterBar, DataStateHandler } from "../../components/Layout";
import { SkeletonHeader, SkeletonFilter, SkeletonGrid, SkeletonTable } from "../../components/Skeletons";
import API_URL from "../../config/api";

const authHeaders = () => ({ headers: { Authorization: `Bearer ${localStorage.getItem("token")}` } });
const LIMIT = 12;

const Admins = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const isSuperAdmin = user?.role?.toLowerCase() === "superadmin";
  const [admins, setAdmins]             = useState([]);
  const [loading, setLoading]           = useState(true);
  const [error, setError]               = useState(null);
  const [search, setSearch]             = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [page, setPage]                 = useState(1);
  const [totalPages, setTotalPages]     = useState(1);
  const [totalCount, setTotalCount]     = useState(0);
  const [selectedAdmin, setSelectedAdmin] = useState(null);
  const [modalMode, setModalMode]       = useState("view");
  const [viewMode, setViewMode]         = useState("card");

  const fetchAdmins = useCallback(async () => {
    try {
      setLoading(true); setError(null);
      const params = new URLSearchParams({
        page: page.toString(), limit: LIMIT.toString(),
        ...(search && { search }),
        ...(statusFilter !== "all" && { status: statusFilter }),
      });
      const res = await axios.get(`${API_URL}/admins?${params}`, authHeaders());
      setAdmins(res.data.admins || res.data.employees || []);
      setTotalCount(res.data.pagination?.total || res.data.total || 0);
      setTotalPages(res.data.pagination?.pages || Math.ceil((res.data.pagination?.total || 0) / LIMIT) || 1);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to fetch admins");
    } finally {
      setLoading(false);
    }
  }, [search, statusFilter, page]);

  useEffect(() => {
    const t = setTimeout(fetchAdmins, 400);
    return () => clearTimeout(t);
  }, [fetchAdmins]);

  useEffect(() => { setPage(1); }, [search, statusFilter]);

  const handleStatusToggle = async (id, newStatus) => {
    try {
      await axios.put(`${API_URL}/admins/${id}`, { status: newStatus }, authHeaders());
      setAdmins(prev => prev.map(a => a._id === id ? { ...a, status: newStatus } : a));
    } catch (err) { alert(err.response?.data?.message || "Status update failed"); }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this admin?")) return;
    try {
      await axios.delete(`${API_URL}/admins/${id}`, authHeaders());
      setAdmins(prev => prev.filter(a => a._id !== id));
      setTotalCount(c => Math.max(0, c - 1));
    } catch (err) { alert(err.response?.data?.message || "Delete failed"); }
  };

  const handleSave = async (values) => {
    try {
      const res = await axios.put(`${API_URL}/admins/${selectedAdmin._id}`, values, authHeaders());
      const updated = res.data.employee || res.data.admin || res.data;
      setAdmins(prev => prev.map(a => a._id === selectedAdmin._id ? { ...a, ...updated } : a));
      closeModal();
    } catch (err) { alert(err.response?.data?.message || "Update failed"); }
  };

  const openModal  = (admin, mode) => { setSelectedAdmin(admin); setModalMode(mode); };
  const closeModal = ()             => { setSelectedAdmin(null); setModalMode("view"); };

  const activeCount   = admins.filter(a => a.status === "active"   || a.status === "Active").length;
  const inactiveCount = admins.filter(a => a.status === "inactive" || a.status === "Inactive").length;

  if (loading && admins.length === 0) {
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
        title="Admin Directory"
        description={`${totalCount} system administrators`}
        action={{ label: "Add Admin", icon: <RiUserAddLine size={18} />, onClick: () => navigate("/employee/registration") }}
      />

      {/* Stats bar */}
      <div className="grid grid-cols-3 gap-3">
        {[
          { icon: RiShieldUserLine,   label: "Total",    value: totalCount,   bg: "from-indigo-500 to-blue-600"    },
          { icon: RiUserFollowLine,   label: "Active",   value: activeCount,  bg: "from-emerald-500 to-teal-600"   },
          { icon: RiUserUnfollowLine, label: "Inactive", value: inactiveCount,bg: "from-amber-500 to-orange-500"   },
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
        filters={[{
          value: statusFilter,
          onChange: val => setStatusFilter(val),
          options: [
            { value: "all",      label: "All Status" },
            { value: "active",   label: "Active"     },
            { value: "inactive", label: "Inactive"   },
          ],
        }]}
        actions={{
          toggle:  { value: viewMode, onChange: setViewMode, cardIcon: <RiLayoutGridFill size={18} />, tableIcon: <RiListUnordered size={18} /> },
          refresh: { onClick: fetchAdmins, icon: loading ? <RiLoader4Line size={18} className="animate-spin" /> : <RiRefreshLine size={18} /> },
        }}
      />

      <DataStateHandler
        loading={loading && admins.length === 0}
        error={error}
        isEmpty={!admins.length}
        emptyLabel="No admins found"
        emptyDescription="Add your first admin."
        onRetry={fetchAdmins}
      >
        {viewMode === "card" ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {admins.map((admin, i) => (
              <PremiumCard key={admin._id || i} {...admin}
                onView={() => openModal(admin, "view")}
                onEdit={() => openModal(admin, "edit")}
                onDelete={isSuperAdmin ? handleDelete : null}
                onStatusToggle={handleStatusToggle}
              />
            ))}
          </div>
        ) : (
          <EmployeeTable
            employees={admins}
            onView={id => { const a = admins.find(a => a._id === id); if (a) openModal(a, "view"); }}
            onEdit={id => { const a = admins.find(a => a._id === id); if (a) openModal(a, "edit"); }}
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
                  className={`w-8 h-8 text-xs font-bold rounded-lg transition-colors ${p === page ? "bg-blue-600 text-white" : "border border-slate-200 text-slate-600 hover:bg-slate-50"}`}>
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

      <EmployeeModal isOpen={!!selectedAdmin} onClose={closeModal} employee={selectedAdmin} onSave={handleSave} mode={modalMode} />
    </div>
  );
};

export default Admins;
