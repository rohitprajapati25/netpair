import React, { useState } from "react";
import AttendanceCards from "../../components/Attendance/AttendanceCards";
import AttendanceTable from "../../components/Attendance/AttendanceTable";
import AttendanceModal from "../../components/Attendance/AttendanceModal";
import { RiCalendarCheckLine } from "react-icons/ri";

const Attendance = () => {
  const [open, setOpen] = useState(false);

  const attendanceData = [
    { id: 1, name: "Rohit", date: "03-02-2026", in: "9:30", out: "6:30", status: "Present" },
    { id: 2, name: "Amit", date: "03-02-2026", in: "-", out: "-", status: "Absent" },
  ];

  return (
    <div className="h-full m-1 p-6
      bg-gray-50 rounded-2xl
      flex flex-col gap-6 overflow-y-auto">

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

      <AttendanceTable data={attendanceData} />

      {open && <AttendanceModal onClose={() => setOpen(false)} />}
    </div>
  );
};

export default Attendance;