import { useState, useEffect, useMemo, useCallback } from "react";
import { useAuth } from "../../contexts/AuthContext";
import axios from "axios";
import {
  RiCloseLine, RiLoader4Line, RiTimeLine, RiCalendarLine,
  RiFolderLine, RiTaskLine, RiCheckLine, RiAlertLine,
  RiInformationLine,
} from "react-icons/ri";
import API_URL from "../../config/api";

// ── Field wrapper ─────────────────────────────────────────────────────────────
const Field = ({ label, required, error, hint, children }) => (
  <div className="space-y-1.5">
    <label className="flex items-center gap-1 text-[10px] font-black uppercase tracking-widest text-slate-500">
      {label}
      {required && <span className="text-red-500 normal-case font-bold">*</span>}
    </label>
    {children}
    {error && (
      <p className="flex items-center gap-1 text-red-500 text-xs font-medium">
        <RiAlertLine size={11} className="shrink-0" />{error}
      </p>
    )}
    {!error && hint && <p className="text-slate-400 text-xs">{hint}</p>}
  </div>
);

const inputBase = "w-full px-4 py-3 border-2 rounded-xl text-sm font-medium outline-none transition-all bg-slate-50 focus:bg-white";
const inputCls  = (err) => `${inputBase} ${err ? "border-red-300 focus:border-red-400 focus:ring-2 focus:ring-red-100" : "border-slate-100 focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100"}`;

// ── Quick hour presets ────────────────────────────────────────────────────────
const HOUR_PRESETS = [1, 2, 3, 4, 6, 7.5, 8];

