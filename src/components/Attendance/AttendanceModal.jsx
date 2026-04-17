import React, { useState, useEffect } from "react";
import { useFormik } from "formik";
import { attendanceValidationSchema } from "../../schemas/attendanceValidation";
import axios from 'axios';
import { useAuth } from "../../contexts/AuthContext";
import { RiCloseLine, RiTimeLine, RiMapPinLine, RiCheckLine, RiUserLine, RiCalendarLine, RiAlertLine } from "react-icons/ri";
import API_URL from "../../config/api";

const AttendanceModal = ({ onClose, onRefresh, editData }) => {
  const { token } = useAuth();
  const [employees, setEmployees] = useState([]);
  const [employeesLoading, setEmployeesLoading] = useState(true);
  const [submitError, setSubmitError] = useState("");
  const isEdit = !!editData;

  useEffect(() => {
    fetchEmployees();
  }, []);

  const fetchEmployees = async () => {
    try {
      const res = await axios.get(`${API_URL}/admin/active-employees?page=1&limit=1000`, {
        headers: { Authorization: `Bearer ${token}` }
      });

      if (res.data.success) {
        setEmployees(res.data.employees || res.data.records || []);
      }
    } catch (err) {
      console.error('Employees fetch error:', err);
    } finally {
      setEmployeesLoading(false);
    }
  };

  const formik = useFormik({
    initialValues: {
      date: editData?.date ? new Date(editData.date).toISOString().split('T')[0] : new Date().toISOString().split('T')[0],
      employee: editData?.employee?._id || '',
      status: editData?.status || 'Present',
      checkIn: editData?.checkIn || '',
      checkOut: editData?.checkOut || '',
      workMode: editData?.workMode || '',
      notes: editData?.notes || ''
    },
    validationSchema: attendanceValidationSchema,
    enableReinitialize: true,
    onSubmit: async (values) => {
      try {
        const attendanceData = {
          date: values.date,
          employeeId: values.employee,
          status: values.status,
          workMode: values.workMode,
          checkIn: values.checkIn,
          checkOut: values.checkOut,
          notes: values.notes
        };

        let res;
        if (isEdit) {
          res = await axios.put(`${API_URL}/admin/attendance/${editData._id}`, attendanceData, {
            headers: { Authorization: `Bearer ${token}` }
          });
        } else {
          res = await axios.post(`${API_URL}/admin/attendance/mark`, attendanceData, {
            headers: { Authorization: `Bearer ${token}` }
          });
        }

        if (res.data.success) {
          onRefresh();
          onClose();
        }
      } catch (err) {
        console.error('Attendance save error:', err);
        setSubmitError(err.response?.data?.message || (isEdit ? 'Update failed' : 'Failed to mark attendance'));
      }
    }
  });

  useEffect(() => {
    if (formik.values.status === 'Absent' || formik.values.status === 'Leave') {
      formik.setFieldValue('checkIn', '');
      formik.setFieldValue('checkOut', '');
      formik.setFieldValue('workMode', '');
    }
  }, [formik.values.status]);

  return (
    <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-[2px] flex items-center justify-center z-[100] p-4">
      <div className="bg-white w-full max-w-md rounded-2xl shadow-2xl p-8 transform transition-all">
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-xl font-bold text-slate-800">
            {isEdit ? 'Edit Attendance' : 'Mark Attendance'}
          </h3>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-600 p-1 -m-1 rounded-lg hover:bg-slate-100 transition">
            <RiCloseLine size={24} />
          </button>
        </div>

        <form onSubmit={formik.handleSubmit} className="space-y-5 relative">
          <fieldset disabled={formik.isSubmitting} className="space-y-5">

            {/* Submit error banner */}
            {submitError && (
              <div className="flex items-start gap-2 p-3 bg-red-50 border border-red-200 rounded-xl text-sm text-red-700 font-medium">
                <RiAlertLine size={16} className="shrink-0 mt-0.5" />
                <span>{submitError}</span>
              </div>
            )}
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-1.5 flex items-center gap-2">
                <RiCalendarLine size={16} />
                Date
              </label>
            <input
              type="date"
              name="date"
              value={formik.values.date}
              onChange={formik.handleChange}
              className="w-full border border-slate-200 rounded-xl px-4 py-3 text-sm font-bold outline-none focus:ring-2 focus:ring-blue-500/20"
            />
            {formik.touched.date && formik.errors.date && (
              <p className="mt-1 text-xs text-rose-600">{formik.errors.date}</p>
            )}
          </div>

          {isEdit && editData?.employee && (
            <div className="mb-6 p-4 bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 rounded-2xl shadow-sm">
              <label className="block text-sm font-semibold text-slate-700 mb-2 flex items-center gap-2">
                <RiUserLine size={16} />
                Employee Name (Cannot Change)
              </label>
              <div className="text-lg font-bold text-slate-900">{editData.employee.name}</div>
              <div className="text-sm text-slate-500">{editData.employee.department || 'N/A'} - {editData.employee.designation || 'N/A'}</div>
            </div>
          )}
          {!isEdit && (
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-1.5 flex items-center gap-2">
                <RiUserLine size={16} />
                Employee
              </label>
              <select 
                name="employee"
                value={formik.values.employee}
                onChange={formik.handleChange}
                disabled={employeesLoading}
                className="w-full border border-slate-200 rounded-xl px-4 py-3 text-sm font-bold outline-none focus:ring-2 focus:ring-blue-500/20 disabled:bg-slate-50"
              >
                <option value="">Select Employee</option>
                {employees.map(emp => (
                  <option key={emp._id} value={emp._id}>
                    {emp.name} ({emp.department} - {emp.designation})
                  </option>
                ))}
              </select>
              {formik.touched.employee && formik.errors.employee && (
                <p className="mt-1 text-xs text-rose-600">{formik.errors.employee}</p>
              )}
            </div>
          )}

          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-1.5">Status</label>
            <select 
              name="status"
              value={formik.values.status}
              onChange={formik.handleChange}
              className="w-full border border-slate-200 rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-blue-500/20 bg-white"
            >
              <option value="Present">Present</option>
              <option value="Absent">Absent</option>
              <option value="Late">Late</option>
              <option value="Leave">On Leave</option>
              <option value="Half Day">Half Day</option>
            </select>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1 flex items-center gap-1">
                <RiTimeLine size={12} /> Check In
              </label>
              <input
                type="time"
                name="checkIn"
                value={formik.values.checkIn}
                onChange={formik.handleChange}
                disabled={formik.values.status === 'Absent' || formik.values.status === 'Leave'}
                className={`w-full border rounded-lg px-3 py-2 text-sm focus:border-blue-500 ${(formik.values.status === 'Absent' || formik.values.status === 'Leave') ? 'bg-slate-100 cursor-not-allowed' : 'border-slate-200'}`}
              />
              {formik.touched.checkIn && formik.errors.checkIn && (
                <p className="mt-1 text-xs text-rose-600">{formik.errors.checkIn}</p>
              )}

            </div>
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1 flex items-center gap-1">
                <RiTimeLine size={12} /> Check Out
              </label>
              <input
                type="time"
                name="checkOut"
                value={formik.values.checkOut}
                onChange={formik.handleChange}
                disabled={formik.values.status === 'Absent' || formik.values.status === 'Leave'}
                className={`w-full border rounded-lg px-3 py-2 text-sm focus:border-blue-500 ${(formik.values.status === 'Absent' || formik.values.status === 'Leave') ? 'bg-slate-100 cursor-not-allowed' : 'border-slate-200'}`}
              />
              {formik.touched.checkOut && formik.errors.checkOut && (
                <p className="mt-1 text-xs text-rose-600">{formik.errors.checkOut}</p>
              )}

            </div>
          </div>

          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-1.5 flex items-center gap-2">
              <RiMapPinLine size={16} />
              Work Mode
            </label>
            <select 
              name="workMode"
              value={formik.values.workMode}
              onChange={formik.handleChange}
              disabled={formik.values.status === 'Absent' || formik.values.status === 'Leave'}
              className={`w-full border rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-blue-500/20 ${(formik.values.status === 'Absent' || formik.values.status === 'Leave') ? 'bg-slate-100 cursor-not-allowed border-slate-200' : 'border-slate-200 bg-white'}`}
            >
              <option value="">-- Select Work Mode --</option>
              <option value="Office">Office</option>
              <option value="WFH">WFH</option>
              <option value="Remote">Remote</option>
              <option value="Offline">Offline</option>
            </select>
            {formik.touched.workMode && formik.errors.workMode && (
              <p className="mt-1 text-xs text-rose-600">{formik.errors.workMode}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-1.5">Notes (Optional)</label>
            <textarea
              name="notes"
              value={formik.values.notes}
              onChange={formik.handleChange}
              rows={2}
              className="w-full border border-slate-200 rounded-xl px-4 py-3 resize-none outline-none focus:ring-2 focus:ring-blue-500/20"
              placeholder="Any special notes..."
            />
          </div>

          <div className="flex gap-3 mt-8 pt-6 border-t border-slate-100">
            <button 
              type="button"
              onClick={onClose}
              disabled={formik.isSubmitting}
              className="flex-1 px-6 py-3 rounded-xl border border-slate-200 font-semibold text-slate-600 hover:bg-slate-50 transition-all disabled:opacity-50"
            >
              Cancel
            </button>
            <button 
              type="submit" 
              disabled={formik.isSubmitting || (!isEdit && employeesLoading)}
              className="flex-1 px-6 py-3 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold shadow-md transition-all disabled:opacity-50 flex items-center justify-center gap-2"
            >
              {formik.isSubmitting ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                  {isEdit ? 'Updating...' : 'Saving...'}
                </>
              ) : (
                <>
                  <RiCheckLine size={18} />
                  {isEdit ? 'Update Record' : 'Save Record'}
                </>
              )}
            </button>
          </div>
        </fieldset>
        </form>
      </div>
    </div>
  );
};

export default AttendanceModal;

