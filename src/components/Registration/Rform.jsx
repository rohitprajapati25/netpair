import React from "react";
import { useFormik } from "formik";
import { signUpSchema } from "../../schemas";
import { useNavigate, Link } from "react-router-dom";

const initialValues = {
  name: "",
  email: "",
  password: "",
  confirm_pass: "",
  agree: false,
};

const Rform = () => {
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
    validationSchema: signUpSchema,
    onSubmit: (values, action) => {
      console.log(values);
      alert("Registration Successful");
      navigate("/login");
      action.resetForm();
    },
  });

  return (
    <form onSubmit={handleSubmit} className="w-full space-y-4 p-8">

      <div>
        <h2 className="text-3xl font-bold text-gray-800">
          Create account
        </h2>
        <p className="text-gray-500">
          Enter your details
        </p>
      </div>

      <div>
        <label className="block font-medium mb-1">Name</label>
        <input
          type="text"
          name="name"
          value={values.name}
          onChange={handleChange}
          onBlur={handleBlur}
          placeholder="Enter your name"
          className="w-full h-10 border rounded px-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        {errors.name && touched.name && (
          <p className="text-red-600 text-sm">{errors.name}</p>
        )}
      </div>

      <div>
        <label className="block font-medium mb-1">Email</label>
        <input
          type="email"
          name="email"
          value={values.email}
          onChange={handleChange}
          onBlur={handleBlur}
          placeholder="Enter your email"
          className="w-full h-10 border rounded px-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        {errors.email && touched.email && (
          <p className="text-red-600 text-sm">{errors.email}</p>
        )}
      </div>

      <div>
        <label className="block font-medium mb-1">Password</label>
        <input
          type="password"
          name="password"
          value={values.password}
          onChange={handleChange}
          onBlur={handleBlur}
          placeholder="Enter password"
          className="w-full h-10 border rounded px-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        {errors.password && touched.password && (
          <p className="text-red-600 text-sm">{errors.password}</p>
        )}
      </div>

      <div>
        <label className="block font-medium mb-1">Confirm Password</label>
        <input
          type="password"
          name="confirm_pass"
          value={values.confirm_pass}
          onChange={handleChange}
          onBlur={handleBlur}
          placeholder="Confirm password"
          className="w-full h-10 border rounded px-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        {errors.confirm_pass && touched.confirm_pass && (
          <p className="text-red-600 text-sm">{errors.confirm_pass}</p>
        )}
      </div>

      <div>
        <label className="flex items-center gap-2 text-sm">
          <input
            type="checkbox"
            name="agree"
            checked={values.agree}
            onChange={handleChange}
            onBlur={handleBlur}
            className="accent-blue-700"
          />
          I agree to Terms & Conditions
        </label>
        {errors.agree && touched.agree && (
          <p className="text-red-600 text-sm">{errors.agree}</p>
        )}
      </div>

      <button
        type="submit"
        className="w-full bg-blue-800 text-white py-2 rounded hover:bg-blue-600 transition"
      >
        Sign Up
      </button>

      <p className="text-center text-sm">
        Already have an account?{" "}
        <Link to="/" className="text-blue-700 font-bold hover:underline">
          Login
        </Link>
      </p>
    </form>
  );
};

export default Rform;
