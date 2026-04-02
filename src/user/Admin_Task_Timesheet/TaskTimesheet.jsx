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

import React, { useState, useEffect } from "react";
import { useAuth } from "../../contexts/AuthContext";
import axios from "axios";
import { RiAddLine, RiLoader2Line } from "react-icons/ri";
import AddTaskModal from "../../components/Task_Timesheet/AddTaskModal";
import TasksTable from "../../components/Task_Timesheet/TimesheetTable";
import TimesheetSubmitModal from "../../components/Task_Timesheet/TimesheetSubmitModal";
import TimesheetCards from "../../components/Task_Timesheet/TimesheetCards";
import TimesheetFilters from "../../components/Task_Timesheet/TimesheetFilters";

const TaskTimesheet = () => {
  const { role, token } = useAuth();
  const [activeTab, setActiveTab] = useState("tasks");
  const [tasks, setTasks] = useState([]);
  const [timesheets, setTimesheets] = useState([]);
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({ search: "", status: "All" });
  const [addTaskOpen, setAddTaskOpen] = useState(false);
  const [submitTimesheetOpen, setSubmitTimesheetOpen] = useState(false);

  useEffect(() => {
    fetchData();
  }, [activeTab]);

  const fetchData = async () => {
    try {
      setLoading(true);
      const tasksRes = await axios.get('http://localhost:5000/api/admin/tasks', { headers: { Authorization: `Bearer ${token}` } });
      const timesheetsRes = await axios.get('http://localhost:5000/api/admin/timesheets', { headers: { Authorization: `Bearer ${token}` } });
      const projectsRes = await axios.get('http://localhost:5000/api/admin/projects', { headers: { Authorization: `Bearer ${token}` } });
      console.log('Projects full response:', projectsRes.data);
      setTasks(tasksRes.data.tasks || []);
      setTimesheets(timesheetsRes.data || []);
      setProjects(projectsRes.data.projects || projectsRes.data || []);

    } catch (error) {
      console.error("Fetch failed:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleRefresh = () => fetchData();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <RiLoader2Line className="animate-spin text-4xl text-slate-400" />
      </div>
    );
  }

  const data = activeTab === "tasks" ? tasks : timesheets;
  const totalTasks = tasks.length;
  const totalHours = timesheets.reduce((sum, ts) => sum + (ts.hours_worked || 0), 0);
  const approvedTimesheets = timesheets.filter(ts => ts.status === "Approved").length;

  return (
    <div className="p-6 lg:p-10 space-y-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl md:text-4xl font-black text-slate-800 tracking-tight">Tasks & Timesheets</h1>
          <p className="text-slate-500 font-medium mt-1">Manage team workload and track productivity</p>
        </div>
        {role === 'employee' ? (
          <button
            onClick={() => setSubmitTimesheetOpen(true)}
            className="bg-indigo-600 text-white px-8 py-3 rounded-2xl font-bold hover:bg-indigo-700 shadow-lg shadow-indigo-200 transition-all flex items-center gap-2"
          >
            <RiAddLine />
            Log Timesheet
          </button>
        ) : (
          <button
            onClick={() => setAddTaskOpen(true)}
            className="bg-blue-600 text-white px-8 py-3 rounded-2xl font-bold hover:bg-blue-700 shadow-lg shadow-blue-200 transition-all flex items-center gap-2"
          >
            <RiAddLine />
            New Task
          </button>
        )}
      </div>

      {/* Stats Cards */}
      <TimesheetCards data={tasks} timesheets={timesheets} />

      {/* Filters */}
      <TimesheetFilters filters={filters} setFilters={setFilters} total={data.length} />

      {/* Tabbed Tables */}
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

      {/* Modals */}
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
