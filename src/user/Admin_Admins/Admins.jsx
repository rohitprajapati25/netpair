import React, { useState, useEffect, useCallback } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import PremiumCard from "../../components/Employee/PremiumCard";
import EmployeeModal from "../../components/Employee/EmployeeModal";
import EmployeeTable from "../../components/Employee/EmployeeTable";
import {
  RiUserAddLine,
  RiLayoutGridFill, RiListUnordered, RiRefreshLine, RiLoader4Line
} from "react-icons/ri";
import { PageHeader, FilterBar, ViewModeToggle, DataStateHandler } from "../../components/Layout";
import { SkeletonHeader, SkeletonFilter, SkeletonGrid, SkeletonTable } from "../../components/Skeletons";

// ─── auth helper ─────────────────────────────────────────────────────────────
const authHeaders = () => ({
  headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
});

// ─── Admins Page (Employee → api/admins) ────────────────────────────────────
const Admins = () => {
  const navigate = useNavigate();
  const [admins, setAdmins] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [page, setPage] = useState(1);
  const [selectedAdmin, setSelectedAdmin] = useState(null);
  const [modalMode, setModalMode] = useState("view");
  const [viewMode, setViewMode] = useState("card");

  // ── fetch Admins ──────────────────────────────────────────────────────────
  const fetchAdmins = useCallback(async () => {
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
        `http://localhost:5000/api/admins?${params}`,
        authHeaders()
      );
      setAdmins(res.data.admins || res.data.employees || []); // Flexible
    } catch (err) {
      setError(err.response?.data?.message || "Failed to fetch Admins");
    } finally {
      setLoading(false);
    }
  }, [search, statusFilter, page]);

  useEffect(() => {
    const timer = setTimeout(fetchAdmins, 400);
    return () => clearTimeout(timer);
  }, [fetchAdmins]);

  // ── handlers ───────────────────────────────────────────────────────────────
  const handleStatusToggle = async (id, newStatus) => {
    try {
      await axios.put(
        `http://localhost:5000/api/admins/${id}`,
        { status: newStatus },
        authHeaders()
      );
      setAdmins((prev) => prev.map((admin) => admin._id === id ? { ...admin, status: newStatus } : admin));
    } catch (err) {
      alert(err.response?.data?.message || "Status update failed");
    }
  };

  const handleDelete = async (id) => {
    try {
      console.log('Deleting Admin ID:', id);
      await axios.delete(`http://localhost:5000/api/admins/${id}`, authHeaders());
      console.log('Admin deleted, refetching...');
      fetchAdmins();
    } catch (err) {
      console.error('Admin Delete error:', err.response?.data);
      alert(err.response?.data?.message || "Delete failed");
    }
  };

  const handleSaveAdmin = async (values) => {
    try {
      const res = await axios.put(
        `http://localhost:5000/api/admins/${selectedAdmin._id}`,
        values,
        authHeaders()
      );
      setAdmins((prev) => prev.map((admin) => admin._id === selectedAdmin._id ? res.data : admin));
      closeModal();
    } catch (err) {
      alert(err.response?.data?.message || "Update failed");
    }
  };

  const openModal = (admin, mode) => {
    setSelectedAdmin(admin);
    setModalMode(mode);
  };

  const closeModal = () => {
    setSelectedAdmin(null);
    setModalMode("view");
  };

  const cardHandlers = (admin) => ({
    onView: () => openModal(admin, "view"),
    onEdit: () => openModal(admin, "edit"),
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
          title="Admin Directory"
          description={`Manage Admin team ${admins.length} members.`}
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
          searchPlaceholder="Search Admins by name/email..."
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
              onClick: fetchAdmins,
              icon: loading ? <RiLoader4Line size={22} className="animate-spin" /> : <RiRefreshLine size={22} />,
            },
          }}
          focusColor="indigo"
        />

        {/* Content */}
        <DataStateHandler
          loading={loading}
          error={error}
          isEmpty={admins.length === 0}
          loadingLabel="Loading Admin team..."
          emptyLabel="No Admins found"
          emptyDescription="Add your first Admin team member."
          onRetry={fetchAdmins}
        >
          <div className="">
            {viewMode === "card" ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                {admins.map((admin, index) => (
                  <PremiumCard
                    key={admin._id || index}
                    {...admin}
                    {...cardHandlers(admin)}
                  />
                ))}
              </div>
            ) : (
              <EmployeeTable
                employees={admins}
                onView={(id) => { const e = admins.find(e => e._id === id); if (e) openModal(e, "view"); }}
                onEdit={(id) => { const e = admins.find(e => e._id === id); if (e) openModal(e, "edit"); }}
                onDelete={handleDelete}
                onStatusToggle={handleStatusToggle}
              />
            )}
          </div>
        </DataStateHandler>
      </div>

      {/* Modal */}
      <EmployeeModal
        isOpen={!!selectedAdmin}
        onClose={closeModal}
        employee={selectedAdmin}
        onSave={handleSaveAdmin}
        mode={modalMode}
      />
    </div>
  );
};

export default Admins;

