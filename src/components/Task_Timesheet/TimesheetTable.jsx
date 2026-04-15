import React, { useState, useEffect } from "react";
import TaskDetailsModal from "./TaskModel";
import TimesheetApprovalModal from "./TimesheetApprovalModal";
import { useAuth } from "../../contexts/AuthContext";
import axios from "axios";
import { RiEditLine, RiDeleteBinLine, RiLoader4Line, RiCheckLine } from "react-icons/ri";

const TasksTable = ({ 
  data, 
  type = "tasks", // "tasks" or "timesheets"
  onRefresh, 
  filters = {},
  role 
}) => {
  const { token } = useAuth();
  const [loading, setLoading] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);
  const [selectedTimesheet, setSelectedTimesheet] = useState(null);

  const getStatusStyle = (status) => {
    const taskStyles = {
      Todo: "bg-amber-100 text-amber-800",
      "In Progress": "bg-blue-100 text-blue-800",
      Review: "bg-purple-100 text-purple-800",
      Completed: "bg-emerald-100 text-emerald-800",
      Blocked: "bg-red-100 text-red-800"
    };
    const timesheetStyles = {
      Submitted: "bg-orange-100 text-orange-800",
      Approved: "bg-emerald-100 text-emerald-800",
      Rejected: "bg-red-100 text-red-800"
    };
    return type === "tasks" ? taskStyles[status] : timesheetStyles[status] || "bg-slate-100 text-slate-800";
  };

// const handleDelete = async (e, id) => {
//   e.preventDefault();
//   e.stopPropagation();
//     if (window.confirm(`Delete this ${type}?`)) {
//       try {
//         await axios.delete(`http://localhost:5000/api/admin/${type}/${id}`, {
//           headers: { Authorization: `Bearer ${token}` }
//         });
//         onRefresh();
//       } catch (error) {
//         alert("Delete failed");
//       }
//     }
//   };


