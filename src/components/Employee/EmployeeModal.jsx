import React from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import { FiX, FiUser, FiBriefcase, FiMail, FiPhone, FiCalendar, FiToggleRight } from "react-icons/fi";

// ── helpers ───────────────────────────────────────────────────────────────────
const parseDate = (d) => {
  if (!d) return "";
  const s = typeof d === "string" ? d : d.toISOString?.() ?? "";
  return s.split("T")[0];
};

const fmtDisplay = (d) => {
  if (!d) return "N/A";
  const [y, m, day] = (typeof d === "string" ? d.split("T")[0] : d.toISOString().split("T")[0])
    .split("-").map(Number);
  return new Date(y, m - 1, day).toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" });
};

const tenure = (joiningDate) => {
  if (!joiningDate) return "";
  const [y, m, day] = (typeof joiningDate === "string"
    ? joiningDate.split("T")[0]
    : joiningDate.toISOString().split("T")[0]
  ).split("-").map(Number);
  const join = new Date(y, m - 1, day);
  const now  = new Date();
  const months = (now.getFullYear() - join.getFullYear()) * 12 + (now.getMonth() - join.getMonth());
  if (months < 1)  return "New joiner";
  if (months < 12) return `${months} month${months > 1 ? "s" : ""}`;
  const yrs = Math.floor(months / 12), rem = months % 12;
  return rem ? `${yrs} yr ${rem} mo` : `${yrs} year${yrs > 1 ? "s" : ""}`;
};

const DEPARTMENTS = [
  "Development", "Design", "HR", "Finance & Accounts", "Sales",
  "Marketing", "Operations", "Customer Support", "Legal & Compliance",
  "Admin", "Procurement", "Logistics", "IT", "QA",
];

