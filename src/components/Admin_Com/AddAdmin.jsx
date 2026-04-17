import React, { useState } from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";
import {
  RiUserSettingsLine, RiMailLine, RiPhoneLine,
  RiLockPasswordLine, RiBriefcaseLine, RiArrowLeftLine,
  RiEyeLine, RiEyeOffLine, RiCheckLine, RiLoader4Line,
} from "react-icons/ri";
import API_URL from "../../config/api";

const DEPARTMENTS = [
  "Development", "Design", "HR", "Finance & Accounts", "Sales",
  "Marketing", "Operations", "IT", "QA", "Admin", "Legal & Compliance",
];

const validationSchema = Yup.object({
  name:        Yup.string().trim().min(2, "Min 2 characters").required("Name is required"),
  email:       Yup.string().email("Invalid email").required("Email is required"),
  phone:       Yup.string().trim().min(7, "Min 7 digits").required("Phone is required"),
  department:  Yup.string().required("Select a department"),
  designation: Yup.string().trim().required("Designation is required"),
  joiningDate: Yup.string().required("Joining date is required"),
  password:    Yup.string().min(8, "Min 8 characters").required("Password is required"),
  confirm_pass: Yup.string()
    .oneOf([Yup.ref("password")], "Passwords don't match")
    .required("Confirm your password"),
});

