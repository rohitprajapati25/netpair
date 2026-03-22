// import React from "react";
// import {
//   PieChart,
//   Pie,
//   Cell,
//   Tooltip,
//   Legend,
//   ResponsiveContainer,
// } from "recharts";

// const PieChartSimple = ({
//   completed = 0,
//   progress = 0,
//   assigned = 0,
//   overdue = 0,
// }) => {

//   const COLORS = ["#22c55e","#3b82f6","#f59e0b","#ef4444"];

//   const data = [
//     { name: "Completed", value: Number(completed) },
//     { name: "In Progress", value: Number(progress) },
//     { name: "Assigned", value: Number(assigned) },
//     { name: "Overdue", value: Number(overdue) },
//   ];

//   return (
//     <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-5 h-[400px] w-full">

//       <h3 className="text-lg font-semibold mb-4">
//         Task Status Overview
//       </h3>

//       <ResponsiveContainer width="100%" height="85%">
//         <PieChart>
//           <Pie
//             data={data}
//             dataKey="value"
//             nameKey="name"
//             outerRadius={90}
//             label
//           >
//             {data.map((entry, index) => (
//               <Cell key={index} fill={COLORS[index]} />
//             ))}
//           </Pie>

//           <Tooltip />
//           <Legend />
//         </PieChart>
//       </ResponsiveContainer>

//     </div>
//   );
// };

// export default PieChartSimple;

import React from "react";
import { PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer } from "recharts";

const PieChartSimple = ({ completed = 18, progress = 10, assigned = 6, overdue = 3 }) => {
  const data = [
    { name: "Completed", value: Number(completed) },
    { name: "In Progress", value: Number(progress) },
    { name: "Assigned", value: Number(assigned) },
    { name: "Overdue", value: Number(overdue) },
  ];

  const COLORS = ["#10b981", "#3b82f6", "#f59e0b", "#ef4444"];

  return (
    <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-6 h-[400px] w-full">
      <h3 className="text-lg font-bold text-slate-800 mb-1">Task Distribution</h3>
      <p className="text-xs text-slate-500 mb-6">Current lifecycle of active tasks</p>

      <ResponsiveContainer width="100%" height="80%">
        <PieChart>
          <Pie
            data={data}
            innerRadius={70}
            outerRadius={100}
            paddingAngle={5}
            dataKey="value"
          >
            {data.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} stroke="none" />
            ))}
          </Pie>
          <Tooltip 
            contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}
          />
          <Legend verticalAlign="bottom" iconType="circle" />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
};

export default PieChartSimple;