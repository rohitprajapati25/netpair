import React, { useState } from "react";
import { 
  FiEdit3, FiTrash2, FiEye, FiToggleLeft, FiToggleRight, 
  FiMapPin, FiMail, FiBriefcase, FiCalendar 
} from "react-icons/fi";
import { motion } from "framer-motion";

const getStatusStyle = (status) => {
  const styles = {
    Active: { bg: "from-emerald-400 to-emerald-600", text: "text-emerald-100", ring: "ring-emerald-200" },
    Inactive: { bg: "from-orange-400 to-orange-600", text: "text-orange-100", ring: "ring-orange-200" },
    Suspended: { bg: "from-red-400 to-red-600", text: "text-red-100", ring: "ring-red-200" }
  };
  return styles[status] || styles.Active;
};

const PremiumCard = ({
  id, name, designation, department, email, phone, status = "Active", 
  joiningDate, role = "Employee", attendanceRate = 95, workingDays = 22,
  profileImage, onView, onEdit, onDelete, onToggleStatus
}) => {
  const [isDeleting, setIsDeleting] = useState(false);
  const [hovered, setHovered] = useState(false);
  
  const statusStyle = getStatusStyle(status);
  const formattedJoining = new Date(joiningDate).toLocaleDateString('en-IN');
  const avatarSrc = profileImage || `https://ui-avatars.com/api/?name=${encodeURIComponent(name)}&size=128&bold=true&background=4f46e5&color=fff`;

  const handleDelete = async () => {
    if (confirm(`Delete ${name}?`)) {
      setIsDeleting(true);
      await onDelete(id);
      setIsDeleting(false);
    }
  };

  const handleToggle = () => {
    onToggleStatus?.(id, status === 'Active' ? 'Inactive' : 'Active');
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -8, scale: 1.02 }}
      transition={{ type: "spring", stiffness: 400, damping: 17 }}
      className="group relative bg-gradient-to-br from-white via-blue-50/50 to-indigo-50/30 backdrop-blur-xl rounded-3xl border border-white/40 shadow-2xl hover:shadow-premium border-opacity-60 overflow-hidden max-w-sm mx-auto h-[380px]"
      onHoverStart={() => setHovered(true)}
      onHoverEnd={() => setHovered(false)}
    >
      {/* Premium Status Badge */}
      <motion.div 
        className={`absolute -top-4 left-4 z-20 px-4 py-2 rounded-2xl text-xs font-bold shadow-2xl uppercase tracking-wide ring-4 ring-white/60 ${statusStyle.text} bg-gradient-to-r ${statusStyle.bg}`}
        initial={{ scale: 0.8, rotate: -10 }}
        animate={{ scale: 1, rotate: 0 }}
        whileHover={{ scale: 1.05 }}
      >
        {status}
      </motion.div>

      {/* Premium Gradient Overlay */}
      <div className="absolute inset-0 bg-gradient-to-t from-blue-500/5 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

      {/* Avatar Section */}
      <div className="p-8 pt-16 relative z-10">
        <div className="relative">
          <motion.img
            src={avatarSrc}
            alt={name}
            className="w-24 h-24 rounded-3xl object-cover ring-8 ring-white shadow-2xl group-hover:ring-blue-300/50 transition-all duration-500 mx-auto"
            whileHover={{ rotate: 2, scale: 1.05 }}
            onError={(e) => {
              e.currentTarget.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(name)}&size=192&bold=true&background=6b7280&color=fff`;
            }}
          />
          <motion.div 
            className="absolute -bottom-2 -right-2 bg-gradient-to-r from-emerald-400 to-green-500 p-2 rounded-2xl border-4 border-white shadow-xl"
            animate={{ scale: [1, 1.1, 1] }}
            transition={{ repeat: Infinity, duration: 2 }}
          >
            <div className="w-4 h-4 bg-white rounded-full" />
          </motion.div>
        </div>

        {/* Name & Role */}
        <div className="text-center mt-6">
          <motion.h3 
            className="text-2xl font-black bg-gradient-to-r from-gray-900 via-gray-800 to-slate-900 bg-clip-text text-transparent mb-2"
            whileHover={{ scale: 1.02 }}
          >
            {name}
          </motion.h3>
          <motion.div 
            className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-blue-500 to-indigo-600 text-white text-sm font-bold rounded-2xl shadow-lg ring-2 ring-blue-200/50"
            whileHover={{ scale: 1.05 }}
          >
            <FiBriefcase className="w-3 h-3" />
            {role?.toUpperCase() || 'EMPLOYEE'}
          </motion.div>
        </div>
      </div>

      {/* Key Metrics - Glass Effect */}
      <div className="px-6 pb-8 relative z-10">
        <div className="grid grid-cols-2 gap-4">
          <motion.div className="group/card p-5 bg-white/60 backdrop-blur-sm rounded-2xl border border-white/50 shadow-lg hover:shadow-xl hover:bg-white/80 transition-all" whileHover={{ y: -4 }}>
            <p className="text-xs text-gray-500 font-medium uppercase tracking-wide">Attendance</p>
            <p className="text-3xl font-black bg-gradient-to-r from-blue-600 to-cyan-600 bg-clip-text text-transparent mt-1">
              {attendanceRate}%
            </p>
          </motion.div>
          
          <motion.div className="group/card p-5 bg-white/60 backdrop-blur-sm rounded-2xl border border-white/50 shadow-lg hover:shadow-xl hover:bg-white/80 transition-all" whileHover={{ y: -4 }}>
            <p className="text-xs text-gray-500 font-medium uppercase tracking-wide">Working Days</p>
            <p className="text-3xl font-black bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent mt-1">
              {workingDays}
            </p>
          </motion.div>
        </div>
        
        <div className="mt-6 text-center">
          <div className="inline-flex items-center gap-2 text-xs text-gray-500">
            <FiCalendar className="w-3 h-3" />
            <span>Joined {formattedJoining}</span>
          </div>
        </div>
      </div>

      {/* Premium Action Bar */}
      <div className="px-6 pb-8 pt-0 relative z-10">
        <div className="flex items-center justify-between">
          <motion.div 
            className="flex items-center gap-3 text-xs text-gray-500 bg-white/60 backdrop-blur rounded-2xl px-4 py-2 border border-gray-200/50"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
          >
            <FiMapPin className="w-3 h-3" />
            <span className="truncate">{department || 'N/A'}</span>
            <span>•</span>
            <FiMail className="w-3 h-3" />
            <span className="truncate max-w-[100px]">{email}</span>
          </motion.div>
          
          <motion.div 
            className="flex items-center gap-2 p-3 bg-gradient-to-r from-slate-100 to-gray-100 rounded-2xl backdrop-blur border shadow-sm hover:shadow-md transition-all"
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.3 }}
          >
            <motion.button onClick={() => onView?.(id)} className="p-3 hover:bg-blue-100 rounded-xl transition-all" title="View">
              <FiEye className="w-4 h-4 text-blue-600 hover:text-blue-700" />
            </motion.button>
            
            <motion.button onClick={() => onEdit?.(id)} className="p-3 hover:bg-amber-100 rounded-xl transition-all" title="Edit">
              <FiEdit3 className="w-4 h-4 text-amber-600 hover:text-amber-700" />
            </motion.button>
            
            <motion.button onClick={handleToggle} className="p-3 hover:bg-emerald-100 rounded-xl transition-all" title="Toggle Status">
              {status === 'Active' ? (
                <FiToggleLeft className="w-4 h-4 text-emerald-600" />
              ) : (
                <FiToggleRight className="w-4 h-4 text-gray-400" />
              )}
            </motion.button>
            
            <motion.button 
              onClick={handleDelete} 
              disabled={isDeleting}
              className="p-3 hover:bg-red-100 rounded-xl transition-all disabled:opacity-50" 
              title="Delete"
            >
              <FiTrash2 className={`w-4 h-4 ${isDeleting ? 'text-gray-400' : 'text-red-600 hover:text-red-700'}`} />
            </motion.button>
          </motion.div>
        </div>
      </div>
    </motion.div>
  );
};

export default PremiumCard;

