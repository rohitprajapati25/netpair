// import React, { useState } from "react";
// import AttendanceCards from "../../components/Attendance/AttendanceCards";
// import AttendanceFilter from "../../components/Attendance/AttendanceFilter";
// // import AttendanceTable from "../../components/Attendance/AttendanceTable";
// import AttendanceModal from "../../components/Attendance/AttendanceModal";
// import { RiCalendarCheckLine } from "react-icons/ri";

// const Attendance = () => {
//   const [open, setOpen] = useState(false);
//   const [attendanceData,setAttendanceData]=useState([
//      { id: 1, name: "Rohit", date: "2026-02-02", in: "9:30", out: "6:30", status: "Present", dept: "Development", mode: "Office" },
//   { id: 2, name: "Amit", date: "2026-02-03", in: "-", out: "-", status: "Absent", dept: "HR", mode: "" },
//   { id: 3, name: "Neha", date: "2026-02-03", in: "10:00", out: "7:00", status: "Present", dept: "Design", mode: "WFH" },
//   { id: 4, name: "Karan", date: "2026-02-04", in: "9:15", out: "6:10", status: "Present", dept: "Development", mode: "Office" },
//   { id: 5, name: "Priya", date: "2026-02-04", in: "-", out: "-", status: "Absent", dept: "HR", mode: "" },
//   { id: 6, name: "Jay", date: "2026-02-05", in: "9:40", out: "6:35", status: "Present", dept: "Testing", mode: "Office" },
//   { id: 7, name: "Mehul", date: "2026-02-05", in: "10:10", out: "7:05", status: "Present", dept: "Development", mode: "WFH" },
//   { id: 8, name: "Sneha", date: "2026-02-06", in: "-", out: "-", status: "Absent", dept: "Design", mode: "" },
//   { id: 9, name: "Vishal", date: "2026-02-06", in: "9:20", out: "6:20", status: "Present", dept: "Support", mode: "Office" },
//   { id: 10, name: "Riya", date: "2026-02-07", in: "9:50", out: "6:45", status: "Present", dept: "HR", mode: "Office" },
//   { id: 11, name: "Arjun", date: "2026-02-07", in: "-", out: "-", status: "Absent", dept: "Development", mode: "" },
//   { id: 12, name: "Pooja", date: "2026-02-08", in: "9:35", out: "6:25", status: "Present", dept: "Design", mode: "WFH" },
//   { id: 13, name: "Rahul", date: "2026-02-08", in: "9:10", out: "6:00", status: "Present", dept: "Testing", mode: "Office" },
//   { id: 14, name: "Komal", date: "2026-02-09", in: "-", out: "-", status: "Absent", dept: "HR", mode: "" },
//   { id: 15, name: "Nikhil", date: "2026-02-09", in: "10:05", out: "7:10", status: "Present", dept: "Development", mode: "WFH" },
//   { id: 16, name: "Heena", date: "2026-02-10", in: "9:25", out: "6:15", status: "Present", dept: "Support", mode: "Office" },
//   { id: 17, name: "Sagar", date: "2026-02-10", in: "-", out: "-", status: "Absent", dept: "Testing", mode: "" },
//   { id: 18, name: "Ankit", date: "2026-02-11", in: "9:45", out: "6:50", status: "Present", dept: "Development", mode: "Office" },
//   { id: 19, name: "Divya", date: "2026-02-11", in: "10:15", out: "7:20", status: "Present", dept: "Design", mode: "WFH" },
//   { id: 20, name: "Manish", date: "2026-02-12", in: "-", out: "-", status: "Absent", dept: "Support", mode: "" }

//   ])

   

//   return (
//     <div className="relative h-full m-1 p-6
//       bg-gradient-to-br from-slate-50 to-gray-100
//       flex flex-col gap-6 overflow-y-auto rounded-2xl">

//       <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
//         <h2 className="text-2xl font-semibold">
//           Attendance Management
//         </h2>

//         <button
//           onClick={() => setOpen(true)}
//           className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700
//           text-white px-4 py-2 rounded-lg shadow transition justify-center"
//         >
//           <RiCalendarCheckLine size={18} />
//           Mark Attendance
//         </button>
//       </div>
//         {open && <AttendanceModal onClose={() => setOpen(false)} />}

//       <AttendanceCards data={attendanceData} />

//       <AttendanceFilter attendanceData={attendanceData}/>
//     </div>
//   );
// };

// export default Attendance;



import React, { useState, useEffect } from "react";
import axios from 'axios';
import AttendanceCards from "../../components/Attendance/AttendanceCards";
import AttendanceFilter from "../../components/Attendance/AttendanceFilter";
import AttendanceTable from "../../components/Attendance/AttendanceTable";
import AttendanceModal from "../../components/Attendance/AttendanceModal";
import { RiCalendarCheckLine } from "react-icons/ri";

const Attendance = () => {
  const [open, setOpen] = useState(false);
const [attendanceData, setAttendanceData] = useState([]);
  const [_loading, setLoading] = useState(true);
  const [_error, setError] = useState('');

  useEffect(() => {
    const fetchAttendance = async () => {
      try {
        setLoading(true);
        const params = new URLSearchParams({
          page: '1',
          limit: '50'
        });
        
        const res = await axios.get(`/api/admin/attendance?${params}`);
        if (res.data.success) {
          setAttendanceData(res.data.employees.map(record => ({
            id: record._id,
            name: record.employee?.name || 'Unknown',
            date: new Date(record.date).toISOString().split('T')[0],
            checkIn: record.checkIn || '-',
            checkOut: record.checkOut || '-',
            status: record.status || 'Absent',
            dept: record.employee?.department || 'N/A',
            mode: record.workMode || '-',
            workingHours: record.workingHours || 0
          })));
        }
      } catch (err) {
        console.error('Attendance fetch error:', err);
        setError('Failed to load attendance data. Backend APIs ready.');
      } finally {
        setLoading(false);
      }
    };

    fetchAttendance();
  }, []);

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
          >
            <RiCalendarCheckLine size={20} />
            Mark Attendance
          </button>
        </div>

        {open && <AttendanceModal onClose={() => setOpen(false)} />}

        <AttendanceCards data={attendanceData} />

        
        <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden">
          <AttendanceFilter attendanceData={attendanceData} />
        </div>
      </div>
    </div>
  );
};

export default Attendance;