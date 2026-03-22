// import React from "react";
// import { useFormik } from "formik";
// import axios from "axios";
// import { useNavigate } from "react-router-dom";
// import * as Yup from "yup";

// const LForm = () => {
//   const navigate = useNavigate();

//   const formik = useFormik({
//     initialValues: {
//       email: "",
//       password: "",
//     },

//     validationSchema: Yup.object({
//       email: Yup.string()
//         .email("Invalid email format")
//         .required("Email is required"),
//       password: Yup.string()
//         .min(6, "Minimum 6 characters")
//         .required("Password is required"),
//     }),

//     onSubmit: async (values, { setSubmitting, setErrors }) => {
//       try {
//         const res = await axios.post(
//           "http://localhost:5000/api/auth/login",
//           values
//         );

//         const { token, user } = res.data;

//         // ✅ Save token & user
//         localStorage.setItem("token", token);
//         localStorage.setItem("user", JSON.stringify(user));

//         // ✅ Role Based Redirect
//         if (user.role === "SuperAdmin") {
//           navigate("/dashboard");
//         } else if (user.role === "Admin") {
//           navigate("/dashboard");
//         } else if (user.role === "HR") {
//           navigate("/hr/dashboard");
//         } else {
//           navigate("/dashboard");
//         }
//       } catch (error) {
//         setErrors({
//           password: error.response?.data?.message || "Login Failed",
//         });
//       } finally {
//         setSubmitting(false);
//       }
//     },
//   });

//   return (
//     <div className="flex justify-center items-center w-full py-10 bg-gray-50">
//       <form
//         onSubmit={formik.handleSubmit}
//         className="bg-white shadow-xl rounded-2xl p-8 w-full max-w-3xl space-y-6 border"
//       >
//         <h2 className="text-2xl font-bold border-b pb-3">Login Page</h2>

//         <div className="mb-4">
//           <input
//             type="email"
//             name="email"
//             placeholder="Enter Email"
//             onChange={formik.handleChange}
//             onBlur={formik.handleBlur}
//             value={formik.values.email}
//             className="w-full p-2 border rounded"
//           />
//           {formik.touched.email && formik.errors.email && (
//             <p className="text-red-500 text-sm mt-1">
//               {formik.errors.email}
//             </p>
//           )}
//         </div>

//         <div className="mb-6">
//           <input
//             type="password"
//             name="password"
//             placeholder="Enter Password"
//             onChange={formik.handleChange}
//             onBlur={formik.handleBlur}
//             value={formik.values.password}
//             className="w-full p-2 border rounded"
//           />
//           {formik.touched.password && formik.errors.password && (
//             <p className="text-red-500 text-sm mt-1">
//               {formik.errors.password}
//             </p>
//           )}
//         </div>

//         <button
//           type="submit"
//           disabled={formik.isSubmitting}
//           className="w-full bg-blue-600 text-white p-2 rounded hover:bg-blue-700"
//         >
//           {formik.isSubmitting ? "Logging in..." : "Login"}
//         </button>
//       </form>
//     </div>
//   );
// };

// export default LForm;

import React from "react";
import { useFormik } from "formik";
import { useAuth } from "../../contexts/AuthContext";
import { useNavigate } from "react-router-dom";
import * as Yup from "yup";

const LForm = () => {
  const { login } = useAuth(); // ✅ context use
  const navigate = useNavigate();

  const formik = useFormik({
    initialValues: {
      email: "",
      password: "",
    },

    validationSchema: Yup.object({
      email: Yup.string().email().required("Email required"),
      password: Yup.string().min(6).required("Password required"),
    }),

    onSubmit: async (values, { setSubmitting, setErrors }) => {
      const res = await login(values.email, values.password);

      if (!res.success) {
        setErrors({ password: res.error });
      }

      setSubmitting(false);
    },
  });

  return (
    <form
        onSubmit={formik.handleSubmit}
        className="bg-white shadow-xl rounded-2xl p-8 w-full max-w-3xl space-y-6 border"
      >
        <h2 className="text-2xl font-bold border-b pb-3">Login Page</h2>

        <div className="mb-4">
          <input
            type="email"
            name="email"
            placeholder="Enter Email"
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            value={formik.values.email}
            className="w-full p-2 border rounded"
          />
          {formik.touched.email && formik.errors.email && (
            <p className="text-red-500 text-sm mt-1">
              {formik.errors.email}
            </p>
          )}
        </div>

        <div className="mb-6">
          <input
            type="password"
            name="password"
            placeholder="Enter Password"
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            value={formik.values.password}
            className="w-full p-2 border rounded"
          />
          {formik.touched.password && formik.errors.password && (
            <p className="text-red-500 text-sm mt-1">
              {formik.errors.password}
            </p>
          )}
        </div>

        <button
          type="submit"
          disabled={formik.isSubmitting}
          className="w-full bg-blue-600 text-white p-2 rounded hover:bg-blue-700"
        >
          {formik.isSubmitting ? "Logging in..." : "Login"}
        </button>
      </form>
  );
};

export default LForm;