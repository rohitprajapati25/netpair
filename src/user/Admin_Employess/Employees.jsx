// // import React, { useState, useEffect } from "react";
// // import axios from "axios";
// // import { useNavigate } from "react-router-dom";
// // import Card from "../../components/Employee/Cards";
// // import { RiUserAddLine, RiLoader2Line } from "react-icons/ri";
// // import EmployeeModal from "../../components/Employee/EmployeeModal";
// // import EmployeeTable from "../../components/Employee/EmployeeTable";

// // const Employees = () => {
// //   const navigate = useNavigate();
// //   const [employees, setEmployees] = useState([]);
// //   const [loading, setLoading] = useState(true);
// //   const [error, setError] = useState(null);
// //   const [search, setSearch] = useState('');
// //   const [statusFilter, setStatusFilter] = useState('All');
// //   const [page, setPage] = useState(1);
// //   const [selectedEmployee, setSelectedEmployee] = useState(null);
// // const [modalMode, setModalMode] = useState('view');
// //   const [viewMode, setViewMode] = useState('card'); // 'card' or 'table'

// //   // Realistic calculation functions
// //   const calculateWorkingDays = (joinDate) => {
// //     if (!joinDate) return 0;
// //     const today = new Date();
// //     const join = new Date(joinDate);
// //     const diffTime = Math.abs(today - join);
// //     const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
// //     return Math.min(diffDays, 30); // Monthly cap
// //   };

// //   const calculateAttendance = (joinDate) => {
// //     const days = calculateWorkingDays(joinDate);
// //     const rate = 0.85 + Math.random() * 0.13; // 85-98%
// //     return Math.floor(days * rate);
// //   };

// //   // ✅ Real API functions
// //   const handleView = (id) => {
// //     const emp = employees.find(e => e._id === id);
// //     setSelectedEmployee(emp);
// //     setModalMode('view');
// //   };

// //   const handleEdit = (id) => {
// //     const emp = employees.find(e => e._id === id);
// //     setSelectedEmployee(emp);
// //     setModalMode('edit');
// //   };

// //   const handleStatusToggle = async (id, newStatus) => {
// //     try {
// //       await axios.put(`http://localhost:5000/api/admin/employees/${id}`, { status: newStatus });
// //       setEmployees(employees.map(emp => emp._id === id ? { ...emp, status: newStatus } : emp));
// //     } catch (_) {
// //       alert('Status update failed');
// //     }
// //   };

// //   const handleDelete = async (id) => {
// //     try {
// //       await axios.delete(`http://localhost:5000/api/admin/employees/${id}`);
// //       setEmployees(employees.filter(emp => emp._id !== id));
// //     } catch (_) {
// //       alert('Delete failed');
// //     }
// //   };

// //   const handleSaveEmployee = async (values) => {
// //     try {
// //       const res = await axios.put(`http://localhost:5000/api/admin/employees/${selectedEmployee._id}`, values);
// //       setEmployees(employees.map(emp => emp._id === selectedEmployee._id ? res.data : emp));
// //       setSelectedEmployee(null);
// //     } catch (_) {
// //       alert('Update failed');
// //     }
// //   };

// //   const fetchEmployees = async (searchQuery = '', statusQuery = '', pageNum = 1) => {
// //     try {
// //       setLoading(true);
// //       setError(null);
// //       const params = new URLSearchParams();
// //       if (searchQuery) params.append('search', searchQuery);
// //       if (statusQuery && statusQuery !== 'All') params.append('status', statusQuery);
// //       params.append('page', pageNum.toString());
// //       params.append('limit', '12');

// //       const res = await axios.get(`http://localhost:5000/api/admin/employees?${params}`);
// //       setEmployees(res.data.employees || []);
// //     } catch (err) {
// //       setError(err.response?.data?.message || 'Failed to fetch employees');
// //       console.error('FETCH_EMPLOYEES:', err);
// //       setEmployees([]);
// //     } finally {
// //       setLoading(false);
// //     }
// //   };

// //   useEffect(() => {
// //     fetchEmployees(search, statusFilter, page);
// //   }, [search, statusFilter, page]);

// //   if (loading) {
// //     return (
// //       <div className="flex items-center justify-center min-h-[400px]">
// //         <RiLoader2Line className="animate-spin h-8 w-8 text-blue-600" />
// //       </div>
// //     );
// //   }

