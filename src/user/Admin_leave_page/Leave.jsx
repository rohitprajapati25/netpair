import React, { useState } from "react";
import LeaveCards from "../../components/Leave/LeaveCards";
import LeaveTable from "../../components/Leave/LeaveTable";
import LeaveFilters from "../../components/Leave/LeaveFilter";

const Leave = () => {

  const [leaveData, setLeaveData] = useState([
  
  {
    id: 1,
    name: "Rohit Prajapati",
    type: "Casual",
    from: "2026-02-12",
    to: "2026-02-14",
    days: 3,
    status: "Pending",
  },
  {
    id: 2,
    name: "Amit Patel",
    type: "Sick",
    from: "2026-02-10",
    to: "2026-02-10",
    days: 1,
    status: "Approved",
  },
  {
    id: 3,
    name: "Jay Shah",
    type: "Casual",
    from: "2026-02-05",
    to: "2026-02-06",
    days: 2,
    status: "Rejected",
  },
  {
    id: 4,
    name: "Priya Mehta",
    type: "Sick",
    from: "2026-02-01",
    to: "2026-02-03",
    days: 3,
    status: "Approved",
  },
  {
    id: 5,
    name: "Karan Joshi",
    type: "Casual",
    from: "2026-02-15",
    to: "2026-02-16",
    days: 2,
    status: "Pending",
  },
  {
    id: 6,
    name: "Neha Sharma",
    type: "Emergency",
    from: "2026-02-08",
    to: "2026-02-09",
    days: 2,
    status: "Approved",
  },
  {
    id: 7,
    name: "Rahul Verma",
    type: "Sick",
    from: "2026-02-18",
    to: "2026-02-18",
    days: 1,
    status: "Pending",
  },
  {
    id: 8,
    name: "Pooja Patel",
    type: "Casual",
    from: "2026-02-20",
    to: "2026-02-22",
    days: 3,
    status: "Rejected",
  },
  {
    id: 9,
    name: "Vikas Yadav",
    type: "Sick",
    from: "2026-02-11",
    to: "2026-02-12",
    days: 2,
    status: "Approved",
  },
  {
    id: 10,
    name: "Sneha Desai",
    type: "Casual",
    from: "2026-02-25",
    to: "2026-02-26",
    days: 2,
    status: "Pending",
  },
  {
    id: 11,
    name: "Hardik Pandya",
    type: "Emergency",
    from: "2026-02-03",
    to: "2026-02-05",
    days: 3,
    status: "Approved",
  },
  {
    id: 12,
    name: "Riya Shah",
    type: "Sick",
    from: "2026-02-07",
    to: "2026-02-07",
    days: 1,
    status: "Rejected",
  },
  {
    id: 13,
    name: "Manish Patel",
    type: "Casual",
    from: "2026-02-09",
    to: "2026-02-11",
    days: 3,
    status: "Pending",
  },
  {
    id: 14,
    name: "Anjali Trivedi",
    type: "Sick",
    from: "2026-02-13",
    to: "2026-02-14",
    days: 2,
    status: "Approved",
  },
  {
    id: 15,
    name: "Deepak Solanki",
    type: "Emergency",
    from: "2026-02-17",
    to: "2026-02-19",
    days: 3,
    status: "Rejected",
  },
  {
    id: 16,
    name: "Kajal Patel",
    type: "Casual",
    from: "2026-02-04",
    to: "2026-02-04",
    days: 1,
    status: "Approved",
  },
  {
    id: 17,
    name: "Nikhil Parmar",
    type: "Sick",
    from: "2026-02-21",
    to: "2026-02-23",
    days: 3,
    status: "Pending",
  },
  {
    id: 18,
    name: "Mehul Rana",
    type: "Casual",
    from: "2026-02-24",
    to: "2026-02-24",
    days: 1,
    status: "Approved",
  },
  {
    id: 19,
    name: "Komal Shah",
    type: "Emergency",
    from: "2026-02-02",
    to: "2026-02-03",
    days: 2,
    status: "Rejected",
  },
  {
    id: 20,
    name: "Arjun Chauhan",
    type: "Casual",
    from: "2026-02-27",
    to: "2026-02-28",
    days: 2,
    status: "Pending",
  },
  ]);

  const [filters, setFilters] = useState({
    search: "",
    status: "All",
    type: "All",
  });

  const setQuickFilter = (status) => {
    setFilters((prev) => ({
      ...prev,
      status: status === "All" ? "All" : status,
    }));
  };

  const handleStatusChange = (id, newStatus) => {
    const updated = leaveData.map((leave) =>
      leave.id === id ? { ...leave, status: newStatus } : leave
    );

    setLeaveData(updated);
  };

  const filteredData = leaveData.filter((leave) => {
    return (
      leave.name.toLowerCase().includes(filters.search.toLowerCase()) &&
      (filters.status === "All" || leave.status === filters.status) &&
      (filters.type === "All" || leave.type === filters.type)
    );
  });

  const stats = {
    total: leaveData.length,
    pending: leaveData.filter(l => l.status === "Pending").length,
    approved: leaveData.filter(l => l.status === "Approved").length,
    rejected: leaveData.filter(l => l.status === "Rejected").length,
  };

  return (
    <div className="relative h-full m-1 p-6
      bg-gradient-to-br from-slate-50 to-gray-100
      flex flex-col gap-6 overflow-y-auto rounded-2xl grid-cols-1">

      <h1 className="text-2xl font-semibold">
        Leave Management
      </h1>

      <LeaveCards
        stats={stats}
        setQuickFilter={setQuickFilter}
      />

      <LeaveFilters
        filters={filters}
        setFilters={setFilters}
      />

      <LeaveTable
        data={filteredData}
        onStatusChange={handleStatusChange}
      />

    </div>
  );
};

export default Leave;