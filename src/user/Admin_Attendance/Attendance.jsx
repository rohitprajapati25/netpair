import React, { useState } from "react";
import AttendanceCards from "../../components/Attendance/AttendanceCards";
import AttendanceTable from "../../components/Attendance/AttendanceTable";
import AttendanceModal from "../../components/Attendance/AttendanceModal";

const Attendance = () => {
  const [open, setOpen] = useState(false);

  const attendanceData = [
    { id: 1, name: "Rohit", date: "03-02-2026", in: "9:30", out: "6:30", status: "Present" },
    { id: 2, name: "Amit", date: "03-02-2026", in: "-", out: "-", status: "Absent" },
  ];

  return (
    <div className="relative h-[100%] m-1 pb-10 pt-5 w-auto bg-white flex flex-col items-start pl-5 pr-5 justify-strat gap-3 min-h-full overflow-y-auto rounded-xl">
      <h2 className="text-2xl font-semibold mb-4">Attendance Management</h2>

      <AttendanceCards data={attendanceData} />
      <AttendanceTable data={attendanceData} onAdd={() => setOpen(true)} />
      {open && <AttendanceModal onClose={() => setOpen(false)} />}
    </div>
  );
};

export default Attendance;
