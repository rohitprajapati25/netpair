import React, { useState } from "react";

const ProjectModal = ({ onClose }) => {
  const [project, setProject] = useState({
    name: "",
    start: "",
    end: "",
  });

  return (
    <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50">
      
      <div className="bg-white w-[420px] rounded-xl shadow-xl p-6 relative">

        <div className="flex justify-between items-center mb-5">
          <h3 className="text-xl font-semibold flex items-center gap-2">
            <i className="ri-folder-add-line text-blue-600 text-2xl"></i>
            Add Project
          </h3>

          <button onClick={onClose}>
            <i className="ri-close-line text-2xl text-gray-600 hover:text-black"></i>
          </button>
        </div>

        <div className="mb-4">
          <label className="text-sm font-medium text-gray-600">
            Project Name
          </label>
          <div className="flex items-center border border-gray-400 rounded-lg px-3 py-2 mt-1 gap-2">
            <i className="ri-folder-line text-gray-500"></i>
            <input
              type="text"
              placeholder="Enter project name"
              className="outline-none w-full"
              value={project.name}
              onChange={(e) =>
                setProject({ ...project, name: e.target.value })
              }
            />
          </div>
        </div>

        <div className="mb-4">
          <label className="text-sm font-medium text-gray-600">
            Start Date
          </label>
          <div className="flex items-center border border-gray-400 rounded-lg px-3 py-2 mt-1 gap-2">
            <i className="ri-calendar-line text-gray-500"></i>
            <input
              type="date"
              className="outline-none w-full"
              value={project.start}
              onChange={(e) =>
                setProject({ ...project, start: e.target.value })
              }
            />
          </div>
        </div>

        <div className="mb-6">
          <label className="text-sm font-medium text-gray-600">
            End Date
          </label>
          <div className="flex items-center border border-gray-400 rounded-lg px-3 py-2 mt-1 gap-2">
            <i className="ri-calendar-check-line text-gray-500"></i>
            <input
              type="date"
              className="outline-none w-full"
              value={project.end}
              onChange={(e) =>
                setProject({ ...project, end: e.target.value })
              }
            />
          </div>
        </div>

        <div className="flex justify-end gap-3">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-lg border border-gray-400 hover:bg-gray-100"
          >
            Cancel
          </button>

          <button className="bg-blue-600 text-white px-5 py-2 rounded-lg hover:bg-blue-700 flex items-center gap-2">
            <i className="ri-save-line"></i>
            Save
          </button>
        </div>

      </div>
    </div>
  );
};

export default ProjectModal;