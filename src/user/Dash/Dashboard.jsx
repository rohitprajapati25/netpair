import React from 'react'
import Charts from '../../components/Charts/Charts'
import BarCharts from '../../components/Charts/BarCharts'
import AreaChartSimple from '../../components/Charts/AreaChartSimple'
import PieChartSimple from '../../components/Charts/PieChartSimple'
import Card from '../../components/Dashboard/Card'
import Table from '../../components/Dashboard/Table'
// import Sidebar from '../../components/Sidebar'

const Dashboard = () => {
  return (
    <div className='relative h-[100%] m-1 pb-10 pt-5 w-auto bg-white flex flex-col items-center justify-strat gap-3 min-h-full overflow-y-auto rounded-xl'>
      
      <div className='flex gap-3 items-center justify-center h-auto p-3 w-[100%] flex-wrap relative'>
        <Card icon="ri-account-box-line text-4xl mb-3" num={100} tot="Total number of staff"/>
        <Card icon="ri-bar-chart-box-line text-4xl mb-3" num={200} tot="Total Aplication"/>
        <Card icon="ri-briefcase-line text-4xl mb-3" num={50} tot="Total Projects"/>
        <Card icon="ri-calendar-check-line text-4xl mb-3" num={10} tot="Total Leave Request"/>
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
