// import React from "react";
// import { useFormik } from "formik";
// import * as Yup from "yup";

// const EmployeeModal = ({ 
//   isOpen, 
//   onClose, 
//   employee, 
//   onSave, 
//   mode = "view" // "view" | "edit"
// }) => {
//   const formik = useFormik({
//     enableReinitialize: true,
//     initialValues: {
//       name: employee?.name || "",
//       email: employee?.email || "",
//       phone: employee?.phone || "",
//       gender: employee?.gender || "",
//       dob: employee?.dob || "",
//       department: employee?.department || "",
//       designation: employee?.designation || "",
//       role: employee?.role || "employee",
//       status: employee?.status || "Active"
//     },
//     validationSchema: Yup.object({
//       name: Yup.string().required("Required"),
//       email: Yup.string().email("Invalid email").required("Required"),
//       department: Yup.string().required("Required"),
//       designation: Yup.string().required("Required")
//     }),
//     onSubmit: onSave
//   });

//   if (!isOpen) return null;

//   return (
//     <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
//       <div className="bg-white/90 backdrop-blur-xl rounded-3xl w-full max-w-2xl max-h-[90vh] overflow-y-auto shadow-2xl border border-white/50">
//         {/* Header */}
//         <div className="sticky top-0 bg-white/95 backdrop-blur border-b border-gray-200 p-6 rounded-t-3xl">
//           <div className="flex items-center justify-between">
//             <h2 className="text-2xl font-bold bg-gradient-to-r from-gray-800 to-gray-600 bg-clip-text text-transparent">
//               {mode === "view" ? "Employee Profile" : "Edit Employee"}
//             </h2>
//             <button onClick={onClose} className="p-2 hover:bg-gray-200 rounded-2xl transition">
//               <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                 <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
//               </svg>
//             </button>
//           </div>
//         </div>

//         <div className="p-8 space-y-8">
//           {/* Avatar & Basic Info */}
//           <div className="flex items-center gap-6">
//             <div className="relative">
//               <img
//                 src={employee?.profileImage || `https://ui-avatars.com/api/?name=${employee?.name || 'User'}&size=160&background=6b7280&color=fff`}
//                 alt={employee?.name || 'User'}
//                 className="w-32 h-32 rounded-3xl object-cover ring-4 ring-blue-100 shadow-xl"
//               />
//             </div>
//             <div>
//               <h3 className="text-3xl font-bold">{employee?.name || 'Employee'}</h3>
//               <p className="text-xl text-gray-600 mt-1">{employee?.designation || 'N/A'}</p>
//               <div className="flex items-center gap-4 mt-3">
//                 <span className={`px-4 py-1 rounded-full text-sm font-semibold ${
//                   employee?.status === 'Active' 
//                     ? 'bg-emerald-100 text-emerald-800' 
//                     : 'bg-red-100 text-red-800'
//                 }`}>
//                   {employee?.status || 'Unknown'}
//                 </span>
//                 <span className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm">
//                   {employee?.role || 'Employee'}
//                 </span>
//               </div>
//             </div>
//           </div>

//           <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
//             {/* Personal Info */}
//             <div>
//               <h4 className="text-lg font-semibold mb-4 text-gray-800">Personal Information</h4>
//               <div className="space-y-4">
//                 <div>
//                   <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
//                   <p className="text-gray-900 font-medium">{employee?.email || 'N/A'}</p>
//                 </div>
//                 <div>
//                   <label className="block text-sm font-medium text-gray-700 mb-1">Phone</label>
//                   <p>{employee?.phone || "N/A"}</p>
//                 </div>
//                 <div>
//                   <label className="block text-sm font-medium text-gray-700 mb-1">Gender</label>
//                   <p>{employee?.gender || "N/A"}</p>
//                 </div>
//                 <div>
//                   <label className="block text-sm font-medium text-gray-700 mb-1">Date of Birth</label>
//                   <p>{employee?.dob ? new Date(employee.dob).toLocaleDateString() : "N/A"}</p>
//                 </div>
//               </div>
//             </div>