// //   return (
// //     <>
// //       <div className="relative h-full m-1 p-6 bg-gradient-to-br from-slate-50 to-gray-100 flex flex-col gap-6 overflow-y-auto rounded-2xl">
// //         {/* Header + Search/Filter */}
// //         <div className="space-y-4">
// //           <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
// //             <div>
// //               <h2 className="text-2xl font-semibold text-gray-800">Employees</h2>
// //               <p className="text-sm text-gray-500">
// //                 {employees.length} employees
// //               </p>
// //             </div>
// //             <button
// //               className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg shadow transition"
// //               onClick={() => navigate('/employee/registration')}
// //             >
// //               <RiUserAddLine size={18} />
// //               Add Employee
// //             </button>
// //           </div>

// //           {/* Search & Filter */}
// //           <div className="flex flex-col sm:flex-row gap-3">
// //             <input
// //               type="text"
// //               placeholder="Search name, email, department..."
// //               value={search}
// //               onChange={(e) => {
// //                 setSearch(e.target.value);
// //                 setPage(1);
// //               }}
// //               className="flex-1 px-4 py-2 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
// //             />
// //             <select
// //               value={statusFilter}
// //               onChange={(e) => {
// //                 setStatusFilter(e.target.value);
// //                 setPage(1);
// //               }}
// //               className="px-4 py-2 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
// //             >
// //               <option>All</option>
// //               <option>Active</option>
// //               <option>Inactive</option>
// //             </select>
// //             <button
// //               onClick={() => fetchEmployees(search, statusFilter, 1)}
// //               className="px-6 py-2 bg-gray-600 text-white rounded-xl hover:bg-gray-700 transition whitespace-nowrap"
// //             >
// //               Refresh
// //             </button>
// //             {/* View Toggle */}
// //             <button
// //               onClick={() => setViewMode(viewMode === 'card' ? 'table' : 'card')}
// //               className={`px-4 py-2 rounded-xl border font-medium transition-all ${viewMode === 'card' ? 'bg-blue-600 text-white border-blue-600' : 'bg-gray-100 text-gray-700 border-gray-300 hover:bg-gray-200'}`}
// //             >
// //               {viewMode === 'card' ? 'Table View' : 'Card View'}
// //             </button>
// //           </div>
// //         </div>

// //         {/* Error */}
// //         {error && (
// //           <div className="p-4 bg-red-50 border border-red-200 rounded-xl text-red-800 text-sm">
// //             {error} <button onClick={() => window.location.reload()} className="underline">Retry</button>
// //           </div>
// //         )}

// //         {/* Dynamic Content - Toggle Card/Table */}
// //         {viewMode === 'card' ? (
// //           <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
// //             {employees.map((emp) => (
// //               <Card
// //                 key={emp._id}
// //                 id={emp._id}
// //                 name={emp.name}
// //                 designation={emp.designation}
// //                 department={emp.department}
// //                 email={emp.email}
// //                 status={emp.status}
// //                 joiningDate={emp.joiningDate}
// //                 role={emp.role}
// //                 workingDays={calculateWorkingDays(emp.joiningDate)}
// //                 attendanceRate={calculateAttendance(emp.joiningDate)}
// //                 profileImage={emp.profileImage}
// //                 onStatusToggle={handleStatusToggle}
// //                 onEdit={handleEdit}
// //                 onDelete={handleDelete}
// //                 onView={handleView}
// //               />
// //             ))}
// //           </div>
// //         ) : (
// //           <EmployeeTable 
// //             employees={employees}
// //             onView={handleView}
// //             onEdit={handleEdit}
// //             onDelete={handleDelete}
// //             onStatusToggle={handleStatusToggle}
// //           />
// //         )}

// //         {employees.length === 0 && !loading && (
// //           <div className="text-center py-12 text-gray-500">
// //             <p>No employees found. <button onClick={() => navigate('/employee/registration')} className="text-blue-600 hover:underline font-medium">Add first employee</button></p>
// //           </div>
// //         )}
// //       </div>

// //       {/* Employee Modal */}
// //       <EmployeeModal
// //         isOpen={!!selectedEmployee}
// //         onClose={() => setSelectedEmployee(null)}
// //         employee={selectedEmployee}
// //         onSave={handleSaveEmployee}
// //         mode={modalMode}
// //       />
// //     </>
// //   );
// // };

// // export default Employees;


