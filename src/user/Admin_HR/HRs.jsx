import React, { useState, useEffect, useCallback } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import PremiumCard from "../../components/Employee/PremiumCard";
import EmployeeModal from "../../components/Employee/EmployeeModal"; // Reuse EmployeeModal (generic)
import EmployeeTable from "../../components/Employee/EmployeeTable"; // Reuse Table
import {
  RiUserAddLine, RiLoader2Line, RiSearchLine,
  RiLayoutGridFill, RiListUnordered, RiRefreshLine
} from "react-icons/ri";

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
  return (
    <div className="min-h-screen bg-slate-50/50 p-4 md:p-8">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div>
            <h1 className="text-3xl font-black text-slate-800 tracking-tight">HR Directory</h1>
            <p className="text-slate-500 font-medium text-sm">
              Manage HR team <span className="text-emerald-600 font-bold">{hrs.length}</span> members.
            </p>
          </div>
          <button
          onClick={() => navigate("/employee/registration?role=employee")}
                      className="flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-6 py-3.5 rounded-2xl font-bold shadow-xl transition-all active:scale-95"
                    >
                      <RiUserAddLine size={20} />
                      <span>Add New Hr</span>
                    </button>
        </div>

        {/* Filters */}
        <div className="bg-white p-3 rounded-[2rem] border border-slate-200 shadow-sm flex flex-col lg:flex-row gap-4 items-center">
          <div className="relative flex-1 w-full">
            <RiSearchLine className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
            <input
              type="text"
              placeholder="Search HR by name/email..."
              value={search}
              onChange={(e) => { setSearch(e.target.value); setPage(1); }}
              className="w-full pl-12 pr-4 py-3 bg-slate-50 border-none rounded-2xl focus:ring-2 focus:ring-emerald-500/20 transition-all font-medium text-slate-700 placeholder:text-slate-400 outline-none"
            />
          </div>

          <div className="flex items-center gap-3 w-full lg:w-auto">
            <select
              value={statusFilter}
              onChange={(e) => { setStatusFilter(e.target.value); setPage(1); }}
              className="flex-1 lg:w-40 px-4 py-3 bg-slate-50 border-none rounded-2xl font-bold text-slate-600 focus:ring-2 focus:ring-emerald-500/20 appearance-none outline-none"
            >
              <option value="all">All Status</option>
              <option value="active">Active</option>
              <option value="inactive">Inactive</option>
            </select>

            <div className="flex bg-slate-100 p-1 rounded-xl">
              <button
                onClick={() => setViewMode("card")}
                className={`p-2 rounded-lg transition-all ${viewMode === "card" ? "bg-white shadow-sm text-emerald-600" : "text-slate-400 hover:text-slate-600"}`}
              >
                <RiLayoutGridFill size={20} />
              </button>
              <button
                onClick={() => setViewMode("table")}
                className={`p-2 rounded-lg transition-all ${viewMode === "table" ? "bg-white shadow-sm text-emerald-600" : "text-slate-400 hover:text-slate-600"}`}
              >
                <RiListUnordered size={20} />
              </button>
            </div>

            <button
              onClick={fetchHRs}
              className="p-3 text-slate-400 hover:text-emerald-600 transition-colors"
            >
              <RiRefreshLine size={22} className={loading ? "animate-spin" : ""} />
            </button>
          </div>
        </div>

        {/* Content */}
        {loading ? (
          <div className="flex flex-col items-center justify-center py-24 gap-4">
            <RiLoader2Line className="animate-spin h-12 w-12 text-emerald-600" />
            <p className="font-bold text-slate-400 animate-pulse">Loading HR team...</p>
          </div>
        ) : error ? (
          <div className="bg-rose-50 border border-rose-100 p-6 rounded-3xl text-center">
            <p className="text-rose-600 font-bold mb-3">{error}</p>
            <button onClick={fetchHRs} className="bg-rose-600 text-white px-6 py-2 rounded-xl font-bold">
              Try Again
            </button>
          </div>
        ) : hrs.length === 0 ? (
          <div className="text-center py-20 bg-white rounded-[3rem] border-2 border-dashed border-slate-200">
            <p className="text-slate-400 font-bold text-lg mb-2">No HR members found</p>
            <p className="text-slate-400 text-sm">Add your first HR team member.</p>
          </div>
        ) : (
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
        )}
      </div>

      {/* Modal (Reuse EmployeeModal - generic) */}
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

