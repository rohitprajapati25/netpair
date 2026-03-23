// import React, { useState } from "react";
// import TimesheetCards from "../../components/Task_Timesheet/TimesheetCards";
// import TimesheetFilters from "../../components/Task_Timesheet/TimesheetFilters";
// import TimesheetTable from "../../components/Task_Timesheet/TimesheetTable";
// import AddTaskModal from "../../components/Task_Timesheet/AddTaskBtnModel";
// import TimesheetData from "../../components/Task_Timesheet/TimesheetData";

// const TaskTimesheet = () => {
//   const [open, setOpen] = useState(false);
//   // Initial data ko state mein load kiya
//   const [tasks, setTasks] = useState(TimesheetData);

//   const saveTask = (newTask) => {
//     // Naya task list mein add kiya (top par dikhane ke liye spread use kiya)
//     setTasks([newTask, ...tasks]);
//     setOpen(false);
//   };

//   const updateTasks = (updatedList) => {
//     setTasks(updatedList);
//   };

//   return (
//     <div className="relative h-full m-1 p-6 bg-gradient-to-br from-slate-50 to-gray-100 flex flex-col gap-6 overflow-y-auto rounded-2xl">
//       <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
//         <h1 className="text-2xl font-semibold text-gray-800">Task & Timesheet</h1>
//         <button
//           onClick={() => setOpen(true)}
//           className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition"
//         >
//           + Add Task
//         </button>
//       </div>

//       <TimesheetCards data={tasks} />
//       <TimesheetFilters />

//       {/* Ab table wahi data dikhayega jo state mein hai */}
//       <TimesheetTable tasks={tasks} setTasks={updateTasks} />

//       <AddTaskModal
//         open={open}
//         onClose={() => setOpen(false)}
//         onSave={saveTask}
//       />
//     </div>
//   );
// };

// export default TaskTimesheet;

import React, { useState, useMemo } from "react";
import TimesheetCards from "../../components/Task_Timesheet/TimesheetCards";
import TimesheetFilters from "../../components/Task_Timesheet/TimesheetFilters";
import TimesheetTable from "../../components/Task_Timesheet/TimesheetTable";
import AddTaskModal from "../../components/Task_Timesheet/AddTaskModal";
import TimesheetData from "../../components/Task_Timesheet/TimesheetData";
import { RiAddLine } from "react-icons/ri";

const TaskTimesheet = () => {
  const [open, setOpen] = useState(false);
  const [tasks, setTasks] = useState(TimesheetData);
  const [filters, setFilters] = useState({ search: "", status: "All" });

  // Filter Logic: Ye original 'tasks' ko modify nahi karega
  const filteredTasks = useMemo(() => {
    return tasks.filter((t) => {
      const taskTitle = (t.task || t.title || "").toLowerCase();
      const empName = (t.employee || t.emp || "").toLowerCase();
      const matchesSearch = taskTitle.includes(filters.search.toLowerCase()) || 
                           empName.includes(filters.search.toLowerCase());
      const matchesStatus = filters.status === "All" || t.status === filters.status;
      return matchesSearch && matchesStatus;
    });
  }, [tasks, filters]);

  const saveTask = (newTask) => {
    setTasks([newTask, ...tasks]);
    setOpen(false);
  };

  return (
    <div className="min-h-screen bg-slate-50/50 p-6 lg:p-10 flex flex-col gap-8">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-black text-slate-800 tracking-tight">Task & Timesheet</h1>
          <p className="text-slate-500 font-medium text-sm">Monitor productivity and track task lifecycles</p>
        </div>
        <button
          onClick={() => setOpen(true)}
          className="bg-blue-600 text-white px-6 py-3 rounded-2xl hover:bg-blue-700 shadow-lg shadow-blue-100 transition-all font-bold flex items-center gap-2 active:scale-95"
        >
          <RiAddLine size={24} /> Create New Task
        </button>
      </div>

      <TimesheetCards data={tasks} />
      
      <div className="flex flex-col shadow-sm">
        <TimesheetFilters filters={filters} setFilters={setFilters} total={filteredTasks.length} />
        <TimesheetTable tasks={filteredTasks} setTasks={setTasks} allTasks={tasks} />
      </div>

      {open && <AddTaskModal open={open} onClose={() => setOpen(false)} onSave={saveTask} />}
    </div>
  );
};

export default TaskTimesheet;