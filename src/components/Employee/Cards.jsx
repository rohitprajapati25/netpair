import React, { useState } from "react";

const Cards = ({
  name,
  designation,
  working_amount,
  place,
  pimg,
}) => {

  const [open, setOpen] = useState(false);

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

          <div className="bg-white rounded-2xl w-[420px] p-6 shadow-xl relative">

            <h2 className="text-xl font-semibold mb-4">
              Edit Employee
            </h2>

            <div className="space-y-3">

              <input
                defaultValue={name}
                className="w-full border rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Employee Name"
              />

              <input
                defaultValue={designation}
                className="w-full border rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Designation"
              />

              <input
                defaultValue={place}
                className="w-full border rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Location"
              />

              <input
                defaultValue={working_amount}
                className="w-full border rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Working Days"
              />
            </div>

            <div className="flex justify-end gap-3 mt-6">
              <button
                onClick={() => setOpen(false)}
                className="px-4 py-2 rounded-lg bg-gray-100 hover:bg-gray-200"
              >
                Cancel
              </button>

              <button
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