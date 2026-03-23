// import React, { useState } from "react";

// const Settings = () => {

//   const [profile, setProfile] = useState({
//     name: "Admin",
//     email: "admin@gmail.com",
//     phone: "9999999999",
//   });

//   return (
//     <div className="relative h-full m-1 p-6
//       bg-gradient-to-br from-slate-50 to-gray-100
//       flex flex-col gap-6 overflow-y-auto rounded-2xl">

//       <h1 className="text-2xl font-semibold">Admin Settings</h1>

//       <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">

//         <div className="flex items-center gap-3 mb-5">
//           <div className="bg-blue-50 text-blue-600 p-3 rounded-xl">
//             <i className="ri-user-settings-line text-xl"></i>
//           </div>
//           <h2 className="text-lg font-semibold">Profile Settings</h2>
//         </div>

//         <div className="grid md:grid-cols-2 gap-4">
//           <input
//             className="border border-gray-300 p-3 rounded-lg"
//             value={profile.name}
//             onChange={(e)=>setProfile({...profile,name:e.target.value})}
//             placeholder="Full Name"
//           />

//           <input
//             className="border border-gray-300 p-3 rounded-lg"
//             value={profile.email}
//             onChange={(e)=>setProfile({...profile,email:e.target.value})}
//             placeholder="Email Address"
//           />

//           <input
//             className="border border-gray-300 p-3 rounded-lg md:col-span-2"
//             value={profile.phone}
//             onChange={(e)=>setProfile({...profile,phone:e.target.value})}
//             placeholder="Phone Number"
//           />
//         </div>

//         <button className="mt-5 bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg transition">
//           Save Profile
//         </button>

//       </div>

//       <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">

//         <div className="flex items-center gap-3 mb-5">
//           <div className="bg-red-50 text-red-600 p-3 rounded-xl">
//             <i className="ri-lock-password-line text-xl"></i>
//           </div>
//           <h2 className="text-lg font-semibold">Security Settings</h2>
//         </div>

//         <p className="text-gray-500 mb-4">
//           Update your account password regularly to keep your system secure.
//         </p>

//         <button className="bg-red-600 hover:bg-red-700 text-white px-6 py-2 rounded-lg transition">
//           Change Password
//         </button>

//       </div>

//     </div>
//   );
// };

// export default Settings;



import React, { useState } from "react";
import { 
  RiUserSettingsLine, RiLockPasswordLine, RiShieldFlashLine, 
  RiMailLine, RiPhoneLine, RiGlobalLine, RiCameraSwitchLine,
  RiSave3Line, RiInformationLine
} from "react-icons/ri";

