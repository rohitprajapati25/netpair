import React from "react";

import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";




const PieChartSimple = (props) => {
const COLORS = ["#22c55e", "#facc15", "#ef4444"];

    const data = [
  { name: "Approved", value: props.ap },
  { name: "Pending", value: props.ar },
  { name: "Rejected", value: props.av },
];
  return (
    <div style={{ width: "30%", height: 300 }}>
      <ResponsiveContainer>
        <PieChart>
          <Pie
            data={data}
            dataKey="value"
            nameKey="name"
            cx="50%"
            cy="50%"
            outerRadius={100}
            label
          >
            {data.map((entry, index) => (
              <Cell key={index} fill={COLORS[index]} />
            ))}
          </Pie>

          <Tooltip />
          <Legend />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
};

export default PieChartSimple;
