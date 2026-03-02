import React from "react";

const statusStyle = (status) => {
  if (status === "Completed") return "bg-green-100 text-green-700";
  if (status === "Ongoing") return "bg-blue-100 text-blue-700";
  return "bg-yellow-100 text-yellow-700";
};

const ProjectsTable = ({ data, onDelete, onEdit }) => {
  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-x-auto">
      <table className="w-full min-w-[800px]">
        <thead className="bg-gray-50 text-gray-600 text-sm">
          <tr>
            <th className="px-6 py-4 text-left font-semibold">Project Name</th>
            <th className="px-6 py-4 text-center font-semibold">Start Date</th>
            <th className="px-6 py-4 text-center font-semibold">End Date</th>
            <th className="px-6 py-4 text-center font-semibold">Status</th>
            <th className="px-6 py-4 text-center font-semibold">Actions</th>
          </tr>
        </thead>
        <tbody className="text-sm">
          {data.map((p) => (
            <tr key={p.id} className="border-t hover:bg-blue-50/40 transition">
              <td className="px-6 py-4 flex items-center gap-3">
                <div className="w-9 h-9 rounded-full bg-blue-100 flex items-center justify-center">
                  <i className="ri-folder-line text-blue-600"></i>
                </div>
                <span className="font-medium text-gray-800">{p.name}</span>
              </td>
              <td className="px-6 py-4 text-center">{p.start}</td>
              <td className="px-6 py-4 text-center">{p.end}</td>
              <td className="px-6 py-4 text-center">
                <span className={`px-3 py-1 rounded-full text-xs font-semibold ${statusStyle(p.status)}`}>
                  {p.status}
                </span>
              </td>
              <td className="px-6 py-4">
                <div className="flex justify-center gap-2 text-sm">
                 
                  <button 
                    onClick={() => onEdit(p)}
                    className="p-2 rounded-lg hover:bg-green-100 transition"
                  >
                    <i className="ri-edit-line cursor-pointer text-blue-600 hover:scale-110"></i>
                  </button>
                  <button 
                    onClick={() => onDelete(p.id)}
                    className="p-2 rounded-lg hover:bg-red-100 transition"
                  >
                    <i className="ri-delete-bin-line text-red-600"></i>
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default ProjectsTable;