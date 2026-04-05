import React from "react";
import { RiLoader4Line } from "react-icons/ri";

const LoadingScreen = ({ label = "Loading...", minHeight = "min-h-screen" }) => (
  <div className={`flex flex-col items-center justify-center ${minHeight} w-full p-6`}>
    <RiLoader4Line className="animate-spin text-5xl text-slate-400 mb-4" />
    <p className="text-lg font-bold text-slate-600">{label}</p>
  </div>
);

export default LoadingScreen;
