import React from "react";
import { useFormik } from "formik";
import { timesheetValidationSchema } from "../../schemas/timesheetValidation";
import { useAuth } from "../../contexts/AuthContext";
import axios from "axios";
import { RiCloseLine, RiLoader4Line, RiTimeLine } from "react-icons/ri";

const TimesheetSubmitModal = ({ open, onClose, onRefresh, projects = [], tasks = [] }) => {
  const { token } = useAuth();

  const formik = useFormik({
    initialValues: {
      date: "",
      project_id: "",
      task_id: "",
      hours_worked: "",
      work_description: "",
    },
    validationSchema: timesheetValidationSchema,
    onSubmit: async (values) => {
      try {
        await axios.post('http://localhost:5000/api/employees/timesheets', values, {
          headers: { Authorization: `Bearer ${token}` }
        });
        onRefresh();
        onClose();
        formik.resetForm();
      } catch (error) {
        alert(error.response?.data?.message || "Failed to submit timesheet");
      }
    },
  });

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm" onClick={onClose} />
      <div className="relative bg-white w-full max-w-md rounded-[2rem] shadow-2xl max-h-[90vh] overflow-y-auto">
        <div className="p-6 border-b border-slate-100 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="p-2 bg-indigo-100 text-indigo-600 rounded-xl">
              <RiTimeLine size={20} />
            </div>
            <h3 className="font-black text-slate-800 text-lg">Log Timesheet</h3>
          </div>
          <button onClick={onClose} className="p-2 text-slate-400 hover:text-rose-500 rounded-xl hover:bg-slate-100 transition-all">
            <RiCloseLine size={20} />
          </button>
        </div>

        <form onSubmit={formik.handleSubmit} className="p-6 space-y-4 relative">

          <fieldset disabled={formik.isSubmitting} className="space-y-4">
            <div className="space-y-2">
              <label className="text-xs font-bold uppercase tracking-wider text-slate-500 ml-1">Date</label>
            <input
              type="date"
              {...formik.getFieldProps("date")}
              className={`w-full p-3 border rounded-xl text-sm focus:ring-2 focus:ring-indigo-200 transition-all ${
                formik.touched.date && formik.errors.date ? "border-red-300" : "border-slate-200 focus:border-indigo-400"
              }`}
            />
            {formik.touched.date && formik.errors.date && (
              <p className="text-red-500 text-xs -mt-5">{formik.errors.date}</p>
            )}
          </div>

          <div className="space-y-2">
            <label className="text-xs font-bold uppercase tracking-wider text-slate-500 ml-1">Project</label>
            <select {...formik.getFieldProps("project_id")} className={`w-full p-3 border rounded-xl text-sm focus:ring-2 focus:ring-indigo-200 transition-all ${
              formik.touched.project_id && formik.errors.project_id ? "border-red-300" : "border-slate-200 focus:border-indigo-400"
            }`}>
              <option value="">Select Project</option>
              {projects.map(p => (
                <option key={p._id} value={p._id}>{p.name}</option>
              ))}
            </select>
          </div>

          <div className="space-y-2">
            <label className="text-xs font-bold uppercase tracking-wider text-slate-500 ml-1">Task (optional)</label>
            <select {...formik.getFieldProps("task_id")} className="w-full p-3 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-indigo-200 transition-all">
              <option value="">No specific task</option>
              {tasks.map(t => (
                <option key={t._id} value={t._id}>{t.task_title}</option>
              ))}
            </select>
          </div>

          <div className="space-y-2">
            <label className="text-xs font-bold uppercase tracking-wider text-slate-500 ml-1">Hours Worked</label>
            <input
              type="number"
              min="0"
              max="24"
              step="0.5"
              {...formik.getFieldProps("hours_worked")}
              className={`w-full p-3 border rounded-xl text-sm focus:ring-2 focus:ring-indigo-200 transition-all ${
                formik.touched.hours_worked && formik.errors.hours_worked ? "border-red-300" : "border-slate-200 focus:border-indigo-400"
              }`}
            />
            {formik.touched.hours_worked && formik.errors.hours_worked && (
              <p className="text-red-500 text-xs -mt-5">{formik.errors.hours_worked}</p>
            )}
          </div>

          <div className="space-y-2">
            <label className="text-xs font-bold uppercase tracking-wider text-slate-500 ml-1">Work Done Today</label>
            <textarea
              rows="3"
              {...formik.getFieldProps("work_description")}
              className={`w-full p-3 border rounded-xl text-sm resize-vertical focus:ring-2 focus:ring-indigo-200 transition-all ${
                formik.touched.work_description && formik.errors.work_description ? "border-red-300" : "border-slate-200 focus:border-indigo-400"
              }`}
              placeholder="What did you accomplish today..."
            />
            {formik.touched.work_description && formik.errors.work_description && (
              <p className="text-red-500 text-xs -mt-5">{formik.errors.work_description}</p>
            )}
          </div>

          <button 
            type="submit" 
            disabled={formik.isSubmitting}
            className="w-full py-4 bg-gradient-to-r from-indigo-500 to-purple-600 text-white font-bold rounded-2xl flex items-center justify-center gap-2 hover:from-indigo-600 hover:to-purple-700 shadow-xl transition-all disabled:opacity-50"
          >
            {formik.isSubmitting ? <RiLoader4Line className="animate-spin" /> : "Submit Timesheet"}
          </button>
        </fieldset>
        </form>
      </div>
    </div>
  );
};

export default TimesheetSubmitModal;

