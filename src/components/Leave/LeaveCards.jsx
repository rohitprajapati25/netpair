import React from "react";

const LeaveCards = ({ stats, setQuickFilter }) => {
  const cards = [
    { title: "Total",    key: "All",      value: stats.total,    icon: "ri-file-list-3-line",     bg: "from-indigo-500 to-blue-600" },
    { title: "Pending",  key: "Pending",  value: stats.pending,  icon: "ri-time-line",            bg: "from-yellow-500 to-orange-500" },
    { title: "Approved", key: "Approved", value: stats.approved, icon: "ri-checkbox-circle-line", bg: "from-green-500 to-emerald-600" },
    { title: "Rejected", key: "Rejected", value: stats.rejected, icon: "ri-close-circle-line",    bg: "from-red-500 to-rose-600" },
  ];

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 lg:gap-5">
      {cards.map((card, i) => (
        <div
          key={i}
          onClick={() => setQuickFilter(card.key)}
          className={`cursor-pointer rounded-2xl text-white p-4 lg:p-5 bg-gradient-to-r ${card.bg} shadow-md hover:shadow-xl hover:-translate-y-0.5 transition-all duration-200 flex items-center justify-between`}
        >
          <div>
            <p className="text-xs opacity-90 font-semibold">{card.title}</p>
            <h2 className="text-2xl lg:text-3xl font-black mt-1">{card.value}</h2>
          </div>
          <div className="bg-white/20 p-2.5 lg:p-3 rounded-xl text-xl lg:text-2xl">
            <i className={card.icon}></i>
          </div>
        </div>
      ))}
    </div>
  );
};

export default LeaveCards;
