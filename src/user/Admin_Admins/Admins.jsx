import React, { useState, useEffect, useCallback } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import PremiumCard from "../../components/Employee/PremiumCard";
import EmployeeModal from "../../components/Employee/EmployeeModal"; // Reuse generic modal
import EmployeeTable from "../../components/Employee/EmployeeTable"; // Reuse table
import {
  RiUserAddLine, RiLoader2Line, RiSearchLine,
  RiLayoutGridFill, RiListUnordered, RiRefreshLine
} from "react-icons/ri";

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
  return (
    <div className="min-h-screen bg-slate-50/50 p-4 md:p-8">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div>
            <h1 className="text-3xl font-black text-slate-800 tracking-tight">Admin Directory</h1>
            <p className="text-slate-500 font-medium text-sm">
              Manage Admin team <span className="text-indigo-600 font-bold">{admins.length}</span> members.
            </p>
          </div>
          <button
          onClick={() => navigate("/employee/registration?role=employee")}
                      className="flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-6 py-3.5 rounded-2xl font-bold shadow-xl transition-all active:scale-95"
                    >
                      <RiUserAddLine size={20} />
                      <span>Add New Employee</span>
                    </button>
        </div>

        {/* Filters */}
        <div className="bg-white p-3 rounded-[2rem] border border-slate-200 shadow-sm flex flex-col lg:flex-row gap-4 items-center">
          <div className="relative flex-1 w-full">
            <RiSearchLine className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
            <input
              type="text"
              placeholder="Search Admins by name/email..."
              value={search}
              onChange={(e) => { setSearch(e.target.value); setPage(1); }}
              className="w-full pl-12 pr-4 py-3 bg-slate-50 border-none rounded-2xl focus:ring-2 focus:ring-indigo-500/20 transition-all font-medium text-slate-700 placeholder:text-slate-400 outline-none"
            />
          </div>

          <div className="flex items-center gap-3 w-full lg:w-auto">
            <select
              value={statusFilter}
              onChange={(e) => { setStatusFilter(e.target.value); setPage(1); }}
              className="flex-1 lg:w-40 px-4 py-3 bg-slate-50 border-none rounded-2xl font-bold text-slate-600 focus:ring-2 focus:ring-indigo-500/20 appearance-none outline-none"
            >
              <option value="all">All Status</option>
              <option value="active">Active</option>
              <option value="inactive">Inactive</option>
            </select>

            <div className="flex bg-slate-100 p-1 rounded-xl">
              <button
                onClick={() => setViewMode("card")}
                className={`p-2 rounded-lg transition-all ${viewMode === "card" ? "bg-white shadow-sm text-indigo-600" : "text-slate-400 hover:text-slate-600"}`}
              >
                <RiLayoutGridFill size={20} />
              </button>
              <button
                onClick={() => setViewMode("table")}
                className={`p-2 rounded-lg transition-all ${viewMode === "table" ? "bg-white shadow-sm text-indigo-600" : "text-slate-400 hover:text-slate-600"}`}
              >
                <RiListUnordered size={20} />
              </button>
            </div>

            <button
              onClick={fetchAdmins}
              className="p-3 text-slate-400 hover:text-indigo-600 transition-colors"
            >
              <RiRefreshLine size={22} className={loading ? "animate-spin" : ""} />
            </button>
          </div>
        </div>

        {/* Content */}
        {loading ? (
          <div className="flex flex-col items-center justify-center py-24 gap-4">
            <RiLoader2Line className="animate-spin h-12 w-12 text-indigo-600" />
            <p className="font-bold text-slate-400 animate-pulse">Loading Admin team...</p>
          </div>
        ) : error ? (
          <div className="bg-rose-50 border border-rose-100 p-6 rounded-3xl text-center">
            <p className="text-rose-600 font-bold mb-3">{error}</p>
            <button onClick={fetchAdmins} className="bg-rose-600 text-white px-6 py-2 rounded-xl font-bold">
              Try Again
            </button>
          </div>
        ) : admins.length === 0 ? (
          <div className="text-center py-20 bg-white rounded-[3rem] border-2 border-dashed border-slate-200">
            <p className="text-slate-400 font-bold text-lg mb-2">No Admins found</p>
            <p className="text-slate-400 text-sm">Add your first Admin team member.</p>
          </div>
        ) : (
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
        )}
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

