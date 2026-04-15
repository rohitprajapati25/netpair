import React, { useState, useEffect, useRef } from 'react';
import { RiTimeLine, RiLockPasswordLine, RiLogoutBoxLine, RiEyeLine, RiEyeOffLine, RiShieldCheckLine } from 'react-icons/ri';

const ExpiryWarning = ({ timeLeft, onExtend, onLogout }) => {
  const [password,    setPassword]    = useState('');
  const [showPwd,     setShowPwd]     = useState(false);
  const [extending,   setExtending]   = useState(false);
  const [error,       setError]       = useState('');
  const [localTime,   setLocalTime]   = useState(timeLeft);
  const inputRef = useRef(null);

  // Sync localTime with prop
  useEffect(() => { setLocalTime(timeLeft); }, [timeLeft]);

  // Countdown inside the modal — independent of parent timers
  useEffect(() => {
    if (localTime <= 0) { onLogout(); return; }
    const t = setInterval(() => {
      setLocalTime(prev => {
        if (prev <= 1) { clearInterval(t); onLogout(); return 0; }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(t);
  }, []); // run once on mount

  // Focus password input
  useEffect(() => {
    setTimeout(() => inputRef.current?.focus(), 100);
  }, []);

  const fmt = (s) => {
    const m = Math.floor(s / 60);
    const sec = s % 60;
    return `${m}:${String(sec).padStart(2, '0')}`;
  };

  const pct = Math.min(100, Math.round((localTime / 300) * 100)); // 300s = 5min warning window
  const isUrgent = localTime < 60;

  const handleExtend = async (e) => {
    e.preventDefault();
    if (!password.trim()) { setError('Please enter your password'); return; }
    setError('');
    setExtending(true);
    try {
      const result = await onExtend(password);
      if (!result?.success) {
        setError(result?.error || 'Incorrect password. Please try again.');
        setPassword('');
        inputRef.current?.focus();
      }
    } catch {
      setError('Something went wrong. Please try again.');
    } finally {
      setExtending(false);
    }
  };

  return (
    // Backdrop — blocks all interaction behind it
    <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4"
      style={{ backdropFilter: 'blur(4px)', backgroundColor: 'rgba(15,23,42,0.7)' }}>

      <div className="bg-white rounded-2xl w-full max-w-md shadow-2xl overflow-hidden animate-fade-in">

        {/* Progress bar */}
        <div className="h-1.5 bg-slate-100">
          <div
            className={`h-full transition-all duration-1000 ${isUrgent ? 'bg-red-500' : 'bg-amber-500'}`}
            style={{ width: `${pct}%` }}
          />
        </div>

        {/* Header */}
        <div className={`px-6 py-5 border-b border-slate-100 flex items-center gap-3 ${isUrgent ? 'bg-red-50' : 'bg-amber-50'}`}>
          <div className={`p-2.5 rounded-xl ${isUrgent ? 'bg-red-100 text-red-600' : 'bg-amber-100 text-amber-600'}`}>
            <RiTimeLine size={20} />
          </div>
          <div>
            <h2 className="font-black text-slate-900 text-base">Session Expiring Soon</h2>
            <p className="text-xs text-slate-500 mt-0.5">Re-enter your password to continue</p>
          </div>
          {/* Countdown */}
          <div className={`ml-auto text-2xl font-black tabular-nums ${isUrgent ? 'text-red-600' : 'text-amber-600'}`}>
            {fmt(localTime)}
          </div>
        </div>

        {/* Body */}
        <form onSubmit={handleExtend} className="p-6 space-y-4">
          <p className="text-sm text-slate-600">
            Your session will expire in <span className={`font-black ${isUrgent ? 'text-red-600' : 'text-amber-600'}`}>{fmt(localTime)}</span>.
            Enter your password to extend it.
          </p>

          {/* Password field */}
          <div>
            <label className="block text-[10px] font-black text-slate-400 uppercase tracking-wider mb-1.5">
              Password
            </label>
            <div className="relative">
              <RiLockPasswordLine className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
              <input
                ref={inputRef}
                type={showPwd ? 'text' : 'password'}
                value={password}
                onChange={e => { setPassword(e.target.value); setError(''); }}
                placeholder="Enter your password"
                className={`w-full pl-10 pr-10 py-3 border rounded-xl text-sm font-medium outline-none transition-all ${
                  error
                    ? 'border-red-300 bg-red-50 focus:ring-2 focus:ring-red-200'
                    : 'border-slate-200 bg-slate-50 focus:ring-2 focus:ring-blue-100 focus:border-blue-400'
                }`}
              />
              <button type="button" onClick={() => setShowPwd(v => !v)}
                className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600">
                {showPwd ? <RiEyeOffLine size={16} /> : <RiEyeLine size={16} />}
              </button>
            </div>
            {error && (
              <p className="text-[11px] text-red-500 font-semibold mt-1.5 flex items-center gap-1">
                <span className="w-1 h-1 rounded-full bg-red-500 shrink-0" />
                {error}
              </p>
            )}
          </div>

          {/* Actions */}
          <div className="flex gap-3 pt-1">
            <button type="submit" disabled={extending || !password.trim()}
              className="flex-1 flex items-center justify-center gap-2 py-3 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl text-sm transition-all disabled:opacity-50 shadow-md">
              {extending
                ? <><div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" /> Extending...</>
                : <><RiShieldCheckLine size={16} /> Extend Session</>}
            </button>
            <button type="button" onClick={onLogout}
              className="flex items-center justify-center gap-2 px-4 py-3 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-xl text-sm transition-all">
              <RiLogoutBoxLine size={16} /> Logout
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ExpiryWarning;