// import React, { useState, useEffect, useCallback } from "react";
// import axios from "axios";
// import { useNavigate } from "react-router-dom";
// import Card from "../../components/Employee/Cards";
// import EmployeeModal from "../../components/Employee/EmployeeModal";
// import EmployeeTable from "../../components/Employee/EmployeeTable";
// import { RiUserAddLine, RiLoader2Line, RiSearchLine, RiLayoutGridFill, RiListUnordered, RiRefreshLine } from "react-icons/ri";

// const Employees = () => {
//   const navigate = useNavigate();
//   const [employees, setEmployees] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);
//   const [search, setSearch] = useState('');
//   const [statusFilter, setStatusFilter] = useState('All');
//   const [page, setPage] = useState(1);
//   const [selectedEmployee, setSelectedEmployee] = useState(null);
//   const [modalMode, setModalMode] = useState('view');
//   const [viewMode, setViewMode] = useState('card'); // 'card' or 'table'

//   // Calculations for Card View
//   const calculateWorkingDays = (joinDate) => {
//     if (!joinDate) return 0;
//     const diffDays = Math.ceil(Math.abs(new Date() - new Date(joinDate)) / (1000 * 60 * 60 * 24));
//     return Math.min(diffDays, 30);
//   };

//   const calculateAttendance = (joinDate) => {
//     const days = calculateWorkingDays(joinDate);
//     return Math.floor(days * (0.85 + Math.random() * 0.13));
//   };

//   // ✅ API Handlers
//   const fetchEmployees = useCallback(async () => {
//     try {
//       setLoading(true);
//       const params = new URLSearchParams({
//         page: page.toString(),
//         limit: '12',
//         ...(search && { search }),
//         ...(statusFilter !== 'All' && { status: statusFilter })
//       });

//       const res = await axios.get(`http://localhost:5000/api/admin/employees?${params}`);
//       setEmployees(res.data.employees || []);
//     } catch (err) {
//       setError(err.response?.data?.message || 'Failed to fetch employees');
//     } finally {
//       setLoading(false);
//     }
//   }, [search, statusFilter, page]);

//   useEffect(() => {
//     const delayDebounceFn = setTimeout(() => {
//       fetchEmployees();
//     }, 400); // Debounce search
//     return () => clearTimeout(delayDebounceFn);
//   }, [fetchEmployees]);

//   const handleStatusToggle = async (id, newStatus) => {
//     try {
//       await axios.put(`http://localhost:5000/api/admin/employees/${id}`, { status: newStatus });
//       setEmployees(prev => prev.map(emp => emp._id === id ? { ...emp, status: newStatus } : emp));
//     } catch (_) {
//       alert('Status update failed');
//     }
//   };


//   const handleDelete = async (id) => {
//     try {
//       await axios.delete(`http://localhost:5000/api/admin/employees/${id}`);
//       setEmployees(prev => prev.filter(emp => emp._id !== id));
//     } catch (_) {
//       alert('Delete failed');
//     }
//   };

//   const handleSaveEmployee = async (values) => {
//     try {
//       const res = await axios.put(`http://localhost:5000/api/admin/employees/${selectedEmployee._id}`, values);
//       setEmployees(prev => prev.map(emp => emp._id === selectedEmployee._id ? res.data : emp));
//       setSelectedEmployee(null);
//     } catch (_) {
//       alert('Update failed');
//     }
//   };

//   return (
//     <div className="min-h-screen bg-slate-50/50 p-4 md:p-8">
//       {/* --- Dashboard Header --- */}
//       <div className="max-w-7xl mx-auto space-y-8">
//         <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
//           <div>
//             <h1 className="text-3xl font-black text-slate-900 tracking-tight">Team Directory</h1>
//             <p className="text-slate-500 font-medium mt-1">
//               Manage your organization's <span className="text-blue-600 font-bold">{employees.length}</span> members.
//             </p>
//           </div>
          
//           <button
//             onClick={() => navigate('/employee/registration')}
//             className="flex items-center justify-center gap-2 bg-slate-900 hover:bg-blue-600 text-white px-6 py-3.5 rounded-2xl font-bold shadow-xl shadow-slate-200 transition-all active:scale-95"
//           >
//             <RiUserAddLine size={20} />
//             <span>Add New Employee</span>
//           </button>
//         </div>

