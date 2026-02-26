import React, { useState } from "react";

const TaskModal = ({ task, close }) => {

  const [form, setForm] = useState(task);

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">

      <div className="bg-white rounded-2xl w-[420px] p-6 shadow-xl">

        <div className="flex justify-between items-center mb-5">
          <h2 className="text-xl font-semibold">Edit Task</h2>
          <i
            className="ri-close-line text-xl cursor-pointer"
            onClick={close}
          ></i>
        </div>

        <div className="flex flex-col gap-4">

          <input
            className="border p-2 rounded-lg"
            value={form.emp}
            onChange={(e)=>setForm({...form, emp:e.target.value})}
          />

          <input
            className="border p-2 rounded-lg"
            value={form.task}
            onChange={(e)=>setForm({...form, task:e.target.value})}
          />

          <input
            className="border p-2 rounded-lg"
            value={form.hours}
            onChange={(e)=>setForm({...form, hours:e.target.value})}
          />

          <select
            className="border p-2 rounded-lg"
            value={form.status}
            onChange={(e)=>setForm({...form, status:e.target.value})}
          >
            <option>Pending</option>
            <option>In Progress</option>
            <option>Approval Pending</option>
            <option>Completed</option>
          </select>

          <button
            className="bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition"
            onClick={close}
          >
            Save Changes
          </button>

        </div>
      </div>
    </div>
  );
};

export default TaskModal;