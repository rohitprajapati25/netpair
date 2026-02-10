import React from "react";
import LeaveCards from "../../components/Leave/LeaveCards";
import LeaveTable from "../../components/Leave/LeaveTable";
import LeaveFilters from "../../components/Leave/LeaveFilter";

const Leave = () => {
  return (
    <div className="relative h-[100%] m-1 pb-10 pt-5 w-auto bg-white flex flex-col items-start pl-5 pr-5 justify-strat gap-3 min-h-full overflow-y-auto rounded-xl">
      
      <h1 className="text-2xl font-semibold mb-6">Leave Management</h1>

      <LeaveCards />

      <LeaveFilters />

      <LeaveTable />

    </div>
  );
};

export default Leave;
