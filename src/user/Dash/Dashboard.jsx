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
       <div className="flex items-center justify-center p-6">
      <table className="table-auto bg-white rounded-xl shadow-lg overflow-hidden border border-gray-200">
        <thead className="bg-gray-100">
          <tr className="text-left">
            <th className="px-6 py-3 border-b">Employee</th>
            <th className="px-6 py-3 border-b">Dept</th>
            <th className="px-6 py-3 border-b">Status</th>
            <th className="px-6 py-3 border-b">Check-in</th>
            <th className="px-6 py-3 border-b">Mode</th>
          </tr>
        </thead>

        <tbody>
          <tr className="hover:bg-gray-50">
            <td className="px-6 py-3 border-b">Rohit Prajapti</td>
            <td className="px-6 py-3 border-b">Dev</td>
            <td className="px-6 py-3 border-b text-green-600 font-semibold">
              Present
            </td>
            <td className="px-6 py-3 border-b">09:30</td>
            <td className="px-6 py-3 border-b">Office</td>
          </tr>
        </tbody>
      </table>
    </div>
      
    </div>
  )
}

export default Dashboard
