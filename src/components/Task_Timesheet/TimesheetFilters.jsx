const TimesheetFilters = () => (
  <div className="bg-white p-4 rounded-xl shadow mb-4 flex gap-4 border-2 border-gray-400">
    <input placeholder="Search..." className="border px-3 py-2 rounded border-2 border-gray-400"/>
    <select className="border-2 border-gray-400 px-3 py-2 rounded">
      <option>Status</option>
      <option>Completed</option>
      <option>In Progress</option>
    </select>
  </div>
);

export default TimesheetFilters;
