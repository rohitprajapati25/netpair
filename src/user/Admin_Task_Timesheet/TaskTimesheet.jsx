import timesheetData from "../../components/Task_Timesheet/timesheetData";
import TimesheetCards from "../../components/Task_Timesheet/TimesheetCards";
import TimesheetFilters from "../../components/Task_Timesheet/TimesheetFilters";
import TimesheetTable from "../../components/Task_Timesheet/TimesheetTable";

const TaskTimesheet = () => {
  return (
    <div className="h-full m-1 p-6
      bg-gray-50 rounded-2xl
      flex flex-col gap-6 overflow-y-auto">

      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-semibold text-gray-800">
          Task & Timesheet
        </h1>

        <button
          className="flex items-center gap-2
          bg-blue-600 hover:bg-blue-700
          text-white px-4 py-2 rounded-lg
          shadow-md transition"
        >
          <i className="ri-add-line text-lg"></i>
          Add Task
        </button>
      </div>
      <TimesheetCards data={timesheetData} />

      <TimesheetFilters />

      <TimesheetTable data={timesheetData} />

    </div>
  );
};

export default TaskTimesheet;