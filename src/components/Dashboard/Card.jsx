import React from "react";

const Card = ({ icon, num, tot, color }) => {
  return (
    <div
      className={`group rounded-2xl p-6 flex items-center gap-5
      shadow-lg hover:-translate-y-1 hover:shadow-2xl
      transition-all duration-300 cursor-pointer w-full max-w-sm
      bg-gradient-to-r ${color} text-white`}
    >
      
      {/* Icon */}
      <div
        className="flex items-center justify-center h-14 w-14 rounded-xl
        bg-white/20 text-2xl backdrop-blur-sm
        group-hover:scale-110 transition-all duration-300"
      >
        <i className={icon}></i>
      </div>

      {/* Content */}
      <div className="flex flex-col">
        <span className="text-3xl font-bold">
          {num}
        </span>
        <span className="text-sm opacity-90 tracking-wide">
          {tot}
        </span>
      </div>

    </div>
  );
};

export default Card;