//         {/* --- Toolbar: Search, Filter, View Toggle --- */}
//         <div className="bg-white p-3 rounded-[2rem] border border-slate-200 shadow-sm flex flex-col lg:flex-row gap-4 items-center">
//           {/* Search Input */}
//           <div className="relative flex-1 w-full">
//             <RiSearchLine className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
//             <input
//               type="text"
//               placeholder="Search by name, role or email..."
//               value={search}
//               onChange={(e) => setSearch(e.target.value)}
//               className="w-full pl-12 pr-4 py-3 bg-slate-50 border-none rounded-2xl focus:ring-2 focus:ring-blue-500/20 transition-all font-medium text-slate-700 placeholder:text-slate-400"
//             />
//           </div>

//           <div className="flex items-center gap-3 w-full lg:w-auto">
//             {/* Status Filter */}
//             <select
//               value={statusFilter}
//               onChange={(e) => setStatusFilter(e.target.value)}
//               className="flex-1 lg:w-40 px-4 py-3 bg-slate-50 border-none rounded-2xl font-bold text-slate-600 focus:ring-2 focus:ring-blue-500/20 appearance-none"
//             >
//               <option value="All">All Status</option>
//               <option value="Active">Active Only</option>
//               <option value="Inactive">Inactive</option>
//             </select>

//             {/* View Switcher */}
//             <div className="flex bg-slate-100 p-1 rounded-xl">
//               <button
//                 onClick={() => setViewMode('card')}
//                 className={`p-2 rounded-lg transition-all ${viewMode === 'card' ? 'bg-white shadow-sm text-blue-600' : 'text-slate-400 hover:text-slate-600'}`}
//               >
//                 <RiLayoutGridFill size={20} />
//               </button>
//               <button
//                 onClick={() => setViewMode('table')}
//                 className={`p-2 rounded-lg transition-all ${viewMode === 'table' ? 'bg-white shadow-sm text-blue-600' : 'text-slate-400 hover:text-slate-600'}`}
//               >
//                 <RiListUnordered size={20} />
//               </button>
//             </div>

//             <button 
//               onClick={fetchEmployees}
//               className="p-3 text-slate-400 hover:text-blue-600 transition-colors"
//             >
//               <RiRefreshLine size={22} className={loading ? 'animate-spin' : ''} />
//             </button>
//           </div>
//         </div>

//         {/* --- Main Content Area --- */}
//         {loading ? (
//           <div className="flex flex-col items-center justify-center py-24 gap-4">
//             <RiLoader2Line className="animate-spin h-12 w-12 text-blue-600" />
//             <p className="font-bold text-slate-400 animate-pulse">Syncing database...</p>
//           </div>
//         ) : error ? (
//           <div className="bg-rose-50 border border-rose-100 p-6 rounded-3xl text-center">
//             <p className="text-rose-600 font-bold mb-3">{error}</p>
//             <button onClick={fetchEmployees} className="bg-rose-600 text-white px-6 py-2 rounded-xl font-bold">Try Again</button>
//           </div>
//         ) : employees.length === 0 ? (
//           <div className="text-center py-20 bg-white rounded-[3rem] border-2 border-dashed border-slate-200">
//             <p className="text-slate-400 font-bold text-lg mb-2">No results found</p>
//             <p className="text-slate-400 text-sm">Try adjusting your filters or search query.</p>
//           </div>
//         ) : (
//           <div className="animate-in fade-in slide-in-from-bottom-4 duration-700">
//             {viewMode === 'card' ? (
//               <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
//                 {employees.map((emp) => (
//                   <Card
//                     key={emp._id}
//                     {...emp}
//                     id={emp._id}
//                     workingDays={calculateWorkingDays(emp.joiningDate)}
//                     attendanceRate={calculateAttendance(emp.joiningDate)}
//                     onStatusToggle={handleStatusToggle}
//                     onEdit={(id) => { setSelectedEmployee(emp); setModalMode('edit'); }}
//                     onDelete={handleDelete}
//                     onView={(id) => { setSelectedEmployee(emp); setModalMode('view'); }}
//                   />
//                 ))}
//               </div>
//             ) : (
//               <EmployeeTable 
//                 employees={employees}
//                 onView={(id) => { setSelectedEmployee(employees.find(e => e._id === id)); setModalMode('view'); }}
//                 onEdit={(id) => { setSelectedEmployee(employees.find(e => e._id === id)); setModalMode('edit'); }}
//                 onDelete={handleDelete}
//                 onStatusToggle={handleStatusToggle}
//               />
//             )}
//           </div>
//         )}
//       </div>

