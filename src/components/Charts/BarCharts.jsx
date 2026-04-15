import React, { useMemo } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Cell,
} from "recharts";

const BarCharts = ({
  data = [],
  title = "Weekly Attendance Overview",
  subtitle = "Real-time employee tracking",
  dateField = 'date',
  statusField = 'status',
  categories = [
    { name: 'Present', match: /present|p/i, color: '#10b981', label: 'Present' },
    { name: 'Absent', match: /absent|a/i, color: '#ef4444', label: 'Absent' },
    { name: 'Leave', match: /leave|onleave/i, color: '#f59e0b', label: 'On Leave' },
    { name: 'Late', match: /late|l/i, color: '#3b82f6', label: 'Late Arrival' }
  ],
  height = 400,
  loading = false,
  className = ""
}) => {

  const chartData = useMemo(() => {
    const stats = {};
    const now = new Date();
    const days = [];

    // Initialize last 7 days
    for (let i = 6; i >= 0; i--) {
      const d = new Date(now);
      d.setDate(now.getDate() - i);
      const dayStr = d.toLocaleDateString('en-US', { weekday: 'short', day: 'numeric' });
      stats[dayStr] = { day: dayStr, total: 0 };
      categories.forEach(cat => stats[dayStr][cat.name] = 0);
    }

    // Process actual data
    if (Array.isArray(data)) {
      data.forEach(record => {
        const date = new Date(record[dateField]);
        if (isNaN(date.getTime())) return;
        const dayStr = date.toLocaleDateString('en-US', { weekday: 'short', day: 'numeric' });
        
        if (stats[dayStr]) {
          const status = (record[statusField] || '').toString().toLowerCase().trim();
          const cat = categories.find(c => c.match.test(status));
          if (cat) {
            stats[dayStr][cat.name]++;
            stats[dayStr].total++;
          }
        }
      });
    }

    return Object.values(stats);
  }, [data, dateField, statusField, categories]);

  const totalRecords = data.length;

  // Custom Tooltip Component
  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white/95 backdrop-blur-md p-4 border border-slate-200 shadow-2xl rounded-2xl min-w-[160px]">
          <p className="text-slate-900 font-bold mb-2 border-b border-slate-100 pb-1">{label}</p>
          {payload.map((entry, index) => (
            <div key={index} className="flex items-center justify-between gap-4 py-1">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full" style={{ backgroundColor: entry.color }} />
                <span className="text-slate-600 text-sm font-medium">{entry.name}:</span>
              </div>
              <span className="text-slate-900 font-bold text-sm">{entry.value}</span>
            </div>
          ))}
        </div>
      );
    }
    return null;
  };

  if (loading) {
    return (
      <div className="bg-white rounded-3xl border border-slate-100 p-8 animate-pulse shadow-sm">
        <div className="h-6 w-1/3 bg-slate-100 rounded-full mb-4"></div>
        <div className="h-[300px] w-full bg-slate-50 rounded-2xl"></div>
      </div>
    );
  }

  return (
    <div className={`bg-white rounded-[2rem] border border-slate-200/60 shadow-sm overflow-hidden ${className}`}>
      {/* Header Section */}
      <div className="p-6 md:p-8 flex flex-col lg:flex-row lg:items-end justify-between gap-6">
        <div className="space-y-1">
          <div className="flex items-center gap-2 mb-1">
            <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse"></span>
            <span className="text-xs font-bold text-emerald-600 uppercase tracking-wider">Live Analytics</span>
          </div>
          <h3 className="text-2xl md:text-3xl font-black text-slate-900 tracking-tight leading-none">
            {title}
          </h3>
          <p className="text-slate-500 font-medium">{subtitle}</p>
        </div>

        {/* Dynamic Legend */}
        <div className="flex flex-wrap gap-4 bg-slate-50/80 p-3 rounded-2xl border border-slate-100">
          {categories.map((cat) => (
            <div key={cat.name} className="flex items-center gap-2 px-1">
              <div className="w-3 h-3 rounded-full shadow-sm" style={{ backgroundColor: cat.color }} />
              <span className="text-xs font-bold text-slate-600 tracking-wide">{cat.label}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Chart Container */}
      <div className="px-4 pb-4 overflow-x-auto scrollbar-hide">
        <div className="min-w-[600px] h-full" style={{ height: height }}>
<ResponsiveContainer width="100%" height={height || 400} minHeight={300}>
            <BarChart
              data={chartData}
              margin={{ top: 10, right: 10, left: -20, bottom: 20 }}
              barGap={8}
            >
              <CartesianGrid 
                strokeDasharray="0" 
                vertical={false} 
                stroke="#f1f5f9" 
              />
              <XAxis
                dataKey="day"
                axisLine={false}
                tickLine={false}
                tick={{ fill: '#94a3b8', fontSize: 12, fontWeight: 600 }}
                dy={15}
              />
              <YAxis
                axisLine={false}
                tickLine={false}
                tick={{ fill: '#cbd5e1', fontSize: 12 }}
              />
              <Tooltip 
                content={<CustomTooltip />} 
                cursor={{ fill: '#f8fafc', radius: 10 }}
              />
              
              {categories.map((cat) => (
                <Bar
                  key={cat.name}
                  dataKey={cat.name}
                  fill={cat.color}
                  radius={[6, 6, 0, 0]}
                  barSize={32}
                  animationDuration={1500}
                />
              ))}
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Footer Stats */}
      <div className="border-t border-slate-100 bg-slate-50/50 p-6 flex items-center justify-between">
        <div className="flex gap-8">
          <div>
            <p className="text-[10px] uppercase font-bold text-slate-400 tracking-widest">Total Scans</p>
            <p className="text-xl font-black text-slate-800">{totalRecords}</p>
          </div>
          <div>
            <p className="text-[10px] uppercase font-bold text-slate-400 tracking-widest">Active Employees</p>
            <p className="text-xl font-black text-slate-800">
               {chartData[chartData.length - 1]?.total || 0}
            </p>
          </div>
        </div>
        <button className="bg-white border border-slate-200 px-5 py-2.5 rounded-xl text-sm font-bold text-slate-700 hover:bg-slate-900 hover:text-white hover:border-slate-900 transition-all duration-300 shadow-sm">
          Export Report
        </button>
      </div>
    </div>
  );
};

export default BarCharts;