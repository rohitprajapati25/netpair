import React, { useState } from "react";
import AttendanceCards from "../../components/Attendance/AttendanceCards";
import AttendanceFilter from "../../components/Attendance/AttendanceFilter";
// import AttendanceTable from "../../components/Attendance/AttendanceTable";
import AttendanceModal from "../../components/Attendance/AttendanceModal";
import { RiCalendarCheckLine } from "react-icons/ri";

const Attendance = () => {
  const [open, setOpen] = useState(false);
  const [attendanceData,setAttendanceData]=useState([
     { id: 1, name: "Rohit", date: "2026-02-02", in: "9:30", out: "6:30", status: "Present", dept: "Development", mode: "Office" },
  { id: 2, name: "Amit", date: "2026-02-03", in: "-", out: "-", status: "Absent", dept: "HR", mode: "" },
  { id: 3, name: "Neha", date: "2026-02-03", in: "10:00", out: "7:00", status: "Present", dept: "Design", mode: "WFH" },
  { id: 4, name: "Karan", date: "2026-02-04", in: "9:15", out: "6:10", status: "Present", dept: "Development", mode: "Office" },
  { id: 5, name: "Priya", date: "2026-02-04", in: "-", out: "-", status: "Absent", dept: "HR", mode: "" },
  { id: 6, name: "Jay", date: "2026-02-05", in: "9:40", out: "6:35", status: "Present", dept: "Testing", mode: "Office" },
  { id: 7, name: "Mehul", date: "2026-02-05", in: "10:10", out: "7:05", status: "Present", dept: "Development", mode: "WFH" },
  { id: 8, name: "Sneha", date: "2026-02-06", in: "-", out: "-", status: "Absent", dept: "Design", mode: "" },
  { id: 9, name: "Vishal", date: "2026-02-06", in: "9:20", out: "6:20", status: "Present", dept: "Support", mode: "Office" },
  { id: 10, name: "Riya", date: "2026-02-07", in: "9:50", out: "6:45", status: "Present", dept: "HR", mode: "Office" },
  { id: 11, name: "Arjun", date: "2026-02-07", in: "-", out: "-", status: "Absent", dept: "Development", mode: "" },
  { id: 12, name: "Pooja", date: "2026-02-08", in: "9:35", out: "6:25", status: "Present", dept: "Design", mode: "WFH" },
  { id: 13, name: "Rahul", date: "2026-02-08", in: "9:10", out: "6:00", status: "Present", dept: "Testing", mode: "Office" },
  { id: 14, name: "Komal", date: "2026-02-09", in: "-", out: "-", status: "Absent", dept: "HR", mode: "" },
  { id: 15, name: "Nikhil", date: "2026-02-09", in: "10:05", out: "7:10", status: "Present", dept: "Development", mode: "WFH" },
  { id: 16, name: "Heena", date: "2026-02-10", in: "9:25", out: "6:15", status: "Present", dept: "Support", mode: "Office" },
  { id: 17, name: "Sagar", date: "2026-02-10", in: "-", out: "-", status: "Absent", dept: "Testing", mode: "" },
  { id: 18, name: "Ankit", date: "2026-02-11", in: "9:45", out: "6:50", status: "Present", dept: "Development", mode: "Office" },
  { id: 19, name: "Divya", date: "2026-02-11", in: "10:15", out: "7:20", status: "Present", dept: "Design", mode: "WFH" },
  { id: 20, name: "Manish", date: "2026-02-12", in: "-", out: "-", status: "Absent", dept: "Support", mode: "" }

  ])

   

  return (
    <div className="relative h-full m-1 p-6
      bg-gradient-to-br from-slate-50 to-gray-100
      flex flex-col gap-6 overflow-y-auto rounded-2xl">

      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <h2 className="text-2xl font-semibold">
          Attendance Management
        </h2>

        <button
          onClick={() => setOpen(true)}
          className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700
          text-white px-4 py-2 rounded-lg shadow transition justify-center"
        >
          <RiCalendarCheckLine size={18} />
          Mark Attendance
        </button>
      </div>
        {open && <AttendanceModal onClose={() => setOpen(false)} />}

      <AttendanceCards data={attendanceData} />

      <AttendanceFilter attendanceData={attendanceData}/>
    </div>
  );
};

export default Attendance;