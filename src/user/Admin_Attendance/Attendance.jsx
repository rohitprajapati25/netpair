import React, { useState, useEffect } from "react";
import { useAuth } from "../../contexts/AuthContext";
import AttendanceCards from "../../components/Attendance/AttendanceCards";
import AttendanceFilter from "../../components/Attendance/AttendanceFilter";
import AttendanceModal from "../../components/Attendance/AttendanceModal";
import AttendanceTable from "../../components/Attendance/AttendanceTable";
import { SkeletonHeader, SkeletonFilter, SkeletonStats, SkeletonTable } from "../../components/Skeletons";
import { RiCalendarCheckLine } from "react-icons/ri";
import { useAttendance, useAttendanceStats } from '../../hooks/useAttendance';
import useDebounce from '../../hooks/useDebounce';

const Attendance = () => {
  const { token, user } = useAuth();
  const role = user?.role?.toLowerCase();
  const isSuperAdmin = role === "superadmin";
  // Only superadmin can edit/delete attendance records
  const canEditAttendance = isSuperAdmin;
  const [open, setOpen] = useState(false);
  const [editData, setEditData] = useState(null);
  const [fullAttendanceData, setFullAttendanceData] = useState([]);
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

  const debouncedFilters = useDebounce(filters, 300);

  const { data: attendanceRes, isLoading: attendanceLoading, error: attendanceError, refetch: refetchAttendance } = useAttendance(debouncedFilters);
  const { data: statsRes, isLoading: statsLoading, refetch: refetchStats } = useAttendanceStats();

  // Store raw data for edit — use JSON comparison to avoid infinite loop
  // rawAttendanceData is a new array ref every render, so we can't use it as dep directly
  useEffect(() => {
    if (attendanceRes?.records) {
      setFullAttendanceData(attendanceRes.records);
    }
  }, [attendanceRes]); // attendanceRes ref only changes when React Query refetches
  
  const rawAttendanceData = attendanceRes?.records || [];

  const attendanceData = rawAttendanceData.map(record => ({
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
  })) || [];

  const stats = statsRes || { totalEmployees: 0, activeEmployees: 0 };

  const loading = attendanceLoading || statsLoading;
  const error = attendanceError || statsRes?.error;

  const handleRefresh = () => {
    refetchAttendance();
    refetchStats();
  };

  const handleFilterChange = (newFilters) => {
    setFilters(prev => ({ ...prev, ...newFilters }));
  };

  const handleEdit = (item) => {
    const fullRecord = fullAttendanceData.find(r => r._id === item.id);
    if (fullRecord) {
      setEditData({
        ...fullRecord,
        date: item.date ? new Date(item.date) : fullRecord.date,
        checkIn: item.checkIn === '--' ? '' : item.checkIn,
        checkOut: item.checkOut === '--' ? '' : item.checkOut,
        status: item.status || fullRecord.status,
        notes: item.notes || fullRecord.notes,
        workMode: item.workMode || fullRecord.workMode
      });
      setOpen(true);
    }
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <SkeletonHeader />
        <SkeletonStats count={4} />
        <SkeletonFilter />
        <SkeletonTable rows={6} />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl lg:text-3xl font-black text-slate-800 tracking-tight">Attendance</h1>
          <p className="text-slate-500 text-sm">Real-time employee presence and work logs</p>
        </div>
        <button
          onClick={() => setOpen(true)}
          className="w-auto self-start sm:self-auto flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-5 py-2.5 rounded-xl shadow-md transition-all font-bold text-sm"
          disabled={loading}
        >
          <RiCalendarCheckLine size={18} />
          Mark Attendance
        </button>
      </div>

        {error && (
          <div className="bg-rose-50 border border-rose-200 text-rose-800 px-6 py-4 rounded-2xl">
            {typeof error === 'string' ? error : 'Failed to load data'}
            <button onClick={handleRefresh} className="ml-4 underline font-bold hover:no-underline">Retry</button>
          </div>
        )}

        {open && (
          <AttendanceModal 
            onClose={() => { 
              setOpen(false); 
              setEditData(null); 
            }} 
            onRefresh={handleRefresh} 
            editData={editData} 
          />
        )}

        <AttendanceCards data={attendanceData} />

        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
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
            onEdit={canEditAttendance ? handleEdit : null}
          />
        </div>
    </div>
  );
};

export default Attendance;