//       {/* --- Global Modal --- */}
//       <EmployeeModal
//         isOpen={!!selectedEmployee}
//         onClose={() => setSelectedEmployee(null)}
//         employee={selectedEmployee}
//         onSave={handleSaveEmployee}
//         mode={modalMode}
//       />
//     </div>
//   );
// };

// export default Employees;


import React, { useState, useEffect, useCallback } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import Card from "../../components/Employee/Cards";
import EmployeeModal from "../../components/Employee/EmployeeModal";
import EmployeeTable from "../../components/Employee/EmployeeTable";
import { RiUserAddLine, RiLoader2Line, RiSearchLine, RiLayoutGridFill, RiListUnordered, RiRefreshLine } from "react-icons/ri";

// ✅ Axios auth helper
const authHeaders = () => ({
  headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
});

const Employees = () => {
  const navigate = useNavigate();
  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');  // ✅ lowercase default
  const [page, setPage] = useState(1);
  const [selectedEmployee, setSelectedEmployee] = useState(null);
  const [modalMode, setModalMode] = useState('view');
  const [viewMode, setViewMode] = useState('card');

  const calculateWorkingDays = (joinDate) => {
    if (!joinDate) return 0;
    const diffDays = Math.ceil(Math.abs(new Date() - new Date(joinDate)) / (1000 * 60 * 60 * 24));
    return Math.min(diffDays, 30);
  };

  const calculateAttendance = (joinDate) => {
    const days = calculateWorkingDays(joinDate);
    return Math.floor(days * (0.85 + Math.random() * 0.13));
  };

  // ✅ Fixed: auth token + error reset + lowercase status
  const fetchEmployees = useCallback(async () => {
    try {
      setLoading(true);
      setError(null); // ✅ reset error before each fetch

      const params = new URLSearchParams({
        page: page.toString(),
        limit: '12',
        ...(search && { search }),
        ...(statusFilter !== 'all' && { status: statusFilter }) // ✅ lowercase 'all'
      });

      const res = await axios.get(
        `http://localhost:5000/api/admin/employees?${params}`,
        authHeaders() // ✅ send token
      );
      setEmployees(res.data.employees || []);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to fetch employees');
    } finally {
      setLoading(false);
    }
  }, [search, statusFilter, page]);

  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      fetchEmployees();
    }, 400);
    return () => clearTimeout(delayDebounceFn);
  }, [fetchEmployees]);

  // ✅ Fixed: auth token added
  const handleStatusToggle = async (id, newStatus) => {
    try {
      await axios.put(
        `http://localhost:5000/api/admin/employees/${id}`,
        { status: newStatus },
        authHeaders()
      );
      setEmployees(prev => prev.map(emp => emp._id === id ? { ...emp, status: newStatus } : emp));
    } catch (_) {
      alert('Status update failed');
    }
  };

  // ✅ Fixed: auth token added
  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this employee?')) return;
    try {
      await axios.delete(
        `http://localhost:5000/api/admin/employees/${id}`,
        authHeaders()
      );
      setEmployees(prev => prev.filter(emp => emp._id !== id));
    } catch (_) {
      alert('Delete failed');
    }
  };

  // ✅ Fixed: auth token added
  const handleSaveEmployee = async (values) => {
    try {
      const res = await axios.put(
        `http://localhost:5000/api/admin/employees/${selectedEmployee._id}`,
        values,
        authHeaders()
      );
      setEmployees(prev => prev.map(emp =>
        emp._id === selectedEmployee._id ? res.data.employee || res.data : emp
      ));
      setSelectedEmployee(null);
    } catch (_) {
      alert('Update failed');
    }
  };

  return (
    <div className="min-h-screen bg-slate-50/50 p-4 md:p-8">
      <div className="max-w-7xl mx-auto space-y-8">

        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div>
            <h1 className="text-3xl font-black text-slate-900 tracking-tight">Team Directory</h1>
            <p className="text-slate-500 font-medium mt-1">
              Manage your organization's <span className="text-blue-600 font-bold">{employees.length}</span> members.
            </p>
          </div>
          <button
            onClick={() => navigate('/employee/registration')}
            className="flex items-center justify-center gap-2 bg-slate-900 hover:bg-blue-600 text-white px-6 py-3.5 rounded-2xl font-bold shadow-xl shadow-slate-200 transition-all active:scale-95"
          >
            <RiUserAddLine size={20} />
            <span>Add New Employee</span>
          </button>
        </div>

        {/* Toolbar */}
        <div className="bg-white p-3 rounded-[2rem] border border-slate-200 shadow-sm flex flex-col lg:flex-row gap-4 items-center">
          <div className="relative flex-1 w-full">
            <RiSearchLine className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
            <input
              type="text"
              placeholder="Search by name, position or email..."
              value={search}
              onChange={(e) => { setSearch(e.target.value); setPage(1); }}
              className="w-full pl-12 pr-4 py-3 bg-slate-50 border-none rounded-2xl focus:ring-2 focus:ring-blue-500/20 transition-all font-medium text-slate-700 placeholder:text-slate-400"
            />
          </div>

          <div className="flex items-center gap-3 w-full lg:w-auto">
            {/* ✅ Fixed: lowercase values to match backend enum */}
            <select
              value={statusFilter}
              onChange={(e) => { setStatusFilter(e.target.value); setPage(1); }}
              className="flex-1 lg:w-40 px-4 py-3 bg-slate-50 border-none rounded-2xl font-bold text-slate-600 focus:ring-2 focus:ring-blue-500/20 appearance-none"
            >
              <option value="all">All Status</option>
              <option value="active">Active Only</option>
              <option value="inactive">Inactive</option>
            </select>

            <div className="flex bg-slate-100 p-1 rounded-xl">
              <button
                onClick={() => setViewMode('card')}
                className={`p-2 rounded-lg transition-all ${viewMode === 'card' ? 'bg-white shadow-sm text-blue-600' : 'text-slate-400 hover:text-slate-600'}`}
              >
                <RiLayoutGridFill size={20} />
              </button>
              <button
                onClick={() => setViewMode('table')}
                className={`p-2 rounded-lg transition-all ${viewMode === 'table' ? 'bg-white shadow-sm text-blue-600' : 'text-slate-400 hover:text-slate-600'}`}
              >
                <RiListUnordered size={20} />
              </button>
            </div>

            <button
              onClick={fetchEmployees}
              className="p-3 text-slate-400 hover:text-blue-600 transition-colors"
            >
              <RiRefreshLine size={22} className={loading ? 'animate-spin' : ''} />
            </button>
          </div>
        </div>

        {/* Content */}
        {loading ? (
          <div className="flex flex-col items-center justify-center py-24 gap-4">
            <RiLoader2Line className="animate-spin h-12 w-12 text-blue-600" />
            <p className="font-bold text-slate-400 animate-pulse">Syncing database...</p>
          </div>
        ) : error ? (
          <div className="bg-rose-50 border border-rose-100 p-6 rounded-3xl text-center">
            <p className="text-rose-600 font-bold mb-3">{error}</p>
            <button onClick={fetchEmployees} className="bg-rose-600 text-white px-6 py-2 rounded-xl font-bold">Try Again</button>
          </div>
        ) : employees.length === 0 ? (
          <div className="text-center py-20 bg-white rounded-[3rem] border-2 border-dashed border-slate-200">
            <p className="text-slate-400 font-bold text-lg mb-2">No results found</p>
            <p className="text-slate-400 text-sm">Try adjusting your filters or search query.</p>
          </div>
        ) : (
          <div className="animate-in fade-in slide-in-from-bottom-4 duration-700">
            {viewMode === 'card' ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
                {employees.map((emp) => (
                  <Card
                    key={emp._id}
                    {...emp}
                    id={emp._id}
                    workingDays={calculateWorkingDays(emp.joiningDate)}
                    attendanceRate={calculateAttendance(emp.joiningDate)}
                    onStatusToggle={handleStatusToggle}
                    onEdit={() => { setSelectedEmployee(emp); setModalMode('edit'); }}
                    onDelete={handleDelete}
                    onView={() => { setSelectedEmployee(emp); setModalMode('view'); }}
                  />
                ))}
              </div>
            ) : (
              <EmployeeTable
                employees={employees}
                onView={(id) => { setSelectedEmployee(employees.find(e => e._id === id)); setModalMode('view'); }}
                onEdit={(id) => { setSelectedEmployee(employees.find(e => e._id === id)); setModalMode('edit'); }}
                onDelete={handleDelete}
                onStatusToggle={handleStatusToggle}
              />
            )}
          </div>
        )}
      </div>

      <EmployeeModal
        isOpen={!!selectedEmployee}
        onClose={() => setSelectedEmployee(null)}
        employee={selectedEmployee}
        onSave={handleSaveEmployee}
        mode={modalMode}
      />
    </div>
  );
};

export default Employees;