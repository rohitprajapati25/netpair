// import React, { useState, useEffect } from "react";
// import { useFormik } from "formik";
// import { useNavigate } from "react-router-dom";
// import { useAuth } from "../../contexts/AuthContext";
// import { signUpSchema } from "../../schemas";
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


import React, { useState, useEffect } from "react";
import { useFormik } from "formik";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";
import { signUpSchema } from "../../schemas";

const initialValues = {
  name: "",
  email: "",
  phone: "",
  gender: "",
  dob: "",
  department: "",
  position: "",        // ✅ renamed from designation
  role: "employee",
  joiningDate: "",
  employmentType: "",
  password: "",
  confirm_pass: "",
  status: "active",    // ✅ lowercase to match backend
};

const Rform = () => {
  const navigate = useNavigate();
  const { user, token } = useAuth();
  const [loading, setLoading] = useState(false);
  const [submitError, setSubmitError] = useState(null);

  useEffect(() => {
    if (!user) {
      alert("Please login as Admin first");
      navigate('/');
    }
  }, [user, navigate]);

  const {
    values,
    handleChange,
    handleSubmit,
    handleBlur,
    errors,
    touched,
  } = useFormik({
    initialValues,
    validationSchema: signUpSchema,
    onSubmit: async (values, { resetForm }) => {
      try {
        setLoading(true);
        setSubmitError(null);

        const { confirm_pass, ...rest } = values;

        // ✅ Use token from context or fallback to localStorage
        const authToken = token || localStorage.getItem('token');

        const res = await fetch("http://localhost:5000/api/admin/employees", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${authToken}`,
          },
          body: JSON.stringify(rest),
        });

        const data = await res.json();

        if (data.success) {
          alert("Employee Created Successfully!");
          resetForm();
          navigate("/employees");
        } else {
          setSubmitError(data.message || "Something went wrong");
        }
      } catch (err) {
        console.error(err);
        setSubmitError("Server Error. Please try again.");
      } finally {
        setLoading(false);
      }
    },
  });

  return (
    <div className="flex justify-center items-center w-full py-10 bg-gray-50">
      <form
        onSubmit={handleSubmit}
        className="bg-white shadow-xl rounded-2xl p-8 w-full max-w-3xl space-y-6 border"
      >
        <h2 className="text-2xl font-bold border-b pb-3">Employee Registration</h2>

        {/* ✅ Show server error */}
        {submitError && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm">
            {submitError}
          </div>
        )}

        <div className="grid grid-cols-2 gap-4">

          {/* Name */}
          <div>
            <input
              name="name"
              placeholder="Full Name *"
              value={values.name}
              onChange={handleChange}
              onBlur={handleBlur}
              className="w-full h-11 border rounded-lg px-3"
            />
            {touched.name && errors.name && (
              <p className="text-red-500 text-sm mt-1">{errors.name}</p>
            )}
          </div>

          {/* Email */}
          <div>
            <input
              name="email"
              placeholder="Email *"
              value={values.email}
              onChange={handleChange}
              onBlur={handleBlur}
              className="w-full h-11 border rounded-lg px-3"
            />
            {touched.email && errors.email && (
              <p className="text-red-500 text-sm mt-1">{errors.email}</p>
            )}
          </div>

          {/* Phone */}
          <div>
            <input
              name="phone"
              placeholder="Phone Number"
              value={values.phone}
              onChange={handleChange}
              onBlur={handleBlur}
              className="w-full h-11 border rounded-lg px-3"
            />
            {touched.phone && errors.phone && (
              <p className="text-red-500 text-sm mt-1">{errors.phone}</p>
            )}
          </div>

          {/* Gender */}
          <div>
            <select
              name="gender"
              value={values.gender}
              onChange={handleChange}
              onBlur={handleBlur}
              className="w-full h-11 border rounded-lg px-3"
            >
              <option value="">Gender</option>
              <option value="Male">Male</option>
              <option value="Female">Female</option>
              <option value="Other">Other</option>
            </select>
          </div>

          {/* DOB */}
          <div className="col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-1">Date of Birth</label>
            <input
              type="date"
              name="dob"
              value={values.dob}
              onChange={handleChange}
              onBlur={handleBlur}
              className="w-full h-11 border rounded-lg px-3"
            />
          </div>

          {/* Department */}
          <div>
            <select
              name="department"
              value={values.department}
              onChange={handleChange}
              onBlur={handleBlur}
              className="w-full h-11 border rounded-lg px-3"
            >
              <option value="">Department *</option>
              <option value="Development">Development</option>
              <option value="HR">HR</option>
              <option value="Design">Design</option>
              <option value="QA">QA</option>
              <option value="Marketing">Marketing</option>
              <option value="Finance">Finance</option>
            </select>
            {touched.department && errors.department && (
              <p className="text-red-500 text-sm mt-1">{errors.department}</p>
            )}
          </div>

          {/* Position (was designation) */}
          <div>
            <input
              name="position"
              placeholder="Position *"
              value={values.position}
              onChange={handleChange}
              onBlur={handleBlur}
              className="w-full h-11 border rounded-lg px-3"
            />
            {touched.position && errors.position && (
              <p className="text-red-500 text-sm mt-1">{errors.position}</p>
            )}
          </div>

          {/* Role */}
          <div>
            <select
              name="role"
              value={values.role}
              onChange={handleChange}
              onBlur={handleBlur}
              className="w-full h-11 border rounded-lg px-3"
            >
              <option value="employee">Employee</option>
              <option value="hr">HR</option>
            </select>
          </div>

          {/* Employment Type */}
          <div>
            <select
              name="employmentType"
              value={values.employmentType}
              onChange={handleChange}
              onBlur={handleBlur}
              className="w-full h-11 border rounded-lg px-3"
            >
              <option value="">Employment Type</option>
              <option value="Full Time">Full Time</option>
              <option value="Intern">Intern</option>
              <option value="Contract">Contract</option>
            </select>
          </div>

          {/* Joining Date */}
          <div className="col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-1">Joining Date *</label>
            <input
              type="date"
              name="joiningDate"
              value={values.joiningDate}
              onChange={handleChange}
              onBlur={handleBlur}
              className="w-full h-11 border rounded-lg px-3"
            />
            {touched.joiningDate && errors.joiningDate && (
              <p className="text-red-500 text-sm mt-1">{errors.joiningDate}</p>
            )}
          </div>

          {/* Status */}
          <div className="col-span-2">
            <select
              name="status"
              value={values.status}
              onChange={handleChange}
              onBlur={handleBlur}
              className="w-full h-11 border rounded-lg px-3"
            >
              <option value="active">Active</option>     {/* ✅ lowercase */}
              <option value="inactive">Inactive</option> {/* ✅ lowercase */}
            </select>
          </div>

        </div>

        {/* Passwords */}
        <div className="space-y-4">
          <div>
            <input
              type="password"
              name="password"
              placeholder="Temporary Password *"
              value={values.password}
              onChange={handleChange}
              onBlur={handleBlur}
              className="w-full h-11 border rounded-lg px-3"
            />
            {touched.password && errors.password && (
              <p className="text-red-500 text-sm mt-1">{errors.password}</p>
            )}
          </div>

          <div>
            <input
              type="password"
              name="confirm_pass"
              placeholder="Confirm Password *"
              value={values.confirm_pass}
              onChange={handleChange}
              onBlur={handleBlur}
              className="w-full h-11 border rounded-lg px-3"
            />
            {touched.confirm_pass && errors.confirm_pass && (
              <p className="text-red-500 text-sm mt-1">{errors.confirm_pass}</p>
            )}
          </div>
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-blue-700 hover:bg-blue-800 disabled:bg-blue-400 text-white py-3 rounded-lg font-semibold transition"
        >
          {loading ? "Creating..." : "Create Employee"}
        </button>
      </form>
    </div>
  );
};

export default Rform;