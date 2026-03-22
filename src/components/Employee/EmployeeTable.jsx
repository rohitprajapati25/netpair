// import React from "react";
// import { FiEye, FiEdit3, FiToggleLeft, FiToggleRight, FiTrash2 } from "react-icons/fi";

// const EmployeeTable = ({ employees, onView, onEdit, onDelete, onStatusToggle }) => {
//   return (
//     <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
//       <table className="w-full">
//         <thead className="bg-gradient-to-r from-slate-50 to-gray-50 border-b border-gray-200">
//           <tr>
//             <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Name</th>
//             <th className="px-4 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Department</th>
//             <th className="px-4 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Role</th>
//             <th className="px-4 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Status</th>
//             <th className="px-4 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Joined</th>
//             <th className="px-6 py-4 text-right text-xs font-semibold text-gray-600 uppercase tracking-wider">Actions</th>
//           </tr>
//         </thead>
//         <tbody className="divide-y divide-gray-200">
//           {employees.map((emp) => (
//             <tr key={emp._id} className="hover:bg-gray-50 transition-colors">
//               <td className="px-6 py-4 whitespace-nowrap">
//                 <div className="flex items-center">
//                   <div className="flex-shrink-0 h-10 w-10">
//                     <img
//                       className="h-10 w-10 rounded-full object-cover"
//                       src={emp.profileImage || `https://ui-avatars.com/api/?name=${encodeURIComponent(emp.name)}&size=128&background=4f46e5&color=fff`}
//                       alt=""
//                     />
//                   </div>
//                   <div className="ml-4">
//                     <div className="text-sm font-semibold text-gray-900">{emp.name}</div>
//                     <div className="text-sm text-gray-500">{emp.email}</div>
//                   </div>
//                 </div>
//               </td>
//               <td className="px-4 py-4 whitespace-nowrap">
//                 <span className="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-blue-100 text-blue-800">
//                   {emp.department}
//                 </span>
//               </td>
//               <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-900">{emp.role}</td>
//               <td className="px-4 py-4 whitespace-nowrap">
//                 <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
//                   emp.status === 'Active' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
//                 }`}>
//                   {emp.status}
//                 </span>
//               </td>
//               <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-900">
//                 {emp.joiningDate ? new Date(emp.joiningDate).toLocaleDateString() : 'N/A'}
//               </td>
//               <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium space-x-2">
//                 <button onClick={() => onView(emp._id)} className="p-2 hover:bg-blue-50 rounded-lg transition text-blue-600 hover:text-blue-900" title="View">
//                   <FiEye className="w-4 h-4" />
//                 </button>
//                 <button onClick={() => onEdit(emp._id)} className="p-2 hover:bg-yellow-50 rounded-lg transition text-yellow-600 hover:text-yellow-900" title="Edit">
//                   <FiEdit3 className="w-4 h-4" />
//                 </button>
//                 <button onClick={() => onStatusToggle(emp._id, emp.status === 'Active' ? 'Inactive' : 'Active')} className="p-2 hover:bg-green-50 rounded-lg transition text-green-600 hover:text-green-900" title="Toggle Status">
//                   {emp.status === 'Active' ? <FiToggleLeft className="w-4 h-4" /> : <FiToggleRight className="w-4 h-4" />}
//                 </button>
//                 <button onClick={() => onDelete(emp._id)} className="p-2 hover:bg-red-50 rounded-lg transition text-red-600 hover:text-red-900" title="Delete">
//                   <FiTrash2 className="w-4 h-4" />
//                 </button>
//               </td>
//             </tr>
//           ))}
//         </tbody>
//       </table>
//     </div>
//   );
// };

// export default EmployeeTable;


import React from "react";
import { FiEye, FiEdit3, FiToggleLeft, FiToggleRight, FiTrash2 } from "react-icons/fi";

