import React, { useState } from 'react'

const ProjectModal = ({onClose}) => {    
    
  return (
      <div className="fixed inset-0 bg-black/40 flex items-center justify-center">
      <div className="bg-white p-6 rounded w-80">
        <h3 className="text-lg font-semibold mb-4">Add Project</h3>
        <input className="border w-full mb-3 px-3 py-2" placeholder="Project Name" />
        <h3>Start Date:</h3>
        <input type='date' className="border w-full mb-3 px-3 py-2" />
        <h3>End Date:</h3>
        <input type='date' className="border w-full mb-3 px-3 py-2" />
        {/* <select className="border w-full mb-3 px-3 py-2">
          <option>Present</option>
          <option>Absent</option>
        </select> */}
        <div className="flex justify-end gap-3">
          <button onClick={onClose}>Cancel</button>
          <button className="bg-blue-600 text-white px-4 py-2 rounded">
            Save
          </button>
        </div>
      </div>
    </div>
  )
}

export default ProjectModal
