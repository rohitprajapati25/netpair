const AttendanceCards = ({ data }) => {
  const total = data.length;
  const present = data.filter(d => d.status === "Present").length;
  const absent = data.filter(d => d.status === "Absent").length;

  return (
    <div className="flex gap-4 mb-6 ">
      <Card title="Total" value={total} />
      <Card title="Present" value={present} color="text-green-600" />
      <Card title="Absent" value={absent} color="text-red-600" />
    </div>
  );
};

const Card = ({ title, value, color }) => (
  <div className="border px-6 py-4 text-center border-gray-400 rounded-xl">
    <p className="text-sm text-black-200 ">{title}</p>
    <p className={`text-xl font-bold ${color}`}>{value}</p>
  </div>
);

export default AttendanceCards;
