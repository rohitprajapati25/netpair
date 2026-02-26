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
    <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-5 h-[400px] w-full">

      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-semibold text-gray-800">
          Weekly Attendance Overview
        </h3>

        <span className="text-xs bg-blue-50 text-blue-600 px-3 py-1 rounded-full">
          This Week
        </span>
      </div>

      <ResponsiveContainer width="100%" height="85%">
        <BarChart data={data}>
          <CartesianGrid strokeDasharray="3 3" vertical={false}/>
          <XAxis dataKey="day" />
          <YAxis />
          <Tooltip />
          <Legend />

          <Bar dataKey="present" fill="#22c55e" radius={[6,6,0,0]} />
          <Bar dataKey="absent" fill="#ef4444" radius={[6,6,0,0]} />
          <Bar dataKey="leave" fill="#f59e0b" radius={[6,6,0,0]} />
          <Bar dataKey="late" fill="#3b82f6" radius={[6,6,0,0]} />

        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

export default BarCharts;