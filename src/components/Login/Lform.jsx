import React from "react";
import { useFormik } from "formik";
import { loginSchema } from "../../schemas";
import { useNavigate, Link } from "react-router-dom";

const initialValues = {
  email: "",
  password: "",
  role: "",
};

const Lform = () => {
  const navigate = useNavigate();

  const {
    values,
    errors,
    touched,
    handleBlur,
    handleChange,
    handleSubmit,
  } = useFormik({
    initialValues,
    validationSchema: loginSchema,
    onSubmit: (values, action) => {

      const userData = {
        email: values.email,
        role: values.role,
        token: "demo_jwt_token",
      };

      localStorage.setItem("user", JSON.stringify(userData));

      alert(`Login Successful as ${values.role}`);

      if (values.role === "Admin") {
        navigate("/dashboard");
      } 
      else if (values.role === "HR") {
        navigate("/employees");
      } 
      else {
        navigate("/attendance");
      }

      action.resetForm();
    },
  });

  return (
    <div>
      <form
        onSubmit={handleSubmit}
        className="bg-white p-8 rounded-lg w-full max-w-md shadow"
      >
        <h2 className="text-3xl font-bold text-gray-800 mb-2">
          Login to your account
        </h2>

        <p className="text-gray-500 mb-6">
          Enter your account details below
        </p>

        {/* EMAIL */}
        <div className="mb-4">
          <label className="block font-medium mb-1">Email</label>
          <input
            type="email"
            name="email"
            value={values.email}
            onChange={handleChange}
            onBlur={handleBlur}
            placeholder="Enter your email"
            className="w-full h-10 border rounded px-3 focus:ring-2 focus:ring-blue-500"
          />
          {errors.email && touched.email && (
            <p className="text-red-600 text-sm">{errors.email}</p>
          )}
        </div>

        {/* PASSWORD */}
        <div className="mb-4">
          <label className="block font-medium mb-1">Password</label>
          <input
            type="password"
            name="password"
            value={values.password}
            onChange={handleChange}
            onBlur={handleBlur}
            placeholder="Enter your password"
            className="w-full h-10 border rounded px-3 focus:ring-2 focus:ring-blue-500"
          />
          {errors.password && touched.password && (
            <p className="text-red-600 text-sm">{errors.password}</p>
          )}
        </div>

        {/* ROLE SELECT */}
        <div className="mb-4">
          <label className="block font-medium mb-1">Login As</label>
          <select
            name="role"
            value={values.role}
            onChange={handleChange}
            onBlur={handleBlur}
            className="w-full h-10 border rounded px-3 focus:ring-2 focus:ring-blue-500"
          >
            <option value="">Select Role</option>
            <option value="Admin">Admin</option>
            <option value="HR">HR</option>
            <option value="Employee">Employee</option>
          </select>

          {errors.role && touched.role && (
            <p className="text-red-600 text-sm">{errors.role}</p>
          )}
        </div>

        {/* REMEMBER */}
        <div className="flex justify-between mb-6 text-sm">
          <label className="flex gap-2">
            <input type="checkbox" className="accent-blue-700" />
            Remember me
          </label>

          <Link
            to="/forgot"
            className="text-blue-700 font-semibold hover:underline"
          >
            Forgot Password?
          </Link>
        </div>

        <button
          type="submit"
          className="w-full bg-blue-800 text-white py-2 rounded hover:bg-blue-600 transition"
        >
          Login
        </button>

        <p className="text-center mt-5 text-sm">
          Don’t have an account?{" "}
          <Link
            to="/registration"
            className="text-blue-700 font-bold hover:underline"
          >
            Sign Up
          </Link>
        </p>
      </form>
    </div>
  );
};

export default Lform;