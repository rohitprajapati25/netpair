const projectData = [
  {
    id: 1,
    name: "EMS Development",
    start: "01-01-2026",
    end: "30-03-2026",
    status: "Ongoing",
  },
  {
    id: 2,
    name: "HR Portal",
    start: "10-12-2025",
    end: "20-02-2026",
    status: "Completed",
  },
];

const statusColor = (status) => {
  if (status === "Completed") return "text-green-600";
  if (status === "Ongoing") return "text-blue-600";
  return "text-yellow-600";
};

const ProjectsTable = () => {
  return (
    <div className="bg-white rounded-xl shadow p-4 overflow-x-auto border-2 border-gray-400">
      <table className="w-full">
        <thead className="bg-gray-100 border-b">
          <tr>
            <th className="p-4 text-left">Project Name</th>
            <th className="p-4">Start Date</th>
            <th className="p-4">End Date</th>
            <th className="p-4">Status</th>
            <th className="p-4">Actions</th>
          </tr>
        </thead>

        <tbody>
          {projectData.map((p) => (
            <tr key={p.id} className="border-b hover:bg-gray-50">
              <td className="p-3 font-semibold">{p.name}</td>
              <td className="p-3 text-center">{p.start}</td>
              <td className="p-3 text-center">{p.end}</td>
              <td className={`p-3 text-center font-semibold ${statusColor(p.status)}`}>
                {p.status}
              </td>
              <td className="p-3 flex justify-center gap-4 text-lg">
                <i className="ri-eye-line cursor-pointer"></i>
                <i className="ri-edit-line cursor-pointer"></i>
                <i className="ri-delete-bin-line text-red-600 cursor-pointer"></i>
              </td>
            </tr>
          ))}
        </tbody>

      </table>
    </div>
  );
};

export default ProjectsTable;
