import React from "react";

const Card = ({ title, tot, bg }) => {
  return (
    <div
      className={`relative overflow-hidden rounded-2xl
      shadow-sm hover:shadow-xl transition-all duration-300
      hover:-translate-y-1 p-5 text-white bg-gradient-to-r ${bg}`}
    >
      <div className="flex justify-between items-center">
        <div>
          <p className="text-sm opacity-90 font-medium">
            {title}
          </p>

          <h2 className="text-3xl font-bold mt-1">
            {tot}
          </h2>
        </div>

        <div className="bg-white/20 backdrop-blur p-3 rounded-xl">
          <i className="ri-computer-line text-xl"></i>
        </div>
      </div>
    </div>
  );
};

export default Card;