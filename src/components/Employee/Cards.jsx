import React, { useState } from "react";

const Cards = ({
  name,
  designation,
  department,
  place,
  working_amount,
  status = "Active",
  pimg,
}) => {

  const [open, setOpen] = useState(false);

  const [formData, setFormData] = useState({
    name,
    designation,
    department,
    place,
    status,
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSave = () => {
    console.log("Updated Employee:", formData);
    setOpen(false);
  };

  return (
    <>
      <div className="bg-white rounded-2xl border border-gray-200 shadow-sm hover:shadow-lg transition duration-300 w-[300px] overflow-hidden">

        <div className="flex items-center gap-4 p-5">
          <img
            src={pimg}
            alt="profile"
            className="w-16 h-16 rounded-full object-cover border-2 border-blue-100"
          />

          <div>
            <h3 className="font-semibold text-gray-800 text-lg">{name}</h3>
            <p className="text-sm text-blue-600 font-medium">{designation}</p>
            <p className="text-xs text-gray-400">{place}</p>
          </div>
        </div>

        <div className="px-5 pb-4 grid grid-cols-2 gap-4 text-sm">
          <div className="bg-gray-50 rounded-lg p-3 text-center">
            <p className="text-gray-400 text-xs">Working Days</p>
            <p className="font-semibold text-gray-800">
              {working_amount} Days
            </p>
          </div>

          <div className="bg-green-50 rounded-lg p-3 text-center">
            <p className="text-gray-400 text-xs">Attendance</p>
            <span className="text-green-600 font-semibold">
              Present
            </span>
          </div>
        </div>

        <div className="border-t px-5 py-3">
          <button
            onClick={() => setOpen(true)}
            className="w-full bg-blue-600 text-white py-2 rounded-lg text-sm font-medium hover:bg-blue-700 transition"
          >
            Edit Employee
          </button>
        </div>
      </div>

      {open && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">

          <div className="bg-white rounded-2xl w-[420px] p-6 shadow-xl">

            <h2 className="text-xl font-semibold mb-5">
              Edit Employee Details
            </h2>

            <div className="space-y-3">

              <input
                name="name"
                value={formData.name}
                onChange={handleChange}
                className="w-full border rounded-lg p-2 focus:ring-2 focus:ring-blue-500"
                placeholder="Employee Name"
              />

              <input
                name="designation"
                value={formData.designation}
                onChange={handleChange}
                className="w-full border rounded-lg p-2 focus:ring-2 focus:ring-blue-500"
                placeholder="Designation"
              />

              <input
                name="department"
                value={formData.department}
                onChange={handleChange}
                className="w-full border rounded-lg p-2 focus:ring-2 focus:ring-blue-500"
                placeholder="Department"
              />

              <input
                name="place"
                value={formData.place}
                onChange={handleChange}
                className="w-full border rounded-lg p-2 focus:ring-2 focus:ring-blue-500"
                placeholder="Location"
              />

              <select
                name="status"
                value={formData.status}
                onChange={handleChange}
                className="w-full border rounded-lg p-2 focus:ring-2 focus:ring-blue-500"
              >
                <option>Active</option>
                <option>Inactive</option>
                <option>Suspended</option>
              </select>

            </div>

            <div className="flex justify-end gap-3 mt-6">
              <button
                onClick={() => setOpen(false)}
                className="px-4 py-2 rounded-lg bg-gray-100 hover:bg-gray-200"
              >
                Cancel
              </button>

              <button
                onClick={handleSave}
                className="px-4 py-2 rounded-lg bg-blue-600 text-white hover:bg-blue-700"
              >
                Save Changes
              </button>
            </div>

          </div>
        </div>
      )}
    </>
  );
};

export default Cards;