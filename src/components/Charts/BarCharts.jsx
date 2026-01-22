import React from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

const data = [
  { name: "Jan", leaves: 4 },
  { name: "Feb", leaves: 2 },
  { name: "Mar", leaves: 6 },
  { name: "Apr", leaves: 3 },
];

const BarCharts = () => {
  return (
    <div style={{ width: "30%", height: 300 }} className="border-2 rounded-xl border-gray-400">
      <ResponsiveContainer>
        <BarChart data={data}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="name" />
          <YAxis />
          <Tooltip />
          <Bar dataKey="leaves" fill="#2563eb" />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

export default BarCharts;
