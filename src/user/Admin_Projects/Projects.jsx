import React, { useState, useEffect, useCallback } from "react";
import axios from 'axios';
import { useAuth } from "../../contexts/AuthContext";
import ProjectFilters from "../../components/Projects/ProjectFilters";
import ProjectsTable from "../../components/Projects/ProjectsTable";
import ProjectCards from "../../components/Projects/ProjectCards";
import ProjectModal from "../../components/Projects/ProjectModal";
import { SkeletonHeader, SkeletonFilter, SkeletonStats, SkeletonGrid } from "../../components/Skeletons";
import { RiAddLine } from "react-icons/ri";
import API_URL from "../../config/api";

const Projects = () => {
  const { token, user } = useAuth();
  const role = user?.role?.toLowerCase();
  const isAdminRole = ['superadmin', 'admin'].includes(role);
  const isHR        = role === 'hr';
  
  const [projects, setProjects] = useState([]);
  const [logs, setLogs] = useState([]);
  const [stats, setStats] = useState({});
  const [filters, setFilters] = useState({ search: "", status: "All", priority: "All", project_type: "All", department: "All", createdBy: "All" });
  const [open, setOpen] = useState(false);
  const [editingProject, setEditingProject] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

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
      const res = await axios.get(`${API_URL}/admin/projects?${params.toString()}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      if (res.data.success) {
        const mappedProjects = (res.data.projects || []).map(p => ({
          ...p,
          id: p._id,
          assignedEmployees: p.assignedEmployees || []
        }));
        setProjects(mappedProjects);
      }
    } catch (err) {
      console.error('Fetch projects error:', err);
      setError('Failed to load projects');
    } finally {
      setLoading(false);
    }
  }, [filters, token]);

  const fetchLogs = useCallback(async () => {
    if (role !== "superadmin") return;
    try {
      const res = await axios.get(`${API_URL}/admin/projects/logs`, {
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
      const res = await axios.get(`${API_URL}/admin/projects/stats?${params.toString()}`, {
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
      fetchProjects();
      fetchStats();
      fetchLogs();
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
        res = await axios.put(`${API_URL}/admin/projects/${editingProject._id}`, projectData, {
          headers: { 
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        });
      } else {
        res = await axios.post(`${API_URL}/admin/projects`, projectData, {
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
    if (!isAdminRole) {
      alert('You do not have permission to delete projects');
      return;
    }
    
    if (window.confirm("⚠️ This will permanently delete the project. Continue?")) {
      try {
        const res = await axios.delete(`${API_URL}/admin/projects/${projectId}`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        if (res.data.success) {
          refreshData();
          alert('Project deleted successfully!');
        }
      } catch (err) {
        console.error('Delete error:', err.response?.data || err.message);
        alert('Delete failed');
      }
    }
  };

  const handleEdit = (project) => {
    setEditingProject(project);
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <SkeletonHeader />
        <SkeletonStats count={4} />
        <SkeletonFilter />
        <SkeletonGrid count={4} />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h1 className="text-3xl font-black text-slate-800 tracking-tight">Project Management</h1>
          <p className="text-slate-500 font-medium text-sm">Track development cycles and delivery timelines</p>
        </div>
        {isAdminRole && (
          <button 
            onClick={() => setOpen(true)} 
            className="w-auto self-start sm:self-auto bg-blue-600 text-white px-5 py-2.5 rounded-xl hover:bg-blue-700 shadow-md transition-all font-bold flex items-center gap-2 text-sm"
          >
            <RiAddLine size={18} /> Add New Project
          </button>
        )}
      </div>

      <ProjectCards data={projects} stats={stats} />

      <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden">
        <ProjectFilters 
          filters={filters} 
          setFilters={setFilters} 
          totalResults={projects.length} 
        />
        {error && (
          <div className="p-8 text-center text-red-600 font-medium">
            {error}
            <button 
              onClick={refreshData}
              className="ml-4 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
            >
              Retry
            </button>
          </div>
        )}
        {!error && projects.length === 0 ? (
          <div className="p-8 text-center text-slate-500">
            No projects found
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

