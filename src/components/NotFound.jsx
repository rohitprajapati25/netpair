import React from "react";
import { useNavigate } from "react-router-dom";

const NotFound = () => {
  const navigate = useNavigate();

  return (
    <div className="h-screen w-full flex items-center justify-center bg-gradient-to-br from-gray-100 to-gray-200 p-4">
      
      <div className="relative h-full bg-white shadow-2xl rounded-3xl p-8 md:p-16 flex flex-col items-center text-center w-full">
        
        <button
          onClick={() => navigate(-1)}
          className="absolute top-4 left-4 text-2xl md:text-3xl border rounded-full p-2 hover:bg-gray-100 transition"
        >
          <i className="ri-arrow-left-long-line"></i>
        </button>

        <div className="text-orange-400 text-6xl md:text-8xl mb-6">
          <i className="ri-alert-line"></i>
        </div>

        <h1 className="text-5xl md:text-8xl font-extrabold text-red-500">
          404
        </h1>

        <p className="text-xl md:text-3xl font-semibold mt-2 text-gray-700">
          Page Not Found
        </p>

        <p className="text-sm md:text-base text-gray-500 mt-4 max-w-md">
          The page you are looking for might have been removed, 
          renamed, or is temporarily unavailable.
        </p>

      </div>
    </div>
  );
};

export default NotFound;
