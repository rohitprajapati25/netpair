import React, { useMemo } from "react";
import { useFormik } from "formik";
import { timesheetValidationSchema } from "../../schemas/timesheetValidation";
import { useAuth } from "../../contexts/AuthContext";
import axios from "axios";
import { RiCloseLine, RiLoader4Line, RiTimeLine } from "react-icons/ri";

const TimesheetSubmitModal = ({
  open,
  onClose,
  onRefresh,
  projects = [],
  tasks = [],
  selectedTask = null,
  onSuccess,
}) => {
  const { token } = useAuth();

  // Derive project_id from selectedTask — handle both populated object and raw string
  const defaultProjectId =
    selectedTask?.project_id?._id ||
    selectedTask?.project_id ||
    "";

  const formik = useFormik({
    enableReinitialize: true, // re-populate when selectedTask changes
    initialValues: {
      date: new Date().toISOString().split("T")[0],
      project_id: defaultProjectId,
      task_id: selectedTask?._id || "",
      hours_worked: "",
      work_description: "",
    },
    validationSchema: timesheetValidationSchema,
    onSubmit: async (values, { resetForm }) => {
      try {
        await axios.post("http://localhost:5000/api/employees/timesheets", values, {
          headers: { Authorization: `Bearer ${token}` },
        });
        resetForm();
        onRefresh?.();
        onSuccess?.();
        onClose();
      } catch (error) {
        // Surface error via formik status so parent can show toast if desired
        formik.setStatus(error.response?.data?.message || "Failed to submit timesheet");
      }
    },
  });

  // Filter tasks by selected project (if a project is chosen)
  const filteredTasks = useMemo(() => {
    if (!formik.values.project_id) return tasks;
    return tasks.filter((t) => {
      const pid = t.project_id?._id || t.project_id;
      return pid === formik.values.project_id;
    });
  }, [tasks, formik.values.project_id]);

  if (!open) return null;

  const Field = ({ label, error, children }) => (
    <div className="space-y-1.5">
      <label className="text-xs font-bold uppercase tracking-wider text-slate-500 ml-0.5">
        {label}
      </label>
      {children}
      {error && <p className="text-red-500 text-xs ml-0.5">{error}</p>}
    </div>
  );

  const inputCls = (touched, error) =>
    `w-full p-3 border rounded-xl text-sm focus:ring-2 focus:ring-indigo-200 outline-none transition-all ${
      touched && error
        ? "border-red-300 focus:border-red-400"
        : "border-slate-200 focus:border-indigo-400"
    }`;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
      <div
        className="absolute inset-0"
        onClick={() => { formik.resetForm(); onClose(); }}
      />
      <div className="relative bg-white w-full max-w-md rounded-2xl shadow-2xl max-h-[92vh] overflow-y-auto">
        {/* Header */}
        <div className="sticky top-0 bg-white px-6 py-4 border-b border-slate-100 flex items-center justify-between z-10">
          <div className="flex items-center gap-2.5">
            <div className="p-2 bg-indigo-100 text-indigo-600 rounded-xl">
              <RiTimeLine size={20} />
            </div>
            <div>
              <h3 className="font-black text-slate-800 text-base leading-tight">Log Timesheet</h3>
              {selectedTask && (
                <p className="text-xs text-slate-400 mt-0.5 truncate max-w-[220px]">
                  {selectedTask.task_title}
                </p>
              )}
            </div>
          </div>
          <button
            onClick={() => { formik.resetForm(); onClose(); }}
            className="p-2 text-slate-400 hover:text-rose-500 rounded-xl hover:bg-slate-100 transition-all"
          >
            <RiCloseLine size={20} />
          </button>
        </div>

        <form onSubmit={formik.handleSubmit} className="p-6 space-y-4">
          <fieldset disabled={formik.isSubmitting} className="space-y-4">

            {/* Server-level error */}
            {formik.status && (
              <div className="px-4 py-3 bg-red-50 border border-red-200 rounded-xl text-sm text-red-700 font-medium">
                {formik.status}
              </div>
            )}

            {/* Date */}
            <Field
              label="Date"
              error={formik.touched.date && formik.errors.date}
            >
              <input
                type="date"
                {...formik.getFieldProps("date")}
                max={new Date().toISOString().split("T")[0]}
                className={inputCls(formik.touched.date, formik.errors.date)}
              />
            </Field>

            {/* Project */}
            <Field
              label="Project"
              error={formik.touched.project_id && formik.errors.project_id}
            >
              <select
                {...formik.getFieldProps("project_id")}
                className={inputCls(formik.touched.project_id, formik.errors.project_id)}
              >
                <option value="">Select Project</option>
                {projects.map((p) => (
                  <option key={p._id} value={p._id}>
                    {p.name}
                  </option>
                ))}
              </select>
            </Field>

            {/* Task (filtered by project) */}
            <Field label="Task (optional)">
              <select
                {...formik.getFieldProps("task_id")}
                className={inputCls(false, false)}
              >
                <option value="">No specific task</option>
                {filteredTasks.map((t) => (
                  <option key={t._id} value={t._id}>
                    {t.task_title}
                  </option>
                ))}
              </select>
              {formik.values.project_id && filteredTasks.length === 0 && (
                <p className="text-xs text-slate-400 ml-0.5">No tasks found for this project</p>
              )}
            </Field>

            {/* Hours Worked */}
            <Field
              label="Hours Worked"
              error={formik.touched.hours_worked && formik.errors.hours_worked}
            >
              <input
                type="number"
                min="0.5"
                max="24"
                step="0.5"
                placeholder="e.g. 7.5"
                {...formik.getFieldProps("hours_worked")}
                className={inputCls(formik.touched.hours_worked, formik.errors.hours_worked)}
              />
            </Field>

            {/* Work Description */}
            <Field
              label="Work Done"
              error={formik.touched.work_description && formik.errors.work_description}
            >
              <textarea
                rows={3}
                placeholder="Describe what you accomplished today... (min 10 chars)"
                {...formik.getFieldProps("work_description")}
                className={`${inputCls(
                  formik.touched.work_description,
                  formik.errors.work_description
                )} resize-none`}
              />
              <div className="flex justify-end">
                <span className="text-xs text-slate-400">
                  {formik.values.work_description.length}/2000
                </span>
              </div>
            </Field>

            {/* Submit */}
            <button
              type="submit"
              disabled={formik.isSubmitting}
              className="w-full py-3.5 bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 text-white font-bold rounded-xl flex items-center justify-center gap-2 shadow-lg transition-all disabled:opacity-50 text-sm"
            >
              {formik.isSubmitting ? (
                <>
                  <RiLoader4Line className="animate-spin text-base" />
                  Submitting...
                </>
              ) : (
                "Submit Timesheet"
              )}
            </button>
          </fieldset>
        </form>
      </div>
    </div>
  );
};

export default TimesheetSubmitModal;
