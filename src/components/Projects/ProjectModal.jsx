import React, { useEffect, useState } from "react";

import { useAuth } from "../../contexts/AuthContext";
import axios from 'axios';
import { Formik, Form, Field, ErrorMessage, useFormikContext } from 'formik';
import { projectSchema } from '../../schemas/projectValidation';
import { 
  RiFolderAddLine, 
  RiEditBoxLine, 
  RiCloseLine, 
  RiSaveLine, 
  RiInformationLine,
  RiCalendarEventLine,
  RiBuildingLine,
  RiTeamLine,
  RiUserLine,
  RiMoneyDollarCircleLine
} from "react-icons/ri";



const ProjectModal = ({ onClose, onSave, initialData }) => {
  const { token } = useAuth();
  const [managers, setManagers] = useState([]);
// const [isSubmitting, setIsSubmitting] = useState(false);

  const [loading, setLoading] = useState(false);

  const [project, setProject] = useState({
    name: "",
    company: "",
    projectOwnerId: null,
    manager: null,
    startDate: "",
    endDate: "",
    status: "Ongoing",
    priority: "Medium",
    project_type: "Internal",
    progress: 0,
    assignedEmployees: [],
    budget: "",
    client: "",
    description: ""
  });


  

  useEffect(() => {
    if (initialData) {
      setProject({
        name: initialData.name || "",
        company: initialData.company || "",
        projectOwnerId: initialData.projectOwnerId?._id || initialData.projectOwnerId || null,
        manager: initialData.manager?._id || initialData.manager || null,
        startDate: initialData.startDate ? new Date(initialData.startDate).toISOString().split('T')[0] : "",
        endDate: initialData.endDate ? new Date(initialData.endDate).toISOString().split('T')[0] : "",
        status: initialData.status || "Ongoing",
        priority: initialData.priority || "Medium",
        project_type: initialData.project_type || "Internal",
        progress: initialData.progress || 0,
        assignedEmployees: initialData.assignedEmployees ? initialData.assignedEmployees.map(emp => emp._id || emp) : [],
        budget: initialData.budget || "",
        client: initialData.client || "",
        description: initialData.description || ""
      });
      // Load employees after setting state
      setTimeout(() => loadEmployees(initialData.company), 100);
    }
  }, [initialData]);

  

  const loadEmployees = async (companyFilter = '') => {
    try {
      const url = `http://localhost:5000/api/admin/active-employees?role=employee${companyFilter ? `&company=${encodeURIComponent(companyFilter)}` : ''}`;
      const res = await axios.get(url, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setManagers(res.data.employees || []);
      console.log('Loaded employees:', res.data.employees?.length || 0);
    } catch (error) {
      console.error('Load employees failed:', error);
      setManagers([]);
    }
  };




  useEffect(() => {
    loadEmployees(); // Load all employees on mount
    console.log('ProjectModal mounted, token:', !!token);
  }, [token]);


  // Removed company change trigger - now text input

const handleSubmit = async (e) => {
    e.preventDefault();
    
    // UI Validation
    if (!project.name.trim()) return alert('Project Name required');
    if (!project.company.trim()) return alert('Company/Department required');
    if (!project.startDate) return alert('Start Date required');
    if (project.endDate && new Date(project.startDate) > new Date(project.endDate)) return alert('End Date must be after Start Date');
    if (project.manager && !managers.find(emp => emp._id === project.manager)) return alert('Select valid Manager');
    
    try {
      setLoading(true);
      const projectData = new FormData();
      projectData.append('name', project.name.trim());
      projectData.append('company', project.company.trim());
      projectData.append('startDate', project.startDate);
      if (project.endDate) projectData.append('endDate', project.endDate);
      projectData.append('status', project.status);
      projectData.append('priority', project.priority);
      projectData.append('project_type', project.project_type);
      projectData.append('progress', project.progress.toString());
      projectData.append('budget', project.budget);
      projectData.append('client', project.client);
      projectData.append('description', project.description);
      if (project.manager) projectData.append('manager', project.manager);
      // Clean assignedEmployees - frontend only string IDs
      const cleanAssigned = project.assignedEmployees.filter(id => 
        id && typeof id === 'string' && id.length === 24 && managers.find(emp => emp._id === id)
      );
      projectData.append('assignedEmployees', JSON.stringify(cleanAssigned));
      
      await onSave(projectData);
      onClose();
    } catch (err) {
      console.error('Submit error:', err);
      alert('Submit failed');
    } finally {
      setLoading(false);
    }
  };



  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      <div 
        className="absolute inset-0 bg-slate-900/60 backdrop-blur-md transition-opacity" 
        onClick={onClose} 
      />
      <div className="relative bg-white w-full max-w-2xl rounded-[2rem] shadow-2xl shadow-blue-900/20 overflow-hidden animate-in fade-in zoom-in duration-200 max-h-[90vh] overflow-y-auto">
        
        <div className="px-8 py-6 border-b border-slate-100 flex items-center justify-between bg-slate-50/50 sticky top-0">
          <div className="flex items-center gap-3">
            <div className={`p-2.5 rounded-xl ${initialData ? 'bg-amber-100 text-amber-600' : 'bg-blue-100 text-blue-600'}`}>
              {initialData ? <RiEditBoxLine size={24} /> : <RiFolderAddLine size={24} />}
            </div>
            <div>
              <h3 className="text-xl font-black text-slate-800 tracking-tight">
                {initialData ? "Update Project" : "Create New Project"}
              </h3>
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                Super Admin - Full Control
              </p>
            </div>
          </div>
          <button 
            onClick={onClose}
            className="p-2 hover:bg-white hover:shadow-sm rounded-full text-slate-400 hover:text-rose-500 transition-all"
          >
            <RiCloseLine size={24} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-8 space-y-6">
          
          <div className="space-y-2">
            <label className="flex items-center gap-2 text-xs font-black text-slate-500 uppercase tracking-wider ml-1">
              <RiInformationLine /> Project Name *
            </label>
            <input
              autoFocus
              required
              type="text"
              placeholder="e.g. Enterprise CRM System"
              className="w-full px-5 py-3.5 bg-slate-50 border-2 border-slate-100 rounded-2xl text-sm font-bold text-slate-700 focus:bg-white focus:border-blue-500 focus:ring-4 focus:ring-blue-500/5 outline-none transition-all"
              value={project.name}
              onChange={(e) => setProject({ ...project, name: e.target.value })}
            />
          </div>

          <div className="space-y-2">
            <label className="flex items-center gap-2 text-xs font-black text-slate-500 uppercase tracking-wider ml-1">
              <RiBuildingLine /> Company/Department *
            </label>
            <input
              required
              type="text"
              placeholder="Enter Company/Department Name"
              className="w-full px-5 py-3.5 bg-slate-50 border-2 border-slate-100 rounded-2xl text-sm font-bold text-slate-700 focus:bg-white focus:border-blue-500 outline-none transition-all"
              value={project.company}
              onChange={(e) => setProject({ ...project, company: e.target.value })}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">

            <div className="space-y-2">
              <label className="flex items-center gap-2 text-xs font-black text-slate-500 uppercase tracking-wider ml-1">
                <RiUserLine /> Manager
              </label>
              <select
                value={project.manager || ''}
                onChange={(e) => setProject({ ...project, manager: e.target.value || null })}
                className="w-full px-5 py-3.5 bg-slate-50 border-2 border-slate-100 rounded-2xl text-sm font-bold text-slate-700 focus:bg-white focus:border-blue-500 outline-none transition-all"
              >
                <option value="">Select Manager</option>
                {managers.map(emp => (
                  <option key={emp._id} value={emp._id}>
                    {emp.name} - {emp.designation}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="flex items-center gap-2 text-xs font-black text-slate-500 uppercase tracking-wider ml-1">
                <RiCalendarEventLine /> Start Date *
              </label>
              <input
                required
                type="date"
                className="w-full px-5 py-3.5 bg-slate-50 border-2 border-slate-100 rounded-2xl text-sm font-bold text-slate-600 focus:bg-white focus:border-blue-500 outline-none transition-all"
                value={project.startDate}
                onChange={(e) => setProject({ ...project, startDate: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <label className="flex items-center gap-2 text-xs font-black text-slate-500 uppercase tracking-wider ml-1">
                <RiCalendarEventLine /> End Date
              </label>
              <input
                type="date"
                className="w-full px-5 py-3.5 bg-slate-50 border-2 border-slate-100 rounded-2xl text-sm font-bold text-slate-600 focus:bg-white focus:border-blue-500 outline-none transition-all"
                value={project.endDate}
                onChange={(e) => setProject({ ...project, endDate: e.target.value })}
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-xs font-black text-slate-500 uppercase tracking-wider ml-1">Project Type</label>
              <select
                value={project.project_type}
                onChange={(e) => setProject({ ...project, project_type: e.target.value })}
                className="w-full px-5 py-3.5 bg-slate-50 border-2 border-slate-100 rounded-2xl text-sm font-bold text-slate-700 focus:bg-white focus:border-blue-500 outline-none transition-all"
              >
                <option value="Internal">Internal</option>
                <option value="Client">Client</option>
                <option value="Product">Product</option>
              </select>
            </div>
            <div className="space-y-2">
              <label className="flex items-center gap-2 text-xs font-black text-slate-500 uppercase tracking-wider ml-1">
                <RiMoneyDollarCircleLine /> Budget
              </label>
              <input
                type="number"
                placeholder="0"
                className="w-full px-5 py-3.5 bg-slate-50 border-2 border-slate-100 rounded-2xl text-sm font-bold text-slate-700 focus:bg-white focus:border-blue-500 outline-none transition-all"
                value={project.budget}
                onChange={(e) => setProject({ ...project, budget: e.target.value })}
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-xs font-black text-slate-500 uppercase tracking-wider ml-1">Progress (%)</label>
              <input
                type="range"
                min="0"
                max="100"
                value={project.progress}
                onChange={(e) => setProject({ ...project, progress: parseInt(e.target.value) })}
                className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer range-sm accent-blue-600 hover:accent-blue-700"
              />
              <div className="text-right text-xs text-slate-500 font-mono">{project.progress}%</div>
            </div>
            <div className="space-y-2">
              <label className="text-xs font-black text-slate-500 uppercase tracking-wider ml-1">Status</label>
              <select
                value={project.status}
                onChange={(e) => setProject({ ...project, status: e.target.value })}
                className="w-full px-5 py-3.5 bg-slate-50 border-2 border-slate-100 rounded-2xl text-sm font-bold text-slate-700 focus:bg-white focus:border-blue-500 outline-none transition-all"
              >
                <option>Pending</option>
                <option>Ongoing</option>
                <option>Completed</option>
                <option>On Hold</option>
                <option>Cancelled</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-500 uppercase tracking-wider ml-1">Client</label>
              <input
                type="text"
                placeholder="Client name (optional)"
                className="w-full px-5 py-3.5 bg-slate-50 border-2 border-slate-100 rounded-2xl text-sm font-bold text-slate-700 focus:bg-white focus:border-blue-500 outline-none transition-all"
                value={project.client}
                onChange={(e) => setProject({ ...project, client: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-500 uppercase tracking-wider ml-1 mb-3 block">Assigned Employees</label>
              <div className="max-h-44 overflow-y-auto border border-slate-200 rounded-xl p-3 bg-slate-50">
                {managers.length === 0 ? (
                  <p className="text-xs text-slate-500 text-center py-4">No employees available</p>
                ) : (
                  managers.map((emp) => (
                    <label key={emp._id || emp.id} className="flex items-center gap-3 p-2 rounded-lg hover:bg-white cursor-pointer group">
                      <input
                        type="checkbox"
                        value={emp._id}
                        checked={project.assignedEmployees.some(id => id === emp._id)}
                        onChange={(e) => {
                          const id = emp._id;
                          const newSelected = e.target.checked 
                            ? [...project.assignedEmployees, id]
                            : project.assignedEmployees.filter(empId => empId !== id);
                          setProject({ ...project, assignedEmployees: newSelected });
                        }}
                        className="w-4 h-4 text-blue-600 bg-slate-100 border-slate-300 rounded focus:ring-blue-500 focus:ring-2 hover:scale-[1.1]"
                      />
                      <div className="flex-1">
                        <div className="font-bold text-sm text-slate-800">{emp.name || 'Unknown'}</div>
                        <div className="text-xs text-slate-500">{emp.designation} - {emp.department}</div>
                      </div>
                    </label>
                  ))
                )}
              </div>
              <div className="text-xs text-slate-500 font-mono">
                Selected: {project.assignedEmployees.length} / {managers.length}
              </div>
            </div>
          </div>

          <div className="space-y-2">
            <label className="flex items-center gap-2 text-xs font-black text-slate-500 uppercase tracking-wider ml-1">
              Description
            </label>
            <textarea
              placeholder="Project scope and objectives..."
              className="w-full px-5 py-3.5 bg-slate-50 border-2 border-slate-100 rounded-2xl text-sm font-bold text-slate-700 h-24 resize-none focus:bg-white focus:border-blue-500 outline-none transition-all"
              value={project.description}
              onChange={(e) => setProject({ ...project, description: e.target.value })}
            />
          </div>

          <div className="flex items-center gap-3 pt-4">
            <button 
              type="button"
              onClick={onClose} 
              disabled={loading}
              className="flex-1 py-4 font-bold text-slate-500 bg-slate-100 hover:bg-slate-200 rounded-2xl transition-all active:scale-95 disabled:opacity-50"
            >
              Cancel
            </button>
            <button 
              type="submit" 
              disabled={loading}
              className="flex-[2] py-4 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 text-white font-black rounded-2xl shadow-xl shadow-blue-200 flex items-center justify-center gap-2 transition-all active:scale-95 disabled:opacity-50"
            >
              {loading ? (
                <>
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  Saving...
                </>
              ) : (
                <>
                  <RiSaveLine size={20} />
                  {initialData ? "Update Project" : "Create Project"}
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ProjectModal;

