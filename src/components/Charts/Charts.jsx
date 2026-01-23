import React from 'react'
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip,ResponsiveContainer } from 'recharts'

const Charts = () => {
    const data = [
  { time: "1", value: 10 },
  { time: "2", value: 25 },
  { time: "3", value: 18 },
];

  return (
    
    <div style={{ width: "30%", height: 300 }}>
      <ResponsiveContainer>
        <LineChart data={data}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="time" />
          <YAxis />
          <Tooltip />
          <Line dataKey="value" stroke="#2563eb" />
        </LineChart>
      </ResponsiveContainer>
    </div>
    
  )
}

export default Charts
