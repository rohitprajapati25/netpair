import React from "react";
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";

const AreaChartSimple = ({ data = [] }) => {
  let chartData = [
    { month: "Jan", leaves: 4 }, { month: "Feb", leaves: 2 }, { month: "Mar", leaves: 6 },
    { month: "Apr", leaves: 3 }, { month: "May", leaves: 2 }, { month: "Jun", leaves: 3 },
    { month: "Jul", leaves: 5 }, { month: "Aug", leaves: 4 }, { month: "Sep", leaves: 4 },
    { month: "Oct", leaves: 8 }, { month: "Nov", leaves: 4 }, { month: "Dec", leaves: 4 },
  ];

  if (data && data.length > 0) {
const monthlyData = {};
  data.forEach(record => {
    const date = new Date(record.date);
    const monthYear = date.toLocaleDateString('en-US', { month: 'short', year: 'numeric' });
    monthlyData[monthYear] = (monthlyData[monthYear] || 0) + 1;
  });

    
    chartData = Object.entries(monthlyData)
      .map(([month, value]) => ({ month, leaves: value }))
      .slice(-12);
  }

  return (
    <div className="bg-white border border-slate-200 rounded-xl shadow-sm p-6 h-[360px] w-full">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-lg font-bold text-slate-800">Attendance Trend</h3>
          <p className="text-xs text-slate-500">Monthly attendance frequency</p>
        </div>
      </div>

      <ResponsiveContainer width="100%" height="80%" aspect={2}>
        <AreaChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
          <defs>
            <linearGradient id="colorAttendance" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.8}/>
              <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
          <XAxis 
            dataKey="month" 
            axisLine={false} 
            tickLine={false} 
            tick={{ fontSize: 11, fill: '#64748b' }} 
          />
          <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 11, fill: '#64748b' }} />
          <Tooltip />
          <Area
            type="monotone"
            dataKey="leaves"
            stroke="#3b82f6"
            strokeWidth={3}
            fillOpacity={1}
            fill="url(#colorAttendance)"
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
};

export default AreaChartSimple;

