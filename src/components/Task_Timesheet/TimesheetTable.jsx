import React, { useState } from "react";
import TaskModal from "../Task_Timesheet/TimeSheetModel";

const TaskTable = ({ tasks, setTasks }) => {
  const [open, setOpen] = useState(false);
  const [selectedTask, setSelectedTask] = useState(null);

  const statusStyle = (status) => {
    switch (status) {
      case "Completed": return "bg-green-100 text-green-700";
      case "In Progress": return "bg-blue-100 text-blue-700";
      case "Rejected": return "bg-red-100 text-red-700";
      default: return "bg-purple-100 text-purple-700";
    }
  };

  const deleteTask = (id) => {
    if (window.confirm("Delete this task?")) {
      setTasks(tasks.filter((t) => t.id !== id));
    }
  };

  const onUpdateTask = (updatedTask) => {
    const updated = tasks.map((t) => (t.id === updatedTask.id ? updatedTask : t));
    setTasks(updated);
    setOpen(false);
  };

  return (
    <div className="bg-white rounded-2xl shadow border border-gray-200 p-6">
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead className="bg-gray-50 border-b text-gray-600">
            <tr>
              <th className="p-4 text-left">Employee</th>
              <th className="p-4 text-left">Task</th>
              <th className="p-4 text-center">Date</th>
              <th className="p-4 text-center">Status</th>
              <th className="p-4 text-center">Actions</th>
            </tr>
          </thead>
          <tbody>
            {tasks.map((t) => (
              <tr key={t.id} className="border-b hover:bg-blue-50 transition">
                <td className="p-4 font-medium">{t.employee || t.emp}</td>
                <td className="p-4">{t.task || t.title}</td>
                <td className="p-4 text-center">{t.date || t.startDate}</td>
                <td className="p-4 text-center">
                  <span className={`px-3 py-1 rounded-full text-xs font-semibold ${statusStyle(t.status)}`}>
                    {t.status}
                  </span>
                </td>
                <td className="p-4">
                  <div className="flex justify-center gap-4 text-lg">
                    <i
                      className="ri-edit-line cursor-pointer text-blue-600 hover:scale-110"
                      onClick={() => { setSelectedTask(t); setOpen(true); }}
                    ></i>
                    <i
                      className="ri-delete-bin-line text-red-600 cursor-pointer hover:scale-110"
                      onClick={() => deleteTask(t.id)}
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
          close={() => setOpen(false)}
          onSave={onUpdateTask}
        />
      )}
    </div>
  );
};

export default TaskTable;