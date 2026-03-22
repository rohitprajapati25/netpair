// import React from "react";
// import {
//   BarChart,
//   Bar,
//   XAxis,
//   YAxis,
//   CartesianGrid,
//   Tooltip,
//   ResponsiveContainer,
//   Legend,
// } from "recharts";

// const data = [
//   { day: "Mon", present: 32, absent: 4, leave: 2, late: 3 },
//   { day: "Tue", present: 30, absent: 5, leave: 3, late: 2 },
//   { day: "Wed", present: 34, absent: 2, leave: 1, late: 4 },
//   { day: "Thu", present: 31, absent: 6, leave: 2, late: 1 },
//   { day: "Fri", present: 35, absent: 3, leave: 1, late: 2 },
// ];

// const BarCharts = () => {
//   return (
//     <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-5 h-[400px] w-full">

//       <div className="flex justify-between items-center mb-4">
//         <h3 className="text-lg font-semibold text-gray-800">
//           Weekly Attendance Overview
//         </h3>

//         <span className="text-xs bg-blue-50 text-blue-600 px-3 py-1 rounded-full">
//           This Week
//         </span>
//       </div>

//       <ResponsiveContainer width="100%" height="85%">
//         <BarChart data={data}>
//           <CartesianGrid strokeDasharray="3 3" vertical={false}/>
//           <XAxis dataKey="day" />
//           <YAxis />
//           <Tooltip />
//           <Legend />

//           <Bar dataKey="present" fill="#22c55e" radius={[6,6,0,0]} />
//           <Bar dataKey="absent" fill="#ef4444" radius={[6,6,0,0]} />
//           <Bar dataKey="leave" fill="#f59e0b" radius={[6,6,0,0]} />
//           <Bar dataKey="late" fill="#3b82f6" radius={[6,6,0,0]} />

//         </BarChart>
//       </ResponsiveContainer>
//     </div>
//   );
// };

// export default BarCharts;




import React from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";

const data = [
  { day: "Mon", present: 32, absent: 4, leave: 2, late: 3 },
  { day: "Tue", present: 30, absent: 5, leave: 3, late: 2 },
  { day: "Wed", present: 34, absent: 2, leave: 1, late: 4 },
  { day: "Thu", present: 31, absent: 6, leave: 2, late: 1 },
  { day: "Fri", present: 35, absent: 3, leave: 1, late: 2 },
];

const BarCharts = () => {
  return (
    <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-6 h-[400px] w-full">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h3 className="text-lg font-bold text-slate-800">Attendance Overview</h3>
          <p className="text-xs text-slate-500">Weekly statistics for all departments</p>
        </div>
        <select className="text-xs bg-slate-50 border border-slate-200 p-1 rounded-md outline-none">
          <option>This Week</option>
          <option>Last Week</option>
        </select>
      </div>

      <ResponsiveContainer width="100%" height="80%">
        <BarChart data={data} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
          <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
          <XAxis 
            dataKey="day" 
            axisLine={false} 
            tickLine={false} 
            tick={{ fill: '#64748b', fontSize: 12 }} 
            dy={10}
          />
          <YAxis 
            axisLine={false} 
            tickLine={false} 
            tick={{ fill: '#64748b', fontSize: 12 }} 
          />
          <Tooltip 
            cursor={{ fill: '#f8fafc' }}
            contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}
          />
          <Legend iconType="circle" wrapperStyle={{ paddingTop: '20px' }} />

          <Bar dataKey="present" fill="#10b981" radius={[4, 4, 0, 0]} barSize={12} name="Present" />
          <Bar dataKey="absent" fill="#ef4444" radius={[4, 4, 0, 0]} barSize={12} name="Absent" />
          <Bar dataKey="leave" fill="#f59e0b" radius={[4, 4, 0, 0]} barSize={12} name="Leave" />
          <Bar dataKey="late" fill="#3b82f6" radius={[4, 4, 0, 0]} barSize={12} name="Late" />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

export default BarCharts;