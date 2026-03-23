// import React, { useState } from "react";

// const AddTaskModal = ({ open, onClose, onSave }) => {
//   const [task, setTask] = useState({
//     title: "",
//     description: "",
//     employee: "",
//     priority: "Medium",
//     startDate: "",
//     deadline: "",
//     hours: "",
//   });

//   if (!open) return null;

//   const handleChange = (e) => {
//     setTask({ ...task, [e.target.name]: e.target.value });
//   };

//   const handleSubmit = () => {
//     if (!task.title || !task.employee || !task.startDate || !task.deadline) {
//       alert("Please fill all required fields");
//       return;
//     }

//     if (new Date(task.deadline) < new Date(task.startDate)) {
//       alert("End Date cannot be before Start Date");
//       return;
//     }

//     onSave({
//       ...task,
//       status: "Assigned",
//       id: Date.now(),
//     });

//     onClose();
//   };

//   return (
//     <div className="fixed inset-0 bg-black/40 backdrop-blur flex items-center justify-center z-50">

//       <div className="bg-white w-[95%] max-w-xl rounded-2xl shadow-xl p-6">

//         <h2 className="text-xl font-semibold mb-5">
//           Create New Task
//         </h2>

//         <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

//           <div>
//             <label className="text-sm font-medium">Task Title *</label>
//             <input
//               name="title"
//               placeholder="Enter task title"
//               onChange={handleChange}
//               className="border p-2 rounded-lg w-full mt-1"
//             />
//           </div>

//           <div>
//             <label className="text-sm font-medium">Assign Employee *</label>
//             <select
//               name="employee"
//               onChange={handleChange}
//               className="border p-2 rounded-lg w-full mt-1"
//             >
//               <option value="">Select Employee</option>
//               <option>Rohit</option>
//               <option>Amit</option>
//               <option>Neha</option>
//             </select>
//           </div>

//           <div>
//             <label className="text-sm font-medium">Estimated Hours</label>
//             <input
//               type="number"
//               name="hours"
//               placeholder="e.g. 8"
//               onChange={handleChange}
//               className="border p-2 rounded-lg w-full mt-1"
//             />
//           </div>

//           <div>
//             <label className="text-sm font-medium">Start Date *</label>
//             <input
//               type="date"
//               name="startDate"
//               onChange={handleChange}
//               className="border p-2 rounded-lg w-full mt-1"
//             />
//           </div>

//           <div>
//             <label className="text-sm font-medium">End Date / Deadline *</label>
//             <input
//               type="date"
//               name="deadline"
//               onChange={handleChange}
//               className="border p-2 rounded-lg w-full mt-1"
//             />
//           </div>

//         </div>

//         <div className="mt-4">
//           <label className="text-sm font-medium">Task Description</label>
//           <textarea
//             name="description"
//             placeholder="Write task details..."
//             onChange={handleChange}
//             className="border p-2 rounded-lg w-full mt-1 h-24 resize-none"
//           />
//         </div>

//         <div className="flex justify-end gap-3 mt-6">
//           <button
//             onClick={onClose}
//             className="px-4 py-2 rounded-lg bg-gray-100 hover:bg-gray-200"
//           >
//             Cancel
//           </button>

//           <button
//             onClick={handleSubmit}
//             className="px-5 py-2 rounded-lg bg-blue-600 text-white hover:bg-blue-700"
//           >
//             Create Task
//           </button>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default AddTaskModal;

import React, { useState } from "react";
import { RiAddCircleLine, RiCloseLine, RiTimeLine, RiUserAddLine, RiFlag2Line } from "react-icons/ri";

