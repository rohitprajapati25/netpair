// import React from "react";
// import { useNavigate } from "react-router-dom";

// const NotFound = () => {
//   const navigate = useNavigate();

//   return (
//     <div className="h-screen w-full flex items-center justify-center bg-gradient-to-br from-gray-100 to-gray-200 p-4">
      
//       <div className="relative h-full bg-white shadow-2xl rounded-3xl p-8 md:p-16 flex flex-col items-center text-center w-full">
        
//         <button
//           onClick={() => navigate(-1)}
//           className="absolute top-4 left-4 text-2xl md:text-3xl border rounded-full p-2 hover:bg-gray-100 transition"
//         >
//           <i className="ri-arrow-left-long-line"></i>
//         </button>

//         <div className="text-orange-400 text-6xl md:text-8xl mb-6">
//           <i className="ri-alert-line"></i>
//         </div>

//         <h1 className="text-5xl md:text-8xl font-extrabold text-red-500">
//           404
//         </h1>

//         <p className="text-xl md:text-3xl font-semibold mt-2 text-gray-700">
//           Page Not Found
//         </p>

//         <p className="text-sm md:text-base text-gray-500 mt-4 max-w-md">
//           The page you are looking for might have been removed, 
//           renamed, or is temporarily unavailable.
//         </p>

//       </div>
//     </div>
//   );
// };

// export default NotFound;

import React from "react";
import { useNavigate } from "react-router-dom";
import { RiArrowLeftLine, RiErrorWarningFill, RiHome4Line } from "react-icons/ri";

const NotFound = () => {
  const navigate = useNavigate();

  return (
    <div className="h-screen w-full flex items-center justify-center bg-slate-50 p-6">
      
      {/* Background Decor (Optional) */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-[10%] -left-[10%] w-[40%] h-[40%] bg-blue-50 rounded-full blur-3xl opacity-50" />
        <div className="absolute -bottom-[10%] -right-[10%] w-[40%] h-[40%] bg-rose-50 rounded-full blur-3xl opacity-50" />
      </div>

      <div className="relative z-10 bg-white shadow-[0_32px_64px_-12px_rgba(0,0,0,0.08)] rounded-[3rem] p-12 md:p-20 flex flex-col items-center text-center max-w-2xl w-full border border-slate-100">
        
        {/* Back Button */}
        <button
          onClick={() => navigate(-1)}
          className="absolute top-8 left-8 flex items-center gap-2 text-sm font-black text-slate-400 hover:text-blue-600 transition-all group"
        >
          <div className="p-2 rounded-xl border border-slate-100 group-hover:bg-blue-50 group-hover:border-blue-100 transition-all">
            <RiArrowLeftLine size={20} />
          </div>
          <span className="hidden md:block uppercase tracking-widest">Go Back</span>
        </button>

        {/* Animated Icon */}
        <div className="relative mb-8">
          <div className="absolute inset-0 bg-amber-100 rounded-full blur-2xl opacity-40 animate-pulse" />
          <RiErrorWarningFill className="text-amber-400 text-8xl md:text-9xl relative animate-bounce-slow" />
        </div>

        <h1 className="text-7xl md:text-9xl font-black text-slate-900 tracking-tighter">
          404
        </h1>

        <div className="space-y-2 mt-4">
          <h2 className="text-2xl md:text-3xl font-black text-slate-800">
            Lost in Space?
          </h2>
          <p className="text-slate-500 font-medium max-w-sm leading-relaxed">
            The page you're looking for doesn't exist or has been moved to another coordinate.
          </p>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col md:flex-row gap-4 mt-10 w-full md:w-auto">
          <button 
            onClick={() => navigate("/dashboard")}
            className="px-10 py-4 bg-blue-600 text-white rounded-2xl font-black flex items-center justify-center gap-2 hover:bg-blue-700 shadow-xl shadow-blue-100 transition-all active:scale-95"
          >
            <RiHome4Line size={20} /> Return to Dashboard
          </button>
          
          <button 
            onClick={() => window.location.reload()}
            className="px-10 py-4 bg-slate-100 text-slate-600 rounded-2xl font-black hover:bg-slate-200 transition-all active:scale-95"
          >
            Refresh Page
          </button>
        </div>

      </div>

      {/* Tailwind Custom Class for animation (Add this to your index.css if not working) */}
      <style>{`
        @keyframes bounce-slow {
          0%, 100% { transform: translateY(-5%); transition-timing-function: cubic-bezier(0.8,0,1,1); }
          50% { transform: none; transition-timing-function: cubic-bezier(0,0,0.2,1); }
        }
        .animate-bounce-slow {
          animation: bounce-slow 3s infinite;
        }
      `}</style>
    </div>
  );
};

export default NotFound;