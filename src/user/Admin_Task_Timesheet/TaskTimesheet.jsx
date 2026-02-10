import timesheetData from "../../components/Task_Timesheet/timesheetData";
import TimesheetCards from "../../components/Task_Timesheet/TimesheetCards";
import TimesheetFilters from "../../components/Task_Timesheet/TimesheetFilters";
import TimesheetTable from "../../components/Task_Timesheet/TimesheetTable";

const TaskTimesheet = () => (
  <div className="relative h-[100%] m-1 pb-10 pt-5 w-auto bg-white flex flex-col items-start pl-5 pr-5 justify-strat gap-3 min-h-full overflow-y-auto rounded-xl">
    <h1 className="text-2xl font-semibold mb-6">Task & Timesheet</h1>

    <TimesheetCards data={timesheetData}/>
    <TimesheetFilters/>
    <TimesheetTable data={timesheetData}/>
  </div>
);

export default TaskTimesheet;
