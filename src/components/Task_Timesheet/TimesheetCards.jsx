import React from "react";

const TimesheetCards = ({ data = [], timesheets = [] }) => {
  const totalTasks  = Array.isArray(data) ? data.length : 0;
  const totalHours  = Array.isArray(timesheets)
    ? timesheets.reduce((a, b) => a + Number(b.hours_worked || b.hours || 0), 0)
    : 0;
  const completed   = Array.isArray(data)
    ? data.filter(d => d.status === "Completed" || d.status === "COMPLETED").length
    : 0;

  const cards = [
    { title: "Total Tasks",     value: totalTasks, icon: "ri-task-line",             bg: "from-indigo-500 to-blue-600" },
    { title: "Total Hours",     value: totalHours, icon: "ri-time-line",             bg: "from-purple-500 to-indigo-600" },
    { title: "Completed Tasks", value: completed,  icon: "ri-checkbox-circle-line",  bg: "from-green-500 to-emerald-600" },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 lg:gap-5">
      {cards.map((card, i) => (
        <div key={i} className={`relative overflow-hidden rounded-2xl text-white p-4 lg:p-5 bg-gradient-to-r ${card.bg} shadow-md hover:shadow-xl hover:-translate-y-0.5 transition-all duration-200 flex items-center justify-between`}>
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

export default TimesheetCards;
