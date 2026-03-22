// // import React, { useState } from "react";
// // import { FiEdit3, FiTrash2, FiEye, FiToggleLeft, FiToggleRight } from "react-icons/fi";
// // // import { motion } from "framer-motion"; // Optional - npm i framer-motion

// // // const getInitials = (name) => name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0,2);

// // const getStatusColor = (status) => {
// //   return status === 'Active' ? 'from-emerald-400 to-emerald-600' : 
// //          status === 'Inactive' ? 'from-orange-400 to-orange-600' : 
// //          'from-red-400 to-red-600';
// // };

// // const Cards = ({
// //   id,
// //   name,
// //   designation,
// //   department,
// //   email,
// //   status = "Active",
// //   joiningDate,
// //   role,
// //   attendanceRate = 95,
// //   workingDays = 22,
// //   profileImage,
// //   onStatusToggle,
// //   onEdit,
// //   onDelete,
// //   onView
// // }) => {
// //   const [isDeleting, setIsDeleting] = useState(false);

// //   const handleStatusToggle = async () => {
// //     if (onStatusToggle) {
// //       await onStatusToggle(id, status === 'Active' ? 'Inactive' : 'Active');
// //     }
// //   };

// //   const handleDelete = async () => {
// //     if (onDelete && confirm(`Delete ${name}?`)) {
// //       setIsDeleting(true);
// //       await onDelete(id);
// //       setIsDeleting(false);
// //     }
// //   };

// //   const formattedJoining = new Date(joiningDate).toLocaleDateString('en-US', {
// //     year: 'numeric',
// //     month: 'short'
// //   });

// //   const avatarSrc = profileImage || `https://ui-avatars.com/api/?name=${encodeURIComponent(name)}&size=128&background=4f46e5&color=fff`;

// //   return (
// // <div
// //       className="group bg-gradient-to-br from-white/80 to-slate-50/80 backdrop-blur-xl rounded-3xl border border-white/50 shadow-xl hover:shadow-2xl hover:border-blue-200/50 hover:scale-[1.02] transition-all duration-500 overflow-hidden max-w-sm mx-auto relative"
// //     >
// //       {/* Status Badge */}
// //       <div className={`absolute -top-3 left-4 z-10 px-3 py-1 rounded-full text-xs font-semibold text-white shadow-lg bg-gradient-to-r ${getStatusColor(status)} ring-2 ring-white/50`}>
// //         {status}
// //       </div>

// //       {/* Header - Avatar + Name */}
// //       <div className="p-6 pt-12 relative z-10">
// //         <div className="flex items-start gap-4">
// //           <div className="relative">
// //             <img
// //               src={avatarSrc}
// //               alt={name}
// //               className="w-20 h-20 rounded-2xl object-cover ring-4 ring-white/50 shadow-2xl group-hover:ring-blue-200/50 transition-all duration-300"
// //               onError={(e) => {
// //                 e.currentTarget.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(name)}&size=160&background=6b7280&color=fff`;
// //               }}
// //             />
// //             <div className="absolute -bottom-1 -right-1 bg-blue-500 p-1.5 rounded-full border-3 border-white shadow-md">
// //               <div className="w-3 h-3 bg-green-400 rounded-full ring-2 ring-white" />
// //             </div>
// //           </div>

// //           <div className="flex-1 min-w-0">
// //             <h3 className="text-xl font-bold bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent truncate mb-1">
// //               {name}
// //             </h3>
// //             <p className="text-sm font-semibold text-blue-600 bg-blue-50/50 px-2 py-1 rounded-full inline-block">
// //               {role?.toUpperCase() || 'EMPLOYEE'}
// //             </p>
// //             <p className="text-xs text-gray-500 mt-1">{designation}</p>
// //           </div>
// //         </div>
// //       </div>

// //       {/* Metrics Grid */}
// //       <div className="px-6 pb-6 grid grid-cols-2 gap-4">
// //         <div className="text-center p-3 bg-gradient-to-b from-blue-50 to-blue-100 rounded-2xl">
// //           <p className="text-xs text-gray-500 uppercase tracking-wide font-medium">Attendance</p>
// //           <p className="text-2xl font-bold text-blue-600">{attendanceRate}%</p>
// //         </div>