// ── Main Modal ────────────────────────────────────────────────────────────────
const TimesheetSubmitModal = ({
  open,
  onClose,
  onRefresh,
  projects = [],
  tasks    = [],
  selectedTask = null,
  onSuccess,
}) => {
  const { token } = useAuth();

  // ── Form state ────────────────────────────────────────────────────────────
  const today = new Date().toISOString().split("T")[0];

  const defaultProjectId =
    selectedTask?.project_id?._id ||
    (typeof selectedTask?.project_id === "string" ? selectedTask.project_id : "") ||
    "";

  const [form, setForm] = useState({
    date:             today,
    project_id:       defaultProjectId,
    task_id:          selectedTask?._id || "",
    hours_worked:     "",
    work_description: "",
  });

  const [errors,     setErrors]     = useState({});
  const [submitting, setSubmitting] = useState(false);
  const [serverMsg,  setServerMsg]  = useState(null); // { type: "success"|"error", text }

  // Re-populate when selectedTask changes (e.g. opened from task row)
  useEffect(() => {
    if (!open) return;
    const pid = selectedTask?.project_id?._id ||
      (typeof selectedTask?.project_id === "string" ? selectedTask.project_id : "") || "";
    setForm({
      date:             today,
      project_id:       pid,
      task_id:          selectedTask?._id || "",
      hours_worked:     "",
      work_description: "",
    });
    setErrors({});
    setServerMsg(null);
  }, [open, selectedTask]);

  // ── Tasks filtered by selected project ───────────────────────────────────
  const filteredTasks = useMemo(() => {
    if (!form.project_id) return tasks;
    return tasks.filter((t) => {
      const pid = t.project_id?._id || t.project_id;
      return String(pid) === String(form.project_id);
    });
  }, [tasks, form.project_id]);

  // ── Field change ──────────────────────────────────────────────────────────
  const set = useCallback((key, value) => {
    setForm((p) => {
      const next = { ...p, [key]: value };
      // Auto-clear task when project changes
      if (key === "project_id") next.task_id = "";
      return next;
    });
    setErrors((p) => ({ ...p, [key]: undefined }));
    setServerMsg(null);
  }, []);

  // ── Validation ────────────────────────────────────────────────────────────
  const validate = () => {
    const e = {};
    if (!form.date) {
      e.date = "Date is required";
    } else {
      const d = new Date(form.date);
      const todayEnd = new Date(); todayEnd.setHours(23, 59, 59, 999);
      if (d > todayEnd) e.date = "Cannot log future hours";
    }
    if (!form.project_id) e.project_id = "Project is required";
    const hrs = Number(form.hours_worked);
    if (!form.hours_worked && form.hours_worked !== 0) {
      e.hours_worked = "Hours worked is required";
    } else if (isNaN(hrs) || hrs < 0.5) {
      e.hours_worked = "Minimum 0.5 hours";
    } else if (hrs > 24) {
      e.hours_worked = "Maximum 24 hours per day";
    }
    if (!form.work_description.trim()) {
      e.work_description = "Work description is required";
    } else if (form.work_description.trim().length < 10) {
      e.work_description = "Minimum 10 characters";
    } else if (form.work_description.length > 2000) {
      e.work_description = "Maximum 2000 characters";
    }
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  // ── Submit ────────────────────────────────────────────────────────────────
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;
    setSubmitting(true);
    setServerMsg(null);
    try {
      await axios.post(
        `${API_URL}/employees/timesheets`,
        {
          date:             form.date,
          project_id:       form.project_id,
          task_id:          form.task_id || undefined,
          hours_worked:     Number(form.hours_worked),
          work_description: form.work_description.trim(),
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setServerMsg({ type: "success", text: "Timesheet submitted successfully!" });
      onSuccess?.();
      onRefresh?.();
      // Auto-close after brief success flash
      setTimeout(() => { onClose(); }, 1200);
    } catch (err) {
      const msg = err.response?.data?.message || "Failed to submit timesheet";
      setServerMsg({ type: "error", text: msg });
    } finally {
      setSubmitting(false);
    }
  };

  const handleClose = () => {
    if (submitting) return;
    onClose();
  };

  const descLen = form.work_description.length;

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-3 sm:p-4 bg-slate-900/60 backdrop-blur-sm">
      {/* Backdrop click */}
      <div className="absolute inset-0" onClick={handleClose} />

      <div className="relative bg-white w-full max-w-lg rounded-2xl shadow-2xl max-h-[90vh] sm:max-h-[95vh] flex flex-col overflow-hidden">

        {/* ── Header ── */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 shrink-0">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-indigo-100 text-indigo-600 rounded-xl">
              <RiTimeLine size={20} />
            </div>
            <div>
              <h3 className="font-black text-slate-800 text-base leading-tight">Log Time</h3>
              {selectedTask ? (
                <p className="text-xs text-indigo-500 font-semibold mt-0.5 truncate max-w-[260px]">
                  {selectedTask.task_title}
                </p>
              ) : (
                <p className="text-xs text-slate-400 mt-0.5">Record your work hours</p>
              )}
            </div>
          </div>
          <button
            onClick={handleClose}
            disabled={submitting}
            className="p-2 text-slate-400 hover:text-rose-500 rounded-xl hover:bg-slate-100 transition-all disabled:opacity-40"
          >
            <RiCloseLine size={20} />
          </button>
        </div>

        {/* ── Body ── */}
        <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto">
          <div className="p-6 space-y-5">

            {/* Server message */}
            {serverMsg && (
              <div className={`flex items-start gap-3 px-4 py-3 rounded-xl text-sm font-medium border ${
                serverMsg.type === "success"
                  ? "bg-emerald-50 border-emerald-200 text-emerald-700"
                  : "bg-red-50 border-red-200 text-red-700"
              }`}>
                {serverMsg.type === "success"
                  ? <RiCheckLine size={16} className="shrink-0 mt-0.5" />
                  : <RiAlertLine size={16} className="shrink-0 mt-0.5" />}
                {serverMsg.text}
              </div>
            )}

            {/* Date */}
            <Field label="Date" required error={errors.date}>
              <div className="relative">
                <RiCalendarLine className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" size={16} />
                <input
                  type="date"
                  value={form.date}
                  max={today}
                  onChange={(e) => set("date", e.target.value)}
                  className={`${inputCls(errors.date)} pl-11`}
                />
              </div>
            </Field>

            {/* Project */}
            <Field label="Project" required error={errors.project_id}>
              <div className="relative">
                <RiFolderLine className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" size={16} />
                <select
                  value={form.project_id}
                  onChange={(e) => set("project_id", e.target.value)}
                  className={`${inputCls(errors.project_id)} pl-11 appearance-none`}
                >
                  <option value="">— Select Project —</option>
                  {projects.map((p) => (
                    <option key={p._id} value={p._id}>{p.name}</option>
                  ))}
                </select>
              </div>
              {projects.length === 0 && (
                <p className="flex items-center gap-1 text-xs text-amber-600">
                  <RiInformationLine size={12} />
                  No projects assigned to you yet
                </p>
              )}
            </Field>

            {/* Task (optional, filtered by project) */}
            <Field
              label="Task"
              hint={form.project_id && filteredTasks.length === 0 ? "No tasks found for this project" : "Optional — link to a specific task"}
            >
              <div className="relative">
                <RiTaskLine className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" size={16} />
                <select
                  value={form.task_id}
                  onChange={(e) => set("task_id", e.target.value)}
                  disabled={!form.project_id}
                  className={`${inputCls(false)} pl-11 appearance-none disabled:opacity-50 disabled:cursor-not-allowed`}
                >
                  <option value="">— No specific task —</option>
                  {filteredTasks.map((t) => (
                    <option key={t._id} value={t._id}>{t.task_title}</option>
                  ))}
                </select>
              </div>
            </Field>

            {/* Hours Worked */}
            <Field label="Hours Worked" required error={errors.hours_worked} hint="Enter hours in decimal (e.g. 7.5 = 7h 30m)">
              <div className="space-y-2">
                <input
                  type="number"
                  min="0.5"
                  max="24"
                  step="0.5"
                  placeholder="e.g. 7.5"
                  value={form.hours_worked}
                  onChange={(e) => set("hours_worked", e.target.value)}
                  className={inputCls(errors.hours_worked)}
                />
                {/* Quick presets */}
                <div className="flex flex-wrap gap-1.5">
                  {HOUR_PRESETS.map((h) => (
                    <button
                      key={h}
                      type="button"
                      onClick={() => set("hours_worked", String(h))}
                      className={`px-2.5 py-1 rounded-lg text-xs font-bold border transition-all ${
                        Number(form.hours_worked) === h
                          ? "bg-indigo-600 text-white border-indigo-600 shadow-sm"
                          : "bg-white text-slate-600 border-slate-200 hover:border-indigo-300 hover:text-indigo-600"
                      }`}
                    >
                      {h}h
                    </button>
                  ))}
                </div>
              </div>
            </Field>

            {/* Work Description */}
            <Field label="Work Done" required error={errors.work_description}>
              <textarea
                rows={4}
                placeholder="Describe what you accomplished... (min 10 characters)"
                value={form.work_description}
                onChange={(e) => set("work_description", e.target.value)}
                maxLength={2000}
                className={`${inputCls(errors.work_description)} resize-none`}
              />
              <div className="flex items-center justify-between">
                <span className={`text-xs font-medium ${descLen < 10 && descLen > 0 ? "text-red-500" : descLen > 1800 ? "text-amber-500" : "text-slate-400"}`}>
                  {descLen < 10 && descLen > 0 ? `${10 - descLen} more chars needed` : ""}
                </span>
                <span className={`text-xs font-medium ${descLen > 1800 ? "text-amber-500" : "text-slate-400"}`}>
                  {descLen}/2000
                </span>
              </div>
            </Field>

          </div>

          {/* ── Footer ── */}
          <div className="px-6 pb-6 flex gap-3 shrink-0">
            <button
              type="button"
              onClick={handleClose}
              disabled={submitting}
              className="flex-1 py-3 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-xl text-sm transition-all disabled:opacity-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={submitting || serverMsg?.type === "success"}
              className="flex-1 py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-xl text-sm shadow-md transition-all disabled:opacity-50 flex items-center justify-center gap-2"
            >
              {submitting ? (
                <><RiLoader4Line className="animate-spin" size={16} /> Submitting...</>
              ) : serverMsg?.type === "success" ? (
                <><RiCheckLine size={16} /> Submitted!</>
              ) : (
                <><RiTimeLine size={16} /> Submit Timesheet</>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default TimesheetSubmitModal;
