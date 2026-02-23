import React from "react";

const LeaveCards = () => {
  const cards = [
    {
      title: "Total Requests",
      value: 120,
      icon: "ri-file-list-3-line",
      bg: "from-indigo-500 to-blue-600",
    },
    {
      title: "Pending",
      value: 35,
      icon: "ri-time-line",
      bg: "from-yellow-500 to-orange-500",
    },
    {
      title: "Approved",
      value: 70,
      icon: "ri-checkbox-circle-line",
      bg: "from-green-500 to-emerald-600",
    },
    {
      title: "Rejected",
      value: 15,
      icon: "ri-close-circle-line",
      bg: "from-red-500 to-rose-600",
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-5 mb-6">
      {cards.map((card, i) => (
        <div
          key={i}
          className={`relative overflow-hidden rounded-2xl text-white p-6
          bg-gradient-to-r ${card.bg}
          shadow-lg hover:shadow-2xl transition-all duration-300
          hover:-translate-y-1`}
        >
          <div className="flex justify-between items-center">
            <div>
              <p className="text-sm opacity-90">{card.title}</p>
              <h2 className="text-3xl font-bold mt-1">{card.value}</h2>
            </div>

            <div className="bg-white/20 p-3 rounded-xl text-2xl">
              <i className={card.icon}></i>
            </div>
          </div>

          </div>
      ))}
    </div>
  );
};

export default LeaveCards;