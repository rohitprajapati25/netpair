// import React, { useState } from "react";

// const AnnouncementForm = ({ onAdd }) => {
//   const [title, setTitle] = useState("");
//   const [msg, setMsg] = useState("");

//   const submit = () => {
//     if (!title.trim() || !msg.trim()) return;

//     onAdd({ title, msg });
//     setTitle("");
//     setMsg("");
//   };

//   return (
//     <div className="bg-white p-5 rounded-2xl shadow border">

//       <input
//         value={title}
//         onChange={(e)=>setTitle(e.target.value)}
//         placeholder="Announcement title"
//         className="w-full border p-3 rounded-lg mb-3"
//       />

//       <textarea
//         value={msg}
//         onChange={(e)=>setMsg(e.target.value)}
//         placeholder="Write message..."
//         rows={4}
//         className="w-full border p-3 rounded-lg mb-4 resize-none"
//       />

//       <button
//         onClick={submit}
//         className="bg-blue-600 text-white px-5 py-2 rounded-lg hover:bg-blue-700">
//         + Add Announcement
//       </button>

//     </div>
//   );
// };

// export default AnnouncementForm;


import React from "react";
import { useFormik } from "formik";
import { announcementValidationSchema } from "../../schemas/announcementValidation";
import { RiSendPlane2Line, RiUserSharedLine, RiErrorWarningLine } from "react-icons/ri";

const AnnouncementForm = ({ onAdd }) => {
  const formik = useFormik({
    initialValues: {
      title: "",
      msg: "",
      targetRole: "All",
    },
    validationSchema: announcementValidationSchema,
    onSubmit: (values, { resetForm }) => {
      onAdd(values);
      resetForm();
    },
  });

  return (
    <form 
      onSubmit={formik.handleSubmit}
      className="bg-white p-4 sm:p-6 lg:p-8 rounded-2xl shadow-sm border border-slate-100 space-y-4 sm:space-y-5"
    >
      <h3 className="text-base sm:text-lg font-black text-slate-800 mb-2 flex items-center gap-2">
        <RiUserSharedLine className="text-blue-500" /> Create Broadcast
      </h3>

      {/* Role Selection */}
      <div className="space-y-1">
        <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Target Audience</label>
        <select
          name="targetRole"
          {...formik.getFieldProps("targetRole")}
          className="w-full bg-slate-50 border-2 border-slate-100 px-4 py-3 rounded-xl outline-none focus:border-blue-500 font-bold text-sm"
        >
          <option value="All">All Employees</option>
          <option value="Intern">Interns Only</option>
          <option value="Developer">Developers Only</option>
          <option value="HR">HR Department</option>
          <option value="Manager">Managers Only</option>
        </select>
      </div>

      {/* Title */}
      <div className="space-y-1">
        <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Heading</label>
        <input
          name="title"
          {...formik.getFieldProps("title")}
          placeholder="Enter title..."
          className={`w-full bg-slate-50 border-2 px-4 py-3 rounded-xl outline-none transition-all font-bold text-sm ${
            formik.touched.title && formik.errors.title ? "border-rose-400" : "border-slate-100 focus:border-blue-500"
          }`}
        />
        {formik.touched.title && formik.errors.title && (
          <p className="text-rose-500 text-[10px] font-bold flex items-center gap-1 mt-1 ml-1">
            <RiErrorWarningLine /> {formik.errors.title}
          </p>
        )}
      </div>

      {/* Message */}
      <div className="space-y-1">
        <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Content</label>
        <textarea
          name="msg"
          {...formik.getFieldProps("msg")}
          placeholder="Write your message..."
          rows={4}
          className={`w-full bg-slate-50 border-2 px-4 py-3 rounded-xl outline-none transition-all text-sm font-medium resize-none ${
            formik.touched.msg && formik.errors.msg ? "border-rose-400" : "border-slate-100 focus:border-blue-500"
          }`}
        />
        {formik.touched.msg && formik.errors.msg && (
          <p className="text-rose-500 text-[10px] font-bold flex items-center gap-1 mt-1 ml-1">
            <RiErrorWarningLine /> {formik.errors.msg}
          </p>
        )}
      </div>

      <button
        type="submit"
        className="w-full bg-slate-900 text-white py-3 sm:py-4 rounded-xl font-black flex items-center justify-center gap-2 hover:bg-blue-600 transition-all shadow-lg active:scale-95"
      >
        <RiSendPlane2Line size={20} /> Publish Now
      </button>
    </form>
  );
};

export default AnnouncementForm;