const EmployeeTable = ({ employees, onView, onEdit, onDelete, onStatusToggle }) => {
  return (
    <div className="w-full bg-white rounded-[1.5rem] border border-slate-200/60 shadow-sm overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full border-collapse">
          {/* Enhanced Header */}
          <thead>
            <tr className="bg-slate-50/50 border-b border-slate-200">
              <th className="px-6 py-5 text-left text-[11px] font-black text-slate-400 uppercase tracking-[0.15em]">
                Employee
              </th>
              <th className="px-4 py-5 text-left text-[11px] font-black text-slate-400 uppercase tracking-[0.15em]">
                Department
              </th>
              <th className="px-4 py-5 text-left text-[11px] font-black text-slate-400 uppercase tracking-[0.15em]">
                Designation
              </th>
              <th className="px-4 py-5 text-left text-[11px] font-black text-slate-400 uppercase tracking-[0.15em]">
                Status
              </th>
              <th className="px-4 py-5 text-left text-[11px] font-black text-slate-400 uppercase tracking-[0.15em]">
                Join Date
              </th>
              <th className="px-6 py-5 text-right text-[11px] font-black text-slate-400 uppercase tracking-[0.15em]">
                Actions
              </th>
            </tr>
          </thead>

          {/* Table Body */}
          <tbody className="divide-y divide-slate-100">
            {employees.map((emp) => (
              <tr 
                key={emp._id} 
                className="group hover:bg-blue-50/30 transition-all duration-200"
              >
                {/* Name & Avatar Column */}
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center">
                    <div className="relative flex-shrink-0 h-11 w-11">
                      <img
                        className="h-11 w-11 rounded-xl object-cover ring-2 ring-white shadow-sm"
                        src={emp.profileImage || `https://ui-avatars.com/api/?name=${encodeURIComponent(emp.name)}&size=128&background=eff6ff&color=3b82f6&bold=true`}
                        alt={emp.name}
                      />
                      {emp.status === 'Active' && (
                        <span className="absolute -bottom-0.5 -right-0.5 block h-3 w-3 rounded-full bg-emerald-500 ring-2 ring-white" />
                      )}
                    </div>
                    <div className="ml-4">
                      <div className="text-sm font-bold text-slate-800 group-hover:text-blue-600 transition-colors">
                        {emp.name}
                      </div>
                      <div className="text-xs font-medium text-slate-400">
                        {emp.email}
                      </div>
                    </div>
                  </div>
                </td>

                {/* Dept Column */}
                <td className="px-4 py-4 whitespace-nowrap">
                  <span className="inline-flex px-2.5 py-1 text-[11px] font-bold rounded-lg bg-slate-100 text-slate-600 uppercase tracking-tight">
                    {emp.department || "N/A"}
                  </span>
                </td>

                {/* Role Column */}
                <td className="px-4 py-4 whitespace-nowrap text-sm font-semibold text-slate-600">
                  {emp.role || "Staff"}
                </td>

                {/* Status Column */}
                <td className="px-4 py-4 whitespace-nowrap">
                  <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-bold uppercase tracking-wider ${
                    emp.status === 'Active' 
                      ? 'bg-emerald-50 text-emerald-600 border border-emerald-100' 
                      : 'bg-rose-50 text-rose-600 border border-rose-100'
                  }`}>
                    <span className={`h-1.5 w-1.5 rounded-full ${emp.status === 'Active' ? 'bg-emerald-500' : 'bg-rose-500'}`} />
                    {emp.status}
                  </span>
                </td>

                {/* Joined Column */}
                <td className="px-4 py-4 whitespace-nowrap text-sm font-bold text-slate-500">
                  {emp.joiningDate ? new Date(emp.joiningDate).toLocaleDateString('en-IN', {
                    day: '2-digit',
                    month: 'short',
                    year: 'numeric'
                  }) : '—'}
                </td>

                {/* Actions Column */}
                <td className="px-6 py-4 whitespace-nowrap text-right">
                  <div className="flex items-center justify-end gap-1">
                    <ActionButton 
                      onClick={() => onView(emp._id)} 
                      icon={<FiEye size={16} />} 
                      variant="blue" 
                      label="View" 
                    />
                    <ActionButton 
                      onClick={() => onEdit(emp._id)} 
                      icon={<FiEdit3 size={16} />} 
                      variant="amber" 
                      label="Edit" 
                    />
                    <ActionButton 
                      onClick={() => onStatusToggle(emp._id, emp.status === 'Active' ? 'Inactive' : 'Active')} 
                      icon={emp.status === 'Active' ? <FiToggleLeft size={18} /> : <FiToggleRight size={18} />} 
                      variant="emerald" 
                      label="Status" 
                    />
                    <ActionButton 
                      onClick={() => onDelete(emp._id)} 
                      icon={<FiTrash2 size={16} />} 
                      variant="rose" 
                      label="Delete" 
                    />
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

// Helper Component for consistency
const ActionButton = ({ onClick, icon, variant, label }) => {
  const variants = {
    blue: "text-slate-400 hover:text-blue-600 hover:bg-blue-50",
    amber: "text-slate-400 hover:text-amber-600 hover:bg-amber-50",
    emerald: "text-slate-400 hover:text-emerald-600 hover:bg-emerald-50",
    rose: "text-slate-400 hover:text-rose-600 hover:bg-rose-50",
  };

  return (
    <button
      onClick={onClick}
      className={`p-2 rounded-xl transition-all duration-200 ${variants[variant]}`}
      title={label}
    >
      {icon}
    </button>
  );
};

export default EmployeeTable;