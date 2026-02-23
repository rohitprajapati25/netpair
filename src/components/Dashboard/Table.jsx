// import React from 'react'

// const Table = () => {
//   return (
//      <div className=' w-full flex items-start justify-center rounded-xl overflow-x-auto border-2 border-gray-500 h-[300px] overflow-y-auto'>
        
//          <table className="table-auto m-5 w-[100%] bg-white rounded-xl shadow-lg overflow-hidden">
//         <thead className="bg-gray-100">
//           <tr className="text-left">
//             <th className="px-6 py-3 border-b">Employee</th>
//             <th className="px-6 py-3 border-b">Dept</th>
//             <th className="px-6 py-3 border-b">Status</th>
//             <th className="px-6 py-3 border-b">Check-in</th>
//             <th className="px-6 py-3 border-b">Mode</th>
//           </tr>
//         </thead>

//         <tbody>
//           <tr className="hover:bg-gray-50">
//             <td className="px-6 py-3 border-b">Rohit Prajapti</td>
//             <td className="px-6 py-3 border-b">Dev</td>
//             <td className="px-6 py-3 border-b  text-green-600 font-semibold">
//               Present
//             </td>
//             <td className="px-6 py-3 border-b">09:30</td>
//             <td className="px-6 py-3 border-b">Office</td>
//           </tr>
//           <tr className="hover:bg-gray-50">
//             <td className="px-6 py-3 border-b">Rohit Prajapti</td>
//             <td className="px-6 py-3 border-b">Dev</td>
//             <td className="px-6 py-3 border-b  text-green-600 font-semibold">
//               Present
//             </td>
//             <td className="px-6 py-3 border-b">09:30</td>
//             <td className="px-6 py-3 border-b">Office</td>
//           </tr>
//           <tr className="hover:bg-gray-50">
//             <td className="px-6 py-3 border-b">Rohit Prajapti</td>
//             <td className="px-6 py-3 border-b">Dev</td>
//             <td className="px-6 py-3 border-b  text-green-600 font-semibold">
//               Present
//             </td>
//             <td className="px-6 py-3 border-b">09:30</td>
//             <td className="px-6 py-3 border-b">Office</td>
//           </tr>
//           <tr className="hover:bg-gray-50">
//             <td className="px-6 py-3 border-b">Rohit Prajapti</td>
//             <td className="px-6 py-3 border-b">Dev</td>
//             <td className="px-6 py-3 border-b  text-green-600 font-semibold">
//               Present
//             </td>
//             <td className="px-6 py-3 border-b">09:30</td>
//             <td className="px-6 py-3 border-b">Office</td>
//           </tr>
//           <tr className="hover:bg-gray-50">
//             <td className="px-6 py-3 border-b">Rohit Prajapti</td>
//             <td className="px-6 py-3 border-b">Dev</td>
//             <td className="px-6 py-3 border-b  text-green-600 font-semibold">
//               Present
//             </td>
//             <td className="px-6 py-3 border-b">09:30</td>
//             <td className="px-6 py-3 border-b">Office</td>
//           </tr>
//           <tr className="hover:bg-gray-50">
//             <td className="px-6 py-3 border-b">Rohit Prajapti</td>
//             <td className="px-6 py-3 border-b">Dev</td>
//             <td className="px-6 py-3 border-b  text-green-600 font-semibold">
//               Present
//             </td>
//             <td className="px-6 py-3 border-b">09:30</td>
//             <td className="px-6 py-3 border-b">Office</td>
//           </tr>
//           <tr className="hover:bg-gray-50">
//             <td className="px-6 py-3 border-b">Rohit Prajapti</td>
//             <td className="px-6 py-3 border-b">Dev</td>
//             <td className="px-6 py-3 border-b  text-green-600 font-semibold">
//               Present
//             </td>
//             <td className="px-6 py-3 border-b">09:30</td>
//             <td className="px-6 py-3 border-b">Office</td>
//           </tr>
//           <tr className="hover:bg-gray-50">
//             <td className="px-6 py-3 border-b">Rohit Prajapti</td>
//             <td className="px-6 py-3 border-b">Dev</td>
//             <td className="px-6 py-3 border-b  text-green-600 font-semibold">
//               Present
//             </td>
//             <td className="px-6 py-3 border-b">09:30</td>
//             <td className="px-6 py-3 border-b">Office</td>
//           </tr>
//           <tr className="hover:bg-gray-50">
//             <td className="px-6 py-3 border-b">Rohit Prajapti</td>
//             <td className="px-6 py-3 border-b">Dev</td>
//             <td className="px-6 py-3 border-b text-green-600 font-semibold">
//               Present
//             </td>
//             <td className="px-6 py-3 border-b">09:30</td>
//             <td className="px-6 py-3 border-b">Office</td>
//           </tr>
//           <tr className="hover:bg-gray-50">
//             <td className="px-6 py-3 border-b">Ravi Prajapti</td>
//             <td className="px-6 py-3 border-b">Dev</td>
//             <td className="px-6 py-3 border-b text-red-600 font-semibold">
//               Absent
//             </td>
//             <td className="px-6 py-3 border-b">09:30</td>
//             <td className="px-6 py-3 border-b">Office</td>
//           </tr>
//           <tr className="hover:bg-gray-50">
//             <td className="px-6 py-3 border-b">Rohit Prajapti</td>
//             <td className="px-6 py-3 border-b">Dev</td>
//             <td className="px-6 py-3 border-b text-green-600 font-semibold">
//               Present
//             </td>
//             <td className="px-6 py-3 border-b">09:30</td>
//             <td className="px-6 py-3 border-b">Office</td>
//           </tr>
//         </tbody>
//       </table>
//      </div>
   
//   )
// }

// export default Table



import React from "react";

const Table = () => {
  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-5 w-full overflow-hidden">

      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-semibold text-gray-800">
          Employee Attendance
        </h2>
        <input
          type="text"
          placeholder="Search employee..."
          className="border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      <div className="overflow-x-auto max-h-[350px] overflow-y-auto">
        <table className="w-full text-sm text-left">
          <thead className="sticky top-0 bg-gray-50 border-b">
            <tr className="text-gray-600">
              <th className="px-6 py-3">Employee</th>
              <th className="px-6 py-3">Department</th>
              <th className="px-6 py-3">Status</th>
              <th className="px-6 py-3">Check-in</th>
              <th className="px-6 py-3">Mode</th>
            </tr>
          </thead>

          <tbody>
            {[
              { name: "Rohit Prajapati", dept: "Dev", status: "Present" },
              { name: "Ravi Prajapati", dept: "Dev", status: "Absent" },
              { name: "Amit Shah", dept: "HR", status: "Present" },
              { name: "Neha Patel", dept: "Design", status: "Present" },
              { name: "Jay Mehta", dept: "QA", status: "Absent" },
            ].map((emp, index) => (
              <tr
                key={index}
                className="border-b hover:bg-blue-50 transition"
              >
                <td className="px-6 py-4 font-medium text-gray-800">
                  {emp.name}
                </td>

                <td className="px-6 py-4">{emp.dept}</td>

                <td className="px-6 py-4">
                  <span
                    className={`px-3 py-1 rounded-full text-xs font-semibold
                    ${
                      emp.status === "Present"
                        ? "bg-green-100 text-green-700"
                        : "bg-red-100 text-red-700"
                    }`}
                  >
                    {emp.status}
                  </span>
                </td>

                <td className="px-6 py-4">09:30 AM</td>

                <td className="px-6 py-4">
                  <span className="bg-blue-100 text-blue-700 px-3 py-1 rounded-full text-xs font-semibold">
                    Office
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Table;