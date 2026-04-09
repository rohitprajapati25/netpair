import React from "react";
import { PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer } from "recharts";

const PieChartSimple = ({ data = [] }) => {
  // Dynamic task status from real data
  const taskStats = data.reduce((acc, task) => {
    const status = task.status?.toLowerCase();
    if (status?.includes('complete') || status === 'done') acc.completed++;
    else if (status?.includes('progress') || status === 'started') acc.progress++;
    else if (status?.includes('assign') || status === 'pending') acc.assigned++;
    else acc.overdue++;
    return acc;
  }, { completed: 0, progress: 0, assigned: 0, overdue: 0 });

  const chartData = [
    { name: "Completed", value: Math.max(taskStats.completed, 1) },
    { name: "In Progress", value: Math.max(taskStats.progress, 1) },
    { name: "Assigned", value: Math.max(taskStats.assigned, 1) },
    { name: "Overdue", value: Math.max(taskStats.overdue, 1) },
  ].filter(item => item.value > 0);

  const COLORS = ["#10b981", "#3b82f6", "#f59e0b", "#ef4444"];

  return (
    <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-6 h-[400px] w-full">
      <div className="mb-6">
        <h3 className="text-lg font-bold text-slate-800 mb-1">Task Distribution</h3>
        <p className="text-xs text-slate-500">Live from database: {data.length} tasks total</p>
      </div>

      {chartData.length > 0 ? (
        <ResponsiveContainer width="100%" height="80%">
          <PieChart>
            <Pie
              data={chartData}
              innerRadius={70}
              outerRadius={100}
              paddingAngle={3}
              dataKey="value"
              nameKey="name"
            >
              {chartData.map((entry, index) => (
                <Cell 
                  key={`cell-${index}`} 
                  fill={COLORS[index % COLORS.length]} 
                  strokeWidth={2}
                  stroke="rgba(255,255,255,0.3)"
                />
              ))}
            </Pie>
            <Tooltip contentStyle={{ 
              borderRadius: '12px', 
              border: '1px solid #e2e8f0', 
              backgroundColor: 'white',
              boxShadow: '0 10px 25px rgba(0,0,0,0.1)'
            }} />
            <Legend 
              verticalAlign="bottom" 
              iconType="circle" 
              iconSize={10}
              wrapperStyle={{ paddingTop: '20px' }}
            />
          </PieChart>
        </ResponsiveContainer>
      ) : (
        <div className="flex items-center justify-center h-full text-slate-500">
          <div>
            <div className="text-4xl mb-2">📊</div>
            <p className="text-sm">No task data yet</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default PieChartSimple;

