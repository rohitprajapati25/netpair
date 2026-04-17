import { useState } from "react";
import { useAuth } from "../../contexts/AuthContext";
import axios from "axios";
import { RiAddLine } from "react-icons/ri";
import AddTaskModal from "../../components/Task_Timesheet/AddTaskModal";
import TasksTable from "../../components/Task_Timesheet/TimesheetTable";
import TimesheetSubmitModal from "../../components/Task_Timesheet/TimesheetSubmitModal";
import TimesheetCards from "../../components/Task_Timesheet/TimesheetCards";
import TimesheetFilters from "../../components/Task_Timesheet/TimesheetFilters";
import { SkeletonHeader, SkeletonFilter, SkeletonStats, SkeletonTable } from "../../components/Skeletons";
import { useTasks, useTimesheets, useProjects } from '../../hooks/useTaskTimesheet';

const TaskTimesheet = () => {
  const { role, token } = useAuth();
  const [activeTab, setActiveTab] = useState("tasks");
  const [filters, setFilters] = useState({ search: "", status: "All" });
  const [addTaskOpen, setAddTaskOpen] = useState(false);
  const [submitTimesheetOpen, setSubmitTimesheetOpen] = useState(false);

  const { data: tasksData, isLoading: tasksLoading, refetch: refetchTasks } = useTasks();
  const { data: timesheetsData, isLoading: timesheetsLoading, refetch: refetchTimesheets } = useTimesheets();
  const { data: projectsData, refetch: refetchProjects } = useProjects();

  const tasks = tasksData || [];
  const timesheets = timesheetsData || [];
  const projects = projectsData || [];

  const loading = tasksLoading || timesheetsLoading;

  const data = activeTab === "tasks" ? tasks : timesheets;
  const totalTasks = tasks.length;
  const totalHours = Array.isArray(timesheets) ? timesheets.reduce((sum, ts) => sum + (ts.hours_worked || 0), 0) : 0;
  const approvedTimesheets = Array.isArray(timesheets) ? timesheets.filter(ts => ts.status === "Approved").length : 0;

  const handleRefresh = () => {
    refetchTasks();
    refetchTimesheets();
    refetchProjects();
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <SkeletonHeader />
        <SkeletonStats count={3} />
        <SkeletonFilter />
        <SkeletonTable rows={6} />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl lg:text-3xl font-black text-slate-800 tracking-tight">Tasks & Timesheets</h1>
          <p className="text-slate-500 font-medium mt-1">Manage team workload and track productivity</p>
        </div>
        {role === 'employee' ? (
          <button
            onClick={() => setSubmitTimesheetOpen(true)}
            className="w-auto self-start sm:self-auto bg-indigo-600 text-white px-5 py-2.5 rounded-xl font-bold hover:bg-indigo-700 shadow-md transition-all flex items-center gap-2 text-sm"
          >
            <RiAddLine size={18} />
            Log Timesheet
          </button>
        ) : role === 'hr' ? null : (
          <button
            onClick={() => setAddTaskOpen(true)}
            className="w-auto self-start sm:self-auto bg-blue-600 text-white px-5 py-2.5 rounded-xl font-bold hover:bg-blue-700 shadow-md transition-all flex items-center gap-2 text-sm"
          >
            <RiAddLine size={18} />
            New Task
          </button>
        )}
      </div>

      <TimesheetCards data={tasks} timesheets={timesheets} />

      <TimesheetFilters filters={filters} setFilters={setFilters} total={data.length} activeTab={activeTab} />

      <div className="space-y-2">
        <div className="flex border-b border-slate-200">
          <button 
            className={`pb-3 px-6 font-bold text-sm uppercase tracking-wider ${
              activeTab === "tasks" 
                ? "border-b-2 border-blue-500 text-blue-600" 
                : "text-slate-500 hover:text-slate-700"
            }`}
            onClick={() => setActiveTab("tasks")}
          >
            Tasks ({tasks.length})
          </button>
          <button 
            className={`pb-3 px-6 font-bold text-sm uppercase tracking-wider ${
              activeTab === "timesheets" 
                ? "border-b-2 border-indigo-500 text-indigo-600" 
                : "text-slate-500 hover:text-slate-700"
            }`}
            onClick={() => setActiveTab("timesheets")}
          >
            Timesheets ({timesheets.length})
          </button>
        </div>
        <TasksTable 
          data={data} 
          type={activeTab} 
          onRefresh={handleRefresh}
          filters={filters}
          role={role}
        />
      </div>

      <AddTaskModal open={addTaskOpen} onClose={() => setAddTaskOpen(false)} onRefresh={handleRefresh} projects={projects} />
      <TimesheetSubmitModal 
        open={submitTimesheetOpen} 
        onClose={() => setSubmitTimesheetOpen(false)} 
        onRefresh={handleRefresh} 
        projects={projects}
        tasks={tasks}
      />
    </div>
  );
};

export default TaskTimesheet;

