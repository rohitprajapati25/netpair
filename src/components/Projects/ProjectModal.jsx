import React, { useEffect, useState } from "react";
import { useAuth } from "../../contexts/AuthContext";
import axios from 'axios';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import { projectSchema } from '../../schemas/projectValidation';
import { 
  RiFolderAddLine, RiEditBoxLine, RiCloseLine, RiSaveLine, RiInformationLine,
  RiCalendarEventLine, RiBuildingLine, RiTeamLine, RiUserLine,
  RiMoneyDollarCircleLine, RiLoader4Line
} from "react-icons/ri";
import API_URL from "../../config/api";

const ProjectModal = ({ onClose, onSave, initialData }) => {
  const { token } = useAuth();
  const [managers, setManagers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [submitError, setSubmitError] = useState("");

  const loadEmployees = async () => {
    try {
      const url = `${API_URL}/admin/active-employees?role=employee`;
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
    loadEmployees();
    console.log('ProjectModal mounted, token:', !!token);
  }, [token]);

  const handleSubmit = async (values) => {
    try {
      setLoading(true);
      
      if (initialData) {
        // For updates, send as JSON
        const updateData = {
          name: values.name.trim(),
          company: values.company.trim(),
          startDate: values.startDate,
          endDate: values.endDate || null,
          status: values.status,
          priority: values.priority,
          project_type: values.project_type,
          progress: values.progress,
          budget: values.budget,
          client: values.client,
          description: values.description,
          manager: values.manager || null,
          assignedEmployees: values.assignedEmployees.filter(id => 
            id && typeof id === 'string' && id.length === 24 && managers.find(emp => emp._id === id)
          )
        };
        
        await onSave(updateData);
      } else {
        // For new projects, send as FormData
        const projectData = new FormData();
        projectData.append('name', values.name.trim());
        projectData.append('company', values.company.trim());
        projectData.append('startDate', values.startDate);
        if (values.endDate) projectData.append('endDate', values.endDate);
        projectData.append('status', values.status);
        projectData.append('priority', values.priority);
        projectData.append('project_type', values.project_type);
        projectData.append('progress', values.progress.toString());
        projectData.append('budget', values.budget);
        projectData.append('client', values.client);
        projectData.append('description', values.description);
        if (values.manager) projectData.append('manager', values.manager);
        // Clean assignedEmployees - frontend only string IDs
        const cleanAssigned = values.assignedEmployees.filter(id => 
          id && typeof id === 'string' && id.length === 24 && managers.find(emp => emp._id === id)
        );
        projectData.append('assignedEmployees', JSON.stringify(cleanAssigned));
        
        await onSave(projectData);
      }
      
      onClose();
    } catch (err) {
      console.error('Submit error:', err);
      setSubmitError(err.response?.data?.message || 'Failed to save project. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const initialValues = {
    name: initialData?.name || "",
    company: initialData?.company || "",
    projectOwnerId: initialData?.projectOwnerId?._id || initialData?.projectOwnerId || "",
    manager: initialData?.manager?._id || initialData?.manager || "",
    startDate: initialData?.startDate ? new Date(initialData.startDate).toISOString().split('T')[0] : "",
    endDate: initialData?.endDate ? new Date(initialData.endDate).toISOString().split('T')[0] : "",
    status: initialData?.status || "Ongoing",
    priority: initialData?.priority || "Medium",
    project_type: initialData?.project_type || "Internal",
    progress: initialData?.progress || 0,
    assignedEmployees: initialData?.assignedEmployees ? initialData.assignedEmployees.map(emp =>
      typeof emp === 'object' && emp._id ? emp._id : emp
    ) : [],
    budget: initialData?.budget || "",
    client: initialData?.client || "",
    description: initialData?.description || ""
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      <div 
        className="absolute inset-0 bg-slate-900/60 backdrop-blur-md transition-opacity" 
        onClick={loading ? undefined : onClose} 
      />
      <div className="relative bg-white w-full max-w-2xl rounded-2xl shadow-2xl shadow-blue-900/20 flex flex-col max-h-[92vh] overflow-hidden animate-in fade-in zoom-in duration-200">
        
        {/* Sticky header */}
        <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-3">
            <div className={`p-2 rounded-xl ${initialData ? 'bg-amber-100 text-amber-600' : 'bg-blue-100 text-blue-600'}`}>
              {initialData ? <RiEditBoxLine size={20} /> : <RiFolderAddLine size={20} />}
            </div>
            <div>
              <h3 className="text-lg font-black text-slate-800 tracking-tight">
                {initialData ? "Update Project" : "Create New Project"}
              </h3>
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                Super Admin - Full Control
              </p>
            </div>
          </div>
          <button 
            onClick={onClose}
            className="p-2 hover:bg-white hover:shadow-sm rounded-xl text-slate-400 hover:text-rose-500 transition-all"
          >
            <RiCloseLine size={22} />
          </button>
        </div>

        <Formik
          initialValues={initialValues}
          validationSchema={projectSchema}
          enableReinitialize={true}
          onSubmit={handleSubmit}
        >
          {({ values, setFieldValue, errors, touched }) => (
            <Form className="flex-1 flex flex-col overflow-hidden">
              <div className="flex-1 overflow-y-auto p-6 space-y-5 relative">
              <fieldset disabled={loading} className="space-y-5">

                {/* Submit error */}
                {submitError && (
                  <div className="p-3 bg-red-50 border border-red-200 rounded-xl text-sm text-red-700 font-medium">
                    {submitError}
                  </div>
                )}

                <div className="space-y-2">
                  <label className="flex items-center gap-2 text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">
                    <RiInformationLine /> Project Name *
                  </label>
                  <Field
                    name="name"
                    className={`w-full px-4 py-3 bg-slate-50 border-2 border-slate-100 rounded-xl text-sm font-medium text-slate-700 focus:bg-white focus:border-blue-400 focus:ring-2 focus:ring-blue-100 outline-none transition-all ${
                      errors.name && touched.name ? 'border-rose-300 bg-rose-50' : ''
                    }`}
                    placeholder="e.g. Enterprise CRM System"
                  />
                  <ErrorMessage name="name" component="div" className="text-rose-500 text-xs mt-1 ml-1 font-medium" />
                </div>

                <div className="space-y-2">
                  <label className="flex items-center gap-2 text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">
                    <RiBuildingLine /> Company/Department *
                  </label>
                  <Field
                    name="company"
                    className={`w-full px-4 py-3 bg-slate-50 border-2 border-slate-100 rounded-xl text-sm font-medium text-slate-700 focus:bg-white focus:border-blue-400 focus:ring-2 focus:ring-blue-100 outline-none transition-all ${
                      errors.company && touched.company ? 'border-rose-300 bg-rose-50' : ''
                    }`}
                    placeholder="Enter Company/Department Name"
                  />
                  <ErrorMessage name="company" component="div" className="text-rose-500 text-xs mt-1 ml-1 font-medium" />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="flex items-center gap-2 text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">
                      <RiUserLine /> Manager
                    </label>
                    <Field as="select" name="manager" className="w-full px-4 py-3 bg-slate-50 border-2 border-slate-100 rounded-xl text-sm font-medium text-slate-700 focus:bg-white focus:border-blue-400 focus:ring-2 focus:ring-blue-100 outline-none transition-all">
                      <option value="">Select Manager</option>
                      {Array.isArray(managers) && managers.map(emp => (
                        <option key={emp._id} value={emp._id}>
                          {emp.name} - {emp.designation}
                        </option>
                      ))}
                    </Field>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="flex items-center gap-2 text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">
                      <RiCalendarEventLine /> Start Date *
                    </label>
                    <Field
                      type="date"
                      name="startDate"
                      className={`w-full px-4 py-3 bg-slate-50 border-2 border-slate-100 rounded-xl text-sm font-medium text-slate-600 focus:bg-white focus:border-blue-400 focus:ring-2 focus:ring-blue-100 outline-none transition-all ${
                        errors.startDate && touched.startDate ? 'border-rose-300 bg-rose-50' : ''
                      }`}
                    />
                    <ErrorMessage name="startDate" component="div" className="text-rose-500 text-xs mt-1 ml-1 font-medium" />
                  </div>
                  <div className="space-y-2">
                    <label className="flex items-center gap-2 text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">
                      <RiCalendarEventLine /> End Date
                    </label>
                    <Field
                      type="date"
                      name="endDate"
                      className="w-full px-4 py-3 bg-slate-50 border-2 border-slate-100 rounded-xl text-sm font-medium text-slate-600 focus:bg-white focus:border-blue-400 focus:ring-2 focus:ring-blue-100 outline-none transition-all"
                    />
                    <ErrorMessage name="endDate" component="div" className="text-rose-500 text-xs mt-1 ml-1 font-medium" />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">Project Type</label>
                    <Field as="select" name="project_type" className="w-full px-4 py-3 bg-slate-50 border-2 border-slate-100 rounded-xl text-sm font-medium text-slate-700 focus:bg-white focus:border-blue-400 focus:ring-2 focus:ring-blue-100 outline-none transition-all">
                      <option value="Internal">Internal</option>
                      <option value="Client">Client</option>
                      <option value="Product">Product</option>
                    </Field>
                  </div>
                  <div className="space-y-2">
                    <label className="flex items-center gap-2 text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">
                      <RiMoneyDollarCircleLine /> Budget
                    </label>
                    <Field
                      type="number"
                      name="budget"
                      placeholder="0"
                      className="w-full px-4 py-3 bg-slate-50 border-2 border-slate-100 rounded-xl text-sm font-medium text-slate-700 focus:bg-white focus:border-blue-400 focus:ring-2 focus:ring-blue-100 outline-none transition-all"
                    />
                    <ErrorMessage name="budget" component="div" className="text-rose-500 text-xs mt-1 ml-1 font-medium" />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">Progress (%)</label>
                    <Field
                      type="range"
                      name="progress"
                      min="0"
                      max="100"
                      className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer range-sm accent-blue-600 hover:accent-blue-700"
                    />
                    <div className="text-right text-xs text-slate-500 font-mono">{values.progress}%</div>
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">Status</label>
                    <Field as="select" name="status" className="w-full px-4 py-3 bg-slate-50 border-2 border-slate-100 rounded-xl text-sm font-medium text-slate-700 focus:bg-white focus:border-blue-400 focus:ring-2 focus:ring-blue-100 outline-none transition-all">
                      <option>Pending</option>
                      <option>Ongoing</option>
                      <option>Completed</option>
                      <option>On Hold</option>
                      <option>Cancelled</option>
                    </Field>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">Client</label>
                    <Field
                      name="client"
                      placeholder="Client name (optional)"
                      className="w-full px-4 py-3 bg-slate-50 border-2 border-slate-100 rounded-xl text-sm font-medium text-slate-700 focus:bg-white focus:border-blue-400 focus:ring-2 focus:ring-blue-100 outline-none transition-all"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1 mb-3 block">Assigned Employees</label>
                    <div className="max-h-44 overflow-y-auto border border-slate-200 rounded-xl p-3 bg-slate-50">
                      {managers.length === 0 ? (
                        <p className="text-xs text-slate-500 text-center py-4">No employees available</p>
                      ) : (
                        managers.map((emp) => (
                          <label key={emp._id} className="flex items-center gap-3 p-2 rounded-lg hover:bg-white cursor-pointer group">
                            <input
                              type="checkbox"
                              value={emp._id}
                              checked={values.assignedEmployees.some(id => id === emp._id)}
                              onChange={(e) => {
                                const id = emp._id;
                                const newSelected = e.target.checked
                                  ? [...values.assignedEmployees, id]
                                  : values.assignedEmployees.filter(empId => empId !== id);
                                setFieldValue('assignedEmployees', newSelected);
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
                      Selected: {values.assignedEmployees.length} / {managers.length}
                    </div>
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="flex items-center gap-2 text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">
                    Description
                  </label>
                  <Field
                    as="textarea"
                    name="description"
                    rows="3"
                    className="w-full px-4 py-3 bg-slate-50 border-2 border-slate-100 rounded-xl text-sm font-medium text-slate-700 h-24 resize-none focus:bg-white focus:border-blue-400 focus:ring-2 focus:ring-blue-100 outline-none transition-all"
                    placeholder="Project scope and objectives..."
                  />
                  <ErrorMessage name="description" component="div" className="text-rose-500 text-xs mt-1 ml-1 font-medium" />
                </div>

              </fieldset>
              </div>

              {/* Footer — sticky, outside scroll */}
              <div className="px-6 pb-6 pt-3 border-t border-slate-100 flex gap-3 shrink-0">
                <button
                  type="button"
                  onClick={onClose}
                  disabled={loading}
                  className="flex-1 py-3 font-bold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-xl text-sm transition-all active:scale-95 disabled:opacity-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="flex-1 py-3 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl text-sm shadow-md flex items-center justify-center gap-2 transition-all active:scale-95 disabled:opacity-50"
                >
                  {loading ? (
                    <>
                      <RiLoader4Line size={18} className="animate-spin" />
                      Saving...
                    </>
                  ) : (
                    <>
                      <RiSaveLine size={18} />
                      {initialData ? "Update Project" : "Create Project"}
                    </>
                  )}
                </button>
              </div>
            </Form>
          )}
        </Formik>
      </div>
    </div>
  );
};

export default ProjectModal;