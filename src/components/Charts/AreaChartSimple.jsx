// import React from "react";
// import {
//   AreaChart,
//   Area,
//   XAxis,
//   YAxis,
//   CartesianGrid,
//   Tooltip,
//   ResponsiveContainer,
// } from "recharts";

// const AreaChartSimple = () => {

//   const data = [
//     { month: "Jan", leaves: 4 },
//     { month: "Feb", leaves: 2 },
//     { month: "Mar", leaves: 6 },
//     { month: "Apr", leaves: 3 },
//     { month: "May", leaves: 2 },
//     { month: "Jun", leaves: 3 },
//     { month: "Jul", leaves: 5 },
//     { month: "Aug", leaves: 4 },
//     { month: "Sep", leaves: 4 },
//     { month: "Oct", leaves: 8 },
//     { month: "Nov", leaves: 4 },
//     { month: "Dec", leaves: 4 },
//   ];

//   return (
//     <div className="bg-white border border-gray-200 rounded-2xl shadow-sm p-5 h-[360px] w-full">

//       {/* Header */}
//       <div className="flex items-center justify-between mb-4">
//         <h3 className="text-lg font-semibold text-gray-800">
//           Monthly Leave Trend
//         </h3>

//         <span className="text-xs bg-blue-50 text-blue-600 px-3 py-1 rounded-full">
//           2026
//         </span>
//       </div>

//       {/* Chart */}
//       <ResponsiveContainer width="100%" height="85%">
//         <AreaChart data={data}>
//           <CartesianGrid strokeDasharray="3 3" vertical={false}/>
//           <XAxis dataKey="month" />
//           <YAxis />
//           <Tooltip />

//           <Area
//             type="monotone"
//             dataKey="leaves"
//             stroke="#2563eb"
//             fill="#bfdbfe"
//             strokeWidth={2}
//           />
//         </AreaChart>
//       </ResponsiveContainer>

//     </div>
//   );
// };

// export default AreaChartSimple;


import React from "react";
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";

const data = [
  { month: "Jan", leaves: 4 }, { month: "Feb", leaves: 2 }, { month: "Mar", leaves: 6 },
  { month: "Apr", leaves: 3 }, { month: "May", leaves: 2 }, { month: "Jun", leaves: 3 },
  { month: "Jul", leaves: 5 }, { month: "Aug", leaves: 4 }, { month: "Sep", leaves: 4 },
  { month: "Oct", leaves: 8 }, { month: "Nov", leaves: 4 }, { month: "Dec", leaves: 4 },
];

const AreaChartSimple = () => {
  return (
    <div className="bg-white border border-slate-200 rounded-xl shadow-sm p-6 h-[360px] w-full">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-lg font-bold text-slate-800">Leave Trends</h3>
          <p className="text-xs text-slate-500">Annual leave frequency analysis</p>
        </div>
      </div>

      <ResponsiveContainer width="100%" height="80%">
        <AreaChart data={data} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
          <defs>
            <linearGradient id="colorLeaves" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.1}/>
              <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
          <XAxis 
            dataKey="month" 
            axisLine={false} 
            tickLine={false} 
            tick={{ fill: '#64748b', fontSize: 11 }} 
          />
          <YAxis axisLine={false} tickLine={false} tick={{ fill: '#64748b', fontSize: 11 }} />
          <Tooltip 
             contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}
          />
          <Area
            type="monotone"
            dataKey="leaves"
            stroke="#3b82f6"
            strokeWidth={3}
            fillOpacity={1}
            fill="url(#colorLeaves)"
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
};

export default AreaChartSimple;