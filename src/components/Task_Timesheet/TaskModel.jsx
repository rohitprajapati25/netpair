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


import React from "react";
import { useFormik } from "formik";

import { useAuth } from "../../contexts/AuthContext";
import axios from "axios";
import { RiEditLine, RiCloseLine, RiCheckLine, RiLoader4Line, RiMessage3Line } from "react-icons/ri";
import { taskStatusSchema } from "../../schemas/taskValidation";

const TaskDetailsModal = ({ task, onClose, onRefresh }) => {
  const { token } = useAuth();

  const formik = useFormik({
    enableReinitialize: true,
    initialValues: {
      status: task.status || "Todo",
      progress: task.progress || 0,
      comments: "",
    },
    validationSchema: taskStatusSchema,
    onSubmit: async (values) => {
      try {
        const payload = {
          status: values.status,
          progress: values.progress,
        };

        // If your backend schema has 'comments' as an ARRAY of objects:
        if (values.comments) {
          payload.comments = [{ text: values.comments }]; 
          // OR if your backend has a dedicated 'newComment' field, use that instead
        }

        const res = await axios.put(`http://localhost:5000/api/admin/tasks/${task._id}`, payload, {
          headers: { Authorization: `Bearer ${token}` }
        });
        onRefresh();
        onClose();
      } catch (error) {
        alert(error.response?.data?.message || "Update failed");
      }
    },
  });

  if (!task) return null;

  const statusColor = {
    Todo: "bg-amber-100 text-amber-800",
    "In Progress": "bg-blue-100 text-blue-800",
    Review: "bg-purple-100 text-purple-800",
    Completed: "bg-emerald-100 text-emerald-800",
    Blocked: "bg-red-100 text-red-800"
  };

  return (
    <div className="fixed inset-0 z-[110] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-slate-900/40 backdrop-blur-[2px]" onClick={onClose} />
      
      <div className="relative bg-white w-full max-w-lg rounded-[2rem] shadow-2xl overflow-hidden animate-in slide-in-from-bottom-4 duration-200 max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="p-6 border-b border-slate-100 flex items-center justify-between sticky top-0 bg-white">
          <div className="flex items-center gap-3">
            <div className={`w-10 h-10 rounded-xl ${statusColor[task.status]} flex items-center justify-center font-bold`}>
              {task.status.slice(0,1)}
            </div>
            <div>
              <h2 className="text-lg font-black text-slate-800 tracking-tight">{task.task_title}</h2>
              <p className="text-xs text-slate-500">Project: {task.project_id?.name || 'N/A'}</p>
            </div>
          </div>
          <button onClick={onClose} className="text-slate-400 hover:text-rose-500 transition-colors p-1 rounded-lg hover:bg-slate-100">
            <RiCloseLine size={24} />
          </button>
        </div>

        {/* Details */}
        <div className="p-8 space-y-6">
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <span className="text-slate-400 uppercase text-[10px] font-bold tracking-wider">Assignee</span>
              <p className="font-bold text-slate-800">{task.assigned_to?.name || 'N/A'}</p>
            </div>
            <div>
              <span className="text-slate-400 uppercase text-[10px] font-bold tracking-wider">Priority</span>
              <span className={`inline-block px-3 py-1 rounded-full text-xs font-bold ml-2 capitalize ${
                task.priority === 'Critical' ? 'bg-red-100 text-red-800' :
                task.priority === 'High' ? 'bg-orange-100 text-orange-800' : 
                'bg-slate-100 text-slate-800'
              }`}>
                {task.priority}
              </span>
            </div>
            <div>
              <span className="text-slate-400 uppercase text-[10px] font-bold tracking-wider">Start</span>
              <p className="text-slate-600">{new Date(task.start_date).toLocaleDateString()}</p>
            </div>
            <div>
              <span className="text-slate-400 uppercase text-[10px] font-bold tracking-wider">Due</span>
              <p className={`font-bold ${new Date(task.due_date) < new Date() ? 'text-red-500' : 'text-slate-600'}`}>
                {new Date(task.due_date).toLocaleDateString()}
              </p>
            </div>
          </div>

          {/* Update Form */}
          <div className="space-y-4 pt-4 border-t">
            <h4 className="font-black text-slate-800 text-lg flex items-center gap-2">
              <RiEditLine />
              Quick Update
            </h4>
            <form onSubmit={formik.handleSubmit}>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1 block mb-1">Status</label>
                  <select
                    {...formik.getFieldProps("status")}
                    className={`w-full px-4 py-3 bg-slate-50 border rounded-xl text-sm font-bold text-slate-700 focus:bg-white focus:border-blue-500 outline-none transition-all cursor-pointer ${
                      formik.touched.status && formik.errors.status ? "border-red-300" : "border-slate-100"
                    }`}
                  >
                    <option value="Todo">Todo</option>
                    <option value="In Progress">In Progress</option>
                    <option value="Review">Review</option>
                    <option value="Completed">Completed</option>
                    <option value="Blocked">Blocked</option>
                  </select>
                </div>
                <div>
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1 block mb-1">Progress</label>
                  <input
                    type="number"
                    {...formik.getFieldProps("progress")}
                    min="0"
                    max="100"
                    className={`w-full px-4 py-3 bg-slate-50 border rounded-xl text-sm font-bold focus:bg-white focus:border-blue-500 outline-none transition-all ${
                      formik.touched.progress && formik.errors.progress ? "border-red-300" : "border-slate-100"
                    }`}
                  />
                </div>
              </div>
              <div className="mt-4">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1 flex items-center gap-1 mb-2">
                  <RiMessage3Line />
                  Comment
                </label>
                <textarea
                  {...formik.getFieldProps("comments")}
                  rows={2}
                  className="w-full px-4 py-3 bg-slate-50 border rounded-xl text-sm resize-none focus:bg-white focus:border-blue-500 outline-none transition-all"
                  placeholder="Quick update note..."
                />
              </div>
              <button 
                type="submit" 
                disabled={formik.isSubmitting}
                className="w-full mt-6 py-4 bg-gradient-to-r from-emerald-500 to-emerald-600 text-white font-bold rounded-2xl flex items-center justify-center gap-2 hover:from-emerald-600 hover:to-emerald-700 shadow-xl shadow-emerald-200 transition-all active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {formik.isSubmitting ? <RiLoader4Line className="animate-spin" size={20} /> : <RiCheckLine size={20} />}
                Update Task
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TaskDetailsModal;
