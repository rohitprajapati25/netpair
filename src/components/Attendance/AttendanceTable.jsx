// import React from "react";

// const AttendanceTable = ({ data }) => {

//   const convertToMinutes = (time) => {
//     if (!time || time === "-") return null;
//     const [hour, minute] = time.split(":").map(Number);
//     return hour * 60 + minute;
//   };

//   const calculateHours = (checkIn, checkOut) => {
//     if (!checkIn || !checkOut || checkIn === "-" || checkOut === "-")
//       return "-";

//     let start = convertToMinutes(checkIn);
//     let end = convertToMinutes(checkOut);

//     if (end < start) end += 12 * 60;

//     const diff = end - start;
//     const hrs = Math.floor(diff / 60);
//     const mins = diff % 60;

//     return `${hrs}h ${mins}m`;
//   };

//   const statusStyle = (status) => {
//     switch (status) {
//       case "Present":
//         return "bg-green-100 text-green-700";
//       case "Late":
//         return "bg-yellow-100 text-yellow-700";
//       case "Leave":
//         return "bg-blue-100 text-blue-700";
//       default:
//         return "bg-red-100 text-red-700";
//     }
//   };

//   return (
//     <div className="w-full bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">

//       <div className="overflow-x-auto max-h-[420px] overflow-y-auto">
//         <table className="w-full text-sm">

//           <thead className="bg-gray-50 sticky top-0 z-10">
//             <tr className="text-left text-gray-600">
//               <th className="px-6 py-4 font-semibold">Employee</th>
//               <th className="px-6 py-4 font-semibold">Department</th>
//               <th className="px-6 py-4 font-semibold">Date</th>
//               <th className="px-6 py-4 font-semibold">Check In</th>
//               <th className="px-6 py-4 font-semibold">Check Out</th>
//               <th className="px-6 py-4 font-semibold">Work Mode</th>
//               <th className="px-6 py-4 font-semibold">Working Hours</th>
//               <th className="px-6 py-4 font-semibold text-center">Status</th>
//             </tr>
//           </thead>

//           <tbody>
//             {data.map((item) => {

//               const hours = calculateHours(item.in, item.out);

//               return (
//                 <tr
//                   key={item.id}
//                   className="border-t hover:bg-gray-50 transition"
//                 >
//                   <td className="px-6 py-4 font-medium text-gray-800 flex items-center gap-3">
                    
//                     {item.name}
//                   </td>

//                   <td className="px-6 py-4">{item.dept}</td>

//                   <td className="px-6 py-4 text-gray-600">
//                     {item.date}
//                   </td>

//                   <td className="px-6 py-4">
//                     {item.in || "-"}
//                   </td>

//                   <td className="px-6 py-4">
//                     {item.out || "-"}
//                   </td>

//                   <td className="px-6 py-4">
//                     <span className={`px-3 py-1 rounded-full text-xs font-semibold
//                       ${item.mode === "Remote"
//                         ? "bg-purple-100 text-purple-700"
//                         : "bg-blue-100 text-blue-700"}`}>
//                       {item.mode || "-"}
//                     </span>
//                   </td>

//                   <td className={`px-6 py-4 font-medium
//                     ${hours !== "-" && hours.startsWith("4")
//                       ? "text-red-500"
//                       : "text-gray-700"}`}>
//                     {hours}
//                   </td>

//                   <td className="px-6 py-4 text-center">
//                     <span
//                       className={`px-3 py-1 rounded-full text-xs font-semibold ${statusStyle(item.status)}`}
//                     >
//                       {item.status}
//                     </span>
//                   </td>

//                 </tr>
//               );
//             })}
//           </tbody>

//         </table>
//       </div>
//     </div>
//   );
// };

// export default AttendanceTable;



import React, { useState } from "react";
import { RiArrowLeftSLine, RiArrowRightSLine, RiTimeLine } from "react-icons/ri";

