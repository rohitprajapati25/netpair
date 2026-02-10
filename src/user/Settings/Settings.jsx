import React, { useState } from "react";

const Settings = () => {
  const [profile, setProfile] = useState({
    name: "Admin",
    email: "admin@gmail.com",
    phone: "9999999999",
  });

  const [system, setSystem] = useState({
    company: "My Company",
    hours: "9 AM - 6 PM",
    checkin: "09:30 AM",
  });

  return (
    <div className="relative h-[100%] m-1 pb-10 pt-5 w-auto bg-white p-6 flex flex-col items-start justify-strat gap-3 min-h-full overflow-y-auto rounded-xl">
      <h1 className="text-2xl font-bold mb-6">Admin Settings</h1>

      <div className="bg-white p-5 border-2 border-gray-400 rounded-xl shadow mb-5">
        <h2 className="font-semibold mb-3">Profile Settings</h2>
        <input
          className="border-2 border-gray-400 p-2 w-full mb-2 rounded"
          value={profile.name}
          onChange={(e) => setProfile({ ...profile, name: e.target.value })}
          placeholder="Name"
        />
        <input
          className="border-2 border-gray-400 p-2 w-full mb-2 rounded"
          value={profile.email}
          onChange={(e) => setProfile({ ...profile, email: e.target.value })}
          placeholder="Email"
        />
        <input
          className="border-2 border-gray-400 p-2 w-full mb-2 rounded"
          value={profile.phone}
          onChange={(e) => setProfile({ ...profile, phone: e.target.value })}
          placeholder="Phone"
        />
        <button className="bg-blue-600 text-white px-4 py-2 rounded">
          Save Profile
        </button>
      </div>

      <div className="bg-white p-5 rounded-xl shadow border-2 border-gray-400">
        <h2 className="font-semibold mb-3">Security</h2>
        <button className="bg-red-600 text-white px-4 py-2 rounded">
          Change Password
        </button>
      </div>
    </div>
  );
};

export default Settings;
