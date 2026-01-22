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

const data = [
  { month: "Jan", leaves: 4 },
  { month: "Feb", leaves: 2 },
  { month: "Mar", leaves: 6 },
  { month: "Apr", leaves: 3 },
];

const AreaChartSimple = () => {
  return (
    <div style={{ width: "30%", height: 300 }}>
      <ResponsiveContainer>
        <AreaChart data={data}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="month" />
          <YAxis />
          <Tooltip />
          <Area
            type="monotone"
            dataKey="leaves"
            stroke="#2563eb"
            fill="#93c5fd"
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
};

export default AreaChartSimple;
