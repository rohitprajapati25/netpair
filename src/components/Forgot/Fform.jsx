// import React from "react";
// import { useFormik } from "formik";
// import { Link } from "react-router-dom";
// import { signUpSchema } from "../../schemas";

// const initialValues = {
//   email: "",
// };

// const Fform = () => {
//   const {
//     values,
//     errors,
//     touched,
//     handleChange,
//     handleBlur,
//     handleSubmit,
//   } = useFormik({
//     initialValues,
//     validationSchema: signUpSchema,
//     onSubmit: (values, actions) => {
//       console.log(values);
//       alert("Reset link sent to your email");
//       actions.resetForm();
//     },
//   });

//   return (
//     <div className="flex items-center justify-center pt-25.5 pb-35">
//       <form
//         onSubmit={handleSubmit}
//         className="bg-white p-2 rounded-xl w-full max-w-sm space-y-4"
//       >
//         <a href="/forgot"><h2 className="text-xl font-semibold text-center">
//           Forgot Password
//         </h2></a>

//         <div>
//           <label className="block mb-1">Email</label>
//           <input
//             type="text"
//             name="email" 
//             value={values.email}
//             onChange={handleChange}
//             onBlur={handleBlur}
//             placeholder="Enter Your Email"

//             className="w-full border rounded px-3 py-2"
//           />

//           {errors.email && touched.email && (
//             <p className="text-red-500 text-sm">{errors.email}</p>
//           )}
//         </div>

//         <button
//           type="submit"
//           className="w-full bg-blue-800 text-white py-2 rounded"
//         >
//           Submit
//         </button>

//         <p className="text-center text-sm">
//           <Link to="/" className="text-blue-600 underline">
//             Back to Login
//           </Link>
//         </p>
//       </form>
//     </div>
//   );
// };

// export default Fform;



import React, { useState } from "react";
import { useFormik } from "formik";
import { Link } from "react-router-dom";
import * as Yup from "yup";
import { RiMailLine, RiArrowLeftLine } from "react-icons/ri";

const Fform = () => {
  const [loading, setLoading] = useState(false);

  const formik = useFormik({
    initialValues: { email: "" },
    validationSchema: Yup.object({
      email: Yup.string().email("Invalid email").required("Email is required"),
    }),
    onSubmit: async (values, actions) => {
      setLoading(true);
      // Backend API call here
      setTimeout(() => {
        alert("Reset link sent to your email");
        setLoading(false);
        actions.resetForm();
      }, 1500);
    },
  });

  return (
    <div className="w-full animate-fade-in">
      <div className="mb-8">
        <h2 className="text-3xl font-black text-slate-800">Forgot Password?</h2>
        <p className="text-slate-500 mt-2 font-medium">Enter your email and we'll send you a reset link.</p>
      </div>

      <form onSubmit={formik.handleSubmit} className="space-y-6">
        <div className="relative group">
          <RiMailLine className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-blue-600 transition-colors text-xl" />
          <input
            type="email"
            name="email"
            placeholder="Work Email Address"
            {...formik.getFieldProps("email")}
            className={`w-full h-14 pl-12 pr-4 border rounded-2xl outline-none transition-all ${
              formik.touched.email && formik.errors.email ? "border-red-500 bg-red-50" : "border-slate-200 focus:border-blue-600 focus:shadow-lg focus:shadow-blue-50"
            }`}
          />
          {formik.touched.email && formik.errors.email && (
            <p className="text-red-500 text-[11px] font-bold mt-1 ml-2 uppercase tracking-wider">{formik.errors.email}</p>
          )}
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full h-14 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-300 text-white rounded-2xl font-black shadow-xl shadow-blue-100 transition-all flex items-center justify-center gap-2"
        >
          {loading ? "Sending..." : "Send Reset Link"}
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

export default Fform;