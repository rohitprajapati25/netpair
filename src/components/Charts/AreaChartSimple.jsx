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



const AreaChartSimple = (props) => {
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
  { month: "nov", leaves: 4 },
  { month: "Dec", leaves: 4 },



  
];
  return (
    <div style={{ width: "30%", height: 400 }}  className="border-2 rounded-xl border-gray-400 bg-white">
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
