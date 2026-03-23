// import React, { useState } from "react";
// import Card from "../../components/Asset/Card";

// const Asset = () => {
//   const [assets, setAssets] = useState([
//     { id: "AST-101", name: "Laptop", category: "IT Asset", assignedTo: "Rohit", status: "Assigned" },
//     { id: "AST-102", name: "Mouse", category: "IT Asset", assignedTo: "", status: "Available" },
//   ]);

//   const [open, setOpen] = useState(false);
//   const [editingAsset, setEditingAsset] = useState(null);
//   const [formData, setFormData] = useState({ id: "", name: "", category: "", assignedTo: "", status: "Available" });

//   const cardData = [
//     { title: "Total Assets", tot: assets.length, bg: "from-indigo-500 to-blue-600" },
//     { title: "Assigned", tot: assets.filter(a => a.status === "Assigned").length, bg: "from-emerald-500 to-green-600" },
//     { title: "Available", tot: assets.filter(a => a.status === "Available").length, bg: "from-amber-400 to-orange-500" },
//     { title: "Damaged", tot: "0", bg: "from-rose-500 to-red-600" },
//   ];

//     const handleAdd = () => {
//     setEditingAsset(null);
//     setFormData({ id: `AST-${Math.floor(100 + Math.random() * 900)}`, name: "", category: "", assignedTo: "", status: "Available" });
//     setOpen(true);
//   };

  
//   const handleEdit = (asset) => {
//     setEditingAsset(asset);
//     setFormData(asset);
//     setOpen(true);
//   };

  
//   const handleSave = () => {
//     if (!formData.name || !formData.category) return alert("Please fill details");

//     if (editingAsset) {
//       setAssets(assets.map(a => a.id === editingAsset.id ? formData : a));
//     } else {
//       setAssets([...assets, formData]);
//     }
//     setOpen(false);
//   };

//   return (
//     <div className="relative h-full m-1 p-6 bg-gradient-to-br from-slate-50 to-gray-100 flex flex-col gap-6 overflow-y-auto rounded-2xl">
      
//       <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
//         <h2 className="text-2xl font-semibold">Asset Management</h2>
//         <button onClick={handleAdd} className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition flex items-center gap-2">
//           <i className="ri-add-line text-lg"></i> Add Asset
//         </button>
//       </div>

//       <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 w-full p-1">
//         {cardData.map((d, i) => (
//           <Card key={i} title={d.title} tot={d.tot} bg={d.bg} />
//         ))}
//       </div>

//       <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-x-auto">
//         <table className="w-full min-w-[850px]">
//           <thead className="bg-gray-50 text-gray-600 text-sm">
//             <tr>
//               <th className="px-6 py-4 text-left font-semibold">Asset ID</th>
//               <th className="px-6 py-4 text-left font-semibold">Asset Name</th>
//               <th className="px-6 py-4 text-center font-semibold">Category</th>
//               <th className="px-6 py-4 text-center font-semibold">Assigned To</th>
//               <th className="px-6 py-4 text-center font-semibold">Status</th>
//               <th className="px-6 py-4 text-center">Action</th>
//             </tr>
//           </thead>
//           <tbody className="text-sm">
//             {assets.map((asset) => (
//               <tr key={asset.id} className="border-t hover:bg-blue-50/40 transition">
//                 <td className="px-6 py-4 font-medium">{asset.id}</td>
//                 <td className="px-6 py-4">{asset.name}</td>
//                 <td className="px-6 py-4 text-center">{asset.category}</td>
//                 <td className="px-6 py-4 text-center">{asset.assignedTo || "—"}</td>
//                 <td className="px-6 py-4 text-center">
//                   <span className={`px-3 py-1 rounded-full text-xs font-semibold ${asset.status === 'Assigned' ? 'bg-green-100 text-green-700' : 'bg-blue-100 text-blue-700'}`}>
//                     {asset.status}
//                   </span>
//                 </td>
//                 <td className="px-6 py-4 text-center">
//                   <i onClick={() => handleEdit(asset)} className="ri-edit-2-line cursor-pointer text-blue-600 hover:scale-125 transition text-lg"></i>
//                 </td>
//               </tr>
//             ))}
//           </tbody>
//         </table>
//       </div>

