import React, { useState, useEffect, useMemo } from "react";
import AssetFilter from "../../components/Asset/AssetFilter.jsx";
import AssetModal from "../../components/Asset/AssetModal.jsx";
import { assetSchema } from "../../schemas/assetValidation.js";
import { useAuth } from '../../contexts/AuthContext';
import axios from 'axios';
import Card from "../../components/Asset/Card";
import { SkeletonHeader, SkeletonFilter, SkeletonStats, SkeletonGrid } from "../../components/Skeletons";
import { RiAddLine, RiEdit2Line, RiDeleteBinLine, RiCloseLine, RiMacbookLine, RiStackLine } from "react-icons/ri";


const Asset = () => {
  const { token } = useAuth();
  const [assets, setAssets] = useState([]);
  const [employees, setEmployees] = useState([]);
  const [filters, setFilters] = useState({ search: "", category: "All", status: "All" });
  const [stats, setStats] = useState({ total: 0, available: 0, assigned: 0, damaged: 0, disposed: 0 });
  const [open, setOpen] = useState(false);
  const [formData, setFormData] = useState({});
  const [editingAsset, setEditingAsset] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (token) {
      fetchAssets();
      fetchEmployees();
      fetchStats();
    }
  }, [token, filters]);

  const filteredAssets = useMemo(() => {
    return assets.filter(asset => {
      if (filters.search && !asset.name?.toLowerCase().includes(filters.search.toLowerCase()) && 
          !asset.assetId?.toLowerCase().includes(filters.search.toLowerCase())) return false;
      if (filters.category !== "All" && asset.category !== filters.category) return false;
      if (filters.status !== "All" && asset.status !== filters.status) return false;
      return true;
    });
  }, [assets, filters]);

  const fetchAssets = async () => {
    try {
      const res = await axios.get('http://localhost:5000/api/admin/assets', {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (res.data.success) {
        setAssets(res.data.assets || []);
      }
    } catch (error) {
      console.error('Assets fetch error:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchEmployees = async () => {
    try {
      const res = await axios.get('http://localhost:5000/api/admin/employees', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setEmployees((res.data?.employees || []).filter(emp => emp && emp.name));
    } catch (error) {
      console.error('Employees fetch error:', error);
    }
  };

  const fetchStats = async () => {
    try {
      const res = await axios.get('http://localhost:5000/api/admin/assets/stats', {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (res.data.success) {
        setStats(res.data.stats);
      }
    } catch (error) {
      console.error('Stats fetch error:', error);
    }
  };

  const handleAdd = () => {
    setEditingAsset(null);
    setFormData({ name: "", category: "", serialNumber: "", purchaseDate: "", assignedTo: "", status: "Available", location: "", notes: "" });
    setOpen(true);
  };

  const handleEdit = (asset) => {
    setEditingAsset(asset);
    setFormData({
      name: asset.name,
      category: asset.category,
      serialNumber: asset.serialNumber || '',
      purchaseDate: asset.purchaseDate ? asset.purchaseDate.split('T')[0] : '',
      assignedTo: asset.assignedTo?._id || '',
      status: asset.status,
      location: asset.location || '',
      notes: asset.notes || ''
    });
    setOpen(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to remove this asset?")) {
      try {
        await axios.delete(`http://localhost:5000/api/admin/assets/${id}`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        fetchAssets();
        fetchStats();
      } catch (error) {
        alert('Delete failed: ' + (error.response?.data?.message || error.message));
      }
    }
  };

  const handleSave = async (values) => {
    try {
      setSaving(true);
      let res;
      if (editingAsset) {
        res = await axios.put(`http://localhost:5000/api/admin/assets/${editingAsset._id}`, values, {
          headers: { Authorization: `Bearer ${token}` }
        });
      } else {
        res = await axios.post('http://localhost:5000/api/admin/assets', values, {
          headers: { Authorization: `Bearer ${token}` }
        });
      }

      if (res.data.success) {
        fetchAssets();
        fetchStats();
        setOpen(false);
      }
    } catch (error) {
      alert(error.response?.data?.message || 'Save failed');
    } finally {
      setSaving(false);
    }
  };

  const getStatusStyle = (status) => {
    switch (status) {
      case "Assigned": return "bg-emerald-100 text-emerald-800 border-emerald-200";
      case "Available": return "bg-blue-100 text-blue-800 border-blue-200";
      case "Damaged": return "bg-rose-100 text-rose-800 border-rose-200";
      case "Disposed": return "bg-gray-100 text-gray-800 border-gray-200";
      default: return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  const cardData = [
    { title: "Total Assets", tot: stats.total, bg: "from-indigo-600 to-blue-700" },
    { title: "Assigned", tot: stats.assigned, bg: "from-emerald-500 to-teal-600" },
    { title: "Available", tot: stats.available, bg: "from-amber-400 to-orange-500" },
    { title: "Damaged", tot: stats.damaged, bg: "from-rose-500 to-red-600" }
  ];

  if (loading) {

    return (
      <div className="min-h-screen bg-slate-50/50 p-6 lg:p-10">
        <div className="max-w-7xl mx-auto space-y-8">
          <SkeletonHeader />
          <SkeletonFilter />
          <SkeletonStats count={4} />
          <SkeletonGrid count={8} />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50/50 p-6 lg:p-10 flex flex-col gap-8">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-black text-slate-800 tracking-tight">Asset Inventory</h1>
          <p className="text-slate-500 font-medium text-sm">Track and manage hardware & company resources</p>
        </div>
        <button 
          onClick={handleAdd} 
          className="bg-blue-600 text-white px-6 py-3 rounded-2xl hover:bg-blue-700 shadow-lg shadow-blue-100 transition-all font-bold flex items-center gap-2 active:scale-95"
        >
          <RiAddLine size={24} /> Add Asset
        </button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {cardData.map((d, i) => (
          <Card key={i} title={d.title} tot={d.tot} bg={d.bg} />
        ))}
      </div>

      <AssetFilter filters={filters} setFilters={setFilters} totalResults={filteredAssets.length} />

      <div className="bg-white rounded-[2rem] border border-slate-100 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-slate-50/50 text-[10px] font-black uppercase tracking-widest text-slate-400 border-b border-slate-100">
                <th className="px-8 py-5">Asset Details</th>
                <th className="px-8 py-5 text-center">Category</th>
                <th className="px-8 py-5 text-center">Assignee</th>
                <th className="px-8 py-5 text-center">Status</th>
                <th className="px-8 py-5 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {filteredAssets.map((asset) => (
                <tr key={asset._id} className="hover:bg-blue-50/30 transition-colors">
                  <td className="px-8 py-5">
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 rounded-xl bg-slate-100 flex items-center justify-center text-slate-500 border border-slate-200">
                        <RiMacbookLine size={20} />
                      </div>
                      <div>
                        <p className="font-bold text-slate-700 text-sm leading-tight">{asset.name}</p>
                        <p className="text-[11px] text-slate-400 font-bold uppercase tracking-tighter mt-0.5">{asset.assetId}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-8 py-5 text-center">
                    <span className="inline-flex items-center gap-1 text-xs font-bold text-slate-600 bg-slate-100 px-3 py-1 rounded-lg">
                      <RiStackLine size={14} className="text-blue-500" /> {asset.category}
                    </span>
                  </td>
                  <td className="px-8 py-5 text-center font-semibold text-slate-600 text-sm">
                    {asset.assignedTo?.name || <span className="text-slate-300 italic">—</span>}
                  </td>
                  <td className="px-8 py-5 text-center">
                    <span className={`px-3 py-1.5 rounded-xl text-[10px] font-black border uppercase tracking-wider ${getStatusStyle(asset.status)}`}>
                      {asset.status}
                    </span>
                  </td>
                  <td className="px-8 py-5 text-right">
                    <div className="flex justify-end gap-2">
                      <button onClick={() => handleEdit(asset)} className="p-2.5 text-blue-600 hover:bg-blue-50 rounded-xl shadow-sm border border-blue-100">
                        <RiEdit2Line size={18} />
                      </button>
                      <button onClick={() => handleDelete(asset._id)} className="p-2.5 text-rose-500 hover:bg-rose-50 rounded-xl shadow-sm border border-rose-100">
                        <RiDeleteBinLine size={18} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <AssetModal
        isOpen={open}
        onClose={() => setOpen(false)}
        initialData={editingAsset}
        onSave={handleSave}
        employees={employees}
        saving={saving}
      />
    </div>
  );
};


export default Asset;