//             {/* Employment Info */}
//             <div>
//               <h4 className="text-lg font-semibold mb-4 text-gray-800">Employment Information</h4>
//               <div className="space-y-4">
//                 <div>
//                   <label className="block text-sm font-medium text-gray-700 mb-1">Department</label>
//                   <p className="font-medium">{employee?.department || 'N/A'}</p>
//                 </div>
//                 <div>
//                   <label className="block text-sm font-medium text-gray-700 mb-1">Role</label>
//                   <p>{employee?.role || 'Employee'}</p>
//                 </div>
//                 <div>
//                   <label className="block text-sm font-medium text-gray-700 mb-1">Joining Date</label>
//                   <p>{employee?.joiningDate ? new Date(employee.joiningDate).toLocaleDateString() : "N/A"}</p>
//                 </div>
//                 <div>
//                   <label className="block text-sm font-medium text-gray-700 mb-1">Employment Type</label>
//                   <p>{employee?.employmentType || "Full Time"}</p>
//                 </div>
//               </div>
//             </div>
//           </div>

//           {mode === "edit" && (
//             <form onSubmit={formik.handleSubmit} className="border-t pt-8">
//               <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
//                 <div>
//                   <label className="block text-sm font-medium text-gray-700 mb-2">Name</label>
//                   <input
//                     {...formik.getFieldProps("name")}
//                     className={`w-full px-4 py-3 border rounded-2xl focus:ring-4 focus:ring-blue-200 focus:border-blue-500 transition-all ${
//                       formik.touched.name && formik.errors.name 
//                         ? "border-red-300 focus:ring-red-200" 
//                         : "border-gray-200"
//                     }`}
//                     placeholder="Employee Name"
//                   />
//                   {formik.touched.name && formik.errors.name && (
//                     <p className="text-red-600 text-xs mt-1">{formik.errors.name}</p>
//                   )}
//                 </div>

//                 <div>
//                   <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
//                   <input
//                     {...formik.getFieldProps("email")}
//                     className={`w-full px-4 py-3 border rounded-2xl focus:ring-4 focus:ring-blue-200 focus:border-blue-500 transition-all ${
//                       formik.touched.email && formik.errors.email 
//                         ? "border-red-300 focus:ring-red-200" 
//                         : "border-gray-200"
//                     }`}
//                     placeholder="employee@company.com"
//                   />
//                   {formik.touched.email && formik.errors.email && (
//                     <p className="text-red-600 text-xs mt-1">{formik.errors.email}</p>
//                   )}
//                 </div>

//                 <div>
//                   <label className="block text-sm font-medium text-gray-700 mb-2">Department</label>
//                   <select
//                     {...formik.getFieldProps("department")}
//                     className={`w-full px-4 py-3 border rounded-2xl focus:ring-4 focus:ring-blue-200 focus:border-blue-500 transition-all ${
//                       formik.touched.department && formik.errors.department 
//                         ? "border-red-300 focus:ring-red-200" 
//                         : "border-gray-200"
//                     }`}
//                   >
//                     <option value="">Select Department</option>
//                     <option value="Development">Development</option>
//                     <option value="HR">HR</option>
//                     <option value="Design">Design</option>
//                     <option value="QA">QA</option>
//                   </select>
//                   {formik.touched.department && formik.errors.department && (
//                     <p className="text-red-600 text-xs mt-1">{formik.errors.department}</p>
//                   )}
//                 </div>

//                 <div>
//                   <label className="block text-sm font-medium text-gray-700 mb-2">Designation</label>
//                   <input
//                     {...formik.getFieldProps("designation")}
//                     className={`w-full px-4 py-3 border rounded-2xl focus:ring-4 focus:ring-blue-200 focus:border-blue-500 transition-all ${
//                       formik.touched.designation && formik.errors.designation 
//                         ? "border-red-300 focus:ring-red-200" 
//                         : "border-gray-200"
//                     }`}
//                     placeholder="Senior Developer"
//                   />
//                   {formik.touched.designation && formik.errors.designation && (
//                     <p className="text-red-600 text-xs mt-1">{formik.errors.designation}</p>
//                   )}
//                 </div>

