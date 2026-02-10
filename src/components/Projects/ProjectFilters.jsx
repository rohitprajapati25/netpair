const ProjectFilters = () => {
  return (
    <div className="bg-white p-4 rounded-xl shadow mb-6 flex flex-wrap gap-4 border-2 border-gray-400 w-full">

      <input
        type="text"
        placeholder="Search project..."
        className="border border-gray-400 px-4 py-2 rounded-lg w-60"
      />

      <select className="border border-gray-400 px-4 py-2 rounded-lg">
        <option>Status</option>
        <option>Ongoing</option>
        <option>Completed</option>
        <option>On Hold</option>
      </select>

      <select className="border border-gray-400 px-4 py-2 rounded-lg">
        <option>Priority</option>
        <option>High</option>
        <option>Medium</option>
        <option>Low</option>
      </select>

    </div>
  );
};

export default ProjectFilters;