const AddAdmin = ({ onClose, onRefresh }) => {
  const { token } = useAuth();
  const navigate  = useNavigate();
  const [showPwd, setShowPwd]       = useState(false);
  const [submitError, setSubmitError] = useState("");
  const [success, setSuccess]       = useState(false);

  const formik = useFormik({
    initialValues: {
      name: "", email: "", phone: "",
      department: "", designation: "",
      joiningDate: "", employmentType: "Full Time",
      password: "", confirm_pass: "",
      status: "inactive",
    },
    validationSchema,
    onSubmit: async (values) => {
      setSubmitError("");
      try {
        const { confirm_pass, ...payload } = values;
        const res = await axios.post(
          `${API_URL}/admin/admins`,
          { ...payload, role: "admin" },
          { headers: { Authorization: `Bearer ${token}` } }
        );
        if (res.data.success) {
          setSuccess(true);
          onRefresh?.();
          setTimeout(() => { onClose?.(); }, 1500);
        }
      } catch (err) {
        setSubmitError(err.response?.data?.message || "Failed to create admin. Please try again.");
      }
    },
  });

  // helpers
  const err = (name) => formik.touched[name] && formik.errors[name];
  const inputCls = (name) =>
    `w-full h-11 px-4 border rounded-xl outline-none transition-all text-sm font-medium
    ${err(name) ? "border-red-400 bg-red-50" : "border-slate-200 bg-slate-50 focus:bg-white focus:border-blue-500"}`;

  return (
    <div className="w-full">
      {/* Header */}
      <div className="flex items-center justify-between mb-5 pb-3 border-b border-slate-100">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-indigo-100 text-indigo-600 rounded-xl flex items-center justify-center">
            <RiUserSettingsLine size={16} />
          </div>
          <h3 className="text-sm font-black text-slate-700 uppercase tracking-widest">Add New Admin</h3>
        </div>
        {onClose && (
          <button
            type="button"
            onClick={onClose}
            className="text-blue-600 text-xs font-bold flex items-center gap-1 hover:underline"
          >
            <RiArrowLeftLine size={13} /> Back
          </button>
        )}
      </div>

      {/* Success */}
      {success && (
        <div className="mb-4 p-3 bg-emerald-50 border border-emerald-200 text-emerald-700 rounded-xl text-sm font-bold flex items-center gap-2">
          <RiCheckLine size={16} /> Admin created successfully!
        </div>
      )}

      {/* Error */}
      {submitError && (
        <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-600 rounded-xl text-xs font-bold">
          {submitError}
        </div>
      )}

      <form
        onSubmit={formik.handleSubmit}
        className="space-y-4 max-h-[480px] overflow-y-auto pr-1 custom-scrollbar"
      >
        {/* Name */}
        <div>
          <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Full Name *</label>
          <div className="relative mt-1">
            <RiUserSettingsLine className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={15} />
            <input
              type="text"
              placeholder="John Doe"
              {...formik.getFieldProps("name")}
              className={`${inputCls("name")} pl-9`}
            />
          </div>
          {err("name") && <p className="text-red-500 text-[10px] font-bold mt-1 ml-1">{formik.errors.name}</p>}
        </div>

        {/* Email + Phone */}
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Email *</label>
            <div className="relative mt-1">
              <RiMailLine className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={15} />
              <input
                type="email"
                placeholder="admin@company.com"
                {...formik.getFieldProps("email")}
                className={`${inputCls("email")} pl-9`}
              />
            </div>
            {err("email") && <p className="text-red-500 text-[10px] font-bold mt-1 ml-1">{formik.errors.email}</p>}
          </div>
          <div>
            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Phone *</label>
            <div className="relative mt-1">
              <RiPhoneLine className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={15} />
              <input
                type="tel"
                placeholder="9876543210"
                {...formik.getFieldProps("phone")}
                className={`${inputCls("phone")} pl-9`}
              />
            </div>
            {err("phone") && <p className="text-red-500 text-[10px] font-bold mt-1 ml-1">{formik.errors.phone}</p>}
          </div>
        </div>

        {/* Department + Designation */}
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Department *</label>
            <select {...formik.getFieldProps("department")} className={`${inputCls("department")} mt-1`}>
              <option value="">Select</option>
              {DEPARTMENTS.map((d) => <option key={d} value={d}>{d}</option>)}
            </select>
            {err("department") && <p className="text-red-500 text-[10px] font-bold mt-1 ml-1">{formik.errors.department}</p>}
          </div>
          <div>
            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Designation *</label>
            <div className="relative mt-1">
              <RiBriefcaseLine className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={15} />
              <input
                type="text"
                placeholder="e.g. Manager"
                {...formik.getFieldProps("designation")}
                className={`${inputCls("designation")} pl-9`}
              />
            </div>
            {err("designation") && <p className="text-red-500 text-[10px] font-bold mt-1 ml-1">{formik.errors.designation}</p>}
          </div>
        </div>

        {/* Joining Date + Employment Type */}
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Joining Date *</label>
            <input
              type="date"
              {...formik.getFieldProps("joiningDate")}
              className={`${inputCls("joiningDate")} mt-1`}
            />
            {err("joiningDate") && <p className="text-red-500 text-[10px] font-bold mt-1 ml-1">{formik.errors.joiningDate}</p>}
          </div>
          <div>
            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Employment Type</label>
            <select {...formik.getFieldProps("employmentType")} className={`${inputCls("employmentType")} mt-1`}>
              <option value="Full Time">Full Time</option>
              <option value="Part Time">Part Time</option>
              <option value="Contract">Contract</option>
            </select>
          </div>
        </div>

        {/* Password */}
        <div className="grid grid-cols-2 gap-3 pt-2 border-t border-slate-100">
          <div>
            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Password *</label>
            <div className="relative mt-1">
              <RiLockPasswordLine className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={15} />
              <input
                type={showPwd ? "text" : "password"}
                placeholder="Min 8 chars"
                {...formik.getFieldProps("password")}
                className={`${inputCls("password")} pl-9 pr-9`}
              />
              <button
                type="button"
                onClick={() => setShowPwd((v) => !v)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
              >
                {showPwd ? <RiEyeOffLine size={15} /> : <RiEyeLine size={15} />}
              </button>
            </div>
            {err("password") && <p className="text-red-500 text-[10px] font-bold mt-1 ml-1">{formik.errors.password}</p>}
          </div>
          <div>
            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Confirm Password *</label>
            <div className="relative mt-1">
              <RiLockPasswordLine className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={15} />
              <input
                type={showPwd ? "text" : "password"}
                placeholder="Re-enter"
                {...formik.getFieldProps("confirm_pass")}
                className={`${inputCls("confirm_pass")} pl-9`}
              />
            </div>
            {err("confirm_pass") && <p className="text-red-500 text-[10px] font-bold mt-1 ml-1">{formik.errors.confirm_pass}</p>}
          </div>
        </div>

        {/* Submit */}
        <button
          type="submit"
          disabled={formik.isSubmitting || success}
          className="w-full h-12 bg-blue-600 hover:bg-blue-700 disabled:bg-slate-300 text-white rounded-xl font-black shadow-md transition-all flex items-center justify-center gap-2 mt-2"
        >
          {formik.isSubmitting
            ? <><RiLoader4Line className="animate-spin" size={16} /> Creating...</>
            : success
            ? <><RiCheckLine size={16} /> Created!</>
            : "Create Admin"}
        </button>
      </form>
    </div>
  );
};

export default AddAdmin;