// //         <div className="text-center p-3 bg-gradient-to-b from-emerald-50 to-emerald-100 rounded-2xl">
// //           <p className="text-xs text-gray-500 uppercase tracking-wide font-medium">Working Days</p>
// //           <p className="text-2xl font-bold text-emerald-600">{workingDays}</p>
// //         </div>

// //         <div className="text-center p-3 bg-gradient-to-b from-purple-50 to-purple-100 rounded-2xl col-span-2">
// //           <p className="text-xs text-gray-500 uppercase tracking-wide font-medium">Joined</p>
// //           <p className="text-lg font-bold text-purple-700">{formattedJoining}</p>
// //         </div>
// //       </div>

// //       {/* Action Bar */}
// //       <div className="px-6 pb-6 pt-0">
// //         <div className="flex items-center justify-between gap-2">
// //           <div className="flex items-center gap-1 text-xs text-gray-500">
// //             <span>{department || 'N/A'}</span>
// //             • <span>{email?.slice(0,20)}...</span>
// //           </div>
          
// //           <div className="flex items-center gap-2">
// //             <button
// //               onClick={() => onView?.(id)}
// //               className="p-2 hover:bg-blue-100 rounded-xl transition-all group/item"
// //               title="View Details"
// //             >
// //               <FiEye className="w-4 h-4 text-gray-600 group-hover/item:text-blue-600" />
// //             </button>

// //             <button
// //               onClick={() => onEdit?.(id)}
// //               className="p-2 hover:bg-yellow-100 rounded-xl transition-all group/item"
// //               title="Edit Employee"
// //             >
// //               <FiEdit3 className="w-4 h-4 text-gray-600 group-hover/item:text-yellow-600" />
// //             </button>

// //             <button
// //               onClick={handleStatusToggle}
// //               className="p-2 hover:bg-emerald-100 rounded-xl transition-all group/item"
// //               title={`Toggle ${status}`}
// //             >
// //               {status === 'Active' ? (
// //                 <FiToggleLeft className="w-4 h-4 text-emerald-600" />
// //               ) : (
// //                 <FiToggleRight className="w-4 h-4 text-gray-400" />
// //               )}
// //             </button>

// //             <button
// //               onClick={handleDelete}
// //               disabled={isDeleting}
// //               className="p-2 hover:bg-red-100 rounded-xl transition-all group/item disabled:opacity-50"
// //               title="Delete Employee"
// //             >
// //               <FiTrash2 className="w-4 h-4 text-gray-600 group-hover/item:text-red-600" />
// //             </button>
// //           </div>
// //         </div>
// //       </div>
// //     </div>
// //   );
// // };


// // export default Cards;




// import React, { useState } from "react";
// import {
//   FiEdit3,
//   FiTrash2,
//   FiEye,
//   FiToggleLeft,
//   FiToggleRight,
// } from "react-icons/fi";

// const getStatusColor = (status) => {
//   return status === "Active"
//     ? "bg-emerald-100 text-emerald-600"
//     : status === "Inactive"
//     ? "bg-yellow-100 text-yellow-600"
//     : "bg-red-100 text-red-600";
// };

// const Cards = ({
//   id,
//   name,
//   designation,
//   department,
//   email,
//   status = "Active",
//   joiningDate,
//   role,
//   attendanceRate = 95,
//   workingDays = 22,
//   profileImage,
//   onStatusToggle,
//   onEdit,
//   onDelete,
//   onView,
// }) => {
//   const [isDeleting, setIsDeleting] = useState(false);

//   const handleStatusToggle = async () => {
//     await onStatusToggle?.(
//       id,
//       status === "Active" ? "Inactive" : "Active"
//     );
//   };

//   const handleDelete = async () => {
//     if (onDelete && confirm(`Delete ${name}?`)) {
//       setIsDeleting(true);
//       await onDelete(id);
//       setIsDeleting(false);
//     }
//   };


// const formattedJoining = joiningDate ? new Date(joiningDate).toLocaleDateString('en-IN', { 
//   year: 'numeric', 
//   month: 'short', 
//   day: 'numeric' 
// }) : 'N/A';


//   const avatarSrc =
//     profileImage ||
//     `https://ui-avatars.com/api/?name=${encodeURIComponent(
//       name
//     )}&background=6366f1&color=fff`;

//   return (
//     <div className="group bg-white rounded-2xl shadow-md hover:shadow-xl transition-all duration-300 border border-gray-100 max-w-sm mx-auto overflow-hidden hover:-translate-y-1">
      
