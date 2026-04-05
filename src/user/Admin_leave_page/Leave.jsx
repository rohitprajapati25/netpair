// // import React, { useState } from "react";
// // import LeaveCards from "../../components/Leave/LeaveCards";
// // import LeaveTable from "../../components/Leave/LeaveTable";
// // import LeaveFilters from "../../components/Leave/LeaveFilter";

// // const Leave = () => {

// //   const [leaveData, setLeaveData] = useState([
  
// //   {
// //     id: 1,
// //     name: "Rohit Prajapati",
// //     type: "Casual",
// //     from: "2026-02-12",
// //     to: "2026-02-14",
// //     days: 3,
// //     status: "Pending",
// //   },
// //   {
// //     id: 2,
// //     name: "Amit Patel",
// //     type: "Sick",
// //     from: "2026-02-10",
// //     to: "2026-02-10",
// //     days: 1,
// //     status: "Approved",
// //   },
// //   {
// //     id: 3,
// //     name: "Jay Shah",
// //     type: "Casual",
// //     from: "2026-02-05",
// //     to: "2026-02-06",
// //     days: 2,
// //     status: "Rejected",
// //   },
// //   {
// //     id: 4,
// //     name: "Priya Mehta",
// //     type: "Sick",
// //     from: "2026-02-01",
// //     to: "2026-02-03",
// //     days: 3,
// //     status: "Approved",
// //   },
// //   {
// //     id: 5,
// //     name: "Karan Joshi",
// //     type: "Casual",
// //     from: "2026-02-15",
// //     to: "2026-02-16",
// //     days: 2,
// //     status: "Pending",
// //   },
// //   {
// //     id: 6,
// //     name: "Neha Sharma",
// //     type: "Emergency",
// //     from: "2026-02-08",
// //     to: "2026-02-09",
// //     days: 2,
// //     status: "Approved",
// //   },
// //   {
// //     id: 7,
// //     name: "Rahul Verma",
// //     type: "Sick",
// //     from: "2026-02-18",
// //     to: "2026-02-18",
// //     days: 1,
// //     status: "Pending",
// //   },
// //   {
// //     id: 8,
// //     name: "Pooja Patel",
// //     type: "Casual",
// //     from: "2026-02-20",
// //     to: "2026-02-22",
// //     days: 3,
// //     status: "Rejected",
// //   },
// //   {
// //     id: 9,
// //     name: "Vikas Yadav",
// //     type: "Sick",
// //     from: "2026-02-11",
// //     to: "2026-02-12",
// //     days: 2,
// //     status: "Approved",
// //   },
// //   {
// //     id: 10,
// //     name: "Sneha Desai",
// //     type: "Casual",
// //     from: "2026-02-25",
// //     to: "2026-02-26",
// //     days: 2,
// //     status: "Pending",
// //   },
// //   {
// //     id: 11,
// //     name: "Hardik Pandya",
// //     type: "Emergency",
// //     from: "2026-02-03",
// //     to: "2026-02-05",
// //     days: 3,
// //     status: "Approved",
// //   },
// //   {
// //     id: 12,
// //     name: "Riya Shah",
// //     type: "Sick",
// //     from: "2026-02-07",
// //     to: "2026-02-07",
// //     days: 1,
// //     status: "Rejected",
// //   },
// //   {
// //     id: 13,
// //     name: "Manish Patel",
// //     type: "Casual",
// //     from: "2026-02-09",
// //     to: "2026-02-11",
// //     days: 3,
// //     status: "Pending",
// //   },
// //   {
// //     id: 14,
// //     name: "Anjali Trivedi",
// //     type: "Sick",
// //     from: "2026-02-13",
// //     to: "2026-02-14",
// //     days: 2,
// //     status: "Approved",
// //   },
// //   {
// //     id: 15,
// //     name: "Deepak Solanki",
// //     type: "Emergency",
// //     from: "2026-02-17",
// //     to: "2026-02-19",
// //     days: 3,
// //     status: "Rejected",
// //   },
// //   {
// //     id: 16,
// //     name: "Kajal Patel",
// //     type: "Casual",
// //     from: "2026-02-04",
// //     to: "2026-02-04",
// //     days: 1,
// //     status: "Approved",
// //   },
// //   {
// //     id: 17,
// //     name: "Nikhil Parmar",
// //     type: "Sick",
// //     from: "2026-02-21",
// //     to: "2026-02-23",
// //     days: 3,
// //     status: "Pending",
// //   },
// //   {
// //     id: 18,
// //     name: "Mehul Rana",
// //     type: "Casual",
// //     from: "2026-02-24",
// //     to: "2026-02-24",
// //     days: 1,
// //     status: "Approved",
// //   },
// //   {
// //     id: 19,
// //     name: "Komal Shah",
// //     type: "Emergency",
// //     from: "2026-02-02",
// //     to: "2026-02-03",
// //     days: 2,
// //     status: "Rejected",
// //   },
// //   {
// //     id: 20,
// //     name: "Arjun Chauhan",
// //     type: "Casual",
// //     from: "2026-02-27",
// //     to: "2026-02-28",
// //     days: 2,
// //     status: "Pending",
// //   },
// //   ]);

