import React, { useState, useEffect, useCallback } from "react";
import axios from 'axios';
import { useAuth } from "../../contexts/AuthContext";
import AttendanceCards from "../../components/Attendance/AttendanceCards";
import AttendanceFilter from "../../components/Attendance/AttendanceFilter";
import AttendanceModal from "../../components/Attendance/AttendanceModal";
import AttendanceTable from "../../components/Attendance/AttendanceTable";
import { SkeletonStats, SkeletonTable } from "../../components/Skeletons";
import { RiCalendarCheckLine } from "react-icons/ri";

const Attendance = () => {
  const { token } = useAuth();
const [open, setOpen] = useState(false);
  const [editData, setEditData] = useState(null);
  const [fullAttendanceData, setFullAttendanceData] = useState([]);
  const [attendanceData, setAttendanceData] = useState([]);
  const [stats, setStats] = useState({ totalEmployees: 0, activeEmployees: 0 });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [filters, setFilters] = useState({
    search: "",
    department: "All",
    status: "All",
    mode: "All",
    fromDate: "",
    toDate: "",
    page: 1,
    limit: 50
  });

  const fetchStats = async () => {
    try {
      const totalRes = await axios.get('http://localhost:5000/api/admin/employees?page=1&limit=1', {
        headers: { Authorization: `Bearer ${token}` }
      });
      const activeRes = await axios.get('http://localhost:5000/api/admin/active-employees?page=1&limit=1', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setStats({
        totalEmployees: totalRes.data.pagination?.total || 0,
        activeEmployees: activeRes.data.totalActive || activeRes.data.activeCount || 0
      });
    } catch (err) {
      console.error('Stats fetch error:', err);
    }
  };

  const fetchAttendance = useCallback(async (currentFilters = filters) => {
    try {
      setLoading(true);
      setError('');

      const params = new URLSearchParams();
      Object.keys(currentFilters).forEach(key => {
        if (currentFilters[key] && currentFilters[key] !== 'All') {
          params.append(key, currentFilters[key]);
        }
      });

      const res = await axios.get(`http://localhost:5000/api/admin/attendance?${params.toString()}`, {
        headers: { Authorization: `Bearer ${token}` }
      });

      if (res.data.success && res.data.records) {
        setFullAttendanceData(res.data.records);
        const mappedData = res.data.records.map(record => ({
          id: record._id,
          name: record.employee?.name || 'Unknown',
          date: new Date(record.date).toLocaleDateString('en-CA'),
          checkIn: record.checkIn || '--',
          checkOut: record.checkOut || '--',
          status: record.status || 'Absent',
          dept: record.employee?.department || 'N/A',
          workMode: record.workMode || '',
          notes: record.notes || '',
          workingHours: record.workingHours || 0
        }));
        console.log('Mapped attendance data:', mappedData);
        setAttendanceData(mappedData);
      } else {
        setAttendanceData([]);
        setError('No attendance records found');
      }
    } catch (err) {
      console.error('Attendance fetch error:', err);
      setError('Failed to load attendance data. Backend port 5000?');
      setAttendanceData([]);
    } finally {
      setLoading(false);
    }
  }, [token, filters]);

  useEffect(() => {
    if (token) {
      fetchAttendance();
      fetchStats();
    }
  }, [fetchAttendance]);

  const handleRefresh = () => {
    fetchAttendance();
    fetchStats();
  };

  const handleFilterChange = (newFilters) => {
    setFilters(prev => ({ ...prev, ...newFilters }));
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50/50 p-6 lg:p-10">
        <SkeletonStats count={2} />
        <div className="mt-8"><SkeletonTable rows={5} /></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50/50 p-6 lg:p-10 text-slate-900">
      <div className="max-w-[1400px] mx-auto flex flex-col gap-8">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-black text-slate-800 tracking-tight">Attendance</h1>
            <p className="text-slate-500 font-medium text-sm">Real-time employee presence and work logs</p>
          </div>
          <button
            onClick={() => setOpen(true)}
            className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-xl shadow-lg shadow-blue-200 transition-all font-bold active:scale-95"
            disabled={loading}
          >
            <RiCalendarCheckLine size={20} />
            Mark Attendance
          </button>
        </div>

        {error && (
          <div className="bg-rose-50 border border-rose-200 text-rose-800 px-6 py-4 rounded-2xl">
            {error} 
            <button onClick={handleRefresh} className="ml-4 underline font-bold hover:no-underline">Retry</button>
          </div>
        )}

{open && <AttendanceModal onClose={() => { setOpen(false); setEditData(null); }} onRefresh={handleRefresh} editData={editData} />}

        <AttendanceCards data={attendanceData} />

        <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden">
          <AttendanceFilter 
            attendanceData={attendanceData} 
            filters={filters}
            onFilterChange={handleFilterChange}
            onRefresh={handleRefresh}
            loading={loading}
          />
          <AttendanceTable 
            data={attendanceData} 
            totalEmployees={stats.totalEmployees}
            activeEmployees={stats.activeEmployees}
            onRefresh={handleRefresh}
            onEdit={(item) => {
              const fullRecord = fullAttendanceData.find(r => r._id === item.id);
              if (fullRecord) {
                setEditData({
                  ...fullRecord,
                  // Use table display values for proper modal defaults
                  date: item.date ? new Date(item.date) : fullRecord.date,
                  checkIn: item.checkIn === '--' ? '' : item.checkIn,
                  checkOut: item.checkOut === '--' ? '' : item.checkOut,
                  status: item.status || fullRecord.status,
                  notes: item.notes || fullRecord.notes,
                  workMode: item.workMode || fullRecord.workMode
                });
                setOpen(true);
              }
            }}
          />

        </div>
      </div>
    </div>
  );
};

export default Attendance;

