import React from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

const Charts = () => {

  const data = [
    { day: "Mon", tasks: 12 },
    { day: "Tue", tasks: 18 },
    { day: "Wed", tasks: 15 },
    { day: "Thu", tasks: 22 },
    { day: "Fri", tasks: 19 },
    { day: "Sat", tasks: 9 },
  ];

  return (
    <div className="bg-white border border-gray-200 rounded-2xl shadow-sm p-5 h-[350px] w-full">

      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-semibold text-gray-800">
          Weekly Task Performance
        </h3>

        <span className="text-xs bg-blue-50 text-blue-600 px-3 py-1 rounded-full">
          This Week
        </span>
      </div>

      <ResponsiveContainer width="100%" height="85%">
        <LineChart data={data}>
          <CartesianGrid strokeDasharray="3 3" vertical={false}/>
          <XAxis dataKey="day" />
          <YAxis />
          <Tooltip />
          <Line
            type="monotone"
            dataKey="tasks"
            stroke="#2563eb"
            strokeWidth={3}
            dot={{ r: 4 }}
          />
        </LineChart>
      </ResponsiveContainer>

    </div>
  );
};

export default Charts;