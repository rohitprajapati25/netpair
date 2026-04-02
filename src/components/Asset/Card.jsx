import React from 'react';
import { RiArrowUpLine } from 'react-icons/ri';

const Card = ({ title, tot, bg }) => {
  return (
    <div className={`group bg-gradient-to-br ${bg} p-8 rounded-3xl shadow-xl hover:shadow-2xl transition-all duration-500 hover:-translate-y-2 border-0`}>
      <div className="flex items-center justify-between">
        <div>
          <p className="text-white/80 font-bold text-sm uppercase tracking-wide">{title}</p>
          <p className="text-4xl font-black text-white mt-2 leading-none">{tot}</p>
        </div>
        <div className="p-4 bg-white/20 backdrop-blur-sm rounded-2xl group-hover:bg-white/30 transition-all duration-300">
          <RiArrowUpLine className="text-white text-xl" />
        </div>
      </div>
    </div>
  );
};

export default Card;

