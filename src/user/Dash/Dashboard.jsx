import React from 'react'
// import Charts from '../../components/Charts/Charts'
import BarCharts from '../../components/Charts/BarCharts'
import AreaChartSimple from '../../components/Charts/AreaChartSimple'
import PieChartSimple from '../../components/Charts/PieChartSimple'
import Card from '../../components/Dashboard/Card'
import Table from '../../components/Dashboard/Table'
// import Sidebar from '../../components/Sidebar'

const Dashboard = () => {
 const dashboardData = [
  {
    icon: "ri-team-line",
    num: 40,
    tot: "Total Employees",
    color: "from-blue-500 to-indigo-600",
  },
  {
    icon: "ri-user-follow-line",
    num: 32,
    tot: "Present Today",
    color: "from-green-500 to-emerald-600",
  },
  {
    icon: "ri-task-line",
    num: 21,
    tot: "Active Tasks",
    color: "from-purple-500 to-pink-600",
  },
  {
    icon: "ri-file-list-3-line",
    num: 6,
    tot: "Pending Timesheets",
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
      <div className=' flex gap-5 items-center justify-center  w-full h-auto flex-wrap relative p-1'>
                   
             <div className='flex align-center gap-4 h-auto w-full p-2 grid gap-5
  grid-cols-1
  md:grid-cols-2'>
                <BarCharts/>
                <div className=''>
                  <PieChartSimple completed={18} progress={10} assigned={6} overdue={3}/> 
                </div>
              </div>  
             <AreaChartSimple/>

      </div>
       <div className="flex items-center justify-center p-2 w-full h-auto">
        <Table/>
    </div>
      
    </div>
  )
}

export default Dashboard
