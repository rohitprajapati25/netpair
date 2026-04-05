// import React from 'react'
// // import Charts from '../../components/Charts/Charts'
// import BarCharts from '../../components/Charts/BarCharts'
// import AreaChartSimple from '../../components/Charts/AreaChartSimple'
// import PieChartSimple from '../../components/Charts/PieChartSimple'
// import Card from '../../components/Dashboard/Card'
// import Table from '../../components/Dashboard/Table'
// // import Sidebar from '../../components/Sidebar'

// const Dashboard = () => {
//  const dashboardData = [
//   {
//     icon: "ri-team-line",
//     num: 40,
//     tot: "Total Employees",
//     color: "from-blue-500 to-indigo-600",
//   },
//   {
//     icon: "ri-user-follow-line",
//     num: 32,
//     tot: "Present Today",
//     color: "from-green-500 to-emerald-600",
//   },
//   {
//     icon: "ri-task-line",
//     num: 21,
//     tot: "Active Tasks",
//     color: "from-purple-500 to-pink-600",
//   },
//   {
//     icon: "ri-file-list-3-line",
//     num: 6,
//     tot: "Pending Timesheets",
//     color: "from-orange-500 to-red-500",
//   },
// ];
//   return (
//     <div className='relative h-full m-1 p-6
//       bg-gradient-to-br from-slate-50 to-gray-100
//       flex flex-col gap-6 overflow-y-auto rounded-2xl grid-cols-1'>
      
//       <div
//   className="
//   grid
//   grid-cols-1
//   sm:grid-cols-2
//   lg:grid-cols-4
//   gap-5
//   w-full
//   p-3
// "
// >
//   {dashboardData.map((item, index) => (
//     <Card key={index} icon={item.icon} num={item.num} tot={item.tot} color={item.color}/>
//   ))}
// </div>
//       <div className=' flex gap-5 items-center justify-center  w-full h-auto flex-wrap relative p-1'>
                   
//              <div className='flex align-center gap-4 h-auto w-full p-2 grid gap-5
//   grid-cols-1
//   md:grid-cols-2'>
//                 <BarCharts/>
//                 <div className=''>
//                   <PieChartSimple completed={18} progress={10} assigned={6} overdue={3}/> 
//                 </div>
//               </div>  
//              <AreaChartSimple/>

//       </div>
//        <div className="flex items-center justify-center p-2 w-full h-auto">
//         <Table/>
//     </div>
      
//     </div>
//   )
// }

// export default Dashboard


import React, { useState, useEffect, useCallback } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import axios from 'axios';
import BarCharts from '../../components/Charts/BarCharts';
import AreaChartSimple from '../../components/Charts/AreaChartSimple';
import PieChartSimple from '../../components/Charts/PieChartSimple';
import { SkeletonHeader, SkeletonStats, SkeletonTable } from '../../components/Skeletons';
import Card from '../../components/Dashboard/Card';
import Table from '../../components/Dashboard/Table';

const Dashboard = () => {
  const { token } = useAuth();
  const [stats, setStats] = useState({});
  const [activity, setActivity] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchDashboardData = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      
      const [statsRes, activityRes] = await Promise.all([
        axios.get('http://localhost:5000/api/admin/dashboard/stats', {
          headers: { Authorization: `Bearer ${token}` }
        }),
        axios.get('http://localhost:5000/api/admin/dashboard/activity', {
          headers: { Authorization: `Bearer ${token}` }
        })
      ]);

      setStats(statsRes.data.stats || {});
      setActivity(activityRes.data.activity || []);
    } catch (err) {
      console.error('Dashboard fetch error:', err);
      setError('Failed to load dashboard data');
    } finally {
      setLoading(false);
    }
  }, [token]);

  useEffect(() => {
    if (token) {
      fetchDashboardData();
    }
  }, [fetchDashboardData]);

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50/50 p-6 lg:p-10">
        <div className="max-w-7xl mx-auto space-y-8">
          <SkeletonHeader />
          <SkeletonStats count={4} />
          <SkeletonTable rows={5} />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50/50 p-6 lg:p-10 text-slate-900">
      <div className="mb-8">
        <h1 className="text-3xl font-black text-slate-800 tracking-tight">Workforce Overview</h1>
        <p className="text-slate-500 font-medium text-sm">Real-time metrics and employee activity logs.</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <Card icon="ri-team-line" num={stats.totalEmployees || 0} tot="Total Employees" color="from-blue-500 to-indigo-600"/>
        <Card icon="ri-user-follow-line" num={stats.presentToday || 0} tot="Present Today" color="from-green-500 to-emerald-600"/>
        <Card icon="ri-task-line" num={stats.activeTasks || 0} tot="Active Tasks" color="from-purple-500 to-pink-600"/>
        <Card icon="ri-file-list-3-line" num={stats.pendingTimesheets || 0} tot="Pending Timesheets" color="from-orange-500 to-red-500"/>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
        <div className="lg:col-span-2">
          <BarCharts />
        </div>
        <div className="lg:col-span-1">
          <PieChartSimple completed={18} progress={10} assigned={6} overdue={3} />
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
         <div className="lg:col-span-1">
            <AreaChartSimple />
         </div>
         <div className="lg:col-span-2">
            <Table data={activity} />
         </div>
      </div>
    </div>
  );
};

export default Dashboard;
