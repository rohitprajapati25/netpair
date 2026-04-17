import React, { useState } from "react";
import { useFormik } from "formik";
import { timesheetApprovalSchema } from "../../schemas/timesheetValidation";
import { useAuth } from "../../contexts/AuthContext";
import axios from "axios";
import { RiCloseLine, RiLoader4Line, RiCheckLine, RiCloseCircleLine, RiAlertLine } from "react-icons/ri";
import API_URL from "../../config/api";

const TimesheetApprovalModal = ({ open, timesheet, onClose, onRefresh }) => {
  const { token } = useAuth();
  const [serverError, setServerError] = useState("");

  const handleClose = () => {
    if (formik.isSubmitting) return;
    onClose();
  };

  const formik = useFormik({
    initialValues: {
      status: "Approved",
      rejection_reason: "",
    },
    validationSchema: timesheetApprovalSchema,
    onSubmit: async (values) => {
      setServerError("");
      try {
        await axios.put(`${API_URL}/admin/timesheets/${timesheet._id}`, values, {
          headers: { Authorization: `Bearer ${token}` }
        });
        onRefresh();
        onClose();
      } catch (error) {
        setServerError(error.response?.data?.message || "Approval failed. Please try again.");
      }
    },
  });

  if (!open || !timesheet) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-3 sm:p-4 bg-slate-900/60 backdrop-blur-sm">
      <div className="absolute inset-0" onClick={handleClose} />
      <div className="relative bg-white w-full max-w-md rounded-2xl shadow-2xl flex flex-col max-h-[90vh] sm:max-h-[95vh] overflow-hidden">

        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 shrink-0">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-emerald-100 text-emerald-600 rounded-xl">
              <RiCheckLine size={20} />
            </div>
            <div>
              <h3 className="font-black text-slate-800 text-base leading-tight">Review Timesheet</h3>
              <p className="text-xs text-slate-400 mt-0.5">Approve or reject submission</p>
            </div>
          </div>
          <button onClick={handleClose} disabled={formik.isSubmitting} className="p-2 text-slate-400 hover:text-rose-500 rounded-xl hover:bg-slate-100 transition-all disabled:opacity-40">
            <RiCloseLine size={20} />
          </button>
        </div>

        {/* Body + Footer */}
        <form onSubmit={formik.handleSubmit} className="flex-1 flex flex-col overflow-hidden">
          <div className="flex-1 overflow-y-auto p-4 sm:p-5 space-y-4">

            {/* Timesheet summary */}
            <div className="bg-slate-50 p-4 rounded-xl">
              <p className="text-sm text-slate-600 mb-2"><strong>Employee:</strong> {timesheet.employee_id?.name}</p>
              <p className="text-sm text-slate-600 mb-2"><strong>Date:</strong> {new Date(timesheet.date).toLocaleDateString()}</p>
              <p className="text-sm text-slate-600 mb-2"><strong>Hours:</strong> {timesheet.hours_worked}h</p>
              <p className="text-sm text-slate-600"><strong>Work:</strong> {timesheet.work_description}</p>
            </div>

            {/* Server error */}
            {serverError && (
              <div className="flex items-start gap-2 p-3 bg-red-50 border border-red-200 rounded-xl text-sm text-red-700 font-medium">
                <RiAlertLine size={16} className="shrink-0 mt-0.5" />
                <span>{serverError}</span>
              </div>
            )}

            <fieldset disabled={formik.isSubmitting} className="space-y-4">
              <div>
                <label className="block text-[10px] font-black uppercase tracking-widest text-slate-500 mb-2">Action</label>
                <div className="flex gap-2">
                  <label className="flex items-center gap-2 p-3 border-2 rounded-xl flex-1 cursor-pointer hover:bg-emerald-50 border-emerald-200">
                    <input
                      type="radio"
                      name="status"
                      value="Approved"
                      checked={formik.values.status === "Approved"}
                      onChange={formik.handleChange}
                      className="text-emerald-600"
                    />
                    <RiCheckLine className="text-emerald-600" />
                    <span className="font-bold text-emerald-800 text-sm">Approve</span>
                  </label>
                  <label className="flex items-center gap-2 p-3 border-2 rounded-xl flex-1 cursor-pointer hover:bg-red-50 border-red-200">
                    <input
                      type="radio"
                      name="status"
                      value="Rejected"
                      checked={formik.values.status === "Rejected"}
                      onChange={formik.handleChange}
                      className="text-red-600"
                    />
                    <RiCloseCircleLine className="text-red-600" />
                    <span className="font-bold text-red-800 text-sm">Reject</span>
                  </label>
                </div>
              </div>

              {formik.values.status === "Rejected" && (
                <div className="space-y-1.5">
                  <label className="text-[10px] font-black uppercase tracking-widest text-slate-500">Rejection Reason *</label>
                  <textarea
                    {...formik.getFieldProps("rejection_reason")}
                    rows="3"
                    className={`w-full px-4 py-3 border-2 rounded-xl text-sm font-medium outline-none transition-all bg-slate-50 focus:bg-white resize-vertical ${
                      formik.touched.rejection_reason && formik.errors.rejection_reason
                        ? "border-red-300 focus:border-red-400 focus:ring-2 focus:ring-red-100"
                        : "border-slate-100 focus:border-blue-400 focus:ring-2 focus:ring-blue-100"
                    }`}
                    placeholder="Explain why this timesheet is rejected..."
                  />
                  {formik.touched.rejection_reason && formik.errors.rejection_reason && (
                    <p className="flex items-center gap-1 text-red-500 text-xs font-medium">
                      <RiAlertLine size={11} className="shrink-0" />{formik.errors.rejection_reason}
                    </p>
                  )}
                </div>
              )}
            </fieldset>
          </div>

          {/* Footer — sticky, outside scroll */}
          <div className="px-4 sm:px-6 pb-4 sm:pb-5 pt-3 border-t border-slate-100 flex gap-3 shrink-0">
            <button
              type="button"
              onClick={handleClose}
              disabled={formik.isSubmitting}
              className="flex-1 py-3 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-xl text-sm transition-all disabled:opacity-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={formik.isSubmitting}
              className="flex-1 py-3 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl text-sm shadow-md flex items-center justify-center gap-2 transition-all disabled:opacity-50"
            >
              {formik.isSubmitting ? <RiLoader4Line className="animate-spin" size={16} /> : "Confirm Action"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default TimesheetApprovalModal;
