import React from "react";
import { useFormik } from "formik";
import { Link } from "react-router-dom";
import { signUpSchema } from "../../schemas";

const initialValues = {
  email: "",
};

const Fform = () => {
  const {
    values,
    errors,
    touched,
    handleChange,
    handleBlur,
    handleSubmit,
  } = useFormik({
    initialValues,
    validationSchema: signUpSchema,
    onSubmit: (values, actions) => {
      console.log(values);
      alert("Reset link sent to your email");
      actions.resetForm();
    },
  });

  return (
    <div className="flex items-center justify-center pt-25.5 pb-35">
      <form
        onSubmit={handleSubmit}
        className="bg-white p-2 rounded-xl w-full max-w-sm space-y-4"
      >
        <a href="/forgot"><h2 className="text-xl font-semibold text-center">
          Forgot Password
        </h2></a>

        <div>
          <label className="block mb-1">Email</label>
          <input
            type="text"
            name="email" 
            value={values.email}
            onChange={handleChange}
            onBlur={handleBlur}
            placeholder="Enter Your Email"

            className="w-full border rounded px-3 py-2"
          />

          {errors.email && touched.email && (
            <p className="text-red-500 text-sm">{errors.email}</p>
          )}
        </div>

        <button
          type="submit"
          className="w-full bg-blue-800 text-white py-2 rounded"
        >
          Submit
        </button>

        <p className="text-center text-sm">
          <Link to="/" className="text-blue-600 underline">
            Back to Login
          </Link>
        </p>
      </form>
    </div>
  );
};

export default Fform;
