// import React, { useState, useEffect } from "react";
// import { useFormik } from "formik";
// import { taskValidationSchema } from "../../schemas/taskValidation";
// import { useAuth } from "../../contexts/AuthContext";
// import axios from "axios";
// import { RiAddCircleLine, RiCloseLine, RiLoader4Line, RiUserAddLine, RiFlag2Line } from "react-icons/ri";

// const AddTaskModal = ({ open, onClose, onRefresh, projects: propProjects }) => {
//   const { token } = useAuth();
//   const [projects, setProjects] = useState([]);
//   const [projectEmployees, setProjectEmployees] = useState([]);
//   const [employeesLoading, setEmployeesLoading] = useState(false);
//   const [selectedProject, setSelectedProject] = useState('');

//   // Load projects dynamically
//   useEffect(() => {
//     if (open && token) {
//       axios.get('http://localhost:5000/api/admin/projects', { 
//         headers: { Authorization: `Bearer ${token}` } 
//       }).then(res => {
//         console.log('Projects API response:', res.data);
//         setProjects(Array.isArray(res.data) ? res.data : (res.data.projects || []));
//       }).catch((err) => {
//         console.error('Projects fetch error:', err.response?.data || err.message);
//         setProjects(propProjects || []);
//       });
//     } else if (propProjects) {
//       console.log('Using propProjects:', propProjects);
//       setProjects(Array.isArray(propProjects) ? propProjects : []);
//     }
//   }, [open, token, propProjects]);

//   // Load employees based on selected project (assignedEmployees)
//   const loadProjectEmployees = async (projectId) => {
//     if (!projectId) {
//       setProjectEmployees([]);
//       return;
//     }
//     setEmployeesLoading(true);
//     try {
//       const res = await axios.get(`http://localhost:5000/api/admin/projects/${projectId}`, { 
//         headers: { Authorization: `Bearer ${token}` } 
//       }).catch(err => {
//         console.log(`No project details for ${projectId}:`, err.response?.status);
//         return { data: { assignedEmployees: [] } };
//       });
//       const assignedIds = res?.data?.assignedEmployees || []; 
//       if (assignedIds.length) {
//         const empRes = await axios.get(`http://localhost:5000/api/admin/employees?ids=${assignedIds.join(',')}`, {
//           headers: { Authorization: `Bearer ${token}` }
//         });
//         setProjectEmployees(empRes.data || []);
//       } else {
//         setProjectEmployees([]);
//       }
//     } catch (error) {
//       console.error("Failed to load project employees:", error);
//       setProjectEmployees([]);
//     }
//     setEmployeesLoading(false);
//   };

//   const formik = useFormik({
//     initialValues: {
//       task_title: "",
//       project_id: "",
//       assigned_to: "",
//       description: "",
//       priority: "Medium",
//       start_date: "",
//       due_date: "",
//     },
//     validationSchema: taskValidationSchema,
//     onSubmit: async (values) => {
//       try {
//         await axios.post('http://localhost:5000/api/admin/tasks', values, {
//           headers: { Authorization: `Bearer ${token}` }
//         });
//         formik.resetForm();
//         setSelectedProject('');
//         setProjectEmployees([]);
//         onClose();
//         onRefresh();
//       } catch (error) {
//         alert(error.response?.data?.message || "Failed to create task");
//       }
//     },
//   });

//   const handleProjectChange = (e) => {
//     const projectId = e.target.value;
//     formik.setFieldValue('project_id', projectId);
//     setSelectedProject(projectId);
//     formik.setFieldValue('assigned_to', '');
//     loadProjectEmployees(projectId);
//   };

//   if (!open) return null;

//   return (
//     <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
//       <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm" onClick={onClose} />
      
//       <div className="relative bg-white w-full max-w-2xl rounded-[2.5rem] shadow-2xl overflow-hidden animate-in zoom-in duration-200">
//         {/* Header */}
//         <div className="px-10 py-8 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
//           <div className="flex items-center gap-4">
//             <div className="p-3 bg-blue-600 text-white rounded-2xl shadow-lg shadow-blue-200">
//               <RiAddCircleLine size={28} />
//             </div>
//             <div>
//               <h3 className="text-2xl font-black text-slate-800 tracking-tight">Create New Task</h3>
//               <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">Assign from project team</p>
//             </div>
//           </div>
//           <button onClick={onClose} className="p-2 hover:bg-rose-50 hover:text-rose-500 rounded-full transition-all text-slate-400">
//             <RiCloseLine size={28} />
//           </button>
//         </div>

