// import React, { useState, useEffect } from "react";

// const ProjectModal = ({ onClose, onSave, initialData }) => {
//   const [project, setProject] = useState({
//     name: "",
//     start: "",
//     end: "",
//     status: "Ongoing"
//   });

//   useEffect(() => {
//     if (initialData) {
//       setProject(initialData);
//     }
//   }, [initialData]);

//   const save = () => {
//     if (project.name && project.start && project.end) {
//       onSave(project);
//     } else {
//       alert("Please fill all fields");
//     }
//   };

//   return (
//     <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50">
//       <div className="bg-white w-[420px] rounded-xl shadow-xl p-6 relative">
//         <h3 className="text-xl font-semibold mb-5 flex items-center gap-2">
//           <i className={initialData ? "ri-edit-box-line text-blue-600" : "ri-folder-add-line text-blue-600"}></i>
//           {initialData ? "Edit Project" : "Add Project"}
//         </h3>
        
//         <div className="space-y-4">
//           <div>
//             <label className="text-sm font-medium text-gray-600">Project Name</label>
//             <input
//               type="text"
//               className="w-full border border-gray-400 rounded-lg px-3 py-2 mt-1 outline-none focus:border-blue-500"
//               value={project.name}
//               onChange={(e) => setProject({ ...project, name: e.target.value })}
//             />
//           </div>
          
//           <div className="grid grid-cols-2 gap-4">
//             <div>
//               <label className="text-sm font-medium text-gray-600">Start Date</label>
//               <input
//                 type="date"
//                 className="w-full border border-gray-400 rounded-lg px-3 py-2 mt-1 outline-none focus:border-blue-500"
//                 value={project.start}
//                 onChange={(e) => setProject({ ...project, start: e.target.value })}
//               />
//             </div>
//             <div>
//               <label className="text-sm font-medium text-gray-600">End Date</label>
//               <input
//                 type="date"
//                 className="w-full border border-gray-400 rounded-lg px-3 py-2 mt-1 outline-none focus:border-blue-500"
//                 value={project.end}
//                 onChange={(e) => setProject({ ...project, end: e.target.value })}
//               />
//             </div>
//           </div>

//           <div>
//             <label className="text-sm font-medium text-gray-600">Status</label>
//             <select
//               className="w-full border border-gray-400 rounded-lg px-3 py-2 mt-1 outline-none"
//               value={project.status}
//               onChange={(e) => setProject({ ...project, status: e.target.value })}
//             >
//               <option>Ongoing</option>
//               <option>Completed</option>
//               <option>On Hold</option>
//             </select>
//           </div>
//         </div>

//         <div className="flex justify-end gap-3 mt-6">
//           <button onClick={onClose} className="px-4 py-2 border rounded-lg hover:bg-gray-50">Cancel</button>
//           <button 
//             onClick={save} 
//             className={`${initialData ? 'bg-blue-600 hover:bg-blue-700' : 'bg-blue-600 hover:bg-blue-700'} text-white px-5 py-2 rounded-lg flex items-center gap-2`}
//           >
//             <i className="ri-save-line"></i> {initialData ? "Update" : "Save"}
//           </button>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default ProjectModal;

import React, { useState, useEffect } from "react";
import { 
  RiFolderAddLine, 
  RiEditBoxLine, 
  RiCloseLine, 
  RiSaveLine, 
  RiInformationLine,
  RiCalendarEventLine 
} from "react-icons/ri";

