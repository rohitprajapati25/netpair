import React, { useState, useMemo, useEffect } from "react";
import { useAuth } from "../../contexts/AuthContext";
import { SkeletonHeader, SkeletonFilter, SkeletonStats, SkeletonTable } from "../../components/Skeletons";
import axios from 'axios';
import LeaveCards from "../../components/Leave/LeaveCards";
import LeaveTable from "../../components/Leave/LeaveTable";
import LeaveFilters from "../../components/Leave/LeaveFilter";

const Leave = () => {
  const { token } = useAuth();
  const [leaveData, setLeaveData] = useState([]);
  const [stats, setStats]         = useState({ total: 0, pending: 0, approved: 0, rejected: 0 });
  const [filters, setFilters]     = useState({ search: "", status: "All", type: "All", page: 1, limit: 10 });
  const [loading, setLoading]     = useState(true);
  const [error, setError]         = useState(null);

  const fetchLeaves = async (pageFilters = filters) => {
    try {
      setLoading(true);
      setError(null);
      const params = new URLSearchParams({
        page:  pageFilters.page.toString(),
        limit: pageFilters.limit.toString(),
        ...(pageFilters.search && { search: pageFilters.search }),
        ...(pageFilters.status !== 'All' && { status: pageFilters.status }),
        ...(pageFilters.type   !== 'All' && { type:   pageFilters.type   }),
      });
      const res = await axios.get(`http://localhost:5000/api/admin/leaves?${params}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setLeaveData(res.data.leaves || []);
      setStats(res.data.stats || {});
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to fetch leaves');
    } finally {
      setLoading(false);
    }
  };

  const setQuickFilter = (status) => setFilters(prev => ({ ...prev, status, page: 1 }));

  const handleStatusChange = async (id, newStatus) => {
    const previousData = leaveData; // save for rollback
    setLeaveData(prev => prev.map(l => l._id === id ? { ...l, status: newStatus } : l)); // optimistic
    try {
      await axios.put(`http://localhost:5000/api/admin/leaves/${id}`,
        { status: newStatus },
        { headers: { Authorization: `Bearer ${token}` } }
      );
    } catch (err) {
      setLeaveData(previousData); // revert on failure
      alert(err.response?.data?.message || 'Failed to update status');
    }
  };

  const filteredData = useMemo(() => {
    if (!filters.search) return leaveData;
    const s = filters.search.toLowerCase();
    return leaveData.filter(l =>
      l.employeeId?.name?.toLowerCase().includes(s) ||
      l.name?.toLowerCase().includes(s)
    );
  }, [leaveData, filters.search]);

  // Re-fetch when status/type filter changes
  useEffect(() => {
    const t = setTimeout(() => fetchLeaves({ ...filters, page: 1 }), 300);
    return () => clearTimeout(t);
  }, [filters.status, filters.type]);

  useEffect(() => { if (token) fetchLeaves(); }, [token]);

  if (loading) {
    return (
      <div className="space-y-6">
        <SkeletonHeader />
        <SkeletonStats count={4} />
        <SkeletonFilter />
        <SkeletonTable rows={6} />
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="text-center">
          <p className="text-red-500 font-semibold mb-3">{error}</p>
          <button onClick={() => fetchLeaves()}
            className="px-4 py-2 bg-blue-600 text-white rounded-xl font-semibold text-sm hover:bg-blue-700 transition-colors">
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-black text-slate-800 tracking-tight">Leave Management</h1>
        <p className="text-slate-500 font-medium text-sm">
          {stats.total} total requests · {stats.pending} pending
        </p>
      </div>

      <LeaveCards stats={stats} setQuickFilter={setQuickFilter} />

      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        <LeaveFilters filters={filters} setFilters={setFilters} totalResults={stats.total} />
        <LeaveTable
          data={filteredData.map(l => ({
            ...l,
            id:   l._id,
            name: l.employeeId?.name || l.name || 'Unknown',
            from: l.fromDate ? new Date(l.fromDate).toISOString().split('T')[0] : '',
            to:   l.toDate   ? new Date(l.toDate).toISOString().split('T')[0]   : '',
          }))}
          onStatusChange={handleStatusChange}
        />
      </div>
    </div>
  );
};

export default Leave;
