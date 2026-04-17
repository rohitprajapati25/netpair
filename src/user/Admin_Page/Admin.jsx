import React, { useState, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { SkeletonHeader, SkeletonFilter, SkeletonGrid, SkeletonTable } from '../../components/Skeletons';
import axios from 'axios';
import API_URL from '../../config/api';

const Admin = () => {
  const { token } = useAuth();
  const [admins, setAdmins] = useState([]);
  const [loading, setLoading] = useState(true);
  const [viewMode, setViewMode] = useState('card');

  useEffect(() => {
    const fetchAdmins = async () => {
      try {
        const res = await axios.get(`${API_URL}/admins`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        setAdmins(res.data.admins || []);
      } catch (err) {
        console.error('Admin fetch error:', err);
      } finally {
        setLoading(false);
      }
    };
    if (token) fetchAdmins();
  }, [token]);

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50/50 p-6 lg:p-10">
        <div className="max-w-7xl mx-auto space-y-8">
          <SkeletonHeader />
          <SkeletonFilter />
          {viewMode === 'card' ? <SkeletonGrid count={8} /> : <SkeletonTable rows={6} />}
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50/50 p-6 lg:p-10">
      <div className="max-w-7xl mx-auto space-y-8">
        <h1 className="text-3xl font-black text-slate-800 tracking-tight">Admin Panel</h1>
        <p className="text-slate-500 font-medium">Super administrator dashboard</p>
        
        <div className="bg-white p-6 rounded-[2rem] border border-slate-100 shadow-sm">
          <h2 className="text-xl font-bold mb-6">Admin Team ({admins.length})</h2>
          {viewMode === 'card' ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {admins.map((admin, i) => {
                const gradients = [
                  "from-indigo-500 to-blue-600",
                  "from-emerald-500 to-teal-600",
                  "from-purple-500 to-pink-600",
                  "from-orange-500 to-red-500",
                ];
                const bg = gradients[i % gradients.length];
                return (
                  <div key={admin._id} className={`relative overflow-hidden rounded-2xl text-white p-5 bg-gradient-to-r ${bg} shadow-md hover:shadow-xl hover:-translate-y-0.5 transition-all duration-200`}>
                    <div className="flex items-center gap-4 mb-4">
                      <div className="w-12 h-12 bg-white/20 backdrop-blur-sm rounded-xl flex items-center justify-center text-white font-bold text-lg">
                        {admin.name?.charAt(0)?.toUpperCase()}
                      </div>
                      <div>
                        <h3 className="font-bold text-white">{admin.name}</h3>
                        <p className="text-sm text-white/80">{admin.email}</p>
                      </div>
                    </div>
                    <span className={`px-3 py-1 rounded-full text-xs font-bold bg-white/20 text-white`}>
                      {admin.status}
                    </span>
                  </div>
                );
              })}
            </div>
          ) : (
            <table className="w-full">
              <thead>
                <tr className="bg-slate-50 border-b">
                  <th className="p-4 text-left font-bold text-slate-700">Name</th>
                  <th className="p-4 text-left font-bold text-slate-700">Email</th>
                  <th className="p-4 text-left font-bold text-slate-700">Role</th>
                  <th className="p-4 text-left font-bold text-slate-700">Status</th>
                </tr>
              </thead>
              <tbody>
                {admins.map(admin => (
                  <tr key={admin._id} className="border-b hover:bg-slate-50">
                    <td className="p-4 font-medium">{admin.name}</td>
                    <td className="p-4 text-slate-600">{admin.email}</td>
                    <td className="p-4"><span className="bg-blue-100 text-blue-800 px-2 py-1 rounded text-xs font-bold">Admin</span></td>
                    <td className="p-4">
                      <span className={`px-3 py-1 rounded-full text-xs font-bold ${
                        admin.status === 'active' ? 'bg-emerald-100 text-emerald-800' : 'bg-slate-100 text-slate-600'
                      }`}>
                        {admin.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
          
          <div className="mt-8 flex gap-3">
            <button 
              onClick={() => setViewMode(viewMode === 'card' ? 'table' : 'card')}
              className="px-6 py-3 border font-bold rounded-xl transition-all flex-1 text-center"
            >
              {viewMode === 'card' ? 'Table View' : 'Card View'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Admin;