//                 <div className="md:col-span-2">
//                   <label className="block text-sm font-medium text-gray-700 mb-2">Status</label>
//                   <select
//                     {...formik.getFieldProps("status")}
//                     className="w-full px-4 py-3 border rounded-2xl focus:ring-4 focus:ring-blue-200 focus:border-blue-500"
//                   >
//                     <option value="Active">Active</option>
//                     <option value="Inactive">Inactive</option>
//                   </select>
//                 </div>
//               </div>

//               <div className="flex gap-4 mt-8 pt-6 border-t">
//                 <button
//                   type="button"
//                   onClick={onClose}
//                   className="flex-1 px-6 py-3 bg-gray-200 hover:bg-gray-300 text-gray-800 font-medium rounded-2xl transition-all duration-200"
//                 >
//                   Cancel
//                 </button>
//                 <button
//                   type="submit"
//                   disabled={formik.isSubmitting}
//                   className="flex-1 px-6 py-3 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white font-medium rounded-2xl shadow-lg hover:shadow-xl transition-all duration-200 disabled:opacity-50 flex items-center justify-center gap-2"
//                 >
//                   {formik.isSubmitting ? (
//                     <>
//                       <svg className="animate-spin -ml-1 w-4 h-4" fill="none" viewBox="0 0 24 24">
//                         <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" className="opacity-25" />
//                         <path fill="currentColor" className="opacity-75" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
//                       </svg>
//                       Saving...
//                     </>
//                   ) : (
//                     "Save Changes"
//                   )}
//                 </button>
//               </div>
//             </form>
//           )}
//         </div>
//       </div>
//     </div>
//   );
// };

// export default EmployeeModal;



import React from "react";
import { useFormik } from "formik";
import * as Yup from "yup";

const EmployeeModal = ({ isOpen, onClose, employee, onSave, mode = "view" }) => {
  const formik = useFormik({
    enableReinitialize: true,
    initialValues: {
      name: employee?.name || "",
      email: employee?.email || "",
      phone: employee?.phone || "",
      gender: employee?.gender || "",
      dob: employee?.dob || "",
      department: employee?.department || "",
      designation: employee?.designation || "",
      role: employee?.role || "employee",
      status: employee?.status || "Active"
    },
    validationSchema: Yup.object({
      name: Yup.string().required("Name is required"),
      email: Yup.string().email("Invalid email").required("Email is required"),
      department: Yup.string().required("Select a department"),
      designation: Yup.string().required("Designation is required")
    }),
    onSubmit: onSave
  });

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6">
      {/* Ultra-smooth Backdrop */}
      <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm transition-opacity" onClick={onClose} />
      
      {/* Modal Container */}
      <div className="relative bg-white rounded-[2.5rem] w-full max-w-4xl max-h-[90vh] overflow-hidden shadow-2xl flex flex-col md:flex-row border border-white/20 animate-in fade-in zoom-in duration-300">
        
        {/* Left Profile Panel (Static Info) */}
        <div className="w-full md:w-72 bg-slate-50 p-8 border-r border-slate-100 flex flex-col items-center text-center">
           <div className="relative mb-6">
              <img
                src={employee?.profileImage || `https://ui-avatars.com/api/?name=${employee?.name}&size=160&background=6366f1&color=fff`}
                className="w-32 h-32 rounded-[2.5rem] shadow-xl ring-8 ring-white object-cover"
                alt="Profile"
              />
           </div>
           <h2 className="text-xl font-black text-slate-800 mb-1 leading-tight">{employee?.name}</h2>
           <p className="text-blue-600 font-bold text-xs tracking-widest uppercase mb-6">{employee?.designation}</p>
           
           <div className="w-full space-y-3">
              <div className="bg-white p-4 rounded-2xl shadow-sm border border-slate-100">
                 <p className="text-[9px] uppercase text-slate-400 font-black tracking-[0.15em] mb-1">Status</p>
                 <span className={`text-xs font-bold ${employee?.status === 'Active' ? 'text-emerald-600' : 'text-rose-600'}`}>
                    {employee?.status}
                 </span>
              </div>
              <div className="bg-white p-4 rounded-2xl shadow-sm border border-slate-100">
                 <p className="text-[9px] uppercase text-slate-400 font-black tracking-[0.15em] mb-1">Member Since</p>
                 <span className="text-xs font-bold text-slate-700">
                    {employee?.joiningDate ? new Date(employee.joiningDate).getFullYear() : 'N/A'}
                 </span>
              </div>
           </div>
        </div>

        {/* Right Panel (Content/Form) */}
        <div className="flex-1 flex flex-col h-full bg-white overflow-hidden">
          {/* Header */}
          <div className="px-8 py-6 border-b border-slate-100 flex justify-between items-center">
             <h3 className="font-extrabold text-slate-800 text-lg">
                {mode === 'view' ? 'Personal Profile' : 'Edit Employee Details'}
             </h3>
             <button onClick={onClose} className="p-2 hover:bg-slate-100 rounded-full transition-colors text-slate-400 hover:text-slate-600">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M6 18L18 6M6 6l12 12" /></svg>
             </button>
          </div>

          {/* Body */}
          <div className="p-8 overflow-y-auto custom-scrollbar">
            {mode === "view" ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-8">
                 <section className="space-y-6">
                    <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] border-b border-slate-50 pb-2">Primary Details</h4>
                    <DetailItem label="Email Address" value={employee?.email} />
                    <DetailItem label="Contact Number" value={employee?.phone} />
                    <DetailItem label="Gender" value={employee?.gender} />
                 </section>
                 <section className="space-y-6">
                    <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] border-b border-slate-50 pb-2">Organizational</h4>
                    <DetailItem label="Department" value={employee?.department} />
                    <DetailItem label="Access Role" value={employee?.role} />
                    <DetailItem label="Date of Birth" value={employee?.dob ? new Date(employee.dob).toLocaleDateString() : 'N/A'} />
                 </section>
              </div>
            ) : (
              <form onSubmit={formik.handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-6 pb-4">
                <InputGroup label="Full Name" name="name" formik={formik} />
                <InputGroup label="Email Address" name="email" formik={formik} type="email" />
                
                <div className="space-y-1.5">
                  <label className="text-[11px] font-bold text-slate-500 uppercase tracking-wider ml-1">Department</label>
                  <select {...formik.getFieldProps("department")} className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 transition-all outline-none text-sm font-semibold">
                    <option value="">Choose...</option>
                    <option value="Development">Development</option>
                    <option value="HR">HR</option>
                    <option value="Design">Design</option>
                  </select>
                </div>

                <InputGroup label="Designation" name="designation" formik={formik} />

                <div className="md:col-span-2 pt-8 flex gap-3">
                   <button type="button" onClick={onClose} className="flex-1 bg-slate-100 text-slate-600 py-4 rounded-2xl font-bold hover:bg-slate-200 transition-all">
                      Discard
                   </button>
                   <button type="submit" disabled={formik.isSubmitting} className="flex-2 bg-slate-900 text-white py-4 px-8 rounded-2xl font-bold hover:bg-blue-600 transition-all shadow-xl shadow-slate-200 flex items-center justify-center gap-2">
                      {formik.isSubmitting ? 'Processing...' : 'Save Changes'}
                   </button>
                </div>
              </form>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

// --- Reusable Internal UI Components ---

const DetailItem = ({ label, value }) => (
  <div className="group">
    <p className="text-[10px] text-slate-400 font-bold uppercase tracking-tight mb-1">{label}</p>
    <p className="text-sm font-bold text-slate-700 group-hover:text-blue-600 transition-colors">{value || "—"}</p>
  </div>
);

const InputGroup = ({ label, name, formik, type = "text" }) => (
  <div className="space-y-1.5">
    <label className="text-[11px] font-bold text-slate-500 uppercase tracking-wider ml-1">{label}</label>
    <input
      type={type}
      {...formik.getFieldProps(name)}
      className={`w-full px-4 py-3 bg-slate-50 border rounded-xl focus:ring-4 transition-all outline-none text-sm font-semibold ${
        formik.touched[name] && formik.errors[name] 
        ? "border-rose-300 focus:ring-rose-500/10" 
        : "border-slate-200 focus:ring-blue-500/10 focus:border-blue-500"
      }`}
    />
    {formik.touched[name] && formik.errors[name] && (
      <p className="text-[10px] text-rose-500 font-bold mt-1 ml-1">{formik.errors[name]}</p>
    )}
  </div>
);

export default EmployeeModal;