const handleDelete = async (e, id) => {
  e.preventDefault();
  e.stopPropagation();

  if (!id) return alert("Invalid ID");

  if (!["admin", "superadmin"].includes(role)) {
    return alert("Not authorized");
  }

  const confirmMsg = `Delete ${type}?`;
  if (window.confirm(confirmMsg)) {
    try {
      const endpoint = type === "tasks" ? `/api/admin/tasks/${id}` : `/api/admin/timesheets/${id}`;
      await axios.delete(`http://localhost:5000${endpoint}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      onRefresh();
    } catch (error) {
      console.error(error.response || error.message);
      alert(error.response?.data?.message || "Delete failed");
    }
  }
};
  const filteredData = data.filter(item => {
    if (filters.search) {
      const search = filters.search.toLowerCase();
      return item.task_title?.toLowerCase().includes(search) || 
             item.work_description?.toLowerCase().includes(search) ||
             item.assigned_to?.name?.toLowerCase().includes(search);
    }
    if (filters.status !== "All") {
      return item.status === filters.status;
    }
    return true;
  });

  return (
    <div className="bg-white rounded-b-2xl border-x border-b border-slate-100 overflow-hidden">
      <table className="w-full text-left border-collapse">
        <thead>
          <tr className="bg-slate-50/50 text-[10px] font-black uppercase tracking-widest text-slate-400 border-b border-slate-100">
            <th className="px-8 py-5">Owner</th>
            <th className="px-8 py-5">Title/Work</th>
            {type === "tasks" && <th className="px-8 py-5">Project</th>}
            <th className="px-8 py-5 text-center">Date</th>
            <th className="px-8 py-5 text-center">Hours</th>
            <th className="px-8 py-5 text-center">Status</th>
            <th className="px-8 py-5 text-right">Actions</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-50">
          {loading ? (
            <tr>
              <td colSpan={7} className="p-8 text-center">
                <RiLoader4Line className="animate-spin mx-auto text-2xl text-slate-400" />
              </td>
            </tr>
          ) : filteredData.length === 0 ? (
            <tr>
              <td colSpan={7} className="p-12 text-center text-slate-400">
                No {type} found matching filters
              </td>
            </tr>
          ) : (
            filteredData.map((item) => (
              <tr key={item._id || item.id} className="hover:bg-slate-50/50 transition-colors">
                <td className="px-8 py-5">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center text-slate-500 border">
                      {item.assigned_to?.name?.[0] || item.employee_id?.name?.[0] || "U"}
                    </div>
                    <span className="font-bold text-slate-700 text-sm">{item.assigned_to?.name || item.employee_id?.name}</span>
                  </div>
                </td>
                <td className="px-8 py-5 max-w-xs">
                  <div>
                    <p className="font-semibold text-slate-800 text-sm line-clamp-2">{item.task_title || item.work_description}</p>
                    {type === "timesheets" && item.task_id && (
                      <p className="text-xs text-slate-500">Task: {item.task_id.task_title}</p>
                    )}
                  </div>
                </td>
                {type === "tasks" && (
                  <td className="px-8 py-5">
                    <span className="px-3 py-1 bg-slate-100 rounded-full text-xs font-medium text-slate-700">
                      {item.project_id?.name}
                    </span>
                  </td>
                )}
                <td className="px-8 py-5 text-center text-sm text-slate-600">
                  {new Date(item.start_date || item.date).toLocaleDateString()}
                </td>
                <td className="px-8 py-5 text-center font-bold text-slate-700 text-lg">
{item.hours_worked ? item.hours_worked + 'h' : (item.estimated_hours ? item.estimated_hours + 'h' : '0h')}
                </td>
                <td className="px-8 py-5 text-center">
                  <span className={`px-4 py-2 rounded-xl text-[11px] font-bold border-2 uppercase tracking-wide inline-block ${getStatusStyle(item.status)}`}>
                    {item.status}
                  </span>
                </td>
                {/* <td className="px-8 py-5 text-right">
                  <div className="flex justify-end gap-1">
                    {type === "tasks" && (
                      <button 
                        onClick={() => setSelectedItem(item)}
                        className="p-2 text-blue-600 hover:bg-blue-50 rounded-xl transition-all hover:shadow-lg hover:scale-[1.05]"
                        title="Edit Task"
                      >
                        <RiEditLine size={16} />
                      </button>
                    )}
                    <button 
onClick={(e) => handleDelete(e, item._id || item.id)}
                      className="p-2 text-rose-500 hover:bg-rose-50 rounded-xl transition-all hover:shadow-lg hover:scale-[1.05]"
                      title="Delete"
                    >
                      <RiDeleteBinLine size={16} />
                    </button>
                    {type === "timesheets" && ["Submitted"].includes(item.status) && role !== 'employee' && (
                      <button 
                        onClick={() => setSelectedTimesheet(item)}
                        className="p-2 text-indigo-600 hover:bg-indigo-50 rounded-xl transition-all hover:shadow-lg hover:scale-[1.05]"
                        title="Approve/Reject"
                      >
                        <RiCheckLine size={16} />
                      </button>
                    )}
                  </div>
                </td> */}


                <td className="px-8 py-5 text-right">
  <div className="flex justify-end gap-1">

    {/* ✏️ Edit Task */}
    {type === "tasks" && (
      <button 
        onClick={() => setSelectedItem(item)}
        className="p-2 text-blue-600 hover:bg-blue-50 rounded-xl"
        title="Edit Task"
      >
        <RiEditLine size={16} />
      </button>
    )}

    {/* 🗑 Delete Task (ONLY ADMIN / SUPER_ADMIN) */}
    {type === "tasks" && ["admin", "superadmin"].includes(role) && (
      <button 
        onClick={(e) => handleDelete(e, item._id || item.id)}
        className="p-2 text-rose-500 hover:bg-rose-50 rounded-xl"
        title="Delete Task"
      >
        <RiDeleteBinLine size={16} />
      </button>
    )}

    {/* ✅ Approve Timesheet */}
    {type === "timesheets" &&
      item.status === "Submitted" &&
      role !== "employee" && (
        <button 
          onClick={() => setSelectedTimesheet(item)}
          className="p-2 text-indigo-600 hover:bg-indigo-50 rounded-xl"
          title="Approve / Reject"
        >
          <RiCheckLine size={16} />
        </button>
    )}

  </div>
</td>
              </tr>
            ))
          )}
        </tbody>
      </table>

      {selectedItem && (
        <TaskDetailsModal 
          task={selectedItem} 
          onClose={() => setSelectedItem(null)} 
          onRefresh={onRefresh}
        />
      )}

      {selectedTimesheet && (
        <TimesheetApprovalModal 
          timesheet={selectedTimesheet}
          onClose={() => setSelectedTimesheet(null)}
          onRefresh={onRefresh}
        />
      )}
    </div>
  );
};

export default TasksTable;
