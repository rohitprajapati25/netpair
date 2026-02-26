import React from "react";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

const AreaChartSimple = () => {

  const data = [
    { month: "Jan", leaves: 4 },
    { month: "Feb", leaves: 2 },
    { month: "Mar", leaves: 6 },
    { month: "Apr", leaves: 3 },
    { month: "May", leaves: 2 },
    { month: "Jun", leaves: 3 },
    { month: "Jul", leaves: 5 },
    { month: "Aug", leaves: 4 },
    { month: "Sep", leaves: 4 },
    { month: "Oct", leaves: 8 },
    { month: "Nov", leaves: 4 },
    { month: "Dec", leaves: 4 },
  ];

  return (
    <div className="bg-white border border-gray-200 rounded-2xl shadow-sm p-5 h-[360px] w-full">

      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-gray-800">
          Monthly Leave Trend
        </h3>

        <span className="text-xs bg-blue-50 text-blue-600 px-3 py-1 rounded-full">
          2026
        </span>
      </div>

      {/* Chart */}
      <ResponsiveContainer width="100%" height="85%">
        <AreaChart data={data}>
          <CartesianGrid strokeDasharray="3 3" vertical={false}/>
          <XAxis dataKey="month" />
          <YAxis />
          <Tooltip />

          <Area
            type="monotone"
            dataKey="leaves"
            stroke="#2563eb"
            fill="#bfdbfe"
            strokeWidth={2}
          />
        </AreaChart>
      </ResponsiveContainer>

    </div>
  );
};

export default AreaChartSimple;