const AddTaskModal = ({ open, onClose, onSave }) => {
  const [task, setTask] = useState({
    title: "",
    description: "",
    employee: "",
    priority: "Medium",
    startDate: "",
    deadline: "",
    hours: "",
  });

  if (!open) return null;

  const handleChange = (e) => {
    setTask({ ...task, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!task.title || !task.employee || !task.startDate || !task.deadline) {
      alert("Required fields are missing!");
      return;
    }
    onSave({ ...task, status: "Assigned", id: Date.now() });
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm" onClick={onClose} />
      
      <div className="relative bg-white w-full max-w-2xl rounded-[2.5rem] shadow-2xl overflow-hidden animate-in zoom-in duration-200">
        {/* Header */}
        <div className="px-10 py-8 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-blue-600 text-white rounded-2xl shadow-lg shadow-blue-200">
              <RiAddCircleLine size={28} />
            </div>
            <div>
              <h3 className="text-2xl font-black text-slate-800 tracking-tight">Create New Task</h3>
              <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">Assign work to your team</p>
            </div>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-rose-50 hover:text-rose-500 rounded-full transition-all text-slate-400">
            <RiCloseLine size={28} />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-10 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            
            {/* Task Title */}
            <div className="md:col-span-2 space-y-2">
              <label className="text-[11px] font-black text-slate-500 uppercase tracking-wider ml-1">Task Title *</label>
              <input
                name="title"
                required
                placeholder="e.g. Design System Architecture"
                className="w-full px-5 py-4 bg-slate-50 border-2 border-slate-100 rounded-2xl text-sm font-bold focus:bg-white focus:border-blue-500 outline-none transition-all"
                onChange={handleChange}
              />
            </div>

            {/* Assign Employee */}
            <div className="space-y-2">
              <label className="text-[11px] font-black text-slate-500 uppercase tracking-wider ml-1 flex items-center gap-1">
                <RiUserAddLine /> Assignee *
              </label>
              <select
                name="employee"
                className="w-full px-5 py-4 bg-slate-50 border-2 border-slate-100 rounded-2xl text-sm font-bold text-slate-600 focus:bg-white focus:border-blue-500 outline-none transition-all"
                onChange={handleChange}
              >
                <option value="">Select Employee</option>
                <option>Rohit</option>
                <option>Amit</option>
                <option>Neha</option>
              </select>
            </div>

            {/* Hours */}
            <div className="space-y-2">
              <label className="text-[11px] font-black text-slate-500 uppercase tracking-wider ml-1 flex items-center gap-1">
                <RiTimeLine /> Est. Hours
              </label>
              <input
                type="number"
                name="hours"
                placeholder="0"
                className="w-full px-5 py-4 bg-slate-50 border-2 border-slate-100 rounded-2xl text-sm font-bold focus:bg-white focus:border-blue-500 outline-none transition-all"
                onChange={handleChange}
              />
            </div>

            {/* Dates */}
            <div className="space-y-2">
              <label className="text-[11px] font-black text-slate-500 uppercase tracking-wider ml-1">Start Date *</label>
              <input
                type="date"
                name="startDate"
                className="w-full px-5 py-4 bg-slate-50 border-2 border-slate-100 rounded-2xl text-sm font-bold focus:bg-white focus:border-blue-500 outline-none transition-all text-slate-600"
                onChange={handleChange}
              />
            </div>

            <div className="space-y-2">
              <label className="text-[11px] font-black text-slate-500 uppercase tracking-wider ml-1 text-rose-500">Deadline *</label>
              <input
                type="date"
                name="deadline"
                className="w-full px-5 py-4 bg-slate-50 border-2 border-slate-100 rounded-2xl text-sm font-bold focus:bg-white focus:border-rose-500 outline-none transition-all text-slate-600"
                onChange={handleChange}
              />
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center gap-4 pt-6">
            <button type="button" onClick={onClose} className="flex-1 py-4 font-bold text-slate-500 bg-slate-100 hover:bg-slate-200 rounded-2xl transition-all">
              Cancel
            </button>
            <button type="submit" className="flex-[2] py-4 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-2xl shadow-xl shadow-blue-100 flex items-center justify-center gap-2 transition-all active:scale-95">
              Confirm & Assign Task
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddTaskModal;