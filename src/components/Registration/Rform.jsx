// import React, { useState, useEffect } from "react";
// import { useFormik } from "formik";
// import { useNavigate } from "react-router-dom";
// import { useAuth } from "../../contexts/AuthContext";
import { signUpSchema } from "../../schemas/signUpValidation";
// import { ROLES } from "../../../../backend/constants/roles";

// const initialValues = {
//   name: "",
//   email: "",
//   phone: "",
//   gender: "",
//   dob: "",
//   department: "",
//   designation: "",
//   role: ROLES.EMPLOYEE,
//   joiningDate: "",
//   employmentType: "",
//   password: "",
//   confirm_pass: "",
//   status: "Active",
// };

// const Rform = () => {
//   const navigate = useNavigate();
//   const { user, token } = useAuth();
//   const [loading, setLoading] = useState(false);

//   useEffect(() => {
//     if (!user) {
//       alert("Please login as Admin first");
//       navigate('/');
//     }
//   }, [user, navigate]);

//   const {
//     values,
//     handleChange,
//     handleSubmit,
//     handleBlur,
//     errors,
//     touched,
//   } = useFormik({
//     initialValues,
//     validationSchema: signUpSchema,
//     onSubmit: async (values) => {
//       console.log("Form Submitted", values);
//       try {
//         setLoading(true);

//         const { confirm_pass, ...rest } = values;

//         const res = await fetch(
//           "http://localhost:5000/api/admin/create-user",
//           {
//             method: "POST",
//             headers: {
//               "Content-Type": "application/json",
//               "Authorization": `Bearer ${token}`,
//             },
//             body: JSON.stringify(rest),
//           }
//         );

//         const data = await res.json();

//         if (data.success) {
//           alert("Employee Created Successfully...");
//           navigate("/employees");
//         } else {
//           alert(data.message || "Something went wrong");
//         }
//       } catch (err) {
//         console.error(err);
//         alert("Server Error");
//       } finally {
//         setLoading(false);
//       }
//     },
//   });

//   return (
//     <div className="flex justify-center items-center w-full py-10 bg-gray-50">
//       <form
//         onSubmit={handleSubmit}
//         className="bg-white shadow-xl rounded-2xl p-8 w-full max-w-3xl space-y-6 border"
//       >
//         <h2 className="text-2xl font-bold border-b pb-3">
//           Registration Page 
//         </h2>

//         <div className="grid grid-cols-2 gap-4">

//           <div>
//             <input
//               name="name"
//               placeholder="Full Name *"
//               value={values.name}
//               onChange={handleChange}
//               onBlur={handleBlur}
//               className="w-full h-11 border rounded-lg px-3"
//             />
//             {touched.name && errors.name && (
//               <p className="text-red-500 text-sm">{errors.name}</p>
//             )}
//           </div>

//           <div>
//             <input
//               name="email"
//               placeholder="Email *"
//               value={values.email}
//               onChange={handleChange}
//               onBlur={handleBlur}
//               className="w-full h-11 border rounded-lg px-3"
//             />
//             {touched.email && errors.email && (
//               <p className="text-red-500 text-sm">{errors.email}</p>
//             )}
//           </div>

//           <input
//             name="phone"
//             placeholder="Phone Number"
//             value={values.phone}
//             onChange={handleChange}
//             onBlur={handleBlur}
//             className="h-11 border rounded-lg px-3"
//           />
//           {touched.phone && errors.phone && (
//             <p className="text-red-500 text-sm">{errors.phone}</p>
//           )}

//           <select
//             name="gender"
//             value={values.gender}
//             onChange={handleChange}
//             onBlur={handleBlur}
//             className="h-11 border rounded-lg px-3"
//           >
//             <option value="">Gender</option>
//             <option value="Male">Male</option>
//             <option value="Female">Female</option>
//           </select>
//           <h4>DOB :</h4>
//           <input
//             type="date"
//             name="dob"
//             value={values.dob}
//             onChange={handleChange}
//             onBlur={handleBlur}
//             className="h-11 border rounded-lg px-3 col-span-2"
//           />

