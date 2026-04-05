import React, { useState, useEffect, useCallback } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import PremiumCard from "../../components/Employee/PremiumCard";
import EmployeeModal from "../../components/Employee/EmployeeModal";
import EmployeeTable from "../../components/Employee/EmployeeTable";
import {
  RiUserAddLine, RiSearchLine, RiLayoutGridFill, RiListUnordered, RiRefreshLine, RiLoader4Line
} from "react-icons/ri";
import { PageHeader, FilterBar, DataStateHandler } from "../../components/Layout";
import { SkeletonHeader, SkeletonFilter, SkeletonGrid, SkeletonTable } from "../../components/Skeletons";

// ─── auth helper ─────────────────────────────────────────────────────────────
const authHeaders = () => ({
  headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
});

// ─── Employees Page ─────────────────────────────────────────────────────────
const Employees = () => {
  const navigate = useNavigate();

  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [page, setPage] = useState(1);
  const [selectedEmployee, setSelectedEmployee] = useState(null);
  const [modalMode, setModalMode] = useState("view");
  const [viewMode, setViewMode] = useState("card");

  // ── fetch ──────────────────────────────────────────────────────────────────
  const fetchEmployees = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      const params = new URLSearchParams({
        page: page.toString(),
        limit: "12",
        ...(search && { search }),
        ...(statusFilter !== "all" && { status: statusFilter }),
      });

      const res = await axios.get(
        `http://localhost:5000/api/employees?${params}`,
        authHeaders()
      );
      setEmployees(res.data.employees || []);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to fetch employees");
    } finally {
      setLoading(false);
    }
  }, [search, statusFilter, page]);

  useEffect(() => {
    const timer = setTimeout(fetchEmployees, 400);
    return () => clearTimeout(timer);
  }, [fetchEmployees]);

  // ── handlers ───────────────────────────────────────────────────────────────
  const handleStatusToggle = async (id, newStatus) => {
    try {
      await axios.put(
        `http://localhost:5000/api/employees/${id}`,
        { status: newStatus },
        authHeaders()
      );
      setEmployees((prev) =>
        prev.map((emp) => emp._id === id ? { ...emp, status: newStatus } : emp)
      );
    } catch (err) {
      alert(err.response?.data?.message || "Status update failed");
    }
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(
        `http://localhost:5000/api/employees/${id}`,
        authHeaders()
      );
      fetchEmployees();
    } catch (err) {
      alert(err.response?.data?.message || "Delete failed");
    }
  };

  const handleSaveEmployee = async (values) => {
    try {
      const res = await axios.put(
        `http://localhost:5000/api/admin/employees/${selectedEmployee._id}`,
        values,
        authHeaders()
      );
      setEmployees((prev) =>
        prev.map((emp) =>
          emp._id === selectedEmployee._id ? { ...emp, ...res.data } : emp
        )
      );
      closeModal();
    } catch (err) {
      alert(err.response?.data?.message || "Update failed");
    }
  };

  const openModal = (emp, mode) => {
    setSelectedEmployee(emp);
    setModalMode(mode);
  };

  const closeModal = () => {
    setSelectedEmployee(null);
    setModalMode("view");
  };

  const cardHandlers = (emp) => ({
    onView: () => openModal(emp, "view"),
    onEdit: () => openModal(emp, "edit"),
    onDelete: handleDelete,
    onStatusToggle: handleStatusToggle,
  });

  // ── render ─────────────────────────────────────────────────────────────────
  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50/50 p-4 md:p-8">
        <div className="max-w-7xl mx-auto space-y-8">
          <SkeletonHeader />
          <SkeletonFilter />
          {viewMode === "card" ? <SkeletonGrid count={8} /> : <SkeletonTable rows={6} />}
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50/50 p-4 md:p-8">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Page Header */}
        <PageHeader
          title="Employee Directory"
          description={`Manage team ${employees.length} members.`}
          action={{
            label: "Add New Employee",
            icon: <RiUserAddLine size={20} />,
            onClick: () => navigate("/employee/registration?role=employee"),
          }}
        />

        {/* Filters */}
        <FilterBar
          searchValue={search}
          setSearchValue={(val) => { setSearch(val); setPage(1); }}
          searchPlaceholder="Search employees by name/email..."
          filters={[
            {
              value: statusFilter,
              onChange: (val) => { setStatusFilter(val); setPage(1); },
              options: [
                { value: "all", label: "All Status" },
                { value: "active", label: "Active" },
                { value: "inactive", label: "Inactive" },
              ],
            },
          ]}
          actions={{
            toggle: {
              value: viewMode,
              onChange: setViewMode,
              cardIcon: <RiLayoutGridFill size={20} />,
              tableIcon: <RiListUnordered size={20} />,
            },
            refresh: {
              onClick: fetchEmployees,
              icon: loading ? <RiLoader4Line size={22} className="animate-spin" /> : <RiRefreshLine size={22} />,
            },
          }}
        />

        {/* Content */}
        <DataStateHandler
          loading={loading}
          error={error}
          isEmpty={employees.length === 0}
          loadingLabel="Loading employees..."
          emptyLabel="No employees found"
          emptyDescription="Add your first team member."
          onRetry={fetchEmployees}
        >
          <div>
            {viewMode === "card" ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                {employees.map((emp, index) => (
                  <PremiumCard
                    key={emp._id || index}
                    {...emp}
                    {...cardHandlers(emp)}
                  />
                ))}
              </div>
            ) : (
              <EmployeeTable
                employees={employees}
                onView={(id) => {
                  const e = employees.find((e) => e._id === id);
                  if (e) openModal(e, "view");
                }}
                onEdit={(id) => {
                  const e = employees.find((e) => e._id === id);
                  if (e) openModal(e, "edit");
                }}
                onDelete={handleDelete}
                onStatusToggle={handleStatusToggle}
              />
            )}
          </div>
        </DataStateHandler>
      </div>

      {/* Modal */}
      <EmployeeModal
        isOpen={!!selectedEmployee}
        onClose={closeModal}
        employee={selectedEmployee}
        onSave={handleSaveEmployee}
        mode={modalMode}
      />
    </div>
  );
};

export default Employees;
