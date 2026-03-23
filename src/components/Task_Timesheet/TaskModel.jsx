// import React, { useState } from "react";

// const TaskModal = ({ task, close, onSave }) => {
//   const [form, setForm] = useState({
//     ...task,
//     emp: task.employee || task.emp,
//     title: task.task || task.title
//   });

//   const handleUpdate = () => {
//     onSave({
//       ...form,
//       employee: form.emp,
//       task: form.title
//     });
//   };

//   return (
//     <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 backdrop-blur-sm">
//       <div className="bg-white rounded-2xl w-[420px] p-6 shadow-xl">
//         <h2 className="text-xl font-semibold mb-5">Edit Details</h2>
//         <div className="flex flex-col gap-4">
//           <input
//             className="border p-2 rounded-lg"
//             placeholder="Employee"
//             value={form.emp}
//             onChange={(e) => setForm({ ...form, emp: e.target.value })}
//           />
//           <input
//             className="border p-2 rounded-lg"
//             placeholder="Task"
//             value={form.title}
//             onChange={(e) => setForm({ ...form, title: e.target.value })}
//           />
//           <select
//             className="border p-2 rounded-lg"
//             value={form.status}
//             onChange={(e) => setForm({ ...form, status: e.target.value })}
//           >
//             <option>Pending</option>
//             <option>In Progress</option>
//             <option>Completed</option>
//           </select>
//           <button
//             className="bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700"
//             onClick={handleUpdate}
//           >
//             Update Changes
//           </button>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default TaskModal;


import React, { useState } from "react";
import { RiEditLine, RiCloseLine, RiCheckLine } from "react-icons/ri";

const TaskModal = ({ task, close, onSave }) => {
  const [form, setForm] = useState({
    ...task,
    emp: task.employee || task.emp,
    title: task.task || task.title
  });

  const handleUpdate = () => {
    onSave({
      ...form,
      employee: form.emp,
      task: form.title
    });
  };

  return (
    <div className="fixed inset-0 z-[110] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-slate-900/40 backdrop-blur-[2px]" onClick={close} />
      
      <div className="relative bg-white w-full max-w-md rounded-[2rem] shadow-2xl overflow-hidden animate-in slide-in-from-bottom-4 duration-200">
        {/* Header */}
        <div className="p-6 border-b border-slate-100 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-amber-100 text-amber-600 flex items-center justify-center">
              <RiEditLine size={20} />
            </div>
            <h2 className="text-lg font-black text-slate-800 tracking-tight">Quick Edit</h2>
          </div>
          <button onClick={close} className="text-slate-400 hover:text-rose-500 transition-colors">
            <RiCloseLine size={24} />
          </button>
        </div>

        {/* Form Body */}
        <div className="p-8 space-y-5">
          <div className="space-y-1">
            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Assignee Name</label>
            <input
              className="w-full px-5 py-3.5 bg-slate-50 border-2 border-slate-100 rounded-xl text-sm font-bold text-slate-700 focus:bg-white focus:border-blue-500 outline-none transition-all"
              placeholder="Employee"
              value={form.emp}
              onChange={(e) => setForm({ ...form, emp: e.target.value })}
            />
          </div>

          <div className="space-y-1">
            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Task Description</label>
            <input
              className="w-full px-5 py-3.5 bg-slate-50 border-2 border-slate-100 rounded-xl text-sm font-bold text-slate-700 focus:bg-white focus:border-blue-500 outline-none transition-all"
              placeholder="Task Title"
              value={form.title}
              onChange={(e) => setForm({ ...form, title: e.target.value })}
            />
          </div>

          <div className="space-y-1">
            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Progress Status</label>
            <select
              className="w-full px-5 py-3.5 bg-slate-50 border-2 border-slate-100 rounded-xl text-sm font-bold text-slate-700 focus:bg-white focus:border-blue-500 outline-none transition-all cursor-pointer"
              value={form.status}
              onChange={(e) => setForm({ ...form, status: e.target.value })}
            >
              <option>Pending</option>
              <option>In Progress</option>
              <option>Completed</option>
              <option>Rejected</option>
            </select>
          </div>

          <button
            className="w-full mt-4 py-4 bg-slate-900 text-white font-bold rounded-2xl flex items-center justify-center gap-2 hover:bg-blue-600 transition-all shadow-lg shadow-slate-200 active:scale-95"
            onClick={handleUpdate}
          >
            <RiCheckLine size={20} />
            Apply Changes
          </button>
        </div>
      </div>
    </div>
  );
};

export default TaskModal;