// ── component ─────────────────────────────────────────────────────────────────
const EmployeeModal = ({ isOpen, onClose, employee, onSave, mode = "view" }) => {

  const handleClose = () => { formik.resetForm(); onClose(); };

  const formik = useFormik({
    enableReinitialize: true,
    initialValues: {
      name:        employee?.name        || "",
      email:       employee?.email       || "",
      phone:       employee?.phone       || "",
      department:  employee?.department  || "",
      designation: employee?.designation || "",
      joiningDate: parseDate(employee?.joiningDate),
      status:      employee?.status      || "active",
    },
    validationSchema: Yup.object({
      name:        Yup.string().trim().required("Name is required"),
      email:       Yup.string().email("Invalid email").required("Email is required"),
      phone:       Yup.string().trim().min(7, "Min 7 digits").required("Phone is required"),
      department:  Yup.string().required("Select a department"),
      designation: Yup.string().trim().required("Designation is required"),
      joiningDate: Yup.string().required("Joining date is required"),
      status:      Yup.string().oneOf(["active", "inactive"]).required(),
    }),
    onSubmit: async (values) => {
      await onSave(values);
      handleClose();
    },
  });

  if (!isOpen) return null;

  const avatar =
    employee?.profileImage ||
    `https://ui-avatars.com/api/?name=${encodeURIComponent(employee?.name || "U")}&size=160&background=4f46e5&color=fff&bold=true`;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm" onClick={handleClose} />

      {/* Modal */}
      <div className="relative bg-white rounded-2xl w-full max-w-3xl max-h-[92vh] overflow-hidden shadow-2xl flex flex-col md:flex-row">

        {/* ── Left: profile panel ── */}
        <div className="w-full md:w-56 bg-gradient-to-b from-slate-800 to-slate-900 p-6 flex flex-col items-center text-center shrink-0">
          <img src={avatar} alt={employee?.name}
            className="w-20 h-20 rounded-2xl object-cover ring-4 ring-white/20 shadow-xl mb-3" />
          <h2 className="text-white font-bold text-base leading-tight">{employee?.name || "—"}</h2>
          <p className="text-slate-400 text-xs mt-0.5">{employee?.designation || "—"}</p>
          <span className={`mt-2 px-3 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${
            (employee?.status === "active" || employee?.status === "Active")
              ? "bg-emerald-500/20 text-emerald-300 border border-emerald-500/30"
              : "bg-amber-500/20 text-amber-300 border border-amber-500/30"
          }`}>
            {employee?.status || "—"}
          </span>

          <div className="w-full mt-5 space-y-2">
            <SCard icon={<FiBriefcase size={11} />} label="Dept"   value={employee?.department} />
            <SCard icon={<FiCalendar  size={11} />} label="Joined" value={fmtDisplay(employee?.joiningDate)} />
            <SCard icon={<FiCalendar  size={11} />} label="Tenure" value={tenure(employee?.joiningDate)} />
          </div>
        </div>

        {/* ── Right: content ── */}
        <div className="flex-1 flex flex-col overflow-hidden">

          {/* Header */}
          <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between shrink-0">
            <h3 className="font-bold text-slate-800">{mode === "view" ? "Employee Profile" : "Edit Employee"}</h3>
            <button onClick={handleClose} className="p-2 hover:bg-slate-100 rounded-xl transition-colors text-slate-400 hover:text-slate-700">
              <FiX size={18} />
            </button>
          </div>

          {/* Body */}
          <div className="flex-1 overflow-y-auto p-6 custom-scrollbar">

            {/* VIEW */}
            {mode === "view" ? (
              <div className="space-y-5">
                <Sec title="Contact">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <DItem icon={<FiMail size={12} />}  label="Email" value={employee?.email} />
                    <DItem icon={<FiPhone size={12} />} label="Phone" value={employee?.phone} />
                  </div>
                </Sec>
                <Sec title="Employment">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <DItem icon={<FiBriefcase size={12} />}  label="Designation"  value={employee?.designation} />
                    <DItem icon={<FiBriefcase size={12} />}  label="Department"   value={employee?.department} />
                    <DItem icon={<FiCalendar size={12} />}   label="Joining Date" value={fmtDisplay(employee?.joiningDate)} />
                    <DItem icon={<FiToggleRight size={12} />} label="Status"
                      value={
                        <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase ${
                          (employee?.status === "active" || employee?.status === "Active")
                            ? "bg-emerald-50 text-emerald-700"
                            : "bg-amber-50 text-amber-700"
                        }`}>{employee?.status || "—"}</span>
                      }
                    />
                  </div>
                </Sec>
                <Sec title="System">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <DItem icon={<FiUser size={12} />} label="Employee ID" value={employee?._id} mono />
                    <DItem icon={<FiUser size={12} />} label="Created By"  value={employee?.createdBy?.name || "—"} />
                  </div>
                </Sec>
              </div>

            /* EDIT */
            ) : (
              <form onSubmit={formik.handleSubmit}>
                <fieldset disabled={formik.isSubmitting} className="space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <IField label="Full Name"    name="name"        formik={formik} />
                    <IField label="Email"        name="email"       formik={formik} type="email" />
                    <IField label="Phone"        name="phone"       formik={formik} type="tel" placeholder="Phone number" />
                    <IField label="Designation"  name="designation" formik={formik} />
                    <IField label="Joining Date" name="joiningDate" formik={formik} type="date" />

                    {/* Department */}
                    <div>
                      <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-1.5">Department</label>
                      <select {...formik.getFieldProps("department")}
                        className={`w-full px-4 py-2.5 bg-slate-50 border rounded-xl text-sm font-medium outline-none transition-all ${
                          formik.touched.department && formik.errors.department
                            ? "border-rose-300 focus:ring-2 focus:ring-rose-200"
                            : "border-slate-200 focus:ring-2 focus:ring-blue-100 focus:border-blue-400"
                        }`}>
                        <option value="">Select department...</option>
                        {DEPARTMENTS.map(d => <option key={d} value={d}>{d}</option>)}
                      </select>
                      {formik.touched.department && formik.errors.department && (
                        <p className="text-[10px] text-rose-500 font-bold mt-1">{formik.errors.department}</p>
                      )}
                    </div>

                    {/* Status */}
                    <div>
                      <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-1.5">Status</label>
                      <select {...formik.getFieldProps("status")}
                        className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-medium outline-none focus:ring-2 focus:ring-blue-100 focus:border-blue-400 transition-all">
                        <option value="active">Active</option>
                        <option value="inactive">Inactive</option>
                      </select>
                    </div>
                  </div>

                  <div className="flex gap-3 pt-2">
                    <button type="button" onClick={handleClose}
                      className="flex-1 py-2.5 bg-slate-100 text-slate-600 rounded-xl font-bold hover:bg-slate-200 transition-all">
                      Discard
                    </button>
                    <button type="submit" disabled={formik.isSubmitting || !formik.dirty}
                      className="flex-[2] py-2.5 bg-slate-900 text-white rounded-xl font-bold hover:bg-blue-600 transition-all shadow-md disabled:opacity-50 disabled:cursor-not-allowed">
                      {formik.isSubmitting ? "Saving..." : "Save Changes"}
                    </button>
                  </div>
                </fieldset>
              </form>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

// ── sub-components ────────────────────────────────────────────────────────────
const Sec = ({ title, children }) => (
  <div>
    <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 pb-1.5 border-b border-slate-100">{title}</h4>
    {children}
  </div>
);

const DItem = ({ icon, label, value, mono }) => (
  <div className="flex items-start gap-2.5 p-3 bg-slate-50 rounded-xl">
    <span className="text-slate-400 mt-0.5 shrink-0">{icon}</span>
    <div className="min-w-0">
      <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wide mb-0.5">{label}</p>
      {typeof value === "string" || !value
        ? <p className={`text-sm font-semibold text-slate-700 truncate ${mono ? "font-mono text-xs" : ""}`}>{value || "—"}</p>
        : value}
    </div>
  </div>
);

const IField = ({ label, name, formik, type = "text", placeholder }) => (
  <div>
    <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-1.5">{label}</label>
    <input type={type} placeholder={placeholder} {...formik.getFieldProps(name)}
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

const SCard = ({ icon, label, value }) => (
  <div className="bg-white/10 rounded-xl px-3 py-2 flex items-center gap-2 text-left">
    <span className="text-slate-400 shrink-0">{icon}</span>
    <div className="min-w-0">
      <p className="text-[9px] text-slate-500 uppercase tracking-wider font-bold">{label}</p>
      <p className="text-xs text-slate-200 font-semibold truncate">{value || "—"}</p>
    </div>
  </div>
);

export default EmployeeModal;