const Settings = () => {
  const [profile, setProfile] = useState({
    name: "G97 Master Admin",
    email: "superadmin@g97autohub.com",
    phone: "+91 9999999999",
    avatar: "https://ui-avatars.com/api/?name=G97+Admin&background=0D8ABC&color=fff&size=256"
  });

  const [isSaving, setIsSaving] = useState(false);

  const handleSave = () => {
    setIsSaving(true);
    // Mimicking API call
    setTimeout(() => {
      setIsSaving(false);
      alert("System Configuration Deployed!");
    }, 1200);
  };

  return (
    <div className="min-h-screen bg-slate-50/50 p-6 lg:p-10 flex flex-col gap-8">
      
      {/* Page Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-black text-slate-800 tracking-tight">Admin Console</h1>
          <p className="text-slate-500 font-medium text-sm">Configure system-wide identity and security parameters</p>
        </div>
        <button 
          onClick={handleSave}
          disabled={isSaving}
          className={`px-8 py-3 rounded-2xl font-black flex items-center gap-2 transition-all shadow-lg active:scale-95 ${
            isSaving ? "bg-slate-400 cursor-not-allowed" : "bg-blue-600 hover:bg-blue-700 text-white shadow-blue-100"
          }`}
        >
          {isSaving ? "Saving..." : <><RiSave3Line size={20} /> Save Changes</>}
        </button>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-12 gap-8 items-start">
        
        {/* Left Side: Avatar & Verification */}
        <div className="xl:col-span-4 space-y-6">
          <div className="bg-white rounded-[2.5rem] p-8 shadow-sm border border-slate-100 flex flex-col items-center">
            <div className="relative group">
              <div className="w-40 h-40 rounded-[3rem] bg-slate-100 p-1 border-4 border-white shadow-2xl">
                <img src={profile.avatar} alt="Admin" className="w-full h-full object-cover rounded-[2.8rem]" />
              </div>
              <label className="absolute bottom-2 right-2 p-3 bg-slate-900 text-white rounded-2xl shadow-xl cursor-pointer hover:bg-blue-600 transition-all border-4 border-white">
                <RiCameraSwitchLine size={20} />
                <input type="file" className="hidden" />
              </label>
            </div>
            <h2 className="mt-6 text-xl font-black text-slate-800">{profile.name}</h2>
            <div className="mt-2 px-4 py-1 bg-blue-50 text-blue-700 text-[10px] font-black uppercase tracking-[0.2em] rounded-full border border-blue-100">
              Master Access
            </div>
          </div>

          <div className="bg-slate-900 rounded-[2.5rem] p-8 text-white">
            <h3 className="text-lg font-black flex items-center gap-2 mb-4">
              <RiShieldFlashLine className="text-blue-400" /> Security Status
            </h3>
            <div className="space-y-4">
              <div className="flex items-center justify-between p-4 bg-white/5 rounded-2xl border border-white/10">
                <span className="text-xs font-bold opacity-70">MFA Status</span>
                <span className="text-[10px] font-black text-emerald-400 uppercase">Active</span>
              </div>
              <div className="flex items-center justify-between p-4 bg-white/5 rounded-2xl border border-white/10">
                <span className="text-xs font-bold opacity-70">IP Whitelisting</span>
                <span className="text-[10px] font-black text-rose-400 uppercase">Disabled</span>
              </div>
            </div>
          </div>
        </div>

        {/* Right Side: Identity & Password Forms */}
        <div className="xl:col-span-8 space-y-8">
          
          {/* Identity Form */}
          <div className="bg-white rounded-[2.5rem] p-8 shadow-sm border border-slate-100">
            <h2 className="text-lg font-black text-slate-800 mb-8 flex items-center gap-2">
              <RiUserSettingsLine className="text-blue-600" /> Identity Configuration
            </h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Admin Display Name</label>
                <div className="relative">
                  <RiUserSettingsLine className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
                  <input 
                    className="w-full pl-11 pr-5 py-4 bg-slate-50 border-2 border-slate-100 rounded-2xl text-sm font-bold focus:bg-white focus:border-blue-500 outline-none transition-all"
                    value={profile.name}
                    onChange={(e)=>setProfile({...profile, name: e.target.value})}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Master Email Address</label>
                <div className="relative opacity-60">
                  <RiMailLine className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
                  <input className="w-full pl-11 pr-5 py-4 bg-slate-100 border-2 border-slate-100 rounded-2xl text-sm font-bold outline-none cursor-not-allowed" value={profile.email} readOnly />
                </div>
              </div>

              <div className="space-y-2 md:col-span-2">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Secure Contact Number</label>
                <div className="relative">
                  <RiPhoneLine className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
                  <input 
                    className="w-full pl-11 pr-5 py-4 bg-slate-50 border-2 border-slate-100 rounded-2xl text-sm font-bold focus:bg-white focus:border-blue-500 outline-none transition-all"
                    value={profile.phone}
                    onChange={(e)=>setProfile({...profile, phone: e.target.value})}
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Security & Password Reset */}
          <div className="bg-white rounded-[2.5rem] p-8 shadow-sm border border-slate-100">
            <h2 className="text-lg font-black text-slate-800 mb-6 flex items-center gap-2">
              <RiLockPasswordLine className="text-rose-500" /> Credentials Management
            </h2>
            
            <p className="text-sm text-slate-500 font-medium mb-6 leading-relaxed">
              Updating your credentials will invalidate all other active sessions for security.
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <input 
                type="password" 
                placeholder="New Root Password"
                className="w-full px-5 py-4 bg-slate-50 border-2 border-slate-100 rounded-2xl text-sm font-bold focus:bg-white focus:border-rose-500 outline-none transition-all"
              />
              <input 
                type="password" 
                placeholder="Confirm Root Password"
                className="w-full px-5 py-4 bg-slate-50 border-2 border-slate-100 rounded-2xl text-sm font-bold focus:bg-white focus:border-rose-500 outline-none transition-all"
              />
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};

export default Settings;