//       {/* Header */}
//       <div className="p-5 flex items-center gap-4">
//         <img
//           src={avatarSrc}
//           alt={name}
//           className="w-16 h-16 rounded-xl object-cover border shadow-sm"
//         />

//         <div className="flex-1">
//           <h3 className="font-semibold text-gray-800 text-lg truncate">
//             {name}
//           </h3>
//           <p className="text-sm text-gray-500">{designation}</p>

//           <span
//             className={`inline-block mt-1 px-2 py-0.5 text-xs rounded-full ${getStatusColor(
//               status
//             )}`}
//           >
//             {status}
//           </span>
//         </div>
//       </div>

//       {/* Info */}
//       <div className="px-5 pb-4 space-y-2 text-sm text-gray-600">
//         <p>
//           <span className="font-medium text-gray-800">Role:</span>{" "}
//           {role || "Employee"}
//         </p>
//         <p>
//           <span className="font-medium text-gray-800">Dept:</span>{" "}
//           {department || "N/A"}
//         </p>
//         <p className="truncate">
//           <span className="font-medium text-gray-800">Email:</span> {email}
//         </p>
//       </div>

//       {/* Stats */}
//       <div className="grid grid-cols-3 text-center border-t border-gray-100">
//         <div className="p-3">
//           <p className="text-xs text-gray-500">Attendance</p>
//           <p className="font-semibold text-blue-600">
//             {attendanceRate}%
//           </p>
//         </div>

//         <div className="p-3 border-x border-gray-100">
//           <p className="text-xs text-gray-500">Days</p>
//           <p className="font-semibold text-green-600">
//             {workingDays}
//           </p>
//         </div>

//         <div className="p-3">
//           <p className="text-xs text-gray-500">Joined</p>
//           <p className="font-semibold text-purple-600 text-xs">
//             {formattedJoining}
//           </p>
//         </div>
//       </div>

//       {/* Actions */}
//       <div className="flex justify-between items-center px-4 py-3 border-t border-gray-100">
//         <button
//           onClick={() => onView?.(id)}
//           className="p-2 hover:bg-blue-50 rounded-lg transition"
//         >
//           <FiEye className="text-gray-600 hover:text-blue-600" />
//         </button>

//         <button
//           onClick={() => onEdit?.(id)}
//           className="p-2 hover:bg-yellow-50 rounded-lg transition"
//         >
//           <FiEdit3 className="text-gray-600 hover:text-yellow-600" />
//         </button>

//         <button
//           onClick={handleStatusToggle}
//           className="p-2 hover:bg-green-50 rounded-lg transition"
//         >
//           {status === "Active" ? (
//             <FiToggleLeft className="text-green-600" />
//           ) : (
//             <FiToggleRight className="text-gray-400" />
//           )}
//         </button>

//         <button
//           onClick={handleDelete}
//           disabled={isDeleting}
//           className="p-2 hover:bg-red-50 rounded-lg transition disabled:opacity-50"
//         >
//           <FiTrash2 className="text-gray-600 hover:text-red-600" />
//         </button>
//       </div>
//     </div>
//   );
// };

// export default Cards;



import React, { useState } from "react";
import { FiEdit3, FiTrash2, FiEye, FiCheckCircle, FiMinusCircle } from "react-icons/fi";

const getStatusStyles = (status) => {
  switch (status) {
    case "Active": return "bg-emerald-50 text-emerald-700 border-emerald-100";
    case "Inactive": return "bg-amber-50 text-amber-700 border-amber-100";
    default: return "bg-rose-50 text-rose-700 border-rose-100";
  }
};

