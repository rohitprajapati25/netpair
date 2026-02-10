const TimesheetCards = ({ data }) => {
  const totalHours = data.reduce((a,b)=>a+b.hours,0);
  const completed = data.filter(d=>d.status==="Completed").length;

  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
      <Card t="Total Tasks" v={data.length}/>
      <Card t="Total Hours" v={totalHours}/>
      <Card t="Completed" v={completed}/>
    </div> 
  );
};

const Card = ({t,v}) => (
  <div className="bg-white border-2 p-5 border-gray-400 rounded-xl gap-3 flex items-center justify-center flex-col hover:shadow-xl transition-shadow duration-300">
    <p className="font-bold text-xl">{t}</p>
    <h2 className="text-xl font-bold">{v}</h2>
  </div>
);

export default TimesheetCards;
