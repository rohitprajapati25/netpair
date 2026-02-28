import TimesheetData from "../../components/Task_Timesheet/TimesheetData";
import TimesheetCards from "../../components/Task_Timesheet/TimesheetCards";
import TimesheetFilters from "../../components/Task_Timesheet/TimesheetFilters";
import TimesheetTable from "../../components/Task_Timesheet/TimesheetTable";
import AddTaskModal from "../../components/Task_Timesheet/AddTaskBtnModel";
import { useState } from "react";

const TaskTimesheet = () => {
   const [open, setOpen] = useState(false);
  const [tasks, setTasks] = useState([]);

  const saveTask = (newTask) => {
    setTasks([...tasks, newTask]);
  };
  return (
    <div className="relative h-full m-1 p-6
      bg-gradient-to-br from-slate-50 to-gray-100
      flex flex-col gap-6 overflow-y-auto rounded-2xl">

      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <h1 className="text-2xl font-semibold text-gray-800">
          Task & Timesheet
        </h1>

        <button
        onClick={() => setOpen(true)}
        className="bg-blue-600 text-white px-4 py-2 rounded-lg"
      >
        + Add Task
      </button>
      <AddTaskModal
        open={open}
        onClose={() => setOpen(false)}
        onSave={saveTask}
      />
      </div>
      <TimesheetCards data={TimesheetData} />

      <TimesheetFilters />

      <TimesheetTable />

    </div>
  );
};

export default TaskTimesheet;