//       {open && (
//         <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50 p-4">
//           <div className="bg-white rounded-2xl w-full max-w-md p-6 shadow-2xl">
//             <div className="flex justify-between items-center mb-6">
//               <h3 className="text-xl font-bold">{editingAsset ? "Edit Asset" : "Add New Asset"}</h3>
//               <i onClick={() => setOpen(false)} className="ri-close-line text-2xl cursor-pointer hover:text-red-500"></i>
//             </div>
            
//             <div className="space-y-4">
//               <div>
//                 <label className="text-xs font-bold text-gray-500 uppercase">Asset Name</label>
//                 <input 
//                   className="w-full border border-gray-300 p-2.5 rounded-lg outline-none focus:border-blue-500 mt-1"
//                   value={formData.name}
//                   onChange={(e) => setFormData({...formData, name: e.target.value})}
//                   placeholder="e.g. MacBook Pro"
//                 />
//               </div>
              
//               <div>
//                 <label className="text-xs font-bold text-gray-500 uppercase">Category</label>
//                 <select 
//                   className="w-full border border-gray-300 p-2.5 rounded-lg outline-none mt-1"
//                   value={formData.category}
//                   onChange={(e) => setFormData({...formData, category: e.target.value})}
//                 >
//                   <option value="">Select Category</option>
//                   <option value="IT Asset">IT Asset</option>
//                   <option value="Furniture">Furniture</option>
//                   <option value="Electronics">Electronics</option>
//                 </select>
//               </div>

//               <div>
//                 <label className="text-xs font-bold text-gray-500 uppercase">Assigned To</label>
//                 <input 
//                   className="w-full border border-gray-300 p-2.5 rounded-lg outline-none mt-1"
//                   value={formData.assignedTo}
//                   onChange={(e) => setFormData({...formData, assignedTo: e.target.value})}
//                   placeholder="Employee Name"
//                 />
//               </div>

//               <div>
//                 <label className="text-xs font-bold text-gray-500 uppercase">Status</label>
//                 <select 
//                   className="w-full border border-gray-300 p-2.5 rounded-lg outline-none mt-1"
//                   value={formData.status}
//                   onChange={(e) => setFormData({...formData, status: e.target.value})}
//                 >
//                   <option value="Available">Available</option>
//                   <option value="Assigned">Assigned</option>
//                   <option value="Damaged">Damaged</option>
//                 </select>
//               </div>
//             </div>

//             <div className="flex gap-3 mt-8">
//               <button onClick={() => setOpen(false)} className="flex-1 py-2.5 border border-gray-300 rounded-lg font-medium hover:bg-gray-50">Cancel</button>
//               <button onClick={handleSave} className="flex-1 py-2.5 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition">
//                 {editingAsset ? "Update Asset" : "Save Asset"}
//               </button>
//             </div>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// };

// export default Asset;


import React, { useState } from "react";
import Card from "../../components/Asset/Card";
import { RiAddLine, RiEdit2Line, RiDeleteBinLine, RiCloseLine, RiMacbookLine, RiStackLine } from "react-icons/ri";

