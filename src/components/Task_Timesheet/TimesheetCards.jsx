import React from "react";

const TimesheetCards = ({ data }) => {
  const totalHours = data.reduce((a, b) => a + b.hours, 0);
  const completed = data.filter(d => d.status === "Completed").length;

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mb-6">

      <Card
        title="Total Tasks"
        value={data.length}
        icon="ri-task-line"
        bg="from-indigo-500 to-blue-600"
      />

      <Card
        title="Total Hours"
        value={totalHours}
        icon="ri-time-line"
        bg="from-purple-500 to-indigo-600"
      />

      <Card
        title="Completed Tasks"
        value={completed}
        icon="ri-checkbox-circle-line"
        bg="from-green-500 to-emerald-600"
      />

    </div>
  );
};

const Card = ({ title, value, icon, bg }) => (
  <div
    className={`relative overflow-hidden rounded-2xl text-white p-6
    bg-gradient-to-r ${bg}
    shadow-lg hover:shadow-2xl transition-all duration-300
    hover:-translate-y-1`}
  >
    <div className="flex justify-between items-center">
      <div>
        <p className="text-sm opacity-90">{title}</p>
        <h2 className="text-3xl font-bold mt-1">{value}</h2>
      </div>

      <div className="bg-white/20 p-3 rounded-xl text-2xl">
        <i className={icon}></i>
      </div>
    </div>

</div>
);

export default TimesheetCards;