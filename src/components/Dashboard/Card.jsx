import React from "react";

const Card = ({ icon, num, tot, color, loading = false }) => {
  if (loading) {
    return (
      <div className="group rounded-2xl p-6 flex items-center gap-5 shadow-lg bg-gradient-to-r from-slate-200 to-slate-300 animate-pulse">
        <div className="flex items-center justify-center h-14 w-14 rounded-xl bg-white/30" />
        <div className="flex flex-col space-y-2 flex-1">
          <div className="h-8 bg-white/30 rounded-lg w-3/4" />
          <div className="h-4 bg-white/30 rounded w-1/2" />
        </div>
      </div>
    );
  }
  return (
    <div
      className={`group rounded-2xl p-6 flex items-center gap-5
      shadow-lg hover:-translate-y-1 hover:shadow-2xl
      transition-all duration-300 cursor-pointer w-full max-w-sm
      bg-gradient-to-r ${color} text-white`}
    >
      
      <div
        className="flex items-center justify-center h-14 w-14 rounded-xl
        bg-white/20 text-2xl backdrop-blur-sm
        transition-all duration-300"
      >
        <i className={icon}></i>
      </div>

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


// const  Card = ({ icon, num, tot, color }) => {
//   return (
//     <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-sm hover:shadow-md transition-shadow duration-200">
//       <div className="flex items-center justify-between">
//         <div>
//           <p className="text-sm font-medium text-slate-500 mb-1">{tot}</p>
//           <h3 className="text-3xl font-bold text-slate-900">{num}</h3>
//         </div>
//         <div className={`h-12 w-12 rounded-lg flex items-center justify-center text-xl ${color}`}>
//           <i className={icon}></i>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default Card;