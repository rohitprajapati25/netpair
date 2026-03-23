// import React, { useState } from "react";
// import ProjectFilters from "../../components/Projects/ProjectFilters";
// import ProjectsTable from "../../components/Projects/ProjectsTable";
// import ProjectCards from "../../components/projects/ProjectCards";
// import ProjectModal from "../../components/Projects/ProjectModal";

// const Projects = () => {
//   const [projects, setProject] = useState([
//     { id: 1, name: "Rohit", start: "2026-02-03", end: "2026-02-10", status: "Ongoing" },
//     { id: 2, name: "Ram", start: "2026-02-03", end: "2026-02-10", status: "Completed" },
//     { id: 3, name: "Dev", start: "2026-02-03", end: "2026-02-10", status: "Ongoing" },
//     { id: 4, name: "Prabhat", start: "2026-02-03", end: "2026-02-10", status: "On Hold" },
//     { id: 5, name: "Demo", start: "2026-02-03", end: "2026-02-10", status: "Ongoing" }
//   ]);

//   const [data, setData] = useState(projects);
//   const [open, setOpen] = useState(false);
//   const [editingProject, setEditingProject] = useState(null);

//   const addNewProject = (newProject) => {
//     const projectWithId = { ...newProject, id: Date.now() };
//     const updatedList = [projectWithId, ...projects];
//     setProject(updatedList);
//     setData(updatedList);
//     setOpen(false);
//   };

//   const updateProject = (updatedDetails) => {
//     const updatedList = projects.map((p) =>
//       p.id === editingProject.id ? { ...updatedDetails, id: p.id } : p
//     );
//     setProject(updatedList);
//     setData(updatedList);
//     setEditingProject(null);
//   };

//   const deleteProject = (id) => {
//     if (window.confirm("Are you sure?")) {
//       const updatedList = projects.filter((p) => p.id !== id);
//       setProject(updatedList);
//       setData(updatedList);
//     }
//   };

//   const startEdit = (project) => {
//     setEditingProject(project);
//   };

//   return (
//     <div className="relative h-full m-1 p-6 bg-gradient-to-br from-slate-50 to-gray-100 flex flex-col gap-6 overflow-y-auto rounded-2xl">
//       <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
//         <h1 className="text-2xl font-semibold"> Project Management </h1>
//         <button 
//           onClick={() => setOpen(true)} 
//           className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition"
//         >
//           <i className="ri-add-line"></i> Add Project
//         </button>
//       </div>

//       <ProjectCards data={data} />
//       <ProjectFilters projects={projects} setData={setData} />
      
//       <ProjectsTable 
//         data={data} 
//         onDelete={deleteProject} 
//         onEdit={startEdit} 
//       />

//       {/* Add Modal */}
//       {open && (
//         <ProjectModal 
//           onClose={() => setOpen(false)} 
//           onSave={addNewProject} 
//         />
//       )}

//       {/* Edit Modal (Same Component, Different Mode) */}
//       {editingProject && (
//         <ProjectModal 
//           onClose={() => setEditingProject(null)} 
//           onSave={updateProject} 
//           initialData={editingProject}
//         />
//       )}
//     </div>
//   );
// };

// export default Projects;


import React, { useState, useMemo } from "react";
import ProjectFilters from "../../components/Projects/ProjectFilters";
import ProjectsTable from "../../components/Projects/ProjectsTable";
import ProjectCards from "../../components/Projects/ProjectCards";
import ProjectModal from "../../components/Projects/ProjectModal";
import { RiAddLine, RiFolderSettingsLine } from "react-icons/ri";

const Projects = () => {
  const [projects, setProjects] = useState([
    { id: 1, name: "G97 AutoHub", start: "2026-03-01", end: "2026-06-10", status: "Ongoing" },
    { id: 2, name: "Internal Management System", start: "2026-01-15", end: "2026-04-20", status: "Ongoing" },
    { id: 3, name: "E-commerce App", start: "2025-12-03", end: "2026-02-10", status: "Completed" },
  ]);

  const [filters, setFilters] = useState({ search: "", status: "All" });
  const [open, setOpen] = useState(false);
  const [editingProject, setEditingProject] = useState(null);

  // INDUSTRY STANDARD: Memoized Filtering
  const filteredData = useMemo(() => {
    return projects.filter((p) => {
      const matchesSearch = p.name.toLowerCase().includes(filters.search.toLowerCase());
      const matchesStatus = filters.status === "All" || p.status === filters.status;
      return matchesSearch && matchesStatus;
    });
  }, [projects, filters]);

  const saveProject = (projectData) => {
    if (editingProject) {
      setProjects(projects.map(p => p.id === editingProject.id ? { ...projectData, id: p.id } : p));
      setEditingProject(null);
    } else {
      setProjects([{ ...projectData, id: Date.now() }, ...projects]);
      setOpen(false);
    }
  };

  const deleteProject = (id) => {
    if (window.confirm("Move this project to trash?")) {
      setProjects(projects.filter(p => p.id !== id));
    }
  };

  return (
    <div className="min-h-screen bg-slate-50/50 p-6 lg:p-10 flex flex-col gap-8">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-black text-slate-800 tracking-tight">Project Management</h1>
          <p className="text-slate-500 font-medium text-sm">Track development cycles and delivery timelines</p>
        </div>
        <button 
          onClick={() => setOpen(true)} 
          className="bg-blue-600 text-white px-6 py-3 rounded-2xl hover:bg-blue-700 shadow-lg shadow-blue-200 transition-all font-bold flex items-center gap-2 active:scale-95"
        >
          <RiAddLine size={22} /> Add New Project
        </button>
      </div>

      <ProjectCards data={projects} />

      <div className="flex flex-col shadow-sm">
        <ProjectFilters 
          filters={filters} 
          setFilters={setFilters} 
          totalResults={filteredData.length} 
        />
        <ProjectsTable 
          data={filteredData} 
          onDelete={deleteProject} 
          onEdit={setEditingProject} 
        />
      </div>

      {/* Unified Modal (Add/Edit) */}
      {(open || editingProject) && (
        <ProjectModal 
          onClose={() => { setOpen(false); setEditingProject(null); }} 
          onSave={saveProject} 
          initialData={editingProject}
        />
      )}
    </div>
  );
};

export default Projects;