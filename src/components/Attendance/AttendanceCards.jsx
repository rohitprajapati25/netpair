import React, { useState, useEffect, useMemo } from "react";
import axios from 'axios';
import { useAuth } from "../../contexts/AuthContext";
import { RiGroupLine, RiUserFollowLine, RiUserUnfollowLine, RiTeamLine } from "react-icons/ri";

const AttendanceCards = ({ data }) => {
  const { token } = useAuth();
  const [stats, setStats] = useState({ 
    totalEmployees: 0, 
    activeEmployees: 0, 
    loading: true 
  });
  
  // Compute attendance stats from data
  const attendanceStats = useMemo(() => {
    const totalRecords = data.length;
    const present = data.filter(d => d.status === "Present").length;
    const absent = data.filter(d => d.status === "Absent").length;
    const todayRecords = data.filter(d => {
      const today = new Date().toISOString().split('T')[0];
      return d.date === today;
    }).length;
    
    return { totalRecords, present, absent, todayRecords };
  }, [data]);

useEffect(() => {
    if (!token) return;
    
    const fetchEmployeeStats = async () => {
      try {
        setStats(prev => ({...prev, loading: true}));
        
        // Get total employees count (first page total)
        const totalRes = await axios.get('http://localhost:5000/api/admin/employees?page=1&limit=1', {
          headers: { Authorization: `Bearer ${token}` }
        });
        
        // Get active employees count
        const activeRes = await axios.get('http://localhost:5000/api/admin/active-employees?page=1&limit=1', {
          headers: { Authorization: `Bearer ${token}` }
        });

        
        console.log('Total res:', totalRes.data);
        console.log('Active res:', activeRes.data);
        
        setStats({
          totalEmployees: totalRes.data.pagination?.total || totalRes.data.total || totalRes.data.count || 0,
          activeEmployees: activeRes.data.activeCount || activeRes.data.totalActive || activeRes.data.pagination?.total || 0,
          loading: false
        });
      } catch (err) {
        console.error('Employee stats error:', err);
        // Better fallback
        const uniqueEmployees = [...new Set(data.map(d => d.name))].length;
        const activeFromData = data.filter(d => d.status === "Present").length;
        setStats({ 
          totalEmployees: uniqueEmployees || 0, 
          activeEmployees: activeFromData || 0, 
          loading: false 
        });
      }
    };
    
    fetchEmployeeStats();
  }, [token]);

  if (stats.loading) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 w-full p-3 mb-6">
        {Array(4).fill().map((_, i) => (
          <div key={i} className="animate-pulse bg-slate-200 rounded-2xl h-24"></div>
        ))}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 w-full p-4 mb-8">
      <Card 
        title="Total Employees" 
        value={stats.totalEmployees.toLocaleString()} 
        icon="ri-group-line" 
        bg="from-indigo-500 to-blue-600"
        subtitle="All Employees"
        
      />
      
      <Card 
        title="Active Employees" 
        value={stats.activeEmployees.toLocaleString()} 
        icon="ri-team-line" 
        bg="from-emerald-500 to-teal-600"
        subtitle="Currently active"
      />

      <Card 
        title="Present Today" 
        value={attendanceStats.present} 
        icon="ri-user-follow-line" 
        bg="from-green-500 to-emerald-600"
        subtitle="Today attendance"
      />

      <Card 
        title="Absent Today" 
        value={attendanceStats.absent} 
        icon="ri-user-unfollow-line" 
        bg="from-red-500 to-rose-600"
        subtitle="Today attendance"
      />
    </div>
  );
};

const Card = ({ title, value, icon, bg, subtitle }) => (
  <div className={`relative overflow-hidden rounded-2xl text-white p-6 shadow-xl hover:shadow-2xl transition-all duration-300 hover:-translate-y-1 bg-gradient-to-br ${bg}`}>
    <div className="flex justify-between items-start">
      <div className="flex-1 space-y-1">
        <p className="text-xs opacity-90 font-bold uppercase tracking-wide">{title}</p>
        <h2 className="text-3xl md:text-4xl font-black leading-tight">{value}</h2>
        <p className="text-xs opacity-80">{subtitle}</p>
       
      </div>
      <div className="bg-white/20 backdrop-blur-sm p-4 rounded-2xl ml-auto shadow-lg">
        <i className={`${icon} text-xl opacity-90`}></i>
      </div>
    </div>
  </div>
);

export default AttendanceCards;