const ProjectModal = ({ onClose, onSave, initialData }) => {
  const [project, setProject] = useState({
    name: "",
    start: "",
    end: "",
    status: "Ongoing",
    description: "" // Added for professional depth
  });

  useEffect(() => {
    if (initialData) {
      setProject(initialData);
    }
  }, [initialData]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (project.name && project.start && project.end) {
      onSave(project);
    } else {
      // Industry practice: replace alert with visual feedback if possible
      alert("Please complete all required fields.");
    }
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      {/* Backdrop with Blur */}
      <div 
        className="absolute inset-0 bg-slate-900/60 backdrop-blur-md transition-opacity" 
        onClick={onClose} 
      />

      {/* Modal Container */}
      <div className="relative bg-white w-full max-w-lg rounded-[2rem] shadow-2xl shadow-blue-900/20 overflow-hidden animate-in fade-in zoom-in duration-200">
        
        {/* Header Section */}
        <div className="px-8 py-6 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
          <div className="flex items-center gap-3">
            <div className={`p-2.5 rounded-xl ${initialData ? 'bg-amber-100 text-amber-600' : 'bg-blue-100 text-blue-600'}`}>
              {initialData ? <RiEditBoxLine size={24} /> : <RiFolderAddLine size={24} />}
            </div>
            <div>
              <h3 className="text-xl font-black text-slate-800 tracking-tight">
                {initialData ? "Update Project" : "Create New Project"}
              </h3>
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                {initialData ? "Modify project parameters" : "Initialize a new workspace"}
              </p>
            </div>
          </div>
          <button 
            onClick={onClose}
            className="p-2 hover:bg-white hover:shadow-sm rounded-full text-slate-400 hover:text-rose-500 transition-all"
          >
            <RiCloseLine size={24} />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-8 space-y-6">
          
          {/* Project Name */}
          <div className="space-y-2">
            <label className="flex items-center gap-2 text-xs font-black text-slate-500 uppercase tracking-wider ml-1">
              <RiInformationLine /> Project Name
            </label>
            <input
              autoFocus
              type="text"
              placeholder="e.g. G97 AutoHub Dashboard"
              className="w-full px-5 py-3.5 bg-slate-50 border-2 border-slate-100 rounded-2xl text-sm font-bold text-slate-700
                         focus:bg-white focus:border-blue-500 focus:ring-4 focus:ring-blue-500/5 outline-none transition-all"
              value={project.name}
              onChange={(e) => setProject({ ...project, name: e.target.value })}
            />
          </div>

          {/* Date Range */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="flex items-center gap-2 text-xs font-black text-slate-500 uppercase tracking-wider ml-1">
                <RiCalendarEventLine /> Start Date
              </label>
              <input
                type="date"
                className="w-full px-5 py-3.5 bg-slate-50 border-2 border-slate-100 rounded-2xl text-sm font-bold text-slate-600
                           focus:bg-white focus:border-blue-500 outline-none transition-all"
                value={project.start}
                onChange={(e) => setProject({ ...project, start: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <label className="flex items-center gap-2 text-xs font-black text-slate-500 uppercase tracking-wider ml-1">
                <RiCalendarEventLine /> End Date
              </label>
              <input
                type="date"
                className="w-full px-5 py-3.5 bg-slate-50 border-2 border-slate-100 rounded-2xl text-sm font-bold text-slate-600
                           focus:bg-white focus:border-blue-500 outline-none transition-all"
                value={project.end}
                onChange={(e) => setProject({ ...project, end: e.target.value })}
              />
            </div>
          </div>

          {/* Status Selection */}
          <div className="space-y-2">
            <label className="text-xs font-black text-slate-500 uppercase tracking-wider ml-1">Current Status</label>
            <div className="grid grid-cols-3 gap-2">
              {["Ongoing", "Completed", "On Hold"].map((statusOption) => (
                <button
                  key={statusOption}
                  type="button"
                  onClick={() => setProject({ ...project, status: statusOption })}
                  className={`py-3 rounded-xl text-[10px] font-black uppercase tracking-tighter border-2 transition-all ${
                    project.status === statusOption 
                    ? "bg-blue-600 border-blue-600 text-white shadow-lg shadow-blue-200" 
                    : "bg-white border-slate-100 text-slate-400 hover:border-slate-200"
                  }`}
                >
                  {statusOption}
                </button>
              ))}
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center gap-3 pt-4">
            <button 
              type="button"
              onClick={onClose} 
              className="flex-1 py-4 font-bold text-slate-500 bg-slate-100 hover:bg-slate-200 rounded-2xl transition-all active:scale-95"
            >
              Cancel
            </button>
            <button 
              type="submit" 
              className="flex-[2] py-4 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-2xl shadow-xl shadow-blue-100
                         flex items-center justify-center gap-2 transition-all active:scale-95"
            >
              <RiSaveLine size={20} />
              {initialData ? "Update Configuration" : "Finalize Project"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ProjectModal;