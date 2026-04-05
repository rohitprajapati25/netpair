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


import React, { useState, useEffect, useCallback } from "react";
import axios from 'axios';
import { useAuth } from "../../contexts/AuthContext";
import ProjectFilters from "../../components/Projects/ProjectFilters";
import ProjectsTable from "../../components/Projects/ProjectsTable";
import ProjectCards from "../../components/Projects/ProjectCards";
import ProjectModal from "../../components/Projects/ProjectModal";
import { SkeletonStats, SkeletonGrid, SkeletonHeader, SkeletonFilter } from "../../components/Skeletons";

import { RiAddLine } from "react-icons/ri";



const Projects = () => {
  const { token, user } = useAuth();
  const isAdminRole = ['superadmin', 'admin', 'SuperAdmin', 'Admin'].includes(user?.role);
  
  console.log('🔍 Projects component - User:', user);
  console.log('🔍 Projects component - Token exists:', !!token);
  console.log('🔍 Projects component - isAdminRole:', isAdminRole);
  
  const [projects, setProjects] = useState([]);
  const [logs, setLogs] = useState([]);
  const [stats, setStats] = useState({});
  const [filters, setFilters] = useState({ search: "", status: "All", priority: "All", project_type: "All", department: "All", createdBy: "All" });
  const [open, setOpen] = useState(false);
  const [editingProject, setEditingProject] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch projects on mount and refresh
  const fetchProjects = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const params = new URLSearchParams({
        ...Object.fromEntries(
          Object.entries(filters).filter(([key, value]) => value !== 'All' && value !== '')
        ),
        page: '1',
        limit: '1000'
      });
      const res = await axios.get(`http://localhost:5000/api/admin/projects?${params.toString()}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      if (res.data.success) {
        // Fix for table expecting 'id' instead of '_id'
        const mappedProjects = (res.data.projects || []).map(p => ({
          ...p,
          id: p._id,
          assignedEmployees: p.assignedEmployees || []
        }));
        console.log('Fetched projects:', mappedProjects.length, 'projects');
        setProjects(mappedProjects);
      }

    } catch (err) {
      console.error('Fetch projects error:', err);
      setError('Failed to load projects');
    } finally {
      setLoading(false);
    }
  }, [filters, token]);

  // Fetch stats
// Logs only for SuperAdmin (404 fixed)
  const fetchLogs = useCallback(async () => {
    if (user?.role !== "superadmin") return;
    try {
      const res = await axios.get('http://localhost:5000/api/admin/projects/logs', {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (res.data.success) {
        setLogs(res.data.logs);
      }
    } catch (err) {
      console.error('Logs error:', err);
    }
  }, [token, user?.role]);

  const fetchStats = useCallback(async () => {
    try {
      const params = new URLSearchParams(
        Object.fromEntries(
          Object.entries(filters).filter(([key, value]) => value !== 'All' && value !== '')
        )
      );
      const res = await axios.get(`http://localhost:5000/api/admin/projects/stats?${params.toString()}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (res.data.success) {
        setStats(res.data.stats);
      }
    } catch (err) {
      console.error('Stats error:', err);
    }
  }, [token, filters]);

  useEffect(() => {
    if (token) {
      console.log('🔄 Fetching projects with token:', token.substring(0, 20) + '...');
      fetchProjects();
      fetchStats();
      fetchLogs();
    } else {
      console.log('❌ No token available, cannot fetch projects');
    }
  }, [fetchProjects, fetchStats, fetchLogs, token]);

  const refreshData = useCallback(() => {
    fetchProjects();
    fetchStats();
  }, [fetchProjects, fetchStats]);

  const saveProject = async (projectData) => {
    try {
      let res;
      if (editingProject) {
        // For updates, send as JSON
        res = await axios.put(`http://localhost:5000/api/admin/projects/${editingProject._id}`, projectData, {
          headers: { 
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        });
      } else {
        // For new projects, send as FormData
        res = await axios.post('http://localhost:5000/api/admin/projects', projectData, {
          headers: { 
            Authorization: `Bearer ${token}`
          }
        });
      }
      
      if (res.data.success) {
        refreshData();
        setOpen(false);
        setEditingProject(null);
      }
    } catch (err) {
      console.error('Save error:', err.response?.data);
      alert(err.response?.data?.message || 'Operation failed');
    }
  };

  const deleteProject = async (projectId) => {
    console.log('🗑️ Delete project called with ID:', projectId);
    console.log('👤 User role:', user?.role, 'Token exists:', !!token);
    console.log('🔐 isAdminRole:', isAdminRole);
    
    if (!isAdminRole) {
      alert('You do not have permission to delete projects');
      return;
    }
    
    if (window.confirm("⚠️ This will permanently delete the project, all tasks, and members. Continue?")) {
      try {
        console.log('📡 Making DELETE request to:', `http://localhost:5000/api/admin/projects/${projectId}`);
        const res = await axios.delete(`http://localhost:5000/api/admin/projects/${projectId}`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        console.log('✅ Delete response:', res.data);
        if (res.data.success) {
          refreshData();
          alert('Project deleted successfully!');
        }
      } catch (err) {
        console.error('❌ Delete error:', err.response?.data || err.message);
        alert('Delete failed: ' + (err.response?.data?.message || err.message));
      }
    }
  };

  const handleEdit = (project) => {
    setEditingProject(project);
  };


  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50/50 p-6 lg:p-10">
        <div className="max-w-7xl mx-auto space-y-8">
          <SkeletonStats count={2} />
          <SkeletonFilter />
          <SkeletonGrid count={4} />
        </div>
      </div>
    );
  }

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

      <ProjectCards data={projects} stats={stats} />

      <div className="flex flex-col shadow-sm">
        <ProjectFilters 
          filters={filters} 
          setFilters={setFilters} 
          totalResults={projects.length} 
        />
        {loading ? (
          <div className="bg-white rounded-b-2xl border-x border-b border-slate-200 p-6">
            <SkeletonGrid count={4} />
          </div>
        ) : error ? (
          <div className="bg-white rounded-b-2xl border-x border-b border-slate-200 p-8 text-center">
            <div className="text-red-600 font-medium">{error}</div>
            <button 
              onClick={refreshData}
              className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
            >
              Try Again
            </button>
          </div>
        ) : projects.length === 0 ? (
          <div className="bg-white rounded-b-2xl border-x border-b border-slate-200 p-8 text-center">
            <div className="text-slate-500 font-medium">No projects found</div>
            <p className="text-slate-400 text-sm mt-1">Try adjusting your filters or create a new project</p>
          </div>
        ) : (
          <ProjectsTable 
            data={projects} 
            onDelete={isAdminRole ? deleteProject : undefined} 
            onEdit={isAdminRole ? handleEdit : undefined}
            isAdminRole={isAdminRole}
          />
        )}
      </div>

      {/* Unified Modal (Add/Edit) */}
      {(open || editingProject) && isAdminRole && (
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