const Card = ({ icon, num, title, bg }) => (
  <div
    className={`relative overflow-hidden rounded-2xl
      p-6 text-white
      bg-gradient-to-r ${bg}
      shadow-md hover:shadow-2xl
      transition-all duration-300
      hover:-translate-y-1
      flex items-center justify-between `}>
    <div>
      <p className="text-sm opacity-90">{title}</p>
      <h2 className="text-3xl font-bold mt-1">{num}</h2>
    </div>

    <div className="bg-white/20 p-3 rounded-xl">
      <i className={`${icon} text-2xl`}></i>
    </div>

  </div>
);

const ProjectCards = ({data}) => {
  const total = data.length;
  const op = data.filter((d)=>d.status == "Ongoing").length;
  const c =  data.filter((d)=>d.status == "Completed").length;
  const oh =  data.filter((d)=>d.status == "On Hold").length;
  return (
    <div className="grid
  grid-cols-1
  sm:grid-cols-2
  lg:grid-cols-4
  gap-5
  w-full
  p-3 gap-5">
      <Card
        icon="ri-folder-line"
        num={total}
        title="Total Projects"
        bg="from-indigo-500 to-blue-600"/>

      <Card
        icon="ri-loader-4-line"
        num={op}
        title="Ongoing Projects"
        bg="from-yellow-500 to-orange-500"/>

      <Card
        icon="ri-checkbox-circle-line"
        num={c}
        title="Completed"
        bg="from-green-500 to-emerald-600"/>

      <Card
        icon="ri-pause-circle-line"
        num={oh}
        title="On Hold"
        bg="from-rose-500 to-red-600"/>
    </div>
  );
};

export default ProjectCards;