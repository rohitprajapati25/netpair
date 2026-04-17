import React, { useState, useEffect } from "react";
import { useFormik } from "formik";
import { taskValidationSchema } from "../../schemas/taskValidation";
import { useAuth } from "../../contexts/AuthContext";
import LoadingOverlay from "../common/LoadingOverlay";
import axios from "axios";
import { RiAddCircleLine, RiCloseLine, RiLoader4Line, RiUserAddLine, RiFlag2Line } from "react-icons/ri";
import API_URL from "../../config/api";

const AddTaskModal = ({ open, onClose, onRefresh, projects: propProjects }) => {
  const { token } = useAuth();
  const [projects, setProjects] = useState([]);
  const [projectEmployees, setProjectEmployees] = useState([]);
  const [employeesLoading, setEmployeesLoading] = useState(false);
  const [selectedProject, setSelectedProject] = useState('');

  useEffect(() => {
    if (open && token) {
      axios.get(`${API_URL}/admin/projects`, {
        headers: { Authorization: `Bearer ${token}` }
      }).then(res => {
        const projectData = Array.isArray(res.data) ? res.data : (res.data.projects || []);
        setProjects(projectData);
      }).catch(() => {
        setProjects(Array.isArray(propProjects) ? propProjects : []);
      });
    }
  }, [open, token, propProjects]);

  const loadProjectEmployees = async (projectId) => {
    if (!projectId) { setProjectEmployees([]); return; }
    setEmployeesLoading(true);
    try {
      const res = await axios.get(`${API_URL}/admin/projects/${projectId}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      const rawData = res?.data?.assignedEmployees || res?.data?.project?.assignedEmployees || [];
      const assignedIds = (Array.isArray(rawData) ? rawData : []).map(emp => emp?._id || emp).filter(id => typeof id === 'string');
      if (assignedIds.length > 0) {
        const empRes = await axios.get(`${API_URL}/admin/employees?ids=${assignedIds.join(',')}`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        setProjectEmployees(Array.isArray(empRes.data) ? empRes.data : (empRes.data.employees || []));
      } else {
        setProjectEmployees([]);
      }
    } catch {
      setProjectEmployees([]);
    } finally {
      setEmployeesLoading(false);
    }
  };

  const formik = useFormik({
    initialValues: { task_title: "", project_id: "", assigned_to: "", description: "", priority: "Medium", start_date: "", due_date: "" },
    validationSchema: taskValidationSchema,
    onSubmit: async (values) => {
      try {
        await axios.post(`${API_URL}/admin/tasks`, values, { headers: { Authorization: `Bearer ${token}` } });
        formik.resetForm();
        setSelectedProject('');
        setProjectEmployees([]);
        onClose();
        onRefresh();
      } catch (error) {
        formik.setStatus(error.response?.data?.message || "Failed to create task. Please try again.");
      }
    },
  });

  const handleProjectChange = (e) => {
    const projectId = e.target.value;
    formik.setFieldValue('project_id', projectId);
    setSelectedProject(projectId);
    formik.setFieldValue('assigned_to', '');
    loadProjectEmployees(projectId);
  };

  const handleClose = () => { if (formik.isSubmitting) return; onClose(); };

  if (!open) return null;

  const inputCls = (err) => `w-full px-4 py-3 bg-slate-50 border-2 rounded-xl text-sm font-medium outline-none transition-all focus:bg-white ${
    err ? "border-red-300 focus:border-red-400 focus:ring-2 focus:ring-red-100" : "border-slate-100 focus:border-blue-400 focus:ring-2 focus:ring-blue-100"
  }`;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-3 sm:p-4 bg-slate-900/60 backdrop-blur-sm">
      <div className="absolute inset-0" onClick={handleClose} />

      <div className="relative bg-white w-full max-w-2xl rounded-2xl shadow-2xl flex flex-col max-h-[90vh] sm:max-h-[95vh] overflow-hidden">

        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 shrink-0">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-blue-100 text-blue-600 rounded-xl">
              <RiAddCircleLine size={20} />
            </div>
            <div>
              <h3 className="font-black text-slate-800 text-base leading-tight">Create New Task</h3>
              <p className="text-xs text-slate-400 mt-0.5">Assign from project team</p>
            </div>
          </div>
          <button onClick={handleClose} disabled={formik.isSubmitting} className="p-2 text-slate-400 hover:text-rose-500 rounded-xl hover:bg-slate-100 transition-all disabled:opacity-40">
            <RiCloseLine size={20} />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={formik.handleSubmit} className="flex-1 flex flex-col overflow-hidden">
          <div className="flex-1 overflow-y-auto p-6 space-y-5 relative">
            <LoadingOverlay visible={formik.isSubmitting} message="Creating task..." />
            <fieldset disabled={formik.isSubmitting} className="space-y-5">

              {formik.status && (
                <div className="p-3 bg-red-50 border border-red-200 rounded-xl text-sm text-red-700 font-medium">{formik.status}</div>
              )}

              {/* Task Title */}
              <div className="space-y-1.5">
                <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Task Title *</label>
                <input {...formik.getFieldProps("task_title")} className={inputCls(formik.touched.task_title && formik.errors.task_title)} />
                {formik.touched.task_title && formik.errors.task_title && <p className="text-red-500 text-xs">{formik.errors.task_title}</p>}
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* Project */}
                <div className="space-y-1.5">
                  <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Project *</label>
                  <select name="project_id" value={formik.values.project_id} onChange={handleProjectChange}
                    className={inputCls(formik.touched.project_id && formik.errors.project_id)}>
                    <option value="">Select Project</option>
                    {Array.isArray(projects) && projects.map(p => <option key={p._id} value={p._id}>{p.name} ({p.status})</option>)}
                  </select>
                </div>

                {/* Employee */}
                <div className="space-y-1.5">
                  <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest flex items-center gap-1">
                    <RiUserAddLine size={11} /> Employee * ({employeesLoading ? 'Loading...' : (Array.isArray(projectEmployees) ? projectEmployees.length : 0)})
                  </label>
                  <select {...formik.getFieldProps("assigned_to")} disabled={!selectedProject || employeesLoading}
                    className={`${inputCls(formik.touched.assigned_to && formik.errors.assigned_to)} ${(!selectedProject || employeesLoading) ? "opacity-60 cursor-not-allowed" : ""}`}>
                    <option value="">Select from {selectedProject ? 'project team' : 'project first'}</option>
                    {Array.isArray(projectEmployees) && projectEmployees.map(emp => <option key={emp._id} value={emp._id}>{emp.name} - {emp.designation}</option>)}
                  </select>
                  {selectedProject && (!projectEmployees || projectEmployees.length === 0) && !employeesLoading && (
                    <p className="text-xs text-amber-600">No employees assigned to this project</p>
                  )}
                </div>

                {/* Priority */}
                <div className="space-y-1.5">
                  <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest flex items-center gap-1"><RiFlag2Line size={11} /> Priority</label>
                  <select {...formik.getFieldProps("priority")} className={inputCls(false)}>
                    <option value="Low">Low</option>
                    <option value="Medium">Medium</option>
                    <option value="High">High</option>
                    <option value="Critical">Critical</option>
                  </select>
                </div>

                {/* Start Date */}
                <div className="space-y-1.5">
                  <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Start Date *</label>
                  <input type="date" {...formik.getFieldProps("start_date")} className={inputCls(formik.touched.start_date && formik.errors.start_date)} />
                </div>

                {/* Due Date */}
                <div className="space-y-1.5 sm:col-span-2">
                  <label className="text-[10px] font-black text-rose-500 uppercase tracking-widest">Due Date *</label>
                  <input type="date" {...formik.getFieldProps("due_date")} className={inputCls(formik.touched.due_date && formik.errors.due_date)} />
                </div>
              </div>

              {/* Description */}
              <div className="space-y-1.5">
                <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Description</label>
                <textarea {...formik.getFieldProps("description")} rows={3}
                  className="w-full px-4 py-3 bg-slate-50 border-2 border-slate-100 rounded-xl text-sm font-medium focus:bg-white focus:border-blue-400 focus:ring-2 focus:ring-blue-100 outline-none transition-all resize-none" />
              </div>

            </fieldset>
          </div>

          {/* Footer */}
          <div className="px-6 pb-6 pt-3 border-t border-slate-100 flex gap-3 shrink-0">
            <button type="button" onClick={handleClose} disabled={formik.isSubmitting}
              className="flex-1 py-3 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-xl text-sm transition-all disabled:opacity-50">
              Cancel
            </button>
            <button type="submit" disabled={formik.isSubmitting}
              className="flex-1 py-3 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl text-sm shadow-md flex items-center justify-center gap-2 transition-all disabled:opacity-50">
              {formik.isSubmitting ? <><RiLoader4Line className="animate-spin" size={16} /> Creating...</> : "Create Task"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddTaskModal;