const Cards = ({
  id, name, designation, department, email, status = "Active",
  joiningDate, role, attendanceRate = 95, workingDays = 22,
  profileImage, onStatusToggle, onEdit, onDelete, onView,
}) => {
  const [isDeleting, setIsDeleting] = useState(false);

  const formattedJoining = joiningDate ? new Date(joiningDate).toLocaleDateString('en-IN', { 
    year: 'numeric', month: 'short'
  }) : 'N/A';

  const avatarSrc = profileImage || `https://ui-avatars.com/api/?name=${encodeURIComponent(name)}&background=eff6ff&color=3b82f6&bold=true`;

  const handleStatusToggle = async () => {
    await onStatusToggle?.(id, status === "Active" ? "Inactive" : "Active");
  };

  const handleDelete = async () => {
    if (onDelete && confirm(`Are you sure you want to delete ${name}?`)) {
      setIsDeleting(true);
      await onDelete(id);
      setIsDeleting(false);
    }
  };

  return (
    <div className="group relative bg-white rounded-[2rem] border border-slate-200 shadow-sm hover:shadow-2xl hover:shadow-blue-500/10 transition-all duration-500 overflow-hidden max-w-sm mx-auto">
      {/* Top Accent Line */}
      <div className="h-1.5 w-full bg-gradient-to-r from-blue-500 via-indigo-500 to-purple-600" />
      
      <div className="p-6">
        {/* Header: Avatar & Badge */}
        <div className="flex items-start justify-between mb-5">
          <div className="relative">
            <img
              src={avatarSrc}
              alt={name}
              className="w-16 h-16 rounded-2xl object-cover ring-4 ring-slate-50 shadow-sm group-hover:scale-105 transition-transform duration-300"
            />
            <div className={`absolute -bottom-1 -right-1 w-5 h-5 rounded-full border-2 border-white flex items-center justify-center ${status === 'Active' ? 'bg-emerald-500' : 'bg-slate-300'}`}>
               {status === 'Active' && <div className="w-1.5 h-1.5 bg-white rounded-full animate-pulse" />}
            </div>
          </div>
          <span className={`px-3 py-1 text-[10px] font-bold uppercase tracking-widest rounded-lg border ${getStatusStyles(status)}`}>
            {status}
          </span>
        </div>

        {/* Info Section */}
        <div className="mb-6">
          <h3 className="text-lg font-bold text-slate-900 leading-tight group-hover:text-blue-600 transition-colors truncate">
            {name}
          </h3>
          <p className="text-sm font-medium text-slate-400 mt-0.5">{designation}</p>
          <div className="mt-3 flex items-center gap-2">
            <span className="px-2 py-0.5 bg-blue-50 text-blue-600 text-[10px] font-bold rounded-md uppercase tracking-tight">
              {role || "Staff"}
            </span>
            <span className="text-slate-200">|</span>
            <span className="text-[11px] text-slate-500 font-semibold uppercase tracking-tighter">{department || "N/A"}</span>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 gap-3 mb-6">
          <div className="p-3 bg-slate-50 rounded-2xl border border-slate-100 group-hover:bg-white group-hover:border-blue-100 transition-colors">
            <p className="text-[9px] text-slate-400 font-black uppercase tracking-widest mb-1">Attendance</p>
            <p className="text-xl font-bold text-slate-800">{attendanceRate}%</p>
          </div>
          <div className="p-3 bg-slate-50 rounded-2xl border border-slate-100 group-hover:bg-white group-hover:border-blue-100 transition-colors">
            <p className="text-[9px] text-slate-400 font-black uppercase tracking-widest mb-1">Joined</p>
            <p className="text-lg font-bold text-slate-800">{formattedJoining}</p>
          </div>
        </div>

        {/* Action Bar */}
        <div className="flex items-center justify-between pt-4 border-t border-slate-100">
          <div className="flex gap-2">
             <button onClick={() => onView?.(id)} className="w-9 h-9 flex items-center justify-center bg-white border border-slate-200 text-slate-500 rounded-xl hover:text-blue-600 hover:border-blue-200 hover:bg-blue-50 transition-all shadow-sm">
                <FiEye size={16} />
             </button>
             <button onClick={() => onEdit?.(id)} className="w-9 h-9 flex items-center justify-center bg-white border border-slate-200 text-slate-500 rounded-xl hover:text-amber-600 hover:border-amber-200 hover:bg-amber-50 transition-all shadow-sm">
                <FiEdit3 size={16} />
             </button>
          </div>

          <div className="flex gap-2">
            <button onClick={handleStatusToggle} className="w-9 h-9 flex items-center justify-center bg-slate-50 text-slate-400 rounded-xl hover:text-emerald-600 hover:bg-emerald-50 transition-all">
               {status === "Active" ? <FiCheckCircle size={18} /> : <FiMinusCircle size={18} />}
            </button>
            <button 
              disabled={isDeleting} 
              onClick={handleDelete}
              className="w-9 h-9 flex items-center justify-center bg-slate-50 text-slate-400 rounded-xl hover:text-rose-600 hover:bg-rose-50 transition-all disabled:opacity-30"
            >
               <FiTrash2 size={18} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Cards;