const AttendanceTable = ({ data }) => {
  const [currentPage, setCurrentPage] = useState(1);
  const recordsPerPage = 10;

  // Pagination Calculations
  const totalPages = Math.ceil(data.length / recordsPerPage);
  const currentRecords = data.slice(
    (currentPage - 1) * recordsPerPage,
    currentPage * recordsPerPage
  );

  const calculateHours = (checkIn, checkOut) => {
    if (!checkIn || !checkOut || checkIn === "-" || checkOut === "-") return "--";
    const [h1, m1] = checkIn.split(":").map(Number);
    const [h2, m2] = checkOut.split(":").map(Number);
    let diff = (h2 * 60 + m2) - (h1 * 60 + m1);
    if (diff < 0) diff += 1440; 
    return `${Math.floor(diff / 60)}h ${diff % 60}m`;
  };

  const getStatusBadge = (status) => {
    const theme = {
      Present: "bg-emerald-50 text-emerald-700 border-emerald-100",
      Absent: "bg-rose-50 text-rose-700 border-rose-100",
      Late: "bg-amber-50 text-amber-700 border-amber-100",
      Leave: "bg-blue-50 text-blue-700 border-blue-100",
    };
    return theme[status] || "bg-slate-50 text-slate-600 border-slate-100";
  };

  return (
    <div className="flex flex-col w-full">
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-slate-50/50 border-b border-slate-200">
              <th className="px-8 py-5 text-[11px] font-bold uppercase tracking-widest text-slate-400">Employee / Dept</th>
              <th className="px-8 py-5 text-[11px] font-bold uppercase tracking-widest text-slate-400 text-center">In-Out Timeline</th>
              <th className="px-8 py-5 text-[11px] font-bold uppercase tracking-widest text-slate-400 text-center">Work Mode</th>
              <th className="px-8 py-5 text-[11px] font-bold uppercase tracking-widest text-slate-400 text-center">Net Hours</th>
              <th className="px-8 py-5 text-[11px] font-bold uppercase tracking-widest text-slate-400 text-center">Status</th>
            </tr>
          </thead>

          <tbody className="divide-y divide-slate-100">
            {currentRecords.map((item) => {
              const totalHrs = calculateHours(item.in, item.out);
              return (
                <tr key={item.id} className="group hover:bg-blue-50/30 transition-all duration-200">
                  <td className="px-8 py-5">
                    <div className="flex flex-col">
                      <span className="text-sm font-bold text-slate-800 group-hover:text-blue-600 transition-colors">{item.name}</span>
                      <span className="text-[11px] font-semibold text-slate-400 mt-0.5">{item.dept} • {item.date}</span>
                    </div>
                  </td>

                  <td className="px-8 py-5">
                    <div className="flex items-center justify-center gap-4">
                      <div className="text-center">
                        <p className="text-xs font-bold text-slate-700">{item.in || "--"}</p>
                        <p className="text-[9px] font-black text-slate-300 uppercase">Start</p>
                      </div>
                      <div className="h-px w-6 bg-slate-200" />
                      <div className="text-center">
                        <p className="text-xs font-bold text-slate-700">{item.out || "--"}</p>
                        <p className="text-[9px] font-black text-slate-300 uppercase">End</p>
                      </div>
                    </div>
                  </td>

                  <td className="px-8 py-5 text-center">
                    <span className={`px-2.5 py-1 rounded-lg text-[10px] font-bold border ${
                      item.mode === "WFH" ? "bg-purple-50 text-purple-600 border-purple-100" : "bg-indigo-50 text-indigo-600 border-indigo-100"
                    }`}>
                      {item.mode || "OFFLINE"}
                    </span>
                  </td>

                  <td className="px-8 py-5 text-center">
                    <div className="inline-flex items-center gap-1.5 text-sm font-mono font-bold text-slate-700">
                      <RiTimeLine className="text-slate-300" />
                      {totalHrs}
                    </div>
                  </td>

                  <td className="px-8 py-5 text-center">
                    <span className={`inline-flex px-3 py-1.5 rounded-full text-[10px] font-black border uppercase tracking-widest shadow-sm ${getStatusBadge(item.status)}`}>
                      {item.status}
                    </span>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Modern Pagination Footer */}
      <div className="px-8 py-5 border-t border-slate-100 flex items-center justify-between bg-slate-50/20">
        <p className="text-xs font-bold text-slate-400">
          Showing <span className="text-slate-900">{((currentPage - 1) * 10) + 1}</span> to <span className="text-slate-900">{Math.min(currentPage * 10, data.length)}</span> of <span className="text-slate-900">{data.length}</span>
        </p>

        <div className="flex items-center gap-1">
          <button
            disabled={currentPage === 1}
            onClick={() => setCurrentPage(p => p - 1)}
            className="p-2 rounded-xl border border-slate-200 hover:bg-white disabled:opacity-30 transition-all"
          >
            <RiArrowLeftSLine size={20} />
          </button>
          
          <div className="flex gap-1 px-2">
            {[...Array(totalPages)].map((_, i) => (
              <button
                key={i}
                onClick={() => setCurrentPage(i + 1)}
                className={`h-9 w-9 rounded-xl text-xs font-bold transition-all ${
                  currentPage === i + 1 
                  ? "bg-blue-600 text-white shadow-lg shadow-blue-100" 
                  : "text-slate-400 hover:bg-slate-100"
                }`}
              >
                {i + 1}
              </button>
            ))}
          </div>

          <button
            disabled={currentPage === totalPages}
            onClick={() => setCurrentPage(p => p + 1)}
            className="p-2 rounded-xl border border-slate-200 hover:bg-white disabled:opacity-30 transition-all"
          >
            <RiArrowRightSLine size={20} />
          </button>
        </div>
      </div>
    </div>
  );
};

export default AttendanceTable;