import React from "react";
import { useFormik } from "formik";
import { timesheetApprovalSchema } from "../../schemas/timesheetValidation";
import { useAuth } from "../../contexts/AuthContext";
import axios from "axios";
import { RiCloseLine, RiLoader4Line, RiCheckLine, RiCloseCircleLine } from "react-icons/ri";

const TimesheetApprovalModal = ({ open, timesheet, onClose, onRefresh }) => {
  const { token } = useAuth();

  const formik = useFormik({
    initialValues: {
      status: "Approved",
      rejection_reason: "",
    },
    validationSchema: timesheetApprovalSchema,
    onSubmit: async (values) => {
      try {
        await axios.put(`http://localhost:5000/api/admin/timesheets/${timesheet._id}`, values, {
          headers: { Authorization: `Bearer ${token}` }
        });
        onRefresh();
        onClose();
      } catch (error) {
        alert(error.response?.data?.message || "Approval failed");
      }
    },
  });

  if (!open || !timesheet) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm" onClick={onClose} />
      <div className="relative bg-white w-full max-w-md rounded-[2rem] shadow-2xl">
        <div className="p-6 border-b border-slate-100 flex items-center justify-between">
          <h3 className="font-black text-slate-800 text-lg">Review Timesheet</h3>
          <button onClick={onClose} className="p-2 text-slate-400 hover:text-rose-500 rounded-xl hover:bg-slate-100">
            <RiCloseLine />
          </button>
        </div>

        <div className="p-6 space-y-4">
          <div className="bg-slate-50 p-4 rounded-xl">
            <p className="text-sm text-slate-600 mb-2"><strong>Employee:</strong> {timesheet.employee_id?.name}</p>
            <p className="text-sm text-slate-600 mb-2"><strong>Date:</strong> {new Date(timesheet.date).toLocaleDateString()}</p>
            <p className="text-sm text-slate-600 mb-2"><strong>Hours:</strong> {timesheet.hours_worked}h</p>
            <p className="text-sm text-slate-600"><strong>Work:</strong> {timesheet.work_description}</p>
          </div>

          <form onSubmit={formik.handleSubmit} className="space-y-4 relative">

            <fieldset disabled={formik.isSubmitting} className="space-y-4">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1">Action</label>
              <div className="flex gap-2">
                <label className="flex items-center gap-2 p-3 border rounded-xl flex-1 cursor-pointer hover:bg-emerald-50 border-emerald-200">
                  <input
                    type="radio"
                    name="status"
                    value="Approved"
                    onChange={formik.handleChange}
                    className="text-emerald-600"
                  />
                  <RiCheckLine className="text-emerald-600" />
                  <span className="font-bold text-emerald-800">Approve</span>
                </label>
                <label className="flex items-center gap-2 p-3 border rounded-xl flex-1 cursor-pointer hover:bg-red-50 border-red-200">
                  <input
                    type="radio"
                    name="status"
                    value="Rejected"
                    onChange={formik.handleChange}
                    className="text-red-600"
                  />
                  <RiCloseCircleLine className="text-red-600" />
                  <span className="font-bold text-red-800">Reject</span>
                </label>
              </div>
            </div>

            {formik.values.status === "Rejected" && (
              <div className="space-y-1">
                <label className="text-xs font-bold uppercase tracking-wider text-slate-500 ml-1">Rejection Reason *</label>
                <textarea
                  {...formik.getFieldProps("rejection_reason")}
                  rows="3"
                  className={`w-full p-3 border rounded-xl text-sm focus:ring-2 resize-vertical transition-all ${
                    formik.touched.rejection_reason && formik.errors.rejection_reason 
                      ? "border-red-300 focus:border-red-400" 
                      : "border-slate-200 focus:border-slate-400"
                  }`}
                  placeholder="Explain why this timesheet is rejected..."
                />
                {formik.touched.rejection_reason && formik.errors.rejection_reason && (
                  <p className="text-red-500 text-xs">{formik.errors.rejection_reason}</p>
                )}
              </div>
            )}

            <button 
              type="submit" 
              disabled={formik.isSubmitting}
              className="w-full py-3 bg-gradient-to-r from-slate-600 to-slate-700 text-white font-bold rounded-xl flex items-center justify-center gap-2 hover:from-slate-700 hover:to-slate-800 shadow-lg transition-all disabled:opacity-50"
            >
              {formik.isSubmitting ? <RiLoader4Line className="animate-spin" size={18} /> : "Confirm Action"}
            </button>
          </fieldset>
          </form>
        </div>
      </div>
    </div>
  );
};

export default TimesheetApprovalModal;
