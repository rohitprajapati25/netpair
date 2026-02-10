const LeaveFilters = () => {
  return (
    <div className="bg-white p-4 rounded-xl shadow border border-gray-400 mb-6 flex flex-wrap gap-4">

      <input
        type="text"
        placeholder="Search employee..."
        className="border border-gray-400 px-3 py-2 rounded w-60"
      />

      <select className="border border-gray-400 px-3 py-2 rounded">
        <option>Status</option>
        <option>Pending</option>
        <option>Approved</option>
        <option>Rejected</option>
      </select>

      <select className="border border-gray-400 px-3 py-2 rounded">
        <option>Leave Type</option>
        <option>Casual</option>
        <option>Sick</option>
        <option>Paid</option>
      </select>

    </div>
  );
};

export default LeaveFilters;