// //   const [filters, setFilters] = useState({
// //     search: "",
// //     status: "All",
// //     type: "All",
// //   });

// //   const setQuickFilter = (status) => {
// //     setFilters((prev) => ({
// //       ...prev,
// //       status: status === "All" ? "All" : status,
// //     }));
// //   };

// //   const handleStatusChange = (id, newStatus) => {
// //     const updated = leaveData.map((leave) =>
// //       leave.id === id ? { ...leave, status: newStatus } : leave
// //     );

// //     setLeaveData(updated);
// //   };

// //   const filteredData = leaveData.filter((leave) => {
// //     return (
// //       leave.name.toLowerCase().includes(filters.search.toLowerCase()) &&
// //       (filters.status === "All" || leave.status === filters.status) &&
// //       (filters.type === "All" || leave.type === filters.type)
// //     );
// //   });

// //   const stats = {
// //     total: leaveData.length,
// //     pending: leaveData.filter(l => l.status === "Pending").length,
// //     approved: leaveData.filter(l => l.status === "Approved").length,
// //     rejected: leaveData.filter(l => l.status === "Rejected").length,
// //   };

// //   return (
// //     <div className="relative h-full m-1 p-6
// //       bg-gradient-to-br from-slate-50 to-gray-100
// //       flex flex-col gap-6 overflow-y-auto rounded-2xl grid-cols-1">

// //       <h1 className="text-2xl font-semibold">
// //         Leave Management
// //       </h1>

// //       <LeaveCards
// //         stats={stats}
// //         setQuickFilter={setQuickFilter}
// //       />

// //       <LeaveFilters
// //         filters={filters}
// //         setFilters={setFilters}
// //       />

// //       <LeaveTable
// //         data={filteredData}
// //         onStatusChange={handleStatusChange}
// //       />

// //     </div>
// //   );
// // };

// // export default Leave;


// import React, { useState, useMemo } from "react";
// import LeaveCards from "../../components/Leave/LeaveCards";
// import LeaveTable from "../../components/Leave/LeaveTable";
// import LeaveFilters from "../../components/Leave/LeaveFilter";

// const Leave = () => {
//   const [leaveData, setLeaveData] = useState([
//     /* ... your 20 records ... */
//     { id: 1, name: "Rohit Prajapati", type: "Casual", from: "2026-02-12", to: "2026-02-14", days: 3, status: "Pending" },
//     { id: 2, name: "Amit Patel", type: "Sick", from: "2026-02-10", to: "2026-02-10", days: 1, status: "Approved" },
//     // ... all other records
//   ]);

//   const [filters, setFilters] = useState({
//     search: "",
//     status: "All",
//     type: "All",
//   });

//   const setQuickFilter = (status) => {
//     setFilters((prev) => ({ ...prev, status }));
//   };

//   const handleStatusChange = (id, newStatus) => {
//     setLeaveData(prev => prev.map(l => l.id === id ? { ...l, status: newStatus } : l));
//   };

//   // Performance optimized filtering
//   const filteredData = useMemo(() => {
//     return leaveData.filter((leave) => {
//       const matchesSearch = leave.name.toLowerCase().includes(filters.search.toLowerCase());
//       const matchesStatus = filters.status === "All" || leave.status === filters.status;
//       const matchesType = filters.type === "All" || leave.type === filters.type;
//       return matchesSearch && matchesStatus && matchesType;
//     });
//   }, [leaveData, filters]);

//   const stats = {
//     total: leaveData.length,
//     pending: leaveData.filter(l => l.status === "Pending").length,
//     approved: leaveData.filter(l => l.status === "Approved").length,
//     rejected: leaveData.filter(l => l.status === "Rejected").length,
//   };