//         {/* Form */}
//         <form onSubmit={formik.handleSubmit} className="p-10 space-y-6">
//           <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
//             <div className="md:col-span-2 space-y-2">
//               <label className="text-[11px] font-black text-slate-500 uppercase tracking-wider ml-1">Task Title *</label>
//               <input
//                 {...formik.getFieldProps("task_title")}
//                 className={`w-full px-5 py-4 bg-slate-50 border-2 rounded-2xl text-sm font-bold focus:bg-white outline-none transition-all ${
//                   formik.touched.task_title && formik.errors.task_title 
//                     ? "border-red-300 focus:border-red-500" 
//                     : "border-slate-100 focus:border-blue-500"
//                 }`}
//               />
//               {formik.touched.task_title && formik.errors.task_title && (
//                 <p className="text-red-500 text-xs mt-1">{formik.errors.task_title}</p>
//               )}
//             </div>

//             {/* Dynamic Project Select */}
//             <div className="space-y-2">
//               <label className="text-[11px] font-black text-slate-500 uppercase tracking-wider ml-1">Project *</label>
//               <select
//                 name="project_id"
//                 value={formik.values.project_id}
//                 onChange={handleProjectChange}
//                 className={`w-full px-5 py-4 bg-slate-50 border-2 rounded-2xl text-sm font-bold text-slate-600 focus:bg-white outline-none transition-all ${
//                   formik.touched.project_id && formik.errors.project_id 
//                     ? "border-red-300 focus:border-red-500" 
//                     : "border-slate-100 focus:border-blue-500"
//                 }`}
//               >
//                 <option value="">Select Project</option>
// {Array.isArray(projects) ? projects.map((project) => (
//                   <option key={project._id} value={project._id}>
//                     {project.name} ({project.status})
//                   </option>
//                 )) : []}
//               </select>
//             </div>

//             {/* Dynamic Employee Select (project assigned only) */}
//             <div className="space-y-2">
//               <label className="text-[11px] font-black text-slate-500 uppercase tracking-wider ml-1 flex items-center gap-1">
//                 <RiUserAddLine /> Employee * ({employeesLoading ? 'Loading...' : projectEmployees.length})
//               </label>
//               <select
//                 {...formik.getFieldProps("assigned_to")}
//                 disabled={!selectedProject || employeesLoading}
//                 className={`w-full px-5 py-4 bg-slate-50 border-2 rounded-2xl text-sm font-bold text-slate-600 focus:bg-white outline-none transition-all cursor-pointer ${
//                   (!selectedProject || employeesLoading) 
//                     ? "bg-slate-50 opacity-60 cursor-not-allowed" 
//                     : formik.touched.assigned_to && formik.errors.assigned_to 
//                       ? "border-red-300 focus:border-red-500" 
//                       : "border-slate-100 focus:border-blue-500"
//                 }`}
//               >
//                 <option value="">Select from {selectedProject ? 'project team' : 'project first'}</option>
//                 {projectEmployees.map((emp) => (
//                   <option key={emp._id} value={emp._id}>
//                     {emp.name} - {emp.designation}
//                   </option>
//                 ))}
//               </select>
//               {selectedProject && projectEmployees.length === 0 && !employeesLoading && (
//                 <p className="text-xs text-amber-600 mt-1">No employees assigned to this project</p>
//               )}
//             </div>

//             <div className="space-y-2">
//               <label className="text-[11px] font-black text-slate-500 uppercase tracking-wider ml-1 flex items-center gap-1">
//                 <RiFlag2Line /> Priority
//               </label>
//               <select
//                 {...formik.getFieldProps("priority")}
//                 className="w-full px-5 py-4 bg-slate-50 border-2 border-slate-100 rounded-2xl text-sm font-bold focus:bg-white focus:border-blue-500 outline-none transition-all"
//               >
//                 <option value="Low">Low</option>
//                 <option value="Medium">Medium</option>
//                 <option value="High">High</option>
//                 <option value="Critical">Critical</option>
//               </select>
//             </div>