//           <select
//             name="department"
//             value={values.department}
//             onChange={handleChange}
//             onBlur={handleBlur}
//             className="h-11 border rounded-lg px-3"
//           >
//             <option value="">Department *</option>
//             <option value="Development">Development</option>
//             <option value="HR">HR</option>
//             <option value="Design">Design</option>
//             <option value="QA">QA</option>
//           </select>
//           {touched.department && errors.department && (
//             <p className="text-red-500 text-sm col-span-2">
//               {errors.department}
//             </p>
//           )}

//           <div>
//             <input
//               name="designation"
//               placeholder="Designation *"
//               value={values.designation}
//               onChange={handleChange}
//               onBlur={handleBlur}
//               className="h-11 border rounded-lg px-3 w-full"
//             />
//             {touched.designation && errors.designation && (
//               <p className="text-red-500 text-sm">
//                 {errors.designation}
//               </p>
//             )}
//           </div>

//           <select
//             name="role"
//             value={values.role}
//             onChange={handleChange}
//             onBlur={handleBlur}
//             className="h-11 border rounded-lg px-3"
//           >
//             <option value="employee">Employee</option>
//             <option value="hr">HR</option>
//           </select><br />
//           <h4>JOIN DATE :</h4>
//           <input
//             type="date"
//             name="joiningDate"
//             value={values.joiningDate}
//             onChange={handleChange}
//             onBlur={handleBlur}
//             className="h-11 border rounded-lg px-3 col-span-2"
//           />
//           {touched.joiningDate && errors.joiningDate && (
//             <p className="text-red-500 text-sm col-span-2">
//               {errors.joiningDate}
//             </p>
//           )}

//           <select
//             name="employmentType"
//             value={values.employmentType}
//             onChange={handleChange}
//             onBlur={handleBlur}
//             className="h-11 border rounded-lg px-3"
//           >
//             <option value="">Employment Type</option>
//             <option value="Full Time">Full Time</option>
//             <option value="Intern">Intern</option>
//             <option value="Contract">Contract</option>
//           </select>

//           <select
//             name="status"
//             value={values.status}
//             onChange={handleChange}
//             onBlur={handleBlur}
//             className="h-11 border rounded-lg px-3"
//           >
//             <option value="Active">Active</option>
//             <option value="Inactive">Inactive</option>
//           </select>

//         </div>

//         <div className="space-y-4">

//           <div>
//             <input
//               type="password"
//               name="password"
//               placeholder="Temporary Password *"
//               value={values.password}
//               onChange={handleChange}
//               onBlur={handleBlur}
//               className="w-full h-11 border rounded-lg px-3"
//             />
//             {touched.password && errors.password && (
//               <p className="text-red-500 text-sm">
//                 {errors.password}
//               </p>
//             )}
//           </div>

//           <div>
//             <input
//               type="password"
//               name="confirm_pass"
//               placeholder="Confirm Password *"
//               value={values.confirm_pass}
//               onChange={handleChange}
//               onBlur={handleBlur}
//               className="w-full h-11 border rounded-lg px-3"
//             />
//             {touched.confirm_pass && errors.confirm_pass && (
//               <p className="text-red-500 text-sm">
//                 {errors.confirm_pass}
//               </p>
//             )}
//           </div>

//         </div>

//         <button
//           type="submit"
//           disabled={loading}
//           className="w-full bg-blue-700 hover:bg-blue-800 text-white py-3 rounded-lg font-semibold"
//         >
//           {loading ? "Creating..." : "Create Employee"}
//         </button>
//       </form>
//     </div>
//   );
// };

// export default Rform;



import React, { useState } from "react";
import { useFormik } from "formik";
import { useNavigate, Link } from "react-router-dom";

import { useAuth } from "../../contexts/AuthContext";
import { genderRole } from "./genderRole";
import axios from "axios";
import { RiArrowLeftLine } from "react-icons/ri";
import { ROLES } from "../../../../backend/constants/roles";
import {empTypes} from "./empTypes";


