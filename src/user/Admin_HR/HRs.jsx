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

// ─── HRs Page (Exact Employee Copy → api/hr) ───────────────────────────────
const HRs = () => {
  const navigate = useNavigate();
  const [hrs, setHrs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [page, setPage] = useState(1);
  const [selectedHR, setSelectedHR] = useState(null);
  const [modalMode, setModalMode] = useState("view");
  const [viewMode, setViewMode] = useState("card");

  // ── fetch HRs ─────────────────────────────────────────────────────────────
  const fetchHRs = useCallback(async () => {
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
        `http://localhost:5000/api/hr?${params}`,
        authHeaders()
      );
      setHrs(res.data.hrs || res.data.employees || []); // Flexible response
    } catch (err) {
      setError(err.response?.data?.message || "Failed to fetch HRs");
    } finally {
      setLoading(false);
    }
  }, [search, statusFilter, page]);

  useEffect(() => {
    const timer = setTimeout(fetchHRs, 400);
    return () => clearTimeout(timer);
  }, [fetchHRs]);

  // ── handlers ───────────────────────────────────────────────────────────────
  const handleStatusToggle = async (id, newStatus) => {
    try {
      await axios.put(
        `http://localhost:5000/api/hr/${id}`,
        { status: newStatus },
        authHeaders()
      );
      setHrs((prev) => prev.map((hr) => hr._id === id ? { ...hr, status: newStatus } : hr));
    } catch (err) {
      alert(err.response?.data?.message || "Status update failed");
    }
  };

  const handleDelete = async (id) => {
    try {
      console.log('Deleting HR ID:', id);
      await axios.delete(`http://localhost:5000/api/hr/${id}`, authHeaders());
      console.log('HR deleted, refetching...');
      fetchHRs();
    } catch (err) {
      console.error('HR Delete error:', err.response?.data);
      alert(err.response?.data?.message || "Delete failed");
    }
  };

  const handleSaveHR = async (values) => {
    try {
      const res = await axios.put(
        `http://localhost:5000/api/hr/${selectedHR._id}`,
        values,
        authHeaders()
      );
      setHrs((prev) => prev.map((hr) => hr._id === selectedHR._id ? res.data : hr));
      closeModal();
    } catch (err) {
      alert(err.response?.data?.message || "Update failed");
    }
  };

  const openModal = (hr, mode) => {
    setSelectedHR(hr);
    setModalMode(mode);
  };

  const closeModal = () => {
    setSelectedHR(null);
    setModalMode("view");
  };

  const cardHandlers = (hr) => ({
    onView: () => openModal(hr, "view"),
    onEdit: () => openModal(hr, "edit"),
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
          title="HR Directory"
          description={`Manage HR team ${hrs.length} members.`}
          action={{
            label: "Add New HR",
            icon: <RiUserAddLine size={20} />,
            onClick: () => navigate("/employee/registration?role=employee"),
          }}
        />

        {/* Filters */}
        <FilterBar
          searchValue={search}
          setSearchValue={(val) => { setSearch(val); setPage(1); }}
          searchPlaceholder="Search HR by name/email..."
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
              onClick: fetchHRs,
              icon: loading ? <RiLoader4Line size={22} className="animate-spin" /> : <RiRefreshLine size={22} />,
            },
          }}
          focusColor="emerald"
        />

        {/* Content */}
        <DataStateHandler
          loading={loading}
          error={error}
          isEmpty={hrs.length === 0}
          loadingLabel="Loading HR team..."
          emptyLabel="No HR members found"
          emptyDescription="Add your first HR team member."
          onRetry={fetchHRs}
        >
          <div className="">
            {viewMode === "card" ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                {hrs.map((hr, index) => (
                  <PremiumCard
                    key={hr._id || index}
                    {...hr}
                    {...cardHandlers(hr)}
                  />
                ))}
              </div>
            ) : (
              <EmployeeTable
                employees={hrs}
                onView={(id) => { const e = hrs.find(e => e._id === id); if (e) openModal(e, "view"); }}
                onEdit={(id) => { const e = hrs.find(e => e._id === id); if (e) openModal(e, "edit"); }}
                onDelete={handleDelete}
                onStatusToggle={handleStatusToggle}
              />
            )}
          </div>
        </DataStateHandler>
      </div>

      {/* Modal */}
      <EmployeeModal
        isOpen={!!selectedHR}
        onClose={closeModal}
        employee={selectedHR}
        onSave={handleSaveHR}
        mode={modalMode}
      />
    </div>
  );
};

export default HRs;

