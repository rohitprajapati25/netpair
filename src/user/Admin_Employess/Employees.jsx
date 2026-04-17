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
  RiTeamLine, RiUserFollowLine, RiUserUnfollowLine
} from "react-icons/ri";
import { PageHeader, FilterBar, DataStateHandler } from "../../components/Layout";
import { SkeletonHeader, SkeletonFilter, SkeletonGrid, SkeletonTable } from "../../components/Skeletons";
import API_URL from "../../config/api";

const authHeaders = () => ({ headers: { Authorization: `Bearer ${localStorage.getItem("token")}` } });
const LIMIT = 12;

const Employees = () => {
  const navigate = useNavigate();
  const { role: userRole } = useAuth();
  const role = userRole?.toLowerCase();
  const isHR          = role === "hr";
  const isSuperAdmin  = role === "superadmin";
  // Only superadmin can delete employees (backend enforces this too)
  const canDelete     = isSuperAdmin;
  const [employees, setEmployees]       = useState([]);
  const [loading, setLoading]           = useState(true);
  const [error, setError]               = useState(null);
  const [search, setSearch]             = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [deptFilter, setDeptFilter]     = useState("all");
  const [page, setPage]                 = useState(1);
  const [totalPages, setTotalPages]     = useState(1);
  const [totalCount, setTotalCount]     = useState(0);
  const [selectedEmployee, setSelectedEmployee] = useState(null);
  const [modalMode, setModalMode]       = useState("view");
  const [viewMode, setViewMode]         = useState("card");

  const fetchEmployees = useCallback(async () => {
    try {
      setLoading(true); setError(null);
      const params = new URLSearchParams({
        page: page.toString(), limit: LIMIT.toString(),
        ...(search && { search }),
        ...(statusFilter !== "all" && { status: statusFilter }),
        ...(deptFilter  !== "all" && { department: deptFilter }),
      });
      const res = await axios.get(`${API_URL}/admin/employees?${params}`, authHeaders());
      setEmployees(res.data.employees || []);
      setTotalCount(res.data.pagination?.total || res.data.total || res.data.count || 0);
      setTotalPages(res.data.pagination?.pages || Math.ceil((res.data.pagination?.total || 0) / LIMIT) || 1);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to fetch employees");
    } finally {
      setLoading(false);
    }
  }, [search, statusFilter, deptFilter, page]);

  useEffect(() => {
    const t = setTimeout(fetchEmployees, 400);
    return () => clearTimeout(t);
  }, [fetchEmployees]);

  // Reset page when filters change
  useEffect(() => { setPage(1); }, [search, statusFilter, deptFilter]);

  const handleStatusToggle = async (id, newStatus) => {
    try {
      await axios.put(`${API_URL}/admin/employees/${id}`, { status: newStatus }, authHeaders());
      setEmployees(prev => prev.map(e => e._id === id ? { ...e, status: newStatus } : e));
    } catch (err) { alert(err.response?.data?.message || "Status update failed"); }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this employee?")) return;
    try {
      await axios.delete(`${API_URL}/admin/employees/${id}`, authHeaders());
      setEmployees(prev => prev.filter(e => e._id !== id));
      setTotalCount(c => Math.max(0, c - 1));
    } catch (err) { alert(err.response?.data?.message || "Delete failed"); }
  };

  const handleSave = async (values) => {
    try {
      const res = await axios.put(`${API_URL}/admin/employees/${selectedEmployee._id}`, values, authHeaders());
      const updated = res.data.employee || res.data;
      setEmployees(prev => prev.map(e => e._id === selectedEmployee._id ? { ...e, ...updated } : e));
      closeModal();
    } catch (err) { alert(err.response?.data?.message || "Update failed"); }
  };

  const openModal  = (emp, mode) => { setSelectedEmployee(emp); setModalMode(mode); };
  const closeModal = ()           => { setSelectedEmployee(null); setModalMode("view"); };

  // Quick stats from current page data
  const activeCount   = employees.filter(e => e.status === "active"   || e.status === "Active").length;
  const inactiveCount = employees.filter(e => e.status === "inactive" || e.status === "Inactive").length;

  if (loading && employees.length === 0) {
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
        title="Employee Directory"
        description={`${totalCount} total employees`}
        action={!isHR ? { label: "Add Employee", icon: <RiUserAddLine size={18} />, onClick: () => navigate("/employee/registration") } : null}
      />

      {/* Stats bar */}
      <div className="grid grid-cols-3 gap-3">
        {[
          { icon: RiTeamLine,         label: "Total",    value: totalCount,   bg: "from-blue-500 to-indigo-600"    },
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
        setSearchValue={val => { setSearch(val); }}
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
              { value: "all",                label: "All Depts"       },
              { value: "Development",        label: "Development"     },
              { value: "Design",             label: "Design"          },
              { value: "HR",                 label: "HR"              },
              { value: "Finance & Accounts", label: "Finance"         },
              { value: "Sales",              label: "Sales"           },
              { value: "Marketing",          label: "Marketing"       },
              { value: "Operations",         label: "Operations"      },
              { value: "IT",                 label: "IT"              },
              { value: "QA",                 label: "QA"              },
            ],
          },
        ]}
        actions={{
          toggle:  { value: viewMode, onChange: setViewMode, cardIcon: <RiLayoutGridFill size={18} />, tableIcon: <RiListUnordered size={18} /> },
          refresh: { onClick: fetchEmployees, icon: loading ? <RiLoader4Line size={18} className="animate-spin" /> : <RiRefreshLine size={18} /> },
        }}
      />

      <DataStateHandler
        loading={loading && employees.length === 0}
        error={error}
        isEmpty={!employees.length}
        emptyLabel="No employees found"
        emptyDescription="Try adjusting filters or add a new employee."
        onRetry={fetchEmployees}
      >
        {viewMode === "card" ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {employees.map((emp, i) => (
              <PremiumCard key={emp._id || i} {...emp}
                onView={() => openModal(emp, "view")}
                onEdit={!isHR ? () => openModal(emp, "edit") : null}
                onDelete={canDelete ? handleDelete : null}
                onStatusToggle={!isHR ? handleStatusToggle : null}
              />
            ))}
          </div>
        ) : (
          <EmployeeTable
            employees={employees}
            onView={id => { const e = employees.find(e => e._id === id); if (e) openModal(e, "view"); }}
            onEdit={id => { const e = employees.find(e => e._id === id); if (e) openModal(e, "edit"); }}
            onDelete={canDelete ? handleDelete : null}
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

      <EmployeeModal isOpen={!!selectedEmployee} onClose={closeModal} employee={selectedEmployee} onSave={handleSave} mode={modalMode} />
    </div>
  );
};

export default Employees;
