import React, { useState, useEffect, useMemo } from "react";
import AssetFilter from "../../components/Asset/AssetFilter.jsx";
import axios from 'axios';
import { useAuth } from '../../contexts/AuthContext';
import Card from "../../components/Asset/Card";
import { RiAddLine, RiEdit2Line, RiDeleteBinLine, RiCloseLine, RiMacbookLine, RiStackLine, RiLoader2Line } from "react-icons/ri";

const Asset = () => {
  const { token } = useAuth();
  const [assets, setAssets] = useState([]);
  const [employees, setEmployees] = useState([]);
  const [filters, setFilters] = useState({ search: "", category: "All", status: "All" });
  const [stats, setStats] = useState({ total: 0, available: 0, assigned: 0, damaged: 0, disposed: 0 });
  const [open, setOpen] = useState(false);
  const [editingAsset, setEditingAsset] = useState(null);
  const [formData, setFormData] = useState({ name: "", category: "", serialNumber: "", purchaseDate: "", assignedTo: "", status: "Available", location: "", notes: "" });
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
      setEmployees(res.data?.employees || []);
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

  const handleSave = async () => {
    if (!formData.name || !formData.category) return alert("Name and category required");

    try {
      setSaving(true);
      let res;
      if (editingAsset) {
        res = await axios.put(`http://localhost:5000/api/admin/assets/${editingAsset._id}`, formData, {
          headers: { Authorization: `Bearer ${token}` }
        });
      } else {
        res = await axios.post('http://localhost:5000/api/admin/assets', formData, {
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
    return <div className="min-h-screen flex items-center justify-center"><RiLoader2Line className="animate-spin text-4xl text-slate-400" /></div>;
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

      {open && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center z-[100] p-4">
          <div className="bg-white rounded-[2.5rem] w-full max-w-lg p-10 shadow-2xl animate-in zoom-in duration-200">
            <div className="flex justify-between items-center mb-8">
              <div>
                <h3 className="text-2xl font-black text-slate-800 tracking-tight">{editingAsset ? "Edit Asset" : "New Asset"}</h3>
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Resource identification</p>
              </div>
              <button onClick={() => setOpen(false)} className="p-2 hover:bg-rose-50 rounded-full transition-all text-slate-400 hover:text-rose-500">
                <RiCloseLine size={28} />
              </button>
            </div>
            
            <div className="space-y-6">
              <div className="space-y-2">
                <label className="text-[11px] font-black text-slate-500 uppercase tracking-wider ml-1">Asset Name</label>
                <input 
                  className="w-full px-5 py-4 bg-slate-50 border-2 border-slate-100 rounded-2xl text-sm font-bold focus:bg-white focus:border-blue-500 outline-none transition-all"
                  value={formData.name}
                  onChange={(e) => setFormData({...formData, name: e.target.value})}
                  placeholder="e.g. MacBook Pro M3"
                />
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-[11px] font-black text-slate-500 uppercase tracking-wider ml-1">Category</label>
                  <select 
                    className="w-full px-4 py-4 bg-slate-50 border-2 border-slate-100 rounded-2xl text-sm font-bold text-slate-600 focus:bg-white outline-none"
                    value={formData.category}
                    onChange={(e) => setFormData({...formData, category: e.target.value})}
                  >
                    <option value="">Select Category</option>
                    <option value="IT Asset">IT Asset</option>
                    <option value="Furniture">Furniture</option>
                    <option value="Electronics">Electronics</option>
                    <option value="Office Supplies">Office Supplies</option>
                  </select>
                </div>
                <div className="space-y-2">
                  <label className="text-[11px] font-black text-slate-500 uppercase tracking-wider ml-1">Status</label>
                  <select 
                    className="w-full px-4 py-4 bg-slate-50 border-2 border-slate-100 rounded-2xl text-sm font-bold text-slate-600 focus:bg-white outline-none"
                    value={formData.status}
                    onChange={(e) => setFormData({...formData, status: e.target.value})}
                  >
                    <option value="Available">Available</option>
                    <option value="Assigned">Assigned</option>
                    <option value="Damaged">Damaged</option>
                    <option value="Disposed">Disposed</option>
                  </select>
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-[11px] font-black text-slate-500 uppercase tracking-wider ml-1">Assigned Employee</label>
                <select 
                  className="w-full px-5 py-4 bg-slate-50 border-2 border-slate-100 rounded-2xl text-sm font-bold focus:bg-white focus:border-blue-500 outline-none transition-all"
                  value={formData.assignedTo}
                  onChange={(e) => setFormData({...formData, assignedTo: e.target.value})}
                >
                  <option value="">No Assignment</option>
                  {employees.map((emp) => (
                    <option key={emp._id} value={emp._id}>{emp.name} ({emp.designation})</option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-[11px] font-black text-slate-500 uppercase tracking-wider ml-1">Serial Number</label>
                  <input 
                    className="w-full px-5 py-4 bg-slate-50 border-2 border-slate-100 rounded-2xl text-sm font-bold focus:bg-white outline-none transition-all"
                    value={formData.serialNumber}
                    onChange={(e) => setFormData({...formData, serialNumber: e.target.value})}
                    placeholder="Optional"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-[11px] font-black text-slate-500 uppercase tracking-wider ml-1">Purchase Date</label>
                  <input 
                    type="date"
                    className="w-full px-5 py-4 bg-slate-50 border-2 border-slate-100 rounded-2xl text-sm font-bold focus:bg-white outline-none transition-all"
                    value={formData.purchaseDate}
                    onChange={(e) => setFormData({...formData, purchaseDate: e.target.value})}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-[11px] font-black text-slate-500 uppercase tracking-wider ml-1">Location</label>
                <input 
                  className="w-full px-5 py-4 bg-slate-50 border-2 border-slate-100 rounded-2xl text-sm font-bold focus:bg-white outline-none transition-all"
                  value={formData.location}
                  onChange={(e) => setFormData({...formData, location: e.target.value})}
                  placeholder="e.g. Floor 2, Room B12"
                />
              </div>

              <div className="space-y-2">
                <label className="text-[11px] font-black text-slate-500 uppercase tracking-wider ml-1">Notes</label>
                <textarea 
                  rows={3}
                  className="w-full px-5 py-4 bg-slate-50 border-2 border-slate-100 rounded-2xl text-sm font-bold focus:bg-white outline-none transition-all resize-none"
                  value={formData.notes}
                  onChange={(e) => setFormData({...formData, notes: e.target.value})}
                  placeholder="Additional information..."
                />
              </div>
            </div>

            <div className="flex gap-4 mt-10">
              <button onClick={() => setOpen(false)} className="flex-1 py-4 font-bold text-slate-500 bg-slate-100 hover:bg-slate-200 rounded-2xl transition-all" disabled={saving}>
                Cancel
              </button>
              <button onClick={handleSave} className="flex-[2] py-4 bg-blue-600 text-white font-bold rounded-2xl shadow-xl shadow-blue-100 hover:bg-blue-700 active:scale-95 transition-all disabled:opacity-50" disabled={saving}>
                {saving ? <RiLoader2Line className="animate-spin mx-auto" /> : editingAsset ? "Update Asset" : "Create Asset"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Asset;

