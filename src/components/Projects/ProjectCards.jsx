import React from "react";

const ProjectCards = ({ data, stats = {} }) => {
  const total  = stats.total     || data.length;
  const op     = stats.ongoing   || data.filter(d => d.status === "Ongoing").length;
  const c      = stats.completed || data.filter(d => d.status === "Completed").length;
  const oh     = stats.onHold    || data.filter(d => d.status === "On Hold").length;

  const cards = [
    { icon: "ri-folder-line",         num: total, title: "Total Projects",   bg: "from-indigo-500 to-blue-600" },
    { icon: "ri-loader-4-line",       num: op,    title: "Ongoing",          bg: "from-yellow-500 to-orange-500" },
    { icon: "ri-checkbox-circle-line",num: c,     title: "Completed",        bg: "from-green-500 to-emerald-600" },
    { icon: "ri-pause-circle-line",   num: oh,    title: "On Hold",          bg: "from-rose-500 to-red-600" },
  ];

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 lg:gap-5">
      {cards.map((card, i) => (
        <div key={i} className={`relative overflow-hidden rounded-2xl p-4 lg:p-5 text-white bg-gradient-to-r ${card.bg} shadow-md hover:shadow-xl hover:-translate-y-0.5 transition-all duration-200 flex items-center justify-between`}>
          <div>
            <p className="text-xs opacity-90 font-semibold">{card.title}</p>
            <h2 className="text-2xl lg:text-3xl font-black mt-1">{card.num}</h2>
          </div>
          <div className="bg-white/20 p-2.5 lg:p-3 rounded-xl text-xl lg:text-2xl">
            <i className={card.icon}></i>
          </div>
        </div>
      ))}
    </div>
  );
};

export default ProjectCards;