//   return (
//     <div className="min-h-screen bg-slate-50/50 p-4 lg:p-8 flex flex-col gap-6">
//       <div className="flex flex-col gap-1">
//         <h1 className="text-3xl font-extrabold tracking-tight text-slate-800">Leave Management</h1>
//         <p className="text-sm text-slate-500 font-medium">Review and manage employee time-off requests</p>
//       </div>

//       <LeaveCards stats={stats} setQuickFilter={setQuickFilter} />

//       <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden">
//         <LeaveFilters filters={filters} setFilters={setFilters} />
//         <LeaveTable data={filteredData} onStatusChange={handleStatusChange} />
//       </div>
//     </div>
//   );
// };

// export default Leave;


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
  const [stats, setStats] = useState({ total: 0, pending: 0, approved: 0, rejected: 0 });
  const [filters, setFilters] = useState({
    search: "",
    status: "All",
    type: "All",
    page: 1,
    limit: 10
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchLeaves = async (pageFilters = filters) => {
    try {
      setLoading(true);
      setError(null);
      const params = new URLSearchParams({
        page: pageFilters.page.toString(),
        limit: pageFilters.limit.toString(),
        ...(pageFilters.search && { search: pageFilters.search }),
        ...(pageFilters.status !== 'All' && { status: pageFilters.status }),
        ...(pageFilters.type !== 'All' && { type: pageFilters.type })
      });

      const res = await axios.get(`http://localhost:5000/api/admin/leaves?${params}`, {
        headers: { Authorization: `Bearer ${token}` }
      });

      setLeaveData(res.data.leaves || []);
      setStats(res.data.stats || {});
    } catch (err) {
      console.error('Fetch leaves error:', err);
      setError(err.response?.data?.message || 'Failed to fetch leaves');
    } finally {
      setLoading(false);
    }
  };

  const setQuickFilter = (status) => {
    setFilters(prev => ({ ...prev, status, page: 1 }));
  };

  const handleStatusChange = async (id, newStatus) => {
    try {
      await axios.put(`http://localhost:5000/api/admin/leaves/${id}`, 
        { status: newStatus },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      // Optimistic update
      setLeaveData(prev => prev.map(l => 
        l._id === id ? { ...l, status: newStatus } : l
      ));
    } catch (err) {
      console.error('Status update error:', err);
      alert('Failed to update status');
    }
  };

  // Client-side search (server does most filtering)
  const filteredData = useMemo(() => {
    return leaveData.filter((leave) => {
      const matchesSearch = !filters.search || 
        leave.employeeId?.name?.toLowerCase().includes(filters.search.toLowerCase()) ||
        leave.name?.toLowerCase().includes(filters.search.toLowerCase());
      return matchesSearch;
    });
  }, [leaveData, filters.search]);

  // Filter change handler with debounce
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      fetchLeaves({ ...filters, page: 1 });
    }, 300);
    return () => clearTimeout(timeoutId);
  }, [filters.status, filters.type]);

  useEffect(() => {
    if (token) {
      fetchLeaves();
    }
  }, [token]);

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50/50 p-6 lg:p-10">
        <div className="max-w-7xl mx-auto space-y-8">
          <SkeletonHeader />
          <SkeletonStats count={4} />
          <SkeletonFilter />
          <SkeletonTable rows={6} />
        </div>
      </div>
    );
  }


  if (error) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="text-red-500 text-lg p-8 bg-white rounded-xl shadow">
          {error}
          <button 
            onClick={() => fetchLeaves()} 
            className="mt-4 px-4 py-2 bg-blue-500 text-white rounded-lg"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50/50 p-4 lg:p-8 flex flex-col gap-6">
      <div className="flex flex-col gap-1">
        <h1 className="text-3xl font-black text-slate-800 tracking-tight">Leave Management</h1>
        <p className="text-slate-500 font-medium text-sm">
          {stats.total} total requests | {stats.pending} pending
        </p>
      </div>

      <LeaveCards stats={stats} setQuickFilter={setQuickFilter} />

      <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden">
        <LeaveFilters 
          filters={filters} 
          setFilters={setFilters} 
          totalResults={stats.total}
        />
        <LeaveTable 
          data={filteredData.map(l => ({
            ...l,
            id: l._id,
            name: l.employeeId?.name || l.name,
            from: l.fromDate.split('T')[0],
            to: l.toDate.split('T')[0]
          }))} 
          onStatusChange={handleStatusChange} 
        />
      </div>
    </div>
  );
};

export default Leave;