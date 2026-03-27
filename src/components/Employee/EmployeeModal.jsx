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
import { FiX, FiUser, FiBriefcase, FiMail, FiPhone, FiCalendar, FiToggleRight } from "react-icons/fi";

// ─── helpers ────────────────────────────────────────────────────────────────

const parseDate = (d) => {
  if (!d) return "";
  const s = typeof d === "string" ? d : d.toISOString?.() ?? "";
  return s.split("T")[0]; // "YYYY-MM-DD" for <input type="date">
};

const fmtDisplay = (d) => {
  if (!d) return "N/A";
  const [y, m, day] = (typeof d === "string" ? d.split("T")[0] : d.toISOString().split("T")[0])
    .split("-").map(Number);
  return new Date(y, m - 1, day).toLocaleDateString("en-IN", {
    day: "2-digit", month: "short", year: "numeric",
  });
};

const tenure = (joiningDate) => {
  if (!joiningDate) return "";
  const [y, m, day] = (typeof joiningDate === "string"
    ? joiningDate.split("T")[0]
    : joiningDate.toISOString().split("T")[0]
  ).split("-").map(Number);
  const join  = new Date(y, m - 1, day);
  const now   = new Date();
  const months =
    (now.getFullYear() - join.getFullYear()) * 12 +
    (now.getMonth() - join.getMonth());
  if (months < 1)  return "New joiner";
  if (months < 12) return `${months} month${months > 1 ? "s" : ""}`;
  const yrs = Math.floor(months / 12);
  const rem = months % 12;
  return rem ? `${yrs} yr ${rem} mo` : `${yrs} year${yrs > 1 ? "s" : ""}`;
};

const DEPARTMENTS = [
  "Development", "Design", "HR", "Finance & Accounts",
  "Sales", "Marketing", "Operations", "Customer Support",
  "Legal & Compliance", "Admin", "Procurement", "Logistics",
];

// ─── component ──────────────────────────────────────────────────────────────

