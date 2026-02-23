const Card = ({ icon, num, title, bg }) => (
  <div
    className={`
      relative overflow-hidden rounded-2xl
      p-6 text-white
      bg-gradient-to-r ${bg}
      shadow-md hover:shadow-2xl
      transition-all duration-300
      hover:-translate-y-1
      flex items-center justify-between
    `}
  >
    {/* Text */}
    <div>
      <p className="text-sm opacity-90">{title}</p>
      <h2 className="text-3xl font-bold mt-1">{num}</h2>
    </div>

    {/* Icon */}
    <div className="bg-white/20 p-3 rounded-xl">
      <i className={`${icon} text-2xl`}></i>
    </div>

  </div>
);

const ProjectCards = () => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
      <Card
        icon="ri-folder-line"
        num="12"
        title="Total Projects"
        bg="from-indigo-500 to-blue-600"
      />

      <Card
        icon="ri-loader-4-line"
        num="6"
        title="Ongoing Projects"
        bg="from-yellow-500 to-orange-500"
      />

      <Card
        icon="ri-checkbox-circle-line"
        num="4"
        title="Completed"
        bg="from-green-500 to-emerald-600"
      />

      <Card
        icon="ri-pause-circle-line"
        num="2"
        title="On Hold"
        bg="from-rose-500 to-red-600"
      />
    </div>
  );
};

export default ProjectCards;