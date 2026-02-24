import React from 'react'
import Charts from '../../components/Charts/Charts'
import BarCharts from '../../components/Charts/BarCharts'
import AreaChartSimple from '../../components/Charts/AreaChartSimple'
import PieChartSimple from '../../components/Charts/PieChartSimple'
import Card from '../../components/Dashboard/Card'
import Table from '../../components/Dashboard/Table'
// import Sidebar from '../../components/Sidebar'

const Dashboard = () => {
  const dashboardData = [
  {
    icon: "ri-account-box-line",
    num: 100,
    tot: "Total number of staff",
    color: "from-blue-500 to-indigo-600",
  },
  {
    icon: "ri-bar-chart-box-line",
    num: 200,
    tot: "Total Application",
    color: "from-purple-500 to-pink-600",
  },
  {
    icon: "ri-briefcase-line",
    num: 50,
    tot: "Total Projects",
    color: "from-green-500 to-emerald-600",
  },
  {
    icon: "ri-calendar-check-line",
    num: 10,
    tot: "Total Leave Request",
    color: "from-orange-500 to-red-500",
  },
];
  return (
    <div className='h-full m-1 p-6
      bg-gray-50 rounded-2xl
      flex flex-col gap-6 overflow-y-auto'>
      
      <div
  className="
  grid
  grid-cols-1
  sm:grid-cols-2
  lg:grid-cols-4
  gap-5
  w-full
  p-3
"
>
  {dashboardData.map((item, index) => (
    <Card key={index} icon={item.icon} num={item.num} tot={item.tot} color={item.color}/>
  ))}
</div>
      <div className=' flex gap-5 items-center justify-center  w-[100%] flex-wrap relative p-1'>
                   
             <BarCharts/>
             <AreaChartSimple />
             <PieChartSimple av={20} ap={20} ar={20}/>   

      </div>
       <div className="flex items-center justify-center p-2 w-full h-auto">
        <Table/>
    </div>
      
    </div>
  )
}

export default Dashboard