const Rform = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [submitError, setSubmitError] = useState(null);
  
  const { token } = useAuth();

  const formik = useFormik({
    initialValues: {
      name: "",
      email: "",
      phone: "",
      gender: "",
      dob: "",
      department: "",
      designation: "", // ✅ FIXED: Schema uses 'designation' NOT 'position'
      role: ROLES.EMPLOYEE, // ✅ Default role
      joiningDate: "", // ✅ Required field
      employmentType: empTypes.FULL_TIME || empTypes.PART_TIME || empTypes.INTERN || empTypes.CONTRACT, // ✅ Required field with default
      password: "",
      confirm_pass: "",
      status: ROLES.INACTIVE, // New registrations are inactive
    },
    validationSchema: signUpSchema,
    onSubmit: async (values) => {
      try {
        setLoading(true);
        setSubmitError(null);

        // ✅ Remove confirm_pass before sending to backend
        const { confirm_pass, ...submitData } = values;

        // ✅ Password ko as-is bhej rahe hain, backend par hash hoga
        const res = await axios.post(
          "http://localhost:5000/api/admin/employees",  // ✅ Role-specific: Employee/HR/Admin + User dual save
          submitData,
          {
            headers: {
              "Content-Type": "application/json",
              "Authorization": `Bearer ${token}`,
            },
          }
        );

        if (res.data.success) {
          alert("Registration Successful! Please wait for Admin approval.");
          navigate("/employees");
        }
      } catch (err) {
        const errorMessage =
          err.response?.data?.message ||
          "Registration Failed. Please check all fields and try again.";
        setSubmitError(errorMessage);
        console.error("Registration error:", err);
      } finally {
        setLoading(false);
      }
    },
  });

  // Error message component
  const ErrorMsg = ({ name }) => (
    formik.touched[name] && formik.errors[name] ? (
      <p className="text-red-500 text-[9px] font-bold mt-1 ml-1 uppercase tracking-tight italic">
        {formik.errors[name]}
      </p>
    ) : null
  );

  // Input styling helper
  const inputStyle = (name) => `
    w-full h-11 px-4 border rounded-xl outline-none transition-all 
    ${
      formik.touched[name] && formik.errors[name]
        ? "border-red-500 bg-red-50"
        : "border-slate-200 focus:border-blue-600 shadow-sm"
    }
  `;

  return (
    <div className="w-full overflow-hidden">
      {/* Header */}
      <div className="flex justify-between items-center mb-4 sticky top-0 bg-white z-10 pb-2 border-b border-slate-50">
        <h3 className="text-xs font-black text-slate-400 uppercase tracking-widest border-b-2 border-blue-600">
          Register Member
        </h3>
        <Link
          to="/"
          className="text-blue-600 text-xs font-bold flex items-center gap-1 hover:underline"
        >
          <RiArrowLeftLine /> Back
        </Link>
      </div>

      {/* Error Alert */}
      {submitError && (
        <div className="p-2 mb-4 bg-red-100 text-red-600 text-[10px] rounded-lg font-bold border border-red-200">
          {submitError}
        </div>
      )}

      <form
        onSubmit={formik.handleSubmit}
        className="space-y-4 max-h-[480px] overflow-y-auto pr-2 custom-scrollbar"
      >
        {/* Full Name */}
        <div>
          <label className="text-[10px] font-bold text-slate-500 uppercase ml-1">
            Full Name
          </label>
          <input
            type="text"
            name="name"
            {...formik.getFieldProps("name")}
            className={inputStyle("name")}
            placeholder="John Doe"
          />
          <ErrorMsg name="name" />
        </div>

        {/* Gender & DOB */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="text-[10px] font-bold text-slate-500 uppercase ml-1">
              Gender
            </label>
            <select
              name="gender"
              {...formik.getFieldProps("gender")}
              className={inputStyle("gender")}
            >
              <option value="">Select</option>
              <option value={genderRole.Male}>Male</option>
              <option value={genderRole.Female}>Female</option>
              <option value={genderRole.Other}>Other</option>
            </select>
            <ErrorMsg name="gender" />
          </div>
          <div>
            <label className="text-[10px] font-bold text-slate-500 uppercase ml-1">
              DOB
            </label>
            <input
              type="date"
              name="dob"
              {...formik.getFieldProps("dob")}
              className={inputStyle("dob")}
            />
            <ErrorMsg name="dob" />
          </div>
        </div>

        {/* Email & Phone */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="text-[10px] font-bold text-slate-500 uppercase ml-1">
              Email
            </label>
            <input
              type="email"
              name="email"
              {...formik.getFieldProps("email")}
              className={inputStyle("email")}
              placeholder="work@company.com"
            />
            <ErrorMsg name="email" />
          </div>
          <div>
            <label className="text-[10px] font-bold text-slate-500 uppercase ml-1">
              Phone
            </label>
            <input
              type="tel"
              name="phone"
              {...formik.getFieldProps("phone")}
              className={inputStyle("phone")}
              placeholder="9876543210"
            />
            <ErrorMsg name="phone" />
          </div>
        </div>

        {/* Work Details Section */}
        <div className="space-y-4 pt-2 border-t border-slate-50">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-[10px] font-bold text-slate-500 uppercase ml-1">
                Department
              </label>
              <select
                name="department"
                {...formik.getFieldProps("department")}
                className={inputStyle("department")}
              >
                <option value="">Select Department</option>
                <option value="Development">Development</option>
                <option value="HR">HR</option>
                <option value="Design">Design</option>
                <option value="QA">QA</option>
                <option value="IT">IT</option>
                <option value="Sales">Sales</option>
                <option value="Marketing">Marketing</option>
                <option value="Finance">Finance</option>
              </select>
              <ErrorMsg name="department" />
            </div>
            <div>
              <label className="text-[10px] font-bold text-slate-500 uppercase ml-1">
                Designation
              </label>
              <select
                name="designation"
                {...formik.getFieldProps("designation")}
                className={inputStyle("designation")}
              >
                <option value="">Select Designation</option>
                <option value="Developer">Developer</option>
                <option value="Senior Developer">Senior Developer</option>
                <option value="Manager">Manager</option>
                <option value="HR Executive">HR Executive</option>
                <option value="Designer">Designer</option>
                <option value="Tester">Tester</option>
                <option value="Intern">Intern</option>
              </select>
              <ErrorMsg name="designation" />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-[10px] font-bold text-slate-500 uppercase ml-1">
                System Role
              </label>
              <select
                name="role"
                {...formik.getFieldProps("role")}
                className={inputStyle("role")}
              >
                <option value={ROLES.EMPLOYEE}>Employee</option>
                <option value={ROLES.HR}>HR</option>
                <option value={ROLES.ADMIN}>Admin</option>
              </select>
              <ErrorMsg name="role" />
            </div>
            <div>
              <label className="text-[10px] font-bold text-slate-500 uppercase ml-1">
                Joining Date
              </label>
              <input
                type="date"
                name="joiningDate"
                {...formik.getFieldProps("joiningDate")}
                className={inputStyle("joiningDate")}
              />
              <ErrorMsg name="joiningDate" />
            </div>
          </div>

          <div>
            <label className="text-[10px] font-bold text-slate-500 uppercase ml-1">
              Employment Type
            </label>
              <select
                name="employmentType"
                {...formik.getFieldProps("employmentType")}
                className={inputStyle("employmentType")}
              >
                <option value="">Select Employment Type</option>
                <option value={empTypes.FULL_TIME}>Full Time</option>
                <option value={empTypes.PART_TIME}>Part Time</option>
                <option value={empTypes.INTERN}>Intern</option>
                <option value={empTypes.CONTRACT}>Contract</option>
              </select>
            <ErrorMsg name="employmentType" />
          </div>
        </div>

        {/* Security Section */}
        <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="text-[10px] font-bold text-slate-500 uppercase ml-1">
                Password
              </label>
              <input
                type="password"
                name="password"
                placeholder="Min 8 characters"
                {...formik.getFieldProps("password")}
                className={inputStyle("password")}
              />
              <ErrorMsg name="password" />
            </div>
            <div>
              <label className="text-[10px] font-bold text-slate-500 uppercase ml-1">
                Confirm Password
              </label>
              <input
                type="password"
                name="confirm_pass"
                placeholder="Re-enter password"
                {...formik.getFieldProps("confirm_pass")}
                className={inputStyle("confirm_pass")}
              />
              <ErrorMsg name="confirm_pass" />
            </div>
          </div>
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          disabled={loading}
          className="w-full h-14 bg-blue-600 hover:bg-blue-700 disabled:bg-slate-300 text-white rounded-2xl font-black shadow-xl mt-4 active:scale-95 transition-all"
        >
          {loading ? "Registering..." : "Complete Registration"}
        </button>
      </form>
    </div>
  );
};

export default Rform;