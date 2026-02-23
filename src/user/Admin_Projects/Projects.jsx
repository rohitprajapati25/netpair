import React, { useState } from "react";
import ProjectFilters from "../../components/Projects/ProjectFilters";
import ProjectsTable from "../../components/Projects/ProjectsTable";
import ProjectCards from "../../components/projects/ProjectCards";
import ProjectModal from "../../components/Projects/ProjectModal";

const Projects = () => {
  const [open, setOpen] = useState(false);

  return (
    <div
      className="
      h-full m-1 p-6
      bg-gray-50 rounded-2xl
      flex flex-col gap-6
      overflow-y-auto"
    >
      {/* HEADER */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold">
            Project Management
          </h1>
         
        </div>

        <button
          onClick={() => setOpen(true)}
          className="
          flex items-center gap-2
          bg-blue-600 hover:bg-blue-700
          text-white px-5 py-2 rounded-lg
          shadow-md transition"
        >
          <i className="ri-add-line text-lg"></i>
          Add Project
        </button>
      </div>

      <ProjectCards />

      <div className="bg-white p-4 rounded-2xl shadow-sm border border-gray-200">
        <ProjectFilters />
      </div>

      <ProjectsTable />

      {open && <ProjectModal onClose={() => setOpen(false)} />}
    </div>
  );
};

export default Projects;