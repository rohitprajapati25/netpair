// import React, { useState } from "react";
// import TaskModal from "../Task_Timesheet/TimeSheetModel";

// const TaskTable = ({ tasks, setTasks }) => {
//   const [open, setOpen] = useState(false);
//   const [selectedTask, setSelectedTask] = useState(null);

//   const statusStyle = (status) => {
//     switch (status) {
//       case "Completed": return "bg-green-100 text-green-700";
//       case "In Progress": return "bg-blue-100 text-blue-700";
//       case "Rejected": return "bg-red-100 text-red-700";
//       default: return "bg-purple-100 text-purple-700";
//     }
//   };

//   const deleteTask = (id) => {
//     if (window.confirm("Delete this task?")) {
//       setTasks(tasks.filter((t) => t.id !== id));
//     }
//   };

//   const onUpdateTask = (updatedTask) => {
//     const updated = tasks.map((t) => (t.id === updatedTask.id ? updatedTask : t));
//     setTasks(updated);
//     setOpen(false);
//   };

//   return (
//     <div className="bg-white rounded-2xl shadow border border-gray-200 p-6">
//       <div className="overflow-x-auto">
//         <table className="w-full text-sm">
//           <thead className="bg-gray-50 border-b text-gray-600">
//             <tr>
//               <th className="p-4 text-left">Employee</th>
//               <th className="p-4 text-left">Task</th>
//               <th className="p-4 text-center">Date</th>
//               <th className="p-4 text-center">Hours</th>
//               <th className="p-4 text-center">Status</th>
//               <th className="p-4 text-center">Actions</th>
//             </tr>
//           </thead>
//           <tbody>
//             {tasks.map((t) => (
//               <tr key={t.id} className="border-b hover:bg-blue-50 transition">
//                 <td className="p-4 font-medium">{t.employee || t.emp}</td>
//                 <td className="p-4">{t.task || t.title}</td>
//                 <td className="p-4 text-center">{t.date || t.startDate}</td>
//                 <td className="p-4 text-center">{t.hours}</td>
//                 <td className="p-4 text-center">
//                   <span className={`px-3 py-1 rounded-full text-xs font-semibold ${statusStyle(t.status)}`}>
//                     {t.status}
//                   </span>
//                 </td>
//                 <td className="p-4">
//                   <div className="flex justify-center gap-4 text-lg">
//                     <i
//                       className="ri-edit-line cursor-pointer text-blue-600 hover:scale-110"
//                       onClick={() => { setSelectedTask(t); setOpen(true); }}
//                     ></i>
//                     <i
//                       className="ri-delete-bin-line text-red-600 cursor-pointer hover:scale-110"
//                       onClick={() => deleteTask(t.id)}
//                     ></i>
//                   </div>
//                 </td>
//               </tr>
//             ))}
//           </tbody>
//         </table>
//       </div>

//       {open && (
//         <TaskModal
//           task={selectedTask}
//           close={() => setOpen(false)}
//           onSave={onUpdateTask}
//         />
//       )}
//     </div>
//   );
// };

// export default TaskTable;

import React, { useState } from "react";
import TaskModal from "./TaskModel";
import { RiEditLine, RiDeleteBinLine, RiTimeLine, RiUserLine } from "react-icons/ri";

const TaskTable = ({ tasks, setTasks, allTasks }) => {
  const [selectedTask, setSelectedTask] = useState(null);

  const getStatusStyle = (status) => {
    const styles = {
      Completed: "bg-emerald-50 text-emerald-700 border-emerald-100",
      "In Progress": "bg-blue-50 text-blue-700 border-blue-100",
      Pending: "bg-amber-50 text-amber-700 border-amber-100",
      Assigned: "bg-purple-50 text-purple-700 border-purple-100",
    };
    return styles[status] || "bg-slate-50 text-slate-500";
  };

  const handleDelete = (id) => {
    if (window.confirm("Permanent delete this task?")) {
      setTasks(allTasks.filter(t => t.id !== id));
    }
  };

  return (
    <div className="bg-white rounded-b-3xl border-x border-b border-slate-100 overflow-hidden">
      <table className="w-full text-left border-collapse">
        <thead>
          <tr className="bg-slate-50/50 text-[10px] font-black uppercase tracking-widest text-slate-400 border-b border-slate-100">
            <th className="px-8 py-5">Assignee</th>
            <th className="px-8 py-5">Task Overview</th>
            <th className="px-8 py-5 text-center">Timeline</th>
            <th className="px-8 py-5 text-center">Hours</th>
            <th className="px-8 py-5 text-center">Status</th>
            <th className="px-8 py-5 text-right">Actions</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-50">
          {tasks.map((t) => (
            <tr key={t.id} className="group hover:bg-blue-50/30 transition-colors">
              <td className="px-8 py-5">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center text-slate-500 border border-slate-200">
                    <RiUserLine />
                  </div>
                  <span className="font-bold text-slate-700 text-sm">{t.employee || t.emp || "Unassigned"}</span>
                </div>
              </td>
              <td className="px-8 py-5">
                <p className="font-semibold text-slate-800 text-sm leading-tight">{t.task || t.title}</p>
                <p className="text-[10px] text-slate-400 mt-1 font-medium italic">Project: Internal System</p>
              </td>
              <td className="px-8 py-5 text-center">
                <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-slate-100 rounded-lg text-[11px] font-bold text-slate-600">
                  <RiTimeLine className="text-blue-500" /> {t.date || t.startDate || t.deadline}
                </div>
              </td>
              <td className="px-8 py-5 text-center font-black text-slate-600 text-sm">{t.hours || "0"}h</td>
              <td className="px-8 py-5 text-center">
                <span className={`px-3 py-1.5 rounded-xl text-[10px] font-black border uppercase tracking-wider ${getStatusStyle(t.status)}`}>
                  {t.status}
                </span>
              </td>
              <td className="px-8 py-5 text-right">
                <div className="flex justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                  <button onClick={() => setSelectedTask(t)} className="p-2.5 text-blue-600 hover:bg-white rounded-xl shadow-sm border border-transparent hover:border-blue-100 transition-all">
                    <RiEditLine size={18} />
                  </button>
                  <button onClick={() => handleDelete(t.id)} className="p-2.5 text-rose-500 hover:bg-white rounded-xl shadow-sm border border-transparent hover:border-rose-100 transition-all">
                    <RiDeleteBinLine size={18} />
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {selectedTask && (
        <TaskModal
          task={selectedTask}
          close={() => setSelectedTask(null)}
          onSave={(updated) => {
            setTasks(allTasks.map(tk => tk.id === updated.id ? updated : tk));
            setSelectedTask(null);
          }}
        />
      )}
    </div>
  );
};

export default TaskTable;