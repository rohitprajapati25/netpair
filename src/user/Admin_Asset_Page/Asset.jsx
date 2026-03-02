import React, { useState } from "react";
import Card from "../../components/Asset/Card";

const Asset = () => {
  const [assets, setAssets] = useState([
    { id: "AST-101", name: "Laptop", category: "IT Asset", assignedTo: "Rohit", status: "Assigned" },
    { id: "AST-102", name: "Mouse", category: "IT Asset", assignedTo: "", status: "Available" },
  ]);

  const [open, setOpen] = useState(false);
  const [editingAsset, setEditingAsset] = useState(null);
  const [formData, setFormData] = useState({ id: "", name: "", category: "", assignedTo: "", status: "Available" });

  const cardData = [
    { title: "Total Assets", tot: assets.length, bg: "from-indigo-500 to-blue-600" },
    { title: "Assigned", tot: assets.filter(a => a.status === "Assigned").length, bg: "from-emerald-500 to-green-600" },
    { title: "Available", tot: assets.filter(a => a.status === "Available").length, bg: "from-amber-400 to-orange-500" },
    { title: "Damaged", tot: "0", bg: "from-rose-500 to-red-600" },
  ];

    const handleAdd = () => {
    setEditingAsset(null);
    setFormData({ id: `AST-${Math.floor(100 + Math.random() * 900)}`, name: "", category: "", assignedTo: "", status: "Available" });
    setOpen(true);
  };

  
  const handleEdit = (asset) => {
    setEditingAsset(asset);
    setFormData(asset);
    setOpen(true);
  };

  c
  const handleSave = () => {
    if (!formData.name || !formData.category) return alert("Please fill details");

    if (editingAsset) {
      setAssets(assets.map(a => a.id === editingAsset.id ? formData : a));
    } else {
      setAssets([...assets, formData]);
    }
    setOpen(false);
  };

  return (
    <div className="relative h-full m-1 p-6 bg-gradient-to-br from-slate-50 to-gray-100 flex flex-col gap-6 overflow-y-auto rounded-2xl">
      
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <h2 className="text-2xl font-semibold">Asset Management</h2>
        <button onClick={handleAdd} className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition flex items-center gap-2">
          <i className="ri-add-line text-lg"></i> Add Asset
        </button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 w-full p-1">
        {cardData.map((d, i) => (
          <Card key={i} title={d.title} tot={d.tot} bg={d.bg} />
        ))}
      </div>

      <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-x-auto">
        <table className="w-full min-w-[850px]">
          <thead className="bg-gray-50 text-gray-600 text-sm">
            <tr>
              <th className="px-6 py-4 text-left font-semibold">Asset ID</th>
              <th className="px-6 py-4 text-left font-semibold">Asset Name</th>
              <th className="px-6 py-4 text-center font-semibold">Category</th>
              <th className="px-6 py-4 text-center font-semibold">Assigned To</th>
              <th className="px-6 py-4 text-center font-semibold">Status</th>
              <th className="px-6 py-4 text-center">Action</th>
            </tr>
          </thead>
          <tbody className="text-sm">
            {assets.map((asset) => (
              <tr key={asset.id} className="border-t hover:bg-blue-50/40 transition">
                <td className="px-6 py-4 font-medium">{asset.id}</td>
                <td className="px-6 py-4">{asset.name}</td>
                <td className="px-6 py-4 text-center">{asset.category}</td>
                <td className="px-6 py-4 text-center">{asset.assignedTo || "—"}</td>
                <td className="px-6 py-4 text-center">
                  <span className={`px-3 py-1 rounded-full text-xs font-semibold ${asset.status === 'Assigned' ? 'bg-green-100 text-green-700' : 'bg-blue-100 text-blue-700'}`}>
                    {asset.status}
                  </span>
                </td>
                <td className="px-6 py-4 text-center">
                  <i onClick={() => handleEdit(asset)} className="ri-edit-2-line cursor-pointer text-blue-600 hover:scale-125 transition text-lg"></i>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {open && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl w-full max-w-md p-6 shadow-2xl">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-xl font-bold">{editingAsset ? "Edit Asset" : "Add New Asset"}</h3>
              <i onClick={() => setOpen(false)} className="ri-close-line text-2xl cursor-pointer hover:text-red-500"></i>
            </div>
            
            <div className="space-y-4">
              <div>
                <label className="text-xs font-bold text-gray-500 uppercase">Asset Name</label>
                <input 
                  className="w-full border border-gray-300 p-2.5 rounded-lg outline-none focus:border-blue-500 mt-1"
                  value={formData.name}
                  onChange={(e) => setFormData({...formData, name: e.target.value})}
                  placeholder="e.g. MacBook Pro"
                />
              </div>
              
              <div>
                <label className="text-xs font-bold text-gray-500 uppercase">Category</label>
                <select 
                  className="w-full border border-gray-300 p-2.5 rounded-lg outline-none mt-1"
                  value={formData.category}
                  onChange={(e) => setFormData({...formData, category: e.target.value})}
                >
                  <option value="">Select Category</option>
                  <option value="IT Asset">IT Asset</option>
                  <option value="Furniture">Furniture</option>
                  <option value="Electronics">Electronics</option>
                </select>
              </div>

              <div>
                <label className="text-xs font-bold text-gray-500 uppercase">Assigned To</label>
                <input 
                  className="w-full border border-gray-300 p-2.5 rounded-lg outline-none mt-1"
                  value={formData.assignedTo}
                  onChange={(e) => setFormData({...formData, assignedTo: e.target.value})}
                  placeholder="Employee Name"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-gray-500 uppercase">Status</label>
                <select 
                  className="w-full border border-gray-300 p-2.5 rounded-lg outline-none mt-1"
                  value={formData.status}
                  onChange={(e) => setFormData({...formData, status: e.target.value})}
                >
                  <option value="Available">Available</option>
                  <option value="Assigned">Assigned</option>
                  <option value="Damaged">Damaged</option>
                </select>
              </div>
            </div>

            <div className="flex gap-3 mt-8">
              <button onClick={() => setOpen(false)} className="flex-1 py-2.5 border border-gray-300 rounded-lg font-medium hover:bg-gray-50">Cancel</button>
              <button onClick={handleSave} className="flex-1 py-2.5 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition">
                {editingAsset ? "Update Asset" : "Save Asset"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Asset;