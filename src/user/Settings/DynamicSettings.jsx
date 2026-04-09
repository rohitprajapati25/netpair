import React, { useState, useEffect } from "react";
import { useAuth } from "../../contexts/AuthContext";
import axios from 'axios';
import { RiUserSettingsLine, RiLockPasswordLine, RiShieldCheckLine, RiNotification3Line, RiPaletteLine, RiCheckLine, RiCloseLine } from "react-icons/ri";

const DynamicSettings = () => {
  const { user, token, updateUser } = useAuth();
  const [profile, setProfile] = useState({ name: '', phone: '', avatar: '' });
  const [preferences, setPreferences] = useState({ theme: 'light', notifications: true, mfa: false });
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [message, setMessage] = useState('');

  // Load profile data
  useEffect(() => {
    if (token) loadProfile();
  }, [token]);

  const loadProfile = async () => {
    try {
      const res = await axios.get('http://localhost:5000/api/admin/profile', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setProfile({
        name: res.data.user.name,
        phone: res.data.user.phone || '',
        avatar: res.data.user.avatar || ''
      });
    } catch (err) {
      console.error('Load profile error:', err);
    }
  };

  const handleProfileUpdate = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await axios.put('http://localhost:5000/api/admin/profile', profile, {
        headers: { Authorization: `Bearer ${token}` }
      });
      updateUser(res.data.user);
      setMessage('Profile updated successfully!');
    } catch (err) {
      setMessage('Update failed. Try again.');
    } finally {
      setLoading(false);
    }
  };

  const handlePasswordChange = async (e) => {
    e.preventDefault();
    if (newPassword !== confirmPassword) {
      setMessage('Passwords do not match');
      return;
    }
    setLoading(true);
    try {
      await axios.post('http://localhost:5000/api/admin/password', {
        currentPassword,
        newPassword
      }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setMessage('Password changed successfully!');
      setShowPasswordModal(false);
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
    } catch (err) {
      setMessage('Password change failed');
    } finally {
      setLoading(false);
    }
  };

  const updatePreference = (key, value) => {
    const newPrefs = { ...preferences, [key]: value };
    setPreferences(newPrefs);
    // Save to localStorage or API
    localStorage.setItem('settings', JSON.stringify(newPrefs));
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50/30 p-6 lg:p-10">
      <div className="max-w-4xl mx-auto space-y-8">
        
        {/* Header */}
        <div className="flex items-center gap-4">
          <div className="p-4 bg-white rounded-2xl shadow-lg border">
            <RiUserSettingsLine className="text-3xl text-blue-600" />
          </div>
          <div>
            <h1 className="text-3xl font-black text-slate-800">Settings Console</h1>
            <p className="text-slate-500">Configure profile, security, and preferences</p>
          </div>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          
          {/* Profile Section */}
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-white rounded-3xl p-8 shadow-xl border border-slate-100">
              <h2 className="text-2xl font-black mb-6 flex items-center gap-3 text-slate-800">
                <RiUserSettingsLine /> Profile Settings
              </h2>
              
              <form onSubmit={handleProfileUpdate} className="space-y-6">
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-bold text-slate-700 mb-2">Full Name</label>
                    <input
                      type="text"
                      className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
                      value={profile.name}
                      onChange={(e) => setProfile({...profile, name: e.target.value})}
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-slate-700 mb-2">Phone Number</label>
                    <input
                      type="tel"
                      className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
                      value={profile.phone}
                      onChange={(e) => setProfile({...profile, phone: e.target.value})}
                    />
                  </div>
                </div>
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 disabled:opacity-50 text-white font-bold py-4 px-8 rounded-xl shadow-lg transition-all"
                >
                  {loading ? 'Saving...' : 'Update Profile'}
                </button>
              </form>
              {message && (
                <div className="mt-4 p-4 rounded-xl bg-emerald-50 border border-emerald-200">
                  <p className="font-semibold text-emerald-800">{message}</p>
                </div>
              )}
            </div>
          </div>

          {/* Quick Settings Sidebar */}
          <div className="space-y-6">
            
            {/* Security Quick Actions */}
            <div className="bg-white rounded-3xl p-6 shadow-xl border border-slate-100">
              <h3 className="font-black text-lg mb-6 flex items-center gap-2 text-slate-800">
                <RiLockPasswordLine className="text-rose-500" />
                Security
              </h3>
              <div className="space-y-4">
                <button
                  onClick={() => setShowPasswordModal(true)}
                  className="w-full flex items-center gap-3 p-4 bg-gradient-to-r from-rose-500 to-red-600 text-white font-semibold rounded-xl hover:from-rose-600 hover:to-red-700 transition-all shadow-lg"
                >
                  <RiLockPasswordLine />
                  Change Password
                </button>
                
                <div className="flex items-center gap-3 p-4 bg-emerald-50 rounded-xl border border-emerald-200">
                  <RiShieldCheckLine className="text-emerald-600" />
                  <div>
                    <p className="font-semibold text-slate-800 text-sm">2FA Status</p>
                    <p className="text-xs text-slate-500">Disabled</p>
                  </div>
                  <div className="ml-auto">
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input type="checkbox" className="sr-only peer" />
                      <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-emerald-300 rounded-full peer peer-checked:after:translate-x-full rtl:peer-focus:ring-emerald-300 peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-emerald-600"></div>
                    </label>
                  </div>
                </div>
              </div>
            </div>

            {/* Preferences */}
            <div className="bg-white rounded-3xl p-6 shadow-xl border border-slate-100">
              <h3 className="font-black text-lg mb-6 flex items-center gap-2 text-slate-800">
                <RiNotification3Line />
                Preferences
              </h3>
              <div className="space-y-4 text-sm">
                <div className="flex items-center justify-between">
                  <span>Dark Mode</span>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input type="checkbox" className="sr-only peer" checked={preferences.theme === 'dark'} onChange={(e) => updatePreference('theme', e.target.checked ? 'dark' : 'light')} />
                    <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full after:content-[''] after:absolute after:top-0.5 after:start-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                  </label>
                </div>
                <div className="flex items-center justify-between">
                  <span>Email Notifications</span>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input type="checkbox" className="sr-only peer" defaultChecked />
                    <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full after:content-[''] after:absolute after:top-0.5 after:start-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-emerald-600"></div>
                  </label>
                </div>
              </div>
            </div>

            {/* Logout */}
            <div className="bg-rose-50 rounded-3xl p-6 shadow-lg border border-rose-100">
              <button className="w-full flex items-center gap-3 text-rose-700 font-bold py-4 px-6 rounded-xl bg-white hover:bg-rose-50 border-2 border-rose-200 hover:border-rose-300 transition-all">
                <RiCloseLine />
                Logout All Sessions
              </button>
            </div>
          </div>
        </div>

        {/* Password Change Modal */}
        {showPasswordModal && (
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50" onClick={() => setShowPasswordModal(false)}>
            <div className="bg-white rounded-3xl p-8 max-w-md w-full max-h-[90vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
              <h2 className="text-2xl font-black mb-6 flex items-center gap-3 text-slate-800">
                <RiLockPasswordLine className="text-rose-500" />
                Change Password
              </h2>
              
              <form onSubmit={handlePasswordChange} className="space-y-4">
                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-2">Current Password</label>
                  <input
                    type="password"
                    className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-rose-500 focus:border-transparent outline-none transition-all"
                    value={currentPassword}
                    onChange={(e) => setCurrentPassword(e.target.value)}
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-2">New Password</label>
                  <input
                    type="password"
                    className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    minLength={8}
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-2">Confirm Password</label>
                  <input
                    type="password"
                    className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    required
                  />
                </div>
                <div className="flex gap-3 pt-2">
                  <button
                    type="submit"
                    disabled={loading}
                    className="flex-1 bg-gradient-to-r from-rose-600 to-red-600 hover:from-rose-700 hover:to-red-700 disabled:opacity-50 text-white font-bold py-3 px-6 rounded-xl shadow-lg transition-all"
                  >
                    {loading ? 'Changing...' : 'Update Password'}
                  </button>
                  <button
                    type="button"
                    onClick={() => setShowPasswordModal(false)}
                    className="flex-1 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold py-3 px-6 rounded-xl transition-all"
                  >
                    Cancel
                  </button>
                </div>
              </form>
              {message && (
                <div className={`mt-4 p-4 rounded-xl ${message.includes('success') ? 'bg-emerald-50 border border-emerald-200 text-emerald-800' : 'bg-rose-50 border border-rose-200 text-rose-800'}`}>
                  {message}
                </div>
              )}
            </div>
          </div>
        )}

      </div>
    </div>
  );
};

export default DynamicSettings;

