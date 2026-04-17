import React, { useState } from "react";
import { useFormik } from "formik";
import { Link, useParams, useNavigate } from "react-router-dom";
import * as Yup from "yup";
import axios from "axios";
import { RiLockPasswordLine, RiArrowLeftLine, RiEyeLine, RiEyeOffLine, RiCheckLine } from "react-icons/ri";
import API_URL from "../../config/api";

const ResetPassword = () => {
  const { token } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const formik = useFormik({
    initialValues: {
      password: "",
      confirmPassword: "",
    },
    validationSchema: Yup.object({
      password: Yup.string()
        .min(8, "Password must be at least 8 characters")
        .required("Required"),
      confirmPassword: Yup.string()
        .oneOf([Yup.ref("password"), null], "Passwords must match")
        .required("Required"),
    }),
    onSubmit: async (values) => {
      setLoading(true);
      setError("");
      try {
        await axios.post(`${API_URL}/auth/reset-password/${token}`, {
          password: values.password,
        });
        setSuccess(true);
        setTimeout(() => navigate("/"), 2500);
      } catch (err) {
        setError(err.response?.data?.message || "Invalid or expired token.");
      } finally {
        setLoading(false);
      }
    },
  });

  return (
    <div className="w-full animate-fade-in">
      <div className="mb-6 sm:mb-8">
        <h2 className="text-2xl sm:text-3xl font-black text-slate-800">Set New Password</h2>
        <p className="text-slate-500 mt-1 sm:mt-2 font-medium text-sm sm:text-base">Please enter your new secure password below.</p>
      </div>

      {error && (
        <div className="mb-6 p-4 bg-red-50 border border-red-200 text-red-700 rounded-2xl text-sm font-bold animate-shake">
          {error}
        </div>
      )}

      {success && (
        <div className="mb-6 p-4 bg-emerald-50 border border-emerald-200 text-emerald-700 rounded-2xl text-sm font-bold flex items-center gap-2">
          <RiCheckLine size={18} /> Password reset successful! Redirecting to login...
        </div>
      )}

      <form onSubmit={formik.handleSubmit} className="space-y-4 sm:space-y-6">
        <div className="relative group">
          <RiLockPasswordLine className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-blue-600 transition-colors text-lg sm:text-xl" />
          <input
            type={showPassword ? "text" : "password"}
            name="password"
            placeholder="New Password"
            {...formik.getFieldProps("password")}
            className={`w-full h-11 sm:h-14 pl-11 sm:pl-12 pr-12 border rounded-xl sm:rounded-2xl outline-none transition-all text-sm ${
              formik.touched.password && formik.errors.password ? "border-red-500 bg-red-50" : "border-slate-200 focus:border-blue-600 focus:shadow-lg focus:shadow-blue-50"
            }`}
          />
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
          >
            {showPassword ? <RiEyeOffLine size={18} /> : <RiEyeLine size={18} />}
          </button>
          {formik.touched.password && formik.errors.password && (
            <p className="text-red-500 text-[11px] font-bold mt-1 ml-2 uppercase tracking-wider">{formik.errors.password}</p>
          )}
        </div>

        <div className="relative group">
          <RiLockPasswordLine className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-blue-600 transition-colors text-lg sm:text-xl" />
          <input
            type={showPassword ? "text" : "password"}
            name="confirmPassword"
            placeholder="Confirm New Password"
            {...formik.getFieldProps("confirmPassword")}
            className={`w-full h-11 sm:h-14 pl-11 sm:pl-12 pr-4 border rounded-xl sm:rounded-2xl outline-none transition-all text-sm ${
              formik.touched.confirmPassword && formik.errors.confirmPassword ? "border-red-500 bg-red-50" : "border-slate-200 focus:border-blue-600 focus:shadow-lg focus:shadow-blue-50"
            }`}
          />
          {formik.touched.confirmPassword && formik.errors.confirmPassword && (
            <p className="text-red-500 text-[11px] font-bold mt-1 ml-2 uppercase tracking-wider">{formik.errors.confirmPassword}</p>
          )}
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full h-11 sm:h-14 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-300 text-white rounded-xl sm:rounded-2xl font-black shadow-xl shadow-blue-100 transition-all flex items-center justify-center gap-2 text-sm sm:text-base"
        >
          {loading ? "Resetting..." : "Reset Password"}
        </button>

        <div className="text-center">
          <Link to="/" className="inline-flex items-center gap-2 text-sm font-bold text-slate-400 hover:text-blue-600 transition-colors">
            <RiArrowLeftLine /> Back to Login
          </Link>
        </div>
      </form>
    </div>
  );
};

export default ResetPassword;
