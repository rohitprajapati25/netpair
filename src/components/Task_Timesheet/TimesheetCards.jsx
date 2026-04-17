const TimesheetCards = ({ data = [], timesheets = [] }) => {
  const tasks       = Array.isArray(data) ? data : [];
  const tsList      = Array.isArray(timesheets) ? timesheets : [];

  const totalTasks  = tasks.length;
  const completed   = tasks.filter(d => d.status === "Completed").length;
  const inProgress  = tasks.filter(d => d.status === "In Progress").length;
  const totalHours  = tsList.reduce((a, b) => a + Number(b.hours_worked || 0), 0);
  const pendingTs   = tsList.filter(t => t.status === "Submitted").length;
  const approvedTs  = tsList.filter(t => t.status === "Approved").length;

  const cards = [
    { title: "Total Tasks",     value: totalTasks,                                    icon: "ri-task-line",            bg: "from-indigo-500 to-blue-600"   },
    { title: "In Progress",     value: inProgress,                                    icon: "ri-progress-3-line",      bg: "from-blue-500 to-cyan-600"     },
    { title: "Completed",       value: completed,                                     icon: "ri-checkbox-circle-line", bg: "from-emerald-500 to-green-600" },
    { title: "Hours Logged",    value: `${totalHours % 1 === 0 ? totalHours : totalHours.toFixed(1)}h`, icon: "ri-time-line", bg: "from-purple-500 to-indigo-600" },
    { title: "Pending Review",  value: pendingTs,                                     icon: "ri-survey-line",          bg: "from-amber-500 to-orange-500"  },
    { title: "Approved",        value: approvedTs,                                    icon: "ri-shield-check-line",    bg: "from-teal-500 to-emerald-600"  },
  ];

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
      {cards.map((card, i) => (
        <div key={i} className={`relative overflow-hidden rounded-2xl text-white p-4 bg-gradient-to-r ${card.bg} shadow-md hover:shadow-xl hover:-translate-y-0.5 transition-all duration-200 flex items-center justify-between`}>
          <div>
            <p className="text-[10px] opacity-90 font-semibold uppercase tracking-wider">{card.title}</p>
            <h2 className="text-xl lg:text-2xl font-black mt-1">{card.value}</h2>
          </div>
          <div className="bg-white/20 p-2 rounded-xl text-lg lg:text-xl">
            <i className={card.icon}></i>
          </div>
        </div>
      ))}
    </div>
  );
};

export default TimesheetCards;
