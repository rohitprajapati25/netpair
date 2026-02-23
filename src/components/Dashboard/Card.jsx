import React from "react";

const Card = ({ icon, num, tot }) => {
  return (
    <div className="group bg-white rounded-2xl p-6 flex items-center gap-5 
    shadow-sm border border-gray-200 hover:shadow-xl hover:-translate-y-1 
    transition-all duration-300 cursor-pointer w-full max-w-sm">

      <div className="flex items-center justify-center h-14 w-14 rounded-xl 
      bg-blue-50 text-blue-600 text-2xl 
      group-hover:bg-blue-600 group-hover:text-white transition-all duration-300">
        <i className={icon}></i>
      </div>

      <div className="flex flex-col">
        <span className="text-3xl font-bold text-gray-900">
          {num}
        </span>
        <span className="text-sm font-medium text-gray-500 tracking-wide">
          {tot}
        </span>
      </div>
    </div>
  );
};

export default Card;