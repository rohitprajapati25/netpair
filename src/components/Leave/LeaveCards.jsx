const LeaveCards = () => {
  const cards = [
    { title: "Total Requests", value: 120 },
    { title: "Pending", value: 35 },
    { title: "Approved", value: 70 },
    { title: "Rejected", value: 15 },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
      {cards.map((card, i) => (
        <div
          key={i}
          className="bg-white rounded-xl shadow p-5 border"
        >
          <p className="text-gray-500 text-sm">{card.title}</p>
          <h2 className="text-2xl font-bold mt-1">{card.value}</h2>
        </div>
      ))}
    </div>
  );
};

export default LeaveCards;
