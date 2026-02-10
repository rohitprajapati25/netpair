const AttendanceTable = ({ data, onAdd }) => {
  return (
    <>
      <button
        onClick={onAdd}
        className="mb-4 bg-blue-600 hover:bg-blue-700 text-white px-5 py-2 rounded-lg shadow"
      >
        Mark Attendance
      </button>

      <div className="w-full flex items-start justify-center rounded-xl overflow-x-auto border-2 border-gray-400 h-auto h-min-[400px] overflow-y-auto">
        <table className="table-auto m-5 w-full bg-white rounded-xl shadow-lg overflow-hidden">
          
          <thead className="bg-gray-100">
            <tr className="text-left">
              <th className="px-6 py-3 border-b">Name</th>
              <th className="px-6 py-3 border-b">Date</th>
              <th className="px-6 py-3 border-b">Check In</th>
              <th className="px-6 py-3 border-b">Check Out</th>
              <th className="px-6 py-3 border-b">Status</th>
            </tr>
          </thead>
          <tbody>
            {data.map((item) => (
              <tr key={item.id} className="hover:bg-gray-50 transition">
                <td className="px-6 py-3 border-b">{item.name}</td>
                <td className="px-6 py-3 border-b">{item.date}</td>
                <td className="px-6 py-3 border-b">{item.in}</td>
                <td className="px-6 py-3 border-b">{item.out}</td>
                <td
                  className={`px-6 py-3 border-b font-semibold ${
                    item.status === "Present"
                      ? "text-green-600"
                      : "text-red-600"
                  }`}
                >
                  {item.status}
                </td>
              </tr>
            ))}
          </tbody>

        </table>
      </div>
    </>
  );
};

export default AttendanceTable;
