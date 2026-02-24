import React from "react";
import LeaveCards from "../../components/Leave/LeaveCards";
import LeaveTable from "../../components/Leave/LeaveTable";
import LeaveFilters from "../../components/Leave/LeaveFilter";

const Leave = () => {
  return (
    <div
      className="relative h-full m-1 p-6
      bg-gradient-to-br from-slate-50 to-gray-100
      flex flex-col gap-6 overflow-y-auto rounded-2xl"
    >
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        
        <div>
          <h1 className="text-2xl font-semibold">
            Leave Management
          </h1>
         
        </div>

      
      </div>

      <LeaveCards />

      <div className="bg-white p-4 rounded-2xl shadow-sm border border-gray-200">
        <LeaveFilters />
      </div>

      <LeaveTable />
    </div>
  );
};

export default Leave;