//             <div className="space-y-2">
//               <label className="text-[11px] font-black text-slate-500 uppercase tracking-wider ml-1">Start Date *</label>
//               <input
//                 type="date"
//                 {...formik.getFieldProps("start_date")}
//                 className={`w-full px-5 py-4 bg-slate-50 border-2 rounded-2xl text-sm font-bold text-slate-600 focus:bg-white outline-none transition-all ${
//                   formik.touched.start_date && formik.errors.start_date 
//                     ? "border-red-300 focus:border-red-500" 
//                     : "border-slate-100 focus:border-blue-500"
//                 }`}
//               />
//             </div>

//             <div className="space-y-2">
//               <label className="text-[11px] font-black text-slate-500 uppercase tracking-wider ml-1 text-rose-500">Due Date *</label>
//               <input
//                 type="date"
//                 {...formik.getFieldProps("due_date")}
//                 className={`w-full px-5 py-4 bg-slate-50 border-2 rounded-2xl text-sm font-bold text-slate-600 focus:bg-white outline-none transition-all ${
//                   formik.touched.due_date && formik.errors.due_date 
//                     ? "border-red-300 focus:border-red-500" 
//                     : "border-slate-100 focus:border-rose-500"
//                 }`}
//               />
//             </div>
//           </div>

//           <div>
//             <label className="text-[11px] font-black text-slate-500 uppercase tracking-wider ml-1">Description</label>
//             <textarea
//               {...formik.getFieldProps("description")}
//               rows={4}
//               className="w-full px-5 py-4 bg-slate-50 border-2 border-slate-100 rounded-2xl text-sm focus:bg-white focus:border-blue-500 outline-none transition-all resize-none mt-2"
//             />
//           </div>

//           <div className="flex items-center gap-4 pt-6">
//             <button type="button" onClick={onClose} className="flex-1 py-4 font-bold text-slate-500 bg-slate-100 hover:bg-slate-200 rounded-2xl transition-all">
//               Cancel
//             </button>
//             <button 
//               type="submit" 
//               disabled={formik.isSubmitting}
//               className="flex-[2] py-4 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-2xl shadow-xl shadow-blue-100 flex items-center justify-center gap-2 transition-all active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed"
//             >
//               {formik.isSubmitting ? <RiLoader4Line className="animate-spin" size={20} /> : "Create Task"}
//             </button>
//           </div>
//         </form>
//       </div>
//     </div>
//   );
// };

// export default AddTaskModal;



import React, { useState, useEffect } from "react";
import { useFormik } from "formik";
import { taskValidationSchema } from "../../schemas/taskValidation";
import { useAuth } from "../../contexts/AuthContext";
import LoadingOverlay from "../common/LoadingOverlay";
import axios from "axios";
import { RiAddCircleLine, RiCloseLine, RiLoader4Line, RiUserAddLine, RiFlag2Line } from "react-icons/ri";

