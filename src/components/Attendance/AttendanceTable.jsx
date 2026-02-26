import React from "react";

const AttendanceTable = ({ data }) => {

  const convertToMinutes = (time) => {
    if (!time || time === "-") return null;
    const [hour, minute] = time.split(":").map(Number);
    return hour * 60 + minute;
  };

  const calculateHours = (checkIn, checkOut) => {
    if (!checkIn || !checkOut || checkIn === "-" || checkOut === "-")
      return "-";

    let start = convertToMinutes(checkIn);
    let end = convertToMinutes(checkOut);

    if (end < start) end += 12 * 60;

    const diff = end - start;
    const hrs = Math.floor(diff / 60);
    const mins = diff % 60;

    return `${hrs}h ${mins}m`;
  };

  const statusStyle = (status) => {
    switch (status) {
      case "Present":
        return "bg-green-100 text-green-700";
      case "Late":
        return "bg-yellow-100 text-yellow-700";
      case "Leave":
        return "bg-blue-100 text-blue-700";
      default:
        return "bg-red-100 text-red-700";
    }
  };

  return (
    <div className="w-full bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">

      <div className="overflow-x-auto max-h-[420px] overflow-y-auto">
        <table className="w-full text-sm">

          <thead className="bg-gray-50 sticky top-0 z-10">
            <tr className="text-left text-gray-600">
              <th className="px-6 py-4 font-semibold">Employee</th>
              <th className="px-6 py-4 font-semibold">Department</th>
              <th className="px-6 py-4 font-semibold">Date</th>
              <th className="px-6 py-4 font-semibold">Check In</th>
              <th className="px-6 py-4 font-semibold">Check Out</th>
              <th className="px-6 py-4 font-semibold">Work Mode</th>
              <th className="px-6 py-4 font-semibold">Working Hours</th>
              <th className="px-6 py-4 font-semibold text-center">Status</th>
            </tr>
          </thead>

          <tbody>
            {data.map((item) => {

              const hours = calculateHours(item.in, item.out);

              return (
                <tr
                  key={item.id}
                  className="border-t hover:bg-gray-50 transition"
                >
                  <td className="px-6 py-4 font-medium text-gray-800 flex items-center gap-3">
                    
                    {item.name}
                  </td>

                  <td className="px-6 py-4">{item.dept}</td>

                  <td className="px-6 py-4 text-gray-600">
                    {item.date}
                  </td>

                  <td className="px-6 py-4">
                    {item.in || "-"}
                  </td>

                  <td className="px-6 py-4">
                    {item.out || "-"}
                  </td>

                  <td className="px-6 py-4">
                    <span className={`px-3 py-1 rounded-full text-xs font-semibold
                      ${item.mode === "Remote"
                        ? "bg-purple-100 text-purple-700"
                        : "bg-blue-100 text-blue-700"}`}>
                      {item.mode || "-"}
                    </span>
                  </td>

                  <td className={`px-6 py-4 font-medium
                    ${hours !== "-" && hours.startsWith("4")
                      ? "text-red-500"
                      : "text-gray-700"}`}>
                    {hours}
                  </td>

                  <td className="px-6 py-4 text-center">
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-semibold ${statusStyle(item.status)}`}
                    >
                      {item.status}
                    </span>
                  </td>

                </tr>
              );
            })}
          </tbody>

        </table>
      </div>
    </div>
  );
};

export default AttendanceTable;