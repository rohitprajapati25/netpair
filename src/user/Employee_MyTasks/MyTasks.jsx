import React, { useState, useEffect } from "react";
import { useAuth } from "../../contexts/AuthContext";
import axios from "axios";
import TasksTable from "../../components/Task_Timesheet/TimesheetTable";
import TimesheetSubmitModal from "../../components/Task_Timesheet/TimesheetSubmitModal";
import TimesheetFilters from "../../components/Task_Timesheet/TimesheetFilters";
import { SkeletonStats, SkeletonTable } from "../../components/Skeletons";
import { RiAddLine } from "react-icons/ri";

const MyTasks = () => {
  const { token } = useAuth();
  const [myTasks, setMyTasks] = useState([]);
  const [timesheets, setTimesheets] = useState([]);
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({ search: "", status: "All" });
  const [submitOpen, setSubmitOpen] = useState(false);
  const [activeTab, setActiveTab] = useState("my-tasks");

  useEffect(() => {
    fetchEmployeeData();
  }, [activeTab]);

  const fetchEmployeeData = async () => {
    try {
      setLoading(true);
      const [tasksRes, timesheetsRes, projectsRes] = await Promise.all([
        axios.get('http://localhost:5000/api/employee/tasks', { headers: { Authorization: `Bearer ${token}` } }),
        axios.get('http://localhost:5000/api/employee/timesheets', { headers: { Authorization: `Bearer ${token}` } }),
        axios.get('http://localhost:5000/api/admin/projects', { headers: { Authorization: `Bearer ${token}` } })
      ]);
      setMyTasks(tasksRes.data.tasks || []);
      setTimesheets(timesheetsRes.data || []);
      setProjects(projectsRes.data || []);
    } catch (error) {
      console.error("Fetch failed:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleRefresh = () => fetchEmployeeData();

  const data = activeTab === "my-tasks" ? myTasks : timesheets;

  if (loading) {
    return (
      <div className="p-6 lg:p-10 space-y-8">
        <div className="h-12 bg-slate-200 rounded-xl animate-pulse w-64" />
        <SkeletonStats count={2} />
        <div className="mt-8"><SkeletonTable rows={5} /></div>
      </div>
    );
  }

  return (
    <div className="p-6 lg:p-10 space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-black text-slate-800">My Tasks</h1>
        <button
          onClick={() => setSubmitOpen(true)}
          className="bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-3 rounded-xl font-bold shadow-lg flex items-center gap-2 transition-all"
        >
          <RiAddLine />
          Log Hours
        </button>
      </div>

      <TimesheetFilters filters={filters} setFilters={setFilters} total={data.length} />

      <div className="flex space-x-1 mb-4">
        <button 
          onClick={() => setActiveTab("my-tasks")}
          className={`pb-2 px-6 font-bold rounded-t-lg ${
            activeTab === "my-tasks" ? "bg-white text-slate-800 border-b-2 border-blue-500 shadow-sm" : "text-slate-500 hover:text-slate-700"
          }`}
        >
          My Tasks ({myTasks.length})
        </button>
        <button 
          onClick={() => setActiveTab("timesheets")}
          className={`pb-2 px-6 font-bold rounded-t-lg ${
            activeTab === "timesheets" ? "bg-white text-slate-800 border-b-2 border-indigo-500 shadow-sm" : "text-slate-500 hover:text-slate-700"
          }`}
        >
          My Timesheets ({timesheets.length})
        </button>
      </div>

      <TasksTable 
        data={data} 
        type={activeTab === "my-tasks" ? "tasks" : "timesheets"} 
        onRefresh={handleRefresh}
        filters={filters}
        role="employee"
      />

      <TimesheetSubmitModal 
        open={submitOpen}
        onClose={() => setSubmitOpen(false)}
        onRefresh={handleRefresh}
        projects={projects}
        tasks={myTasks}
      />
    </div>
  );
};

export default MyTasks;

