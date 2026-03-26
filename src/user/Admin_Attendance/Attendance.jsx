
import React, { useState, useEffect, useCallback } from "react";
import axios from 'axios';
import { useAuth } from "../../contexts/AuthContext";
import AttendanceCards from "../../components/Attendance/AttendanceCards";
import AttendanceFilter from "../../components/Attendance/AttendanceFilter";
import AttendanceModal from "../../components/Attendance/AttendanceModal";
import AttendanceTable from "../../components/Attendance/AttendanceTable";
import { RiCalendarCheckLine } from "react-icons/ri";

const Attendance = () => {
  const { token } = useAuth();
  const [open, setOpen] = useState(false);
  const [attendanceData, setAttendanceData] = useState([]);
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

      const res = await axios.get(`/api/admin/attendance?${params.toString()}`, {
        headers: { Authorization: `Bearer ${token}` }
      });

      if (res.data.success && res.data.records) {
        const mappedData = res.data.records.map(record => ({
          id: record._id,
          name: record.employee?.name || 'Unknown',
          date: new Date(record.date).toLocaleDateString('en-CA'),
          in: record.checkIn || '-',
          out: record.checkOut || '-',
          status: record.status || 'Absent',
          dept: record.employee?.department || 'N/A',
          mode: record.workMode || 'Office',
          workingHours: record.workingHours || 0
        }));
        setAttendanceData(mappedData);
      } else {
        setAttendanceData([]);
        setError('No attendance records found');
      }
    } catch (err) {
      console.error('Attendance fetch error:', err);
      setError('Failed to load attendance data. Check if backend server is running on port 5000.');
      setAttendanceData([]);
    } finally {
      setLoading(false);
    }
  }, [token, filters]);

  useEffect(() => {
    if (token) {
      fetchAttendance();
    }
  }, [fetchAttendance]);

  const handleRefresh = () => {
    fetchAttendance();
  };

  const handleFilterChange = (newFilters) => {
    setFilters(prev => ({ ...prev, ...newFilters }));
  };

  if (loading) {
    return <div className="flex items-center justify-center h-64"><div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div></div>;
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

        {open && <AttendanceModal onClose={() => setOpen(false)} onRefresh={handleRefresh} />}

        <AttendanceCards data={attendanceData} />

        <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden">
          <AttendanceFilter 
            attendanceData={attendanceData} 
            filters={filters}
            onFilterChange={handleFilterChange}
            onRefresh={handleRefresh}
            loading={loading}
          />
        </div>
      </div>
    </div>
  );
};

export default Attendance;

