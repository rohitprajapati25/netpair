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





import React, { useState } from "react";
import { useFormik } from "formik";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";
import * as Yup from "yup";
import { RiMailLine, RiLockPasswordLine, RiEyeLine, RiEyeOffLine } from "react-icons/ri";

const LForm = () => {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [showPassword, setShowPassword] = useState(false);

  const formik = useFormik({
    initialValues: { email: "", password: "" },
    validationSchema: Yup.object({
      email: Yup.string().email("Invalid email format").required("Email is required"),
      password: Yup.string().min(6, "Minimum 6 characters").required("Password is required"),
    }),
    onSubmit: async (values, { setSubmitting, setErrors }) => {
  try {
    const res = await login(values.email, values.password);

    if (res.success) {
      // 🚨 CLIENT-SIDE SECURITY CHECK
      // Maan lijiye 'res' mein user object aa raha hai: res.user.status
      if (res.user && res.user.status === "inactive") {
        setErrors({ 
          password: "Aapka account abhi active nahi hai. Admin approval ka intezaar karein." 
        });
        // Token remove karne ke liye logout call kar sakte hain agar context handle nahi kar raha
        return;
      }
      
      // Agar active hai toh dashboard bhejein
      navigate("/dashboard");
    } else {
      // Backend errors (Wrong password, Email not found, etc.)
      setErrors({ password: res.error || "Login Failed" });
    }
  } catch (err) {
    setErrors({ password: "Something went wrong. Please try again." });
  } finally {
    setSubmitting(false);
  }
},
  });

  // Helper function to show error style on input
  const inputErrorStyle = (name) => 
    formik.touched[name] && formik.errors[name] ? "border-red-500 bg-red-50" : "border-slate-200 focus:border-blue-600";

  return (
    <div className="w-full">
      <div className="mb-8 text-center md:text-left">
        <h2 className="text-3xl font-black text-slate-800">Login</h2>
        <p className="text-slate-500 font-medium">Access your management portal</p>
      </div>

      <form onSubmit={formik.handleSubmit} className="space-y-5">
        
        {/* Email Field */}
        <div className="relative group">
          <RiMailLine className={`absolute left-4 top-1/2 -translate-y-1/2 transition-colors text-xl ${formik.touched.email && formik.errors.email ? 'text-red-400' : 'text-slate-400 group-focus-within:text-blue-600'}`} />
          <input 
            type="email" 
            name="email" 
            placeholder="Email Address" 
            {...formik.getFieldProps("email")} 
            className={`w-full h-12 pl-12 pr-4 border rounded-xl outline-none transition-all shadow-sm ${inputErrorStyle("email")}`} 
          />
          {/* 🚨 Validation Message for Email */}
          {formik.touched.email && formik.errors.email && (
            <p className="text-red-500 text-[11px] font-bold mt-1 ml-2 uppercase tracking-wider italic">
              {formik.errors.email}
            </p>
          )}
        </div>

        {/* Password Field */}
        <div className="relative group">
          <RiLockPasswordLine className={`absolute left-4 top-1/2 -translate-y-1/2 transition-colors text-xl ${formik.touched.password && formik.errors.password ? 'text-red-400' : 'text-slate-400 group-focus-within:text-blue-600'}`} />
          <input 
            type={showPassword ? "text" : "password"} 
            name="password" 
            placeholder="Password" 
            {...formik.getFieldProps("password")} 
            className={`w-full h-12 pl-12 pr-12 border rounded-xl outline-none transition-all shadow-sm ${inputErrorStyle("password")}`} 
          />
          <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-blue-600">
            {showPassword ? <RiEyeOffLine size={20} /> : <RiEyeLine size={20} />}
          </button>
          
          {/* 🚨 Validation Message for Password */}
          {formik.touched.password && formik.errors.password && (
            <p className="text-red-500 text-[11px] font-bold mt-1 ml-2 uppercase tracking-wider italic">
              {formik.errors.password}
            </p>
          )}
        </div>

        <div className="flex justify-between items-center px-1 text-sm">
          <Link to="/forgot" className="font-bold text-blue-600 hover:underline">Forgot Password?</Link>
        </div>

        <button 
          type="submit" 
          disabled={formik.isSubmitting} 
          className="w-full h-14 bg-blue-600 hover:bg-blue-700 text-white rounded-2xl font-black shadow-lg shadow-blue-100 transition-all active:scale-[0.98] disabled:bg-slate-300"
        >
          {formik.isSubmitting ? "Processing..." : "Sign In"}
        </button>

        <p className="text-center text-slate-500 text-sm font-bold pt-2">
          New Employee? <Link to="/employee/registration" className="text-blue-600 hover:underline">Create Account</Link>
        </p>
      </form>
    </div>
  );
};

export default LForm;