const Card = ({ icon, num, title }) => (
  <div className="bg-white border-2 border-gray-400 rounded-xl p-5 flex items-center gap-4 hover:shadow-lg transition">
    <i className={`${icon} text-3xl text-black`}></i>
    <div>
      <h2 className="text-3xl font-bold">{num}</h2>
      <p className="text-gray-700 font-semibold">{title}</p>
    </div>
  </div>
);

const ProjectCards = () => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
      <Card icon="ri-folder-line" num="12" title="Total Projects" />
      <Card icon="ri-loader-4-line" num="6" title="Ongoing Projects" />
      <Card icon="ri-checkbox-circle-line" num="4" title="Completed" />
      <Card icon="ri-pause-circle-line" num="2" title="On Hold" />
    </div>
  );
};

export default ProjectCards;
