import React from 'react'
import Card from '../../components/Dashboard/Card'
import Charts from '../../components/Charts/Charts'
import BarCharts from '../../components/Charts/BarCharts'
import AreaChartSimple from '../../components/Charts/AreaChartSimple'
import PieChartSimple from '../../components/Charts/PieChartSimple'
// import Sidebar from '../../components/Sidebar'

const Dashboard = () => {
  
  


  return (
    <div className='relative h-[100%] w-full bg-gray-100 flex flex-col items-center justify-strat gap-3'>
      <div className='flex gap-3 items-center justify-center h-auto p-3 w-[100%] flex-wrap relative'>
        <Card icon="ri-account-box-line text-4xl mb-3" num={100} tot="Total number of staff"/>
        <Card icon="ri-bar-chart-box-line text-4xl mb-3" num={200} tot="Total Aplication"/>
        <Card icon="ri-briefcase-line text-4xl mb-3" num={50} tot="Total Projects"/>
        <Card icon="ri-calendar-check-line text-4xl mb-3" num={10} tot="Total Leave Request"/>
      </div>
      <div className=' flex gap-5 items-center justify-center  w-full flex-wrap relative p-1'>
                   
             <BarCharts/>
             <AreaChartSimple />
             <PieChartSimple av={20} ap={20} ar={20}/>   

      </div>
      <div className='flex item-center justify-center p-5 bg-red-200 h-auto w-auto'>
        <table className='table-auto bg-white rounded-t-xl border-all-2 border-separate border'>
          <thead>
            <tr >
            <th >Employee</th>
          <th>Dept</th>
          <th>Status</th>
          <th>Check-in</th>
          <th>Mode</th>
          </tr>
          </thead>
          <tbody>
            <tr>
              <td>Rohit Prajapti</td>
              <td>Dev</td>
              <td>Present</td>
              <td>09:30</td>
              <td>Office</td>
            </tr>
          </tbody>
        </table>
      </div>
      
    </div>
  )
}

export default Dashboard
