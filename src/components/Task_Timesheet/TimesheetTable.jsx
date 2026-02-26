import React, { useState } from "react";
import TaskModal from "../Task_Timesheet/TimeSheetModel";

const TaskTable = () => {

  const [open, setOpen] = useState(false);
  const [selectedTask, setSelectedTask] = useState(null);

  const [tasks, setTasks] = useState([
    { id:1, emp:"Rohit", task:"UI Design", date:"04-02-2026", hours:"6h", status:"Approval Pending", reason:"" },
    { id:2, emp:"Amit", task:"API Integration", date:"04-02-2026", hours:"4h", status:"In Progress", reason:"" },
    { id:3, emp:"Neha", task:"Testing", date:"04-02-2026", hours:"5h", status:"Completed", reason:"" },
  ]);

  const statusStyle = (status) => {
    switch(status){
      case "Completed":
        return "bg-green-100 text-green-700";
      case "Approval Pending":
        return "bg-purple-100 text-purple-700";
      case "In Progress":
        return "bg-blue-100 text-blue-700";
      case "Rejected":
        return "bg-red-100 text-red-700";
      default:
        return "bg-gray-100 text-gray-600";
    }
  };

  // ✅ Approve Task
  const approveTask = (id) => {
    setTasks(tasks.map(t =>
      t.id === id ? { ...t, status:"Completed", reason:"" } : t
    ));
  };

  // ✅ Reject Task with reason
  const rejectTask = (id) => {
    const reason = prompt("Enter rejection reason");
    if(!reason) return;

    setTasks(tasks.map(t =>
      t.id === id ? { ...t, status:"Rejected", reason } : t
    ));
  };

  return (
    <div className="bg-white rounded-2xl shadow border border-gray-200 p-6">

      <div className="flex justify-between items-center mb-5">
        <h2 className="text-xl font-semibold">
          Task & Timesheet Management
        </h2>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-sm">

          <thead className="bg-gray-50 border-b text-gray-600">
            <tr>
              <th className="p-4 text-left">Employee</th>
              <th className="p-4 text-left">Task</th>
              <th className="p-4 text-center">Date</th>
              <th className="p-4 text-center">Hours</th>
              <th className="p-4 text-center">Status</th>
              <th className="p-4 text-left">Reason</th>
              <th className="p-4 text-center">Actions</th>
            </tr>
          </thead>

          <tbody>
            {tasks.map((t) => (
              <tr key={t.id} className="border-b hover:bg-blue-50 transition">

                <td className="p-4 font-medium">{t.emp}</td>
                <td className="p-4">{t.task}</td>
                <td className="p-4 text-center">{t.date}</td>
                <td className="p-4 text-center">{t.hours}</td>

                <td className="p-4 text-center">
                  <span className={`px-3 py-1 rounded-full text-xs font-semibold ${statusStyle(t.status)}`}>
                    {t.status}
                  </span>
                </td>

                <td className="p-4 text-gray-500">
                  {t.reason || "-"}
                </td>

                <td className="p-4">
                  <div className="flex justify-center gap-4 text-lg">

                    <i
                      className="ri-eye-line cursor-pointer text-blue-600 hover:scale-110"
                      onClick={()=>{
                        setSelectedTask(t);
                        setOpen(true);
                      }}
                    ></i>

                    <i
                      className="ri-check-line text-green-600 cursor-pointer hover:scale-110"
                      onClick={()=>approveTask(t.id)}
                    ></i>

                    <i
                      className="ri-close-line text-red-600 cursor-pointer hover:scale-110"
                      onClick={()=>rejectTask(t.id)}
                    ></i>

                  </div>
                </td>

              </tr>
            ))}
          </tbody>

        </table>
      </div>

      {open && (
        <TaskModal
          task={selectedTask}
          close={()=>setOpen(false)}
        />
      )}
    </div>
  );
};

export default TaskTable;