const EmployeeModal = ({ isOpen, onClose, employee, onSave, mode = "view" }) => {

  const handleClose = () => {
    formik.resetForm();
    onClose();
  };

  const formik = useFormik({
    enableReinitialize: true,
    initialValues: {
      // ← only fields that exist in DB schema
      name:        employee?.name        || "",
      email:       employee?.email       || "",
      phone:       employee?.phone       || "",
      department:  employee?.department  || "",
      designation: employee?.designation || "",
      joiningDate: parseDate(employee?.joiningDate),
      status:      employee?.status      || "active",
    },
    validationSchema: Yup.object({
      name:       Yup.string().required("Name is required"),
      email:      Yup.string().email("Invalid email").required("Email is required"),
      phone:      Yup.string()
                    .matches(/^(\+91[\-\s]?)?[6-9]\d{9}$/, "Valid Indian mobile number daalo")
                    .required("Phone is required"),
      department: Yup.string().required("Department select karo"),
      designation: Yup.string().required("Designation is required"),
      joiningDate:Yup.string().required("Joining date is required"),
      status:     Yup.string().oneOf(["active", "inactive"]).required(),
    }),
    onSubmit: async (values) => {
      await onSave(values);
      handleClose();
    },
  });

  if (!isOpen) return null;

  const avatarSrc =
    employee?.profileImage ||
    `https://ui-avatars.com/api/?name=${encodeURIComponent(employee?.name || "")}&size=160&background=4f46e5&color=fff&bold=true`;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm"
        onClick={handleClose}
      />

      {/* Modal */}
      <div className="relative bg-white rounded-3xl w-full max-w-3xl max-h-[92vh] overflow-hidden shadow-2xl flex flex-col md:flex-row">

        {/* ── Left panel: profile summary ── */}
        <div className="w-full md:w-64 bg-gradient-to-b from-slate-800 to-slate-900 p-7 flex flex-col items-center text-center flex-shrink-0">
          <img
            src={avatarSrc}
            alt={employee?.name}
            className="w-24 h-24 rounded-2xl object-cover ring-4 ring-white/20 shadow-xl mb-4"
          />
          <h2 className="text-white font-bold text-lg leading-tight mb-1">
            {employee?.name || "—"}
          </h2>
          <p className="text-slate-400 text-xs mb-1">{employee?.designation || "—"}</p>
          <span className={`mt-2 px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${
            employee?.status === "active"
              ? "bg-emerald-500/20 text-emerald-300 border border-emerald-500/30"
              : "bg-amber-500/20 text-amber-300 border border-amber-500/30"
          }`}>
            {employee?.status || "—"}
          </span>

          {/* Summary cards */}
          <div className="w-full mt-6 space-y-2">
            <SummaryCard icon={<FiBriefcase size={12} />} label="Department" value={employee?.department} />
            <SummaryCard icon={<FiCalendar size={12} />} label="Joined"     value={fmtDisplay(employee?.joiningDate)} />
            <SummaryCard icon={<FiCalendar size={12} />} label="Tenure"     value={tenure(employee?.joiningDate)} />
          </div>
        </div>

        {/* ── Right panel ── */}
        <div className="flex-1 flex flex-col overflow-hidden">
          {/* Header */}
          <div className="px-7 py-5 border-b border-slate-100 flex items-center justify-between flex-shrink-0">
            <h3 className="font-bold text-slate-800 text-base">
              {mode === "view" ? "Employee Profile" : "Edit Employee"}
            </h3>
            <button
              onClick={handleClose}
              className="p-2 hover:bg-slate-100 rounded-xl transition-colors text-slate-400 hover:text-slate-700"
            >
              <FiX size={20} />
            </button>
          </div>

          {/* Body */}
          <div className="flex-1 overflow-y-auto p-7">

            {/* ── VIEW MODE ── */}
            {mode === "view" ? (
              <div className="space-y-6">
                <Section title="Contact Information">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <DetailItem icon={<FiMail size={13} />}    label="Email"   value={employee?.email} />
                    <DetailItem icon={<FiPhone size={13} />}   label="Phone"   value={employee?.phone} />
                  </div>
                </Section>

                <Section title="Job Details">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <DetailItem icon={<FiBriefcase size={13} />} label="Designation"   value={employee?.designation} />
                    <DetailItem icon={<FiBriefcase size={13} />} label="Department" value={employee?.department} />
                    <DetailItem icon={<FiCalendar size={13} />}  label="Joining Date" value={fmtDisplay(employee?.joiningDate)} />
                    <DetailItem icon={<FiToggleRight size={13} />} label="Status"
                      value={
                        <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase ${
                          employee?.status === "active"
                            ? "bg-emerald-50 text-emerald-700"
                            : "bg-amber-50 text-amber-700"
                        }`}>
                          {employee?.status || "—"}
                        </span>
                      }
                    />
                  </div>
                </Section>

                <Section title="System Info">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <DetailItem icon={<FiUser size={13} />} label="Employee ID" value={employee?._id} mono />
                    <DetailItem icon={<FiUser size={13} />} label="Created By"  value={employee?.createdBy?.name || "—"} />
                  </div>
                </Section>
              </div>

            /* ── EDIT MODE ── */
            ) : (
              <form onSubmit={formik.handleSubmit} className="space-y-5">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <InputField label="Full Name"    name="name"     formik={formik} />
                  <InputField label="Email"        name="email"    formik={formik} type="email" />
                  <InputField label="Phone"        name="phone"    formik={formik} type="tel"
                    placeholder="+91 9876543210"
                  />
                  <InputField label="Designation"     name="designation" formik={formik} />
                  <InputField label="Joining Date" name="joiningDate" formik={formik} type="date" />

                  {/* Department */}
                  <div>
                    <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-1.5">
                      Department
                    </label>
                    <select
                      {...formik.getFieldProps("department")}
                      className={`w-full px-4 py-2.5 bg-slate-50 border rounded-xl text-sm font-medium outline-none transition-all ${
                        formik.touched.department && formik.errors.department
                          ? "border-rose-300 focus:ring-2 focus:ring-rose-200"
                          : "border-slate-200 focus:ring-2 focus:ring-blue-100 focus:border-blue-400"
                      }`}
                    >
                      <option value="">Select department...</option>
                      {DEPARTMENTS.map((d) => (
                        <option key={d} value={d}>{d}</option>
                      ))}
                    </select>
                    {formik.touched.department && formik.errors.department && (
                      <p className="text-[10px] text-rose-500 font-bold mt-1">{formik.errors.department}</p>
                    )}
                  </div>

                  {/* Status */}
                  <div>
                    <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-1.5">
                      Status
                    </label>
                    <select
                      {...formik.getFieldProps("status")}
                      className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-medium outline-none focus:ring-2 focus:ring-blue-100 focus:border-blue-400 transition-all"
                    >
                      <option value="active">Active</option>
                      <option value="inactive">Inactive</option>
                    </select>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex gap-3 pt-2">
                  <button
                    type="button"
                    onClick={handleClose}
                    className="flex-1 py-3 bg-slate-100 text-slate-600 rounded-xl font-bold hover:bg-slate-200 transition-all"
                  >
                    Discard
                  </button>
                  <button
                    type="submit"
                    disabled={formik.isSubmitting || !formik.dirty}
                    className="flex-[2] py-3 bg-slate-900 text-white rounded-xl font-bold hover:bg-blue-600 transition-all shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {formik.isSubmitting ? "Saving..." : "Save Changes"}
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

// ─── sub-components ──────────────────────────────────────────────────────────

const Section = ({ title, children }) => (
  <div>
    <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.18em] mb-3 pb-2 border-b border-slate-100">
      {title}
    </h4>
    {children}
  </div>
);

const DetailItem = ({ icon, label, value, mono }) => (
  <div className="flex items-start gap-3 p-3 bg-slate-50 rounded-xl">
    <span className="text-slate-400 mt-0.5 flex-shrink-0">{icon}</span>
    <div className="min-w-0">
      <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wide mb-0.5">{label}</p>
      {typeof value === "string" || !value ? (
        <p className={`text-sm font-semibold text-slate-700 truncate ${mono ? "font-mono text-xs" : ""}`}>
          {value || "—"}
        </p>
      ) : (
        value
      )}
    </div>
  </div>
);

const InputField = ({ label, name, formik, type = "text", placeholder }) => (
  <div>
    <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-1.5">
      {label}
    </label>
    <input
      type={type}
      placeholder={placeholder}
      {...formik.getFieldProps(name)}
      className={`w-full px-4 py-2.5 bg-slate-50 border rounded-xl text-sm font-medium outline-none transition-all ${
        formik.touched[name] && formik.errors[name]
          ? "border-rose-300 focus:ring-2 focus:ring-rose-200"
          : "border-slate-200 focus:ring-2 focus:ring-blue-100 focus:border-blue-400"
      }`}
    />
    {formik.touched[name] && formik.errors[name] && (
      <p className="text-[10px] text-rose-500 font-bold mt-1">{formik.errors[name]}</p>
    )}
  </div>
);

const SummaryCard = ({ icon, label, value }) => (
  <div className="bg-white/10 rounded-xl px-3 py-2.5 flex items-center gap-2 text-left">
    <span className="text-slate-400 flex-shrink-0">{icon}</span>
    <div className="min-w-0">
      <p className="text-[9px] text-slate-500 uppercase tracking-wider font-bold">{label}</p>
      <p className="text-xs text-slate-200 font-semibold truncate">{value || "—"}</p>
    </div>
  </div>
);

export default EmployeeModal;