import React, { useState } from "react";

const Settings = () => {

  const [profile, setProfile] = useState({
    name: "Admin",
    email: "admin@gmail.com",
    phone: "9999999999",
  });

  return (
    <div className="relative h-full m-1 p-6
      bg-gradient-to-br from-slate-50 to-gray-100
      flex flex-col gap-6 overflow-y-auto rounded-2xl">

      <h1 className="text-2xl font-semibold">Admin Settings</h1>

      <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">

        <div className="flex items-center gap-3 mb-5">
          <div className="bg-blue-50 text-blue-600 p-3 rounded-xl">
            <i className="ri-user-settings-line text-xl"></i>
          </div>
          <h2 className="text-lg font-semibold">Profile Settings</h2>
        </div>

        <div className="grid md:grid-cols-2 gap-4">
          <input
            className="border border-gray-300 p-3 rounded-lg"
            value={profile.name}
            onChange={(e)=>setProfile({...profile,name:e.target.value})}
            placeholder="Full Name"
          />

          <input
            className="border border-gray-300 p-3 rounded-lg"
            value={profile.email}
            onChange={(e)=>setProfile({...profile,email:e.target.value})}
            placeholder="Email Address"
          />

          <input
            className="border border-gray-300 p-3 rounded-lg md:col-span-2"
            value={profile.phone}
            onChange={(e)=>setProfile({...profile,phone:e.target.value})}
            placeholder="Phone Number"
          />
        </div>

        <button className="mt-5 bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg transition">
          Save Profile
        </button>

      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">

        <div className="flex items-center gap-3 mb-5">
          <div className="bg-red-50 text-red-600 p-3 rounded-xl">
            <i className="ri-lock-password-line text-xl"></i>
          </div>
          <h2 className="text-lg font-semibold">Security Settings</h2>
        </div>

        <p className="text-gray-500 mb-4">
          Update your account password regularly to keep your system secure.
        </p>

        <button className="bg-red-600 hover:bg-red-700 text-white px-6 py-2 rounded-lg transition">
          Change Password
        </button>

      </div>

    </div>
  );
};

export default Settings;