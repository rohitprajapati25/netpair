import React, { useState } from "react";

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
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 backdrop-blur-sm">
      <div className="bg-white rounded-2xl w-[420px] p-6 shadow-xl">
        <h2 className="text-xl font-semibold mb-5">Edit Details</h2>
        <div className="flex flex-col gap-4">
          <input
            className="border p-2 rounded-lg"
            placeholder="Employee"
            value={form.emp}
            onChange={(e) => setForm({ ...form, emp: e.target.value })}
          />
          <input
            className="border p-2 rounded-lg"
            placeholder="Task"
            value={form.title}
            onChange={(e) => setForm({ ...form, title: e.target.value })}
          />
          <select
            className="border p-2 rounded-lg"
            value={form.status}
            onChange={(e) => setForm({ ...form, status: e.target.value })}
          >
            <option>Pending</option>
            <option>In Progress</option>
            <option>Completed</option>
          </select>
          <button
            className="bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700"
            onClick={handleUpdate}
          >
            Update Changes
          </button>
        </div>
      </div>
    </div>
  );
};

export default TaskModal;