import React from "react";

const ProjectFilters = ({ projects, setData }) => {

  const handleSearch = (e) => {
    const value = e.target.value.toLowerCase();

    const filtered = projects.filter((p) =>
      p.name.toLowerCase().includes(value)
    );

    setData(filtered);
  };

  const handleStatus = (e) => {
    const value = e.target.value;

    if (value === "All") {
      setData(projects);
      return;
    }

    const filtered = projects.filter(
      (p) => p.status === value
    );

    setData(filtered);
  };

  return (
    <div className="bg-white p-4 rounded-xl shadow flex gap-4 flex-wrap">

      <input
        type="text"
        placeholder="Search project..."
        onChange={handleSearch}
        className="border px-3 py-2 rounded-lg border-gray-300"
      />

      <select
        onChange={handleStatus}
        className="border px-3 py-2 rounded-lg border-gray-300"
      >
        <option>All</option>
        <option>Ongoing</option>
        <option>Completed</option>
        <option>On Hold</option>
      </select>

    </div>
  );
};

export default ProjectFilters;