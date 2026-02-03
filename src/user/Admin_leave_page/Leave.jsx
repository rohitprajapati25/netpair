import React from "react";
import LeaveCards from "../../components/Leave/LeaveCards";
import LeaveTable from "../../components/Leave/LeaveTable";
import LeaveFilters from "../../components/Leave/LeaveFilter";

const Leave = () => {
  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      
      <h1 className="text-2xl font-semibold mb-6">Leave Management</h1>

      <LeaveCards />

      <LeaveFilters />

      <LeaveTable />

    </div>
  );
};

export default Leave;