const Asset = () => {
  const [assets, setAssets] = useState([
    { id: "AST-101", name: "Laptop", category: "IT Asset", assignedTo: "Rohit", status: "Assigned" },
    { id: "AST-102", name: "Mouse", category: "IT Asset", assignedTo: "", status: "Available" },
  ]);

  const [open, setOpen] = useState(false);
  const [editingAsset, setEditingAsset] = useState(null);
  const [formData, setFormData] = useState({ id: "", name: "", category: "", assignedTo: "", status: "Available" });

  const cardData = [
    { title: "Total Assets", tot: assets.length, bg: "from-indigo-600 to-blue-700" },
    { title: "Assigned", tot: assets.filter(a => a.status === "Assigned").length, bg: "from-emerald-500 to-teal-600" },
    { title: "Available", tot: assets.filter(a => a.status === "Available").length, bg: "from-amber-400 to-orange-500" },
    { title: "Damaged", tot: assets.filter(a => a.status === "Damaged").length, bg: "from-rose-500 to-red-600" },
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

  const handleDelete = (id) => {
    if (window.confirm("Are you sure you want to remove this asset?")) {
      setAssets(assets.filter(a => a.id !== id));
    }
  };

  const handleSave = () => {
    if (!formData.name || !formData.category) return alert("Please fill details");
    
    if (editingAsset) {
      setAssets(assets.map(a => a.id === editingAsset.id ? formData : a));
    } else {
      setAssets([...assets, formData]);
    }
    setOpen(false);
  };

  const getStatusStyle = (status) => {
    switch (status) {
      case "Assigned": return "bg-emerald-50 text-emerald-700 border-emerald-100";
      case "Available": return "bg-blue-50 text-blue-700 border-blue-100";
      case "Damaged": return "bg-rose-50 text-rose-700 border-rose-100";
      default: return "bg-gray-50 text-gray-700 border-gray-100";
    }
  };

  return (
    <div className="min-h-screen bg-slate-50/50 p-6 lg:p-10 flex flex-col gap-8">
      
      {/* Header Section */}
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

      {/* Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {cardData.map((d, i) => (
          <Card key={i} title={d.title} tot={d.tot} bg={d.bg} />
        ))}
      </div>

      {/* Table Container */}
      <div className="bg-white rounded-[2rem] border border-slate-100 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
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
              {assets.map((asset) => (
                <tr key={asset.id} className="group hover:bg-blue-50/30 transition-colors">
                  <td className="px-8 py-5">
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 rounded-xl bg-slate-100 flex items-center justify-center text-slate-500 border border-slate-200">
                        <RiMacbookLine size={20} />
                      </div>
                      <div>
                        <p className="font-bold text-slate-700 text-sm leading-tight">{asset.name}</p>
                        <p className="text-[11px] text-slate-400 font-bold uppercase tracking-tighter mt-0.5">{asset.id}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-8 py-5 text-center">
                    <span className="inline-flex items-center gap-1 text-xs font-bold text-slate-600 bg-slate-100 px-3 py-1 rounded-lg">
                      <RiStackLine size={14} className="text-blue-500" /> {asset.category}
                    </span>
                  </td>
                  <td className="px-8 py-5 text-center font-semibold text-slate-600 text-sm">
                    {asset.assignedTo || <span className="text-slate-300 italic">—</span>}
                  </td>
                  <td className="px-8 py-5 text-center">
                    <span className={`px-3 py-1.5 rounded-xl text-[10px] font-black border uppercase tracking-wider ${getStatusStyle(asset.status)}`}>
                      {asset.status}
                    </span>
                  </td>
                  <td className="px-8 py-5 text-right">
                    <div className="flex justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button onClick={() => handleEdit(asset)} className="p-2.5 text-blue-600 hover:bg-white rounded-xl shadow-sm border border-transparent hover:border-blue-100 transition-all">
                        <RiEdit2Line size={18} />
                      </button>
                      <button onClick={() => handleDelete(asset.id)} className="p-2.5 text-rose-500 hover:bg-white rounded-xl shadow-sm border border-transparent hover:border-rose-100 transition-all">
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

      {/* Asset Modal */}
      {open && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center z-[100] p-4">
          <div className="bg-white rounded-[2.5rem] w-full max-w-md p-10 shadow-2xl animate-in zoom-in duration-200">
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
                    <option value="">Select</option>
                    <option value="IT Asset">IT Asset</option>
                    <option value="Furniture">Furniture</option>
                    <option value="Electronics">Electronics</option>
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
                  </select>
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-[11px] font-black text-slate-500 uppercase tracking-wider ml-1">Assign to Employee</label>
                <input 
                  className="w-full px-5 py-4 bg-slate-50 border-2 border-slate-100 rounded-2xl text-sm font-bold focus:bg-white outline-none transition-all"
                  value={formData.assignedTo}
                  onChange={(e) => setFormData({...formData, assignedTo: e.target.value})}
                  placeholder="Enter employee name"
                />
              </div>
            </div>

            <div className="flex gap-4 mt-10">
              <button onClick={() => setOpen(false)} className="flex-1 py-4 font-bold text-slate-500 bg-slate-100 hover:bg-slate-200 rounded-2xl transition-all">Cancel</button>
              <button onClick={handleSave} className="flex-[2] py-4 bg-blue-600 text-white font-bold rounded-2xl shadow-xl shadow-blue-100 hover:bg-blue-700 active:scale-95 transition-all">
                {editingAsset ? "Update Configuration" : "Finalize Asset"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Asset;