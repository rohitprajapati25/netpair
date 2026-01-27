
import React from "react";
import { useFormik } from "formik";
import { loginSchema } from "../../schemas";
import { useNavigate, Link } from "react-router-dom";

const initialValues = {
  email: "",
  password: "",
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
      console.log(values);
      alert("Login Successful");
      navigate("/dashboard");
      action.resetForm();
    },
  });


  return (
    <div>
      <form
        onSubmit={handleSubmit}
        className="bg-white p-8 rounded-lg w-full max-w-md"
      >
        
        <h2 className="text-3xl font-bold text-gray-800 mb-2">
          Login to your account
        </h2>
        <p className="text-gray-500 mb-6">
          Enter your account details below
        </p>

        <div className="mb-4">
          <label htmlFor="email" className="block font-medium mb-1">
            Email
          </label>
          <input
            id="email"
            type="email"
            name="email"
            value={values.email}
            onChange={handleChange}
            onBlur={handleBlur}
            placeholder="Enter your email"
            className="w-full h-10 border rounded px-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          {errors.email && touched.email && (
            <p className="text-red-600 text-sm mt-1">{errors.email}</p>
          )}
        </div>

        <div className="mb-4">
          <label htmlFor="password" className="block font-medium mb-1">
            Password
          </label>
          <input
            id="password"
            type="password"
            name="password"
            value={values.password}
            onChange={handleChange}
            onBlur={handleBlur}
            placeholder="Enter your password"
            className="w-full h-10 border rounded px-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          {errors.password && touched.password && (
            <p className="text-red-600 text-sm mt-1">{errors.password}</p>
          )}
        </div>

        <div className="flex items-center justify-between mb-6 text-sm">
          <label className="flex items-center gap-2">
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
