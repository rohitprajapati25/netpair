import React from "react";

const Cards = ({ name,  designation,  working_amount,  place,  pimg}) => {
  return (
    <div className="bg-white rounded-2xl border border-gray-200 shadow-sm hover:shadow-xl transition duration-300 p-5 w-[280px]">

      <div className="flex items-center gap-4">
        <img
          src={pimg}
          alt="profile"
          className="w-16 h-16 rounded-full object-cover border-2 border-blue-100"
        />

        <div>
          <h3 className="font-semibold text-gray-800">{name}</h3>
          <p className="text-sm text-gray-500">{designation}</p>
          <p className="text-xs text-gray-400">{place}</p>
        </div>
      </div>

      <div className="my-4 border-t"></div>

      <div className="flex justify-between text-sm">
        <div>
          <p className="text-gray-400">Working Days</p>
          <p className="font-semibold text-gray-800">
            {working_amount} Days
          </p>
        </div>

        <div>
          <p className="text-gray-400">Status</p>
          <span className="bg-green-100 text-green-600 px-3 py-1 rounded-full text-xs font-semibold">
            Present
          </span>
        </div>
      </div>

      <div className="flex gap-2 mt-5">
        <button className="flex-1 bg-blue-600 text-white py-2 rounded-lg text-sm hover:bg-blue-700 transition">
          View
        </button>

        <button className="flex-1 bg-gray-100 text-gray-700 py-2 rounded-lg text-sm hover:bg-gray-200 transition">
          Edit
        </button>
      </div>

    </div>
  );
};

export default Cards;