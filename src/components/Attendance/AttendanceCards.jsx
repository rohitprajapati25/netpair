import React from "react";

const AttendanceCards = ({ data }) => {
  const total = data.length;
  const present = data.filter(d => d.status === "Present").length;
  const absent = data.filter(d => d.status === "Absent").length;

  return (
    <div className="grid grid-cols-1 md:grid-cols-3  gap-5 mb-6">
      <Card
        title="Total Employees"
        value={total}
        icon="ri-group-line"
        bg="from-indigo-500 to-blue-600"
      />

      <Card
        title="Present Today"
        value={present}
        icon="ri-user-follow-line"
        bg="from-green-500 to-emerald-600"
      />

      <Card
        title="Absent Today"
        value={absent}
        icon="ri-user-unfollow-line"
        bg="from-red-500 to-rose-600"
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

      <div className="bg-white/20 p-3 rounded-xl">
        <i className={`${icon} text-2xl`}></i>
      </div>
    </div>

  </div>
);

export default AttendanceCards;