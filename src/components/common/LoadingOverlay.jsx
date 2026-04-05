import React from "react";
import { RiLoader4Line } from "react-icons/ri";

const LoadingOverlay = ({ visible, message = "Saving..." }) => {
  if (!visible) return null;

  return (
    <div className="absolute inset-0 z-40 flex items-center justify-center rounded-[2rem] bg-white/90 backdrop-blur-sm">
      <div className="flex flex-col items-center gap-3 rounded-3xl bg-slate-50/90 px-6 py-5 shadow-xl border border-slate-200">
        <RiLoader4Line className="animate-spin text-4xl text-slate-700" />
        <p className="text-sm font-semibold text-slate-700">{message}</p>
      </div>
    </div>
  );
};

export default LoadingOverlay;