const AddTaskModal = ({ open, onClose, onRefresh, projects: propProjects }) => {
  const { token } = useAuth();
  const [projects, setProjects] = useState([]);
  const [projectEmployees, setProjectEmployees] = useState([]);
  const [employeesLoading, setEmployeesLoading] = useState(false);
  const [selectedProject, setSelectedProject] = useState('');

  // Load projects dynamically
  useEffect(() => {
    if (open && token) {
      axios.get('http://localhost:5000/api/admin/projects', { 
        headers: { Authorization: `Bearer ${token}` } 
      }).then(res => {
        // Safety check for project array
        const projectData = Array.isArray(res.data) ? res.data : (res.data.projects || []);
        setProjects(projectData);
      }).catch((err) => {
        console.error('Projects fetch error:', err.response?.data || err.message);
        setProjects(Array.isArray(propProjects) ? propProjects : []);
      });
    }
  }, [open, token, propProjects]);

  // Load employees based on selected project
  const loadProjectEmployees = async (projectId) => {
    if (!projectId) {
      setProjectEmployees([]);
      return;
    }
    setEmployeesLoading(true);
    try {
      const res = await axios.get(`http://localhost:5000/api/admin/projects/${projectId}`, { 
        headers: { Authorization: `Bearer ${token}` } 
      });

      // 1. Get the IDs of assigned employees (handle cases where data might be populated objects)
      const rawData = res?.data?.assignedEmployees || res?.data?.project?.assignedEmployees || []; 
      const assignedIds = (Array.isArray(rawData) ? rawData : []).map(emp => emp?._id || emp).filter(id => typeof id === 'string');
      
      if (assignedIds.length > 0) {
        const empRes = await axios.get(`http://localhost:5000/api/admin/employees?ids=${assignedIds.join(',')}`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        
        // 2. Safety check: Ensure we set an array even if the API returns an object
        const employeesList = Array.isArray(empRes.data) ? empRes.data : (empRes.data.employees || []);
        setProjectEmployees(employeesList);
      } else {
        setProjectEmployees([]);
      }
    } catch (error) {
      console.error("Failed to load project employees:", error);
      setProjectEmployees([]); // Fallback to empty array on error to prevent .map crash
    } finally {
      setEmployeesLoading(false);
    }
  };

  const formik = useFormik({
    initialValues: {
      task_title: "",
      project_id: "",
      assigned_to: "",
      description: "",
      priority: "Medium",
      start_date: "",
      due_date: "",
    },
    validationSchema: taskValidationSchema,
    onSubmit: async (values) => {
      try {
        await axios.post('http://localhost:5000/api/admin/tasks', values, {
          headers: { Authorization: `Bearer ${token}` }
        });
        formik.resetForm();
        setSelectedProject('');
        setProjectEmployees([]);
        onClose();
        onRefresh();
      } catch (error) {
        alert(error.response?.data?.message || "Failed to create task");
      }
    },
  });

  const handleProjectChange = (e) => {
    const projectId = e.target.value;
    formik.setFieldValue('project_id', projectId);
    setSelectedProject(projectId);
    formik.setFieldValue('assigned_to', ''); // Reset selected employee
    loadProjectEmployees(projectId);
  };

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm" onClick={onClose} />
      
      <div className="relative bg-white w-full max-w-2xl rounded-[2.5rem] shadow-2xl overflow-hidden animate-in zoom-in duration-200">
        {/* Header */}
        <div className="px-10 py-8 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-blue-600 text-white rounded-2xl shadow-lg shadow-blue-200">
              <RiAddCircleLine size={28} />
            </div>
            <div>
              <h3 className="text-2xl font-black text-slate-800 tracking-tight">Create New Task</h3>
              <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">Assign from project team</p>
            </div>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-rose-50 hover:text-rose-500 rounded-full transition-all text-slate-400">
            <RiCloseLine size={28} />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={formik.handleSubmit} className="p-10 space-y-6 relative">
          <LoadingOverlay visible={formik.isSubmitting} message="Creating task..." />
          <fieldset disabled={formik.isSubmitting} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="md:col-span-2 space-y-2">
              <label className="text-[11px] font-black text-slate-500 uppercase tracking-wider ml-1">Task Title *</label>
              <input
                {...formik.getFieldProps("task_title")}
                className={`w-full px-5 py-4 bg-slate-50 border-2 rounded-2xl text-sm font-bold focus:bg-white outline-none transition-all ${
                  formik.touched.task_title && formik.errors.task_title 
                    ? "border-red-300 focus:border-red-500" 
                    : "border-slate-100 focus:border-blue-500"
                }`}
              />
              {formik.touched.task_title && formik.errors.task_title && (
                <p className="text-red-500 text-xs mt-1">{formik.errors.task_title}</p>
              )}
            </div>

            {/* Dynamic Project Select */}
            <div className="space-y-2">
              <label className="text-[11px] font-black text-slate-500 uppercase tracking-wider ml-1">Project *</label>
              <select
                name="project_id"
                value={formik.values.project_id}
                onChange={handleProjectChange}
                className={`w-full px-5 py-4 bg-slate-50 border-2 rounded-2xl text-sm font-bold text-slate-600 focus:bg-white outline-none transition-all ${
                  formik.touched.project_id && formik.errors.project_id 
                    ? "border-red-300 focus:border-red-500" 
                    : "border-slate-100 focus:border-blue-500"
                }`}
              >
                <option value="">Select Project</option>
                {Array.isArray(projects) && projects.map((project) => (
                  <option key={project._id} value={project._id}>
                    {project.name} ({project.status})
                  </option>
                ))}
              </select>
            </div>

            {/* Dynamic Employee Select (project assigned only) */}
            <div className="space-y-2">
              <label className="text-[11px] font-black text-slate-500 uppercase tracking-wider ml-1 flex items-center gap-1">
                <RiUserAddLine /> Employee * ({employeesLoading ? 'Loading...' : (Array.isArray(projectEmployees) ? projectEmployees.length : 0)})
              </label>
              <select
                {...formik.getFieldProps("assigned_to")}
                disabled={!selectedProject || employeesLoading}
                className={`w-full px-5 py-4 bg-slate-50 border-2 rounded-2xl text-sm font-bold text-slate-600 focus:bg-white outline-none transition-all cursor-pointer ${
                  (!selectedProject || employeesLoading) 
                    ? "bg-slate-50 opacity-60 cursor-not-allowed" 
                    : formik.touched.assigned_to && formik.errors.assigned_to 
                      ? "border-red-300 focus:border-red-500" 
                      : "border-slate-100 focus:border-blue-500"
                }`}
              >
                <option value="">Select from {selectedProject ? 'project team' : 'project first'}</option>
                {/* SAFE MAPPING HERE */}
                {Array.isArray(projectEmployees) && projectEmployees.map((emp) => (
                  <option key={emp._id} value={emp._id}>
                    {emp.name} - {emp.designation}
                  </option>
                ))}
              </select>
              {selectedProject && (!projectEmployees || projectEmployees.length === 0) && !employeesLoading && (
                <p className="text-xs text-amber-600 mt-1">No employees assigned to this project</p>
              )}
            </div>

            <div className="space-y-2">
              <label className="text-[11px] font-black text-slate-500 uppercase tracking-wider ml-1 flex items-center gap-1">
                <RiFlag2Line /> Priority
              </label>
              <select
                {...formik.getFieldProps("priority")}
                className="w-full px-5 py-4 bg-slate-50 border-2 border-slate-100 rounded-2xl text-sm font-bold focus:bg-white focus:border-blue-500 outline-none transition-all"
              >
                <option value="Low">Low</option>
                <option value="Medium">Medium</option>
                <option value="High">High</option>
                <option value="Critical">Critical</option>
              </select>
            </div>

            <div className="space-y-2">
              <label className="text-[11px] font-black text-slate-500 uppercase tracking-wider ml-1">Start Date *</label>
              <input
                type="date"
                {...formik.getFieldProps("start_date")}
                className={`w-full px-5 py-4 bg-slate-50 border-2 rounded-2xl text-sm font-bold text-slate-600 focus:bg-white outline-none transition-all ${
                  formik.touched.start_date && formik.errors.start_date 
                    ? "border-red-300 focus:border-red-500" 
                    : "border-slate-100 focus:border-blue-500"
                }`}
              />
            </div>

            <div className="space-y-2">
              <label className="text-[11px] font-black text-slate-500 uppercase tracking-wider ml-1 text-rose-500">Due Date *</label>
              <input
                type="date"
                {...formik.getFieldProps("due_date")}
                className={`w-full px-5 py-4 bg-slate-50 border-2 rounded-2xl text-sm font-bold text-slate-600 focus:bg-white outline-none transition-all ${
                  formik.touched.due_date && formik.errors.due_date 
                    ? "border-red-300 focus:border-red-500" 
                    : "border-slate-100 focus:border-rose-500"
                }`}
              />
            </div>
          </div>

          <div>
            <label className="text-[11px] font-black text-slate-500 uppercase tracking-wider ml-1">Description</label>
            <textarea
              {...formik.getFieldProps("description")}
              rows={4}
              className="w-full px-5 py-4 bg-slate-50 border-2 border-slate-100 rounded-2xl text-sm focus:bg-white focus:border-blue-500 outline-none transition-all resize-none mt-2"
            />
          </div>

          <div className="flex items-center gap-4 pt-6">
            <button type="button" onClick={onClose} disabled={formik.isSubmitting} className="flex-1 py-4 font-bold text-slate-500 bg-slate-100 hover:bg-slate-200 rounded-2xl transition-all disabled:opacity-50">
              Cancel
            </button>
            <button 
              type="submit" 
              disabled={formik.isSubmitting}
              className="flex-[2] py-4 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-2xl shadow-xl shadow-blue-100 flex items-center justify-center gap-2 transition-all active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {formik.isSubmitting ? <RiLoader4Line className="animate-spin" size={20} /> : "Create Task"}
            </button>
          </div>
        </fieldset>
        </form>
      </div>
    </div>
  );
};

export default AddTaskModal;