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

const BarCharts = ({ data = [] }) => {
  // Fallback data - ALWAYS VISIBLE
  const fallbackData = [
    { day: "Mon", present: 32, absent: 4, leave: 2, late: 3 },
    { day: "Tue", present: 30, absent: 5, leave: 3, late: 2 },
    { day: "Wed", present: 34, absent: 2, leave: 1, late: 4 },
    { day: "Thu", present: 31, absent: 6, leave: 2, late: 1 },
    { day: "Fri", present: 35, absent: 3, leave: 1, late: 2 }
  ];

  // Transform live data OR use fallback
  const weeklyStats = {};
  
  // Process live data (last 5 days)
  (data || []).slice(-5).forEach(record => {
    const dayName = new Date(record.date || Date.now()).toLocaleDateString('en-US', { weekday: 'short' });
    weeklyStats[dayName] = weeklyStats[dayName] || { present: 0, absent: 0, leave: 0, late: 0 };
    
    const status = (record.status || 'present').toString().toLowerCase().trim();
    switch(status) {
      case 'present':
      case 'p': weeklyStats[dayName].present++; break;
      case 'absent':
      case 'a': weeklyStats[dayName].absent++; break;
      case 'late':
      case 'l': weeklyStats[dayName].late++; break;
      default: weeklyStats[dayName].leave++; break;
    }
  });

  // Ensure minimum 5 days data
  const dayOrder = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri'];
  dayOrder.forEach(day => {
    if (!weeklyStats[day]) weeklyStats[day] = { present: 0, absent: 0, leave: 0, late: 0 };
  });

  const chartData = dayOrder.map(day => ({
    day,
    present: weeklyStats[day].present,
    absent: weeklyStats[day].absent,
    leave: weeklyStats[day].leave,
    late: weeklyStats[day].late
  }));

  return (
    <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6 h-[400px] w-full">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-xl font-bold text-slate-800">Weekly Attendance</h3>
          <p className="text-sm text-slate-500 mt-1">
            {data.length ? `${data.length} records` : 'Demo data'}
          </p>
        </div>
        <span className={`px-3 py-1 rounded-full text-xs font-bold ${
          data.length 
            ? 'bg-emerald-100 text-emerald-800' 
            : 'bg-slate-100 text-slate-600'
        }`}>
          {data.length ? 'LIVE' : 'DEMO'}
        </span>
      </div>

      <ResponsiveContainer width="100%" height="85%">
        <BarChart data={chartData} barCategoryGap={15}>
          <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f8fafc" />
          <XAxis 
            dataKey="day" 
            axisLine={false}
            tickLine={false}
            tick={{ fontSize: 12, fontWeight: 600, fill: '#475569' }}
          />
          <YAxis 
            axisLine={false}
            tickLine={false}
            tick={{ fontSize: 11, fill: '#64748b' }}
            width={40}
          />
          <Tooltip 
            cursor={{ fill: '#f8fafc' }}
            contentStyle={{
              borderRadius: '12px',
              border: '1px solid #e2e8f0',
              backgroundColor: 'white',
              boxShadow: '0 10px 25px rgba(0,0,0,0.08)'
            }}
          />
          <Legend 
            verticalAlign="top" 
            height={40}
            wrapperStyle={{ paddingBottom: '10px' }}
          />

          <Bar 
            dataKey="present" 
            fill="#10b981" 
            radius={[8,8,0,0]} 
            name="Present"
            maxBarSize={20}
          />
          <Bar 
            dataKey="absent" 
            fill="#ef4444" 
            radius={[8,8,0,0]} 
            name="Absent"
            maxBarSize={20}
          />
          <Bar 
            dataKey="leave" 
            fill="#f59e0b" 
            radius={[8,8,0,0]} 
            name="Leave"
            maxBarSize={20}
          />
          <Bar 
            dataKey="late" 
            fill="#3b82f6" 
            radius={[8,8,0,0]} 
            name="Late"
            maxBarSize={20}
          />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

export default BarCharts;
