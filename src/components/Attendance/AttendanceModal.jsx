import React, { useState, useEffect } from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import axios from 'axios';
import { useAuth } from "../../contexts/AuthContext";
import { RiCloseLine, RiTimeLine, RiMapPinLine, RiCheckLine, RiUserLine } from "react-icons/ri";

const AttendanceModal = ({ onClose, onRefresh, editData }) => {
  const { token } = useAuth();
  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(false);
  const [employeesLoading, setEmployeesLoading] = useState(true);
  const isEdit = !!editData;

  useEffect(() => {
    fetchEmployees();
  }, []);

  const fetchEmployees = async () => {
    try {
      const res = await axios.get('http://localhost:5000/api/admin/employees?page=1&limit=100', {
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
      employee: editData?.employee?._id || '',
      status: editData?.status || 'Present',
      checkIn: editData?.checkIn || '',
      checkOut: editData?.checkOut || '',
      workMode: editData?.workMode || 'Office',
      notes: editData?.notes || ''
    },
    validationSchema: Yup.object({
      employee: Yup.string().required('Employee required'),
      status: Yup.string().required('Status required')
    }),
    enableReinitialize: true, // Reset form when editData changes
    onSubmit: async (values) => {
      try {
        setLoading(true);
        const attendanceData = {
          employeeId: values.employee, // ✅ Backend expects 'employeeId'
          status: values.status,
          workMode: values.workMode,
          checkIn: values.checkIn,
          checkOut: values.checkOut,
          notes: values.notes
        };

        let res;
        if (isEdit) {
          // Edit existing
          res = await axios.put(`http://localhost:5000/api/admin/attendance/${editData._id}`, attendanceData, {
            headers: { Authorization: `Bearer ${token}` }
          });
        } else {
          // New attendance
          res = await axios.post('http://localhost:5000/api/admin/attendance/mark', attendanceData, {
            headers: { Authorization: `Bearer ${token}` }
          });
        }

        if (res.data.success) {
          onRefresh(); // Refresh parent table
          onClose();
        }
      } catch (err) {
        console.error('Attendance save error:', err);
        alert(err.response?.data?.message || (isEdit ? 'Update failed' : 'Mark failed'));
      } finally {
        setLoading(false);
      }
    }
  });

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

        <form onSubmit={formik.handleSubmit} className="space-y-5">
          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-1.5 flex items-center gap-2">
              <RiUserLine size={16} />
              Employee
            </label>
            <select 
              name="employee"
              value={formik.values.employee}
              onChange={formik.handleChange}
              disabled={employeesLoading || isEdit}
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
                className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm focus:border-blue-500"
              />
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
                className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm focus:border-blue-500"
              />
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
              className="w-full border border-slate-200 rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-blue-500/20 bg-white"
            >
              <option value="Office">Office</option>
              <option value="WFH">WFH</option>
              <option value="Remote">Remote</option>
              <option value="Offline">Offline</option>
            </select>
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
              disabled={loading}
              className="flex-1 px-6 py-3 rounded-xl border border-slate-200 font-semibold text-slate-700 hover:bg-slate-50 transition-all disabled:opacity-50"
            >
              Cancel
            </button>
            <button 
              type="submit" 
              disabled={loading || employeesLoading}
              className="flex-1 px-6 py-3 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-semibold shadow-lg hover:shadow-xl transition-all disabled:opacity-50 flex items-center justify-center gap-2"
            >
              {loading ? (
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
        </form>
      </div>
    </div>
  );
};

export default AttendanceModal;

