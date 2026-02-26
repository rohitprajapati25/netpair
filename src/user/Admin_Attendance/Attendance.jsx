import React, { useState } from "react";
import AttendanceCards from "../../components/Attendance/AttendanceCards";
import AttendanceFilter from "../../components/Attendance/AttendanceFilter";
// import AttendanceTable from "../../components/Attendance/AttendanceTable";
import AttendanceModal from "../../components/Attendance/AttendanceModal";
import { RiCalendarCheckLine } from "react-icons/ri";

const Attendance = () => {
  const [open, setOpen] = useState(false);

  const attendanceData = [
    { id: 1, name: "Rohit", date: "2026-02-02", in: "9:30", out: "6:30", status: "Present", dept:"Development", mode:"Office" },
    { id: 2, name: "Amit", date: "2026-02-08", in: "-", out: "-", status: "Absent",dept:"HR", mode:"Office" }
  ];

  return (
    <div className="relative h-full m-1 p-6
      bg-gradient-to-br from-slate-50 to-gray-100
      flex flex-col gap-6 overflow-y-auto rounded-2xl">

      <div className="flex justify-between items-center w-full">
        <h2 className="text-2xl font-semibold">
          Attendance Management
        </h2>

        <button
          onClick={() => setOpen(true)}
          className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700
          text-white px-4 py-2 rounded-lg shadow transition"
        >
          <RiCalendarCheckLine size={18} />
          Mark Attendance
        </button>
      </div>

      <AttendanceCards data={attendanceData} />

      <AttendanceFilter attendanceData={attendanceData}/>
      {open && <AttendanceModal onClose={() => setOpen(false)} />}
    </div>
  );
};

export default Attendance;