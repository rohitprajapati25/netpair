import React from 'react'

const Cards = ({ name, designation, working_amount, place, pimg }) => {

  return (
    <div className="flex justify-center items-center">
      
      <div className="w-[300px] min-h-[400px] bg-white p-5 flex flex-col justify-between border-2 border-gray-400 rounded-xl hover:shadow-xl transition-shadow duration-300">

        {/* TOP */}
        <div className="flex items-center justify-between w-[100px] pt-2 self-center">
          <img
            src={pimg}
            alt="profile"
            className="h-[100px] w-[100px] rounded-full object-cover border-2 border-gray-200"
          />
        </div>

        {/* CENTER */}
        <div className="text-center my-4">
          <h3 className="text-[1.05rem] font-medium mb-1">
            {name}
            <span className="text-[0.65rem] text-gray-400 ml-1">
              5 days ago
            </span>
          </h3>

          <h2 className="text-lg font-semibold">
            {designation}
          </h2>

          <div>
            <h4 className="text-sm font-normal bg-gray-100 px-2 py-1 rounded-md inline-block mt-2">
              {name.toLowerCase().replace(/\s+/g, '.')}@netpairinfotech.com
            </h4>
          </div>
        </div>

        {/* STATUS BOXES */}
        <div className="flex justify-center items-center p-3 gap-4">

          <div className="bg-green-500 rounded-xl py-2 px-4 text-white flex items-center justify-center w-full">
            <p className="font-bold">Present</p>
          </div>

          <div className="bg-red-500 rounded-xl py-2 px-4 text-white flex items-center justify-center w-full">
            <p className="font-bold">Absent</p>
          </div>

          <div className="bg-yellow-500 rounded-xl py-2 px-4 text-white flex items-center justify-center w-full">
            <p className="font-bold">Leave</p>
          </div>

        </div>

      </div>
    </div>
  )
}

export default Cards
