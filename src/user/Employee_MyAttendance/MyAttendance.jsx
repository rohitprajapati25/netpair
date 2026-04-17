import { useState, useEffect, useCallback } from "react";
import { useAuth } from "../../contexts/AuthContext";
import axios from "axios";
import {
  RiCalendarCheckLine, RiTimeLine, RiMapPinLine,
  RiRefreshLine, RiCheckboxCircleLine, RiCloseCircleLine,
  RiLoginBoxLine, RiLogoutBoxLine, RiLoader4Line,
} from "react-icons/ri";
import { SkeletonHeader, SkeletonStats, SkeletonTable } from "../../components/Skeletons";
import { BASE_URL as BASE } from "../../config/api";
const SHIFT_START = { h: 9,  m: 0  }; // 09:00
const SHIFT_END   = { h: 18, m: 0  }; // 18:00
const SHIFT_START_MINS = SHIFT_START.h * 60 + SHIFT_START.m;
const SHIFT_END_MINS   = SHIFT_END.h   * 60 + SHIFT_END.m;

const fmtShift = ({ h, m }) =>
  `${String(h).padStart(2,"0")}:${String(m).padStart(2,"0")}`;

const useClock = () => {
  const [time, setTime] = useState(new Date());
  useEffect(() => {
    const t = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(t);
  }, []);
  return time;
};

// ── Status badge ──────────────────────────────────────────────────────────────
const StatusBadge = ({ status }) => {
  const styles = {
    Present:  "bg-green-100 text-green-700 border-green-200",
    Absent:   "bg-red-100 text-red-700 border-red-200",
    Late:     "bg-yellow-100 text-yellow-700 border-yellow-200",
    "Half Day": "bg-orange-100 text-orange-700 border-orange-200",
    Leave:    "bg-blue-100 text-blue-700 border-blue-200",
  };
  return (
    <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold border ${styles[status] || "bg-slate-100 text-slate-700"}`}>
      {status}
    </span>
  );
};

// ── Check In/Out Widget ───────────────────────────────────────────────────────
const CheckInWidget = ({ todayRecord, onCheckIn, onCheckOut, loading }) => {
  const now = useClock();
  const [workMode, setWorkMode] = useState("Office");
  const [notes, setNotes] = useState("");

  const hasCheckedIn  = !!todayRecord?.checkIn;
  const hasCheckedOut = !!todayRecord?.checkOut;

  const timeStr = now.toLocaleTimeString("en-US", {
    hour: "2-digit", minute: "2-digit", second: "2-digit",
  });
  const dateStr = now.toLocaleDateString("en-US", {
    weekday: "long", day: "numeric", month: "long", year: "numeric",
  });

  // Shift progress (0–100%) based on current time between 09:00–18:00
  const nowMins = now.getHours() * 60 + now.getMinutes();
  const shiftProgress = Math.min(100, Math.max(0,
    Math.round(((nowMins - SHIFT_START_MINS) / (SHIFT_END_MINS - SHIFT_START_MINS)) * 100)
  ));

  // Working hours display
  const getWorkingTime = () => {
    if (!todayRecord?.checkIn) return null;
    const [h1, m1] = todayRecord.checkIn.split(":").map(Number);
    const endTime = todayRecord.checkOut
      ? (() => { const [h2, m2] = todayRecord.checkOut.split(":").map(Number); return h2 * 60 + m2; })()
      : now.getHours() * 60 + now.getMinutes();
    const diff = endTime - (h1 * 60 + m1);
    if (diff <= 0) return "0h 0m";
    return `${Math.floor(diff / 60)}h ${diff % 60}m`;
  };

  return (
    <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
      {/* Header gradient */}
      <div className={`p-5 lg:p-6 text-white ${
        hasCheckedOut
          ? "bg-gradient-to-r from-slate-600 to-slate-800"
          : hasCheckedIn
          ? "bg-gradient-to-r from-emerald-500 to-teal-600"
          : "bg-gradient-to-r from-blue-600 to-indigo-700"
      }`}>
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <p className="text-white/70 text-xs font-semibold uppercase tracking-widest mb-1">{dateStr}</p>
            <p className="text-3xl lg:text-4xl font-black tabular-nums tracking-tight">{timeStr}</p>
            {hasCheckedIn && (
              <div className="flex items-center gap-3 mt-2 flex-wrap">
                <span className="text-white/80 text-sm">
                  In: <span className="font-bold text-white">{todayRecord.checkIn}</span>
                </span>
                {hasCheckedOut && (
                  <span className="text-white/80 text-sm">
                    Out: <span className="font-bold text-white">{todayRecord.checkOut}</span>
                  </span>
                )}
                <span className="text-white/80 text-sm">
                  Worked: <span className="font-bold text-white">{getWorkingTime()}</span>
                </span>
              </div>
            )}
            {/* Shift progress bar */}
            <div className="mt-3">
              <div className="flex items-center justify-between mb-1">
                <span className="text-white/60 text-[10px] font-semibold">{fmtShift(SHIFT_START)}</span>
                <span className="text-white/80 text-[10px] font-bold">{shiftProgress}% of shift</span>
                <span className="text-white/60 text-[10px] font-semibold">{fmtShift(SHIFT_END)}</span>
              </div>
              <div className="h-1.5 bg-white/20 rounded-full overflow-hidden">
                <div
                  className="h-full bg-white/70 rounded-full transition-all duration-1000"
                  style={{ width: `${shiftProgress}%` }}
                />
              </div>
            </div>
          </div>

          {/* Status pill */}
          <div className="shrink-0">
            {hasCheckedOut ? (
              <div className="flex items-center gap-2 bg-white/20 px-4 py-2 rounded-xl">
                <RiCheckboxCircleLine size={18} />
                <span className="font-bold text-sm">Day Complete</span>
              </div>
            ) : hasCheckedIn ? (
              <div className="flex items-center gap-2 bg-white/20 px-4 py-2 rounded-xl">
                <div className="w-2 h-2 bg-white rounded-full animate-pulse" />
                <span className="font-bold text-sm">
                  {todayRecord?.status === "Late" ? "Checked In (Late)" : "Checked In"}
                </span>
              </div>
            ) : (
              <div className="flex items-center gap-2 bg-white/20 px-4 py-2 rounded-xl">
                <RiTimeLine size={18} />
                <span className="font-bold text-sm">Not Checked In</span>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Action area */}
      <div className="p-5">
        {hasCheckedOut ? (
          // Day complete state
          <div className="flex items-center justify-center gap-3 py-4 text-slate-500">
            <RiCheckboxCircleLine size={24} className="text-emerald-500" />
            <div>
              <p className="font-bold text-slate-700">Attendance recorded for today</p>
              <p className="text-sm text-slate-400">
                {todayRecord.checkIn} → {todayRecord.checkOut} · {getWorkingTime()} worked
              </p>
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            {/* Work mode selector — only before check-in */}
            {!hasCheckedIn && (
              <div>
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 block">
                  Work Mode
                </label>
                <div className="flex gap-2 flex-wrap">
                  {["Office", "WFH", "Remote"].map(mode => (
                    <button
                      key={mode}
                      onClick={() => setWorkMode(mode)}
                      className={`flex items-center gap-1.5 px-3 py-2 rounded-xl border text-xs font-bold transition-all ${
                        workMode === mode
                          ? "bg-blue-600 text-white border-blue-600 shadow-md"
                          : "bg-white text-slate-600 border-slate-200 hover:border-blue-300"
                      }`}
                    >
                      <RiMapPinLine size={13} />
                      {mode}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Notes */}
            {!hasCheckedIn && (
              <div>
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1.5 block">
                  Notes <span className="normal-case font-normal">(optional)</span>
                </label>
                <input
                  type="text"
                  value={notes}
                  onChange={e => setNotes(e.target.value)}
                  placeholder="e.g. Working from client site..."
                  className="w-full px-4 py-2.5 border border-slate-200 rounded-xl text-sm outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                />
              </div>
            )}

            {/* Action buttons */}
            <div className="flex gap-3">
              {!hasCheckedIn ? (
                <button
                  onClick={() => onCheckIn(workMode, notes)}
                  disabled={loading}
                  className="flex-1 flex items-center justify-center gap-2 py-3 bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 text-white font-bold rounded-xl shadow-md transition-all disabled:opacity-50 text-sm"
                >
                  {loading
                    ? <RiLoader4Line className="animate-spin" size={18} />
                    : <RiLoginBoxLine size={18} />
                  }
                  {loading ? "Checking In..." : "Check In"}
                </button>
              ) : (
                <button
                  onClick={() => onCheckOut(notes)}
                  disabled={loading}
                  className="flex-1 flex items-center justify-center gap-2 py-3 bg-gradient-to-r from-red-500 to-rose-600 hover:from-red-600 hover:to-rose-700 text-white font-bold rounded-xl shadow-md transition-all disabled:opacity-50 text-sm"
                >
                  {loading
                    ? <RiLoader4Line className="animate-spin" size={18} />
                    : <RiLogoutBoxLine size={18} />
                  }
                  {loading ? "Checking Out..." : "Check Out"}
                </button>
              )}
            </div>

            {/* Late warning — shown before check-in if past shift start */}
            {!hasCheckedIn && (() => {
              const nowMins = now.getHours() * 60 + now.getMinutes();
              return nowMins > SHIFT_START_MINS;
            })() && (
              <p className="text-xs text-amber-600 bg-amber-50 border border-amber-200 rounded-xl px-3 py-2 flex items-center gap-2">
                <RiTimeLine size={14} />
                It's past {fmtShift(SHIFT_START)} — your attendance will be marked as <strong>Late</strong>
              </p>
            )}

            {/* Early checkout warning — shown after check-in if before shift end */}
            {hasCheckedIn && !hasCheckedOut && (() => {
              const nowMins = now.getHours() * 60 + now.getMinutes();
              return nowMins < SHIFT_END_MINS;
            })() && (
              <p className="text-xs text-blue-600 bg-blue-50 border border-blue-200 rounded-xl px-3 py-2 flex items-center gap-2">
                <RiTimeLine size={14} />
                Shift ends at {fmtShift(SHIFT_END)} — checking out now will be recorded as early departure
              </p>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

// ── Main Page ─────────────────────────────────────────────────────────────────
const MyAttendance = () => {
  const { token } = useAuth();

  const [attendance, setAttendance]   = useState([]);
  const [todayRecord, setTodayRecord] = useState(null);
  const [stats, setStats]             = useState({ present: 0, absent: 0, late: 0, total: 0 });
  const [loading, setLoading]         = useState(true);
  const [actionLoading, setActionLoading] = useState(false);
  const [toast, setToast]             = useState(null);
  const [dateFilter, setDateFilter]   = useState({
    from: new Date(new Date().setDate(1)).toISOString().split("T")[0],
    to:   new Date().toISOString().split("T")[0],
  });

  const showToast = (msg, type = "success") => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 3500);
  };

  // ── Fetch today's status ──────────────────────────────────────────────────
  const fetchToday = useCallback(async () => {
    try {
      const res = await axios.get(`${BASE}/api/employees/attendance/today`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setTodayRecord(res.data.record || null);
    } catch {
      setTodayRecord(null);
    }
  }, [token]);

  // ── Fetch history ─────────────────────────────────────────────────────────
  const fetchHistory = useCallback(async () => {
    try {
      const params = new URLSearchParams({
        dateFrom: dateFilter.from,
        dateTo:   dateFilter.to,
        limit:    "100",
      });
      const res = await axios.get(`${BASE}/api/employees/attendance?${params}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const records = res.data.records || [];
      setAttendance(records);
      setStats({
        present: records.filter(r => r.status === "Present").length,
        absent:  records.filter(r => r.status === "Absent").length,
        late:    records.filter(r => r.status === "Late").length,
        total:   records.length,
      });
    } catch {
      setAttendance([]);
    }
  }, [token, dateFilter]);

  const fetchAll = useCallback(async () => {
    setLoading(true);
    await Promise.all([fetchToday(), fetchHistory()]);
    setLoading(false);
  }, [fetchToday, fetchHistory]);

  useEffect(() => { if (token) fetchAll(); }, [fetchAll]);

  // ── Check In ──────────────────────────────────────────────────────────────
  const handleCheckIn = async (workMode, notes) => {
    setActionLoading(true);
    try {
      const res = await axios.post(
        `${BASE}/api/employees/attendance/checkin`,
        { workMode, notes },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      showToast(res.data.message || "Checked in successfully!");
      setTodayRecord(res.data.record);
      await fetchHistory();
    } catch (err) {
      showToast(err.response?.data?.message || "Check-in failed", "error");
    } finally {
      setActionLoading(false);
    }
  };

  // ── Check Out ─────────────────────────────────────────────────────────────
  const handleCheckOut = async (notes) => {
    setActionLoading(true);
    try {
      const res = await axios.post(
        `${BASE}/api/employees/attendance/checkout`,
        { notes },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      showToast(res.data.message || "Checked out successfully!");
      setTodayRecord(res.data.record);
      await fetchHistory();
    } catch (err) {
      showToast(err.response?.data?.message || "Check-out failed", "error");
    } finally {
      setActionLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="h-48 bg-slate-200 rounded-2xl animate-pulse" />
        <SkeletonStats count={4} />
        <SkeletonTable rows={6} />
      </div>
    );
  }

  return (
    <div className="space-y-6">

      {/* Toast */}
      {toast && (
        <div className={`fixed bottom-6 right-6 z-50 flex items-center gap-3 px-5 py-3.5 rounded-2xl shadow-2xl font-semibold text-sm text-white animate-fade-in ${
          toast.type === "error" ? "bg-red-600" : "bg-emerald-600"
        }`}>
          {toast.type === "error"
            ? <RiCloseCircleLine size={18} />
            : <RiCheckboxCircleLine size={18} />
          }
          {toast.msg}
        </div>
      )}

      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl lg:text-3xl font-black text-slate-800">My Attendance</h1>
          <p className="text-slate-500 text-sm mt-0.5">Track your daily attendance</p>
        </div>
        <button
          onClick={fetchAll}
          className="flex items-center gap-2 px-4 py-2.5 bg-white border border-slate-200 hover:border-slate-300 text-slate-700 font-semibold rounded-xl shadow-sm text-sm transition-all"
        >
          <RiRefreshLine size={15} /> Refresh
        </button>
      </div>

      {/* ── Check In/Out Widget ── */}
      <CheckInWidget
        todayRecord={todayRecord}
        onCheckIn={handleCheckIn}
        onCheckOut={handleCheckOut}
        loading={actionLoading}
      />

      {/* ── Stats ── */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 lg:gap-5">
        {[
          { label: "Total Days", value: stats.total,   bg: "from-indigo-500 to-blue-600",   icon: "ri-calendar-check-line" },
          { label: "Present",    value: stats.present, bg: "from-green-500 to-emerald-600",  icon: "ri-checkbox-circle-fill" },
          { label: "Late",       value: stats.late,    bg: "from-yellow-500 to-orange-500",  icon: "ri-time-line" },
          { label: "Absent",     value: stats.absent,  bg: "from-red-500 to-rose-600",       icon: "ri-close-circle-fill" },
        ].map((s, i) => (
          <div key={i} className={`relative overflow-hidden rounded-2xl text-white p-4 lg:p-5 bg-gradient-to-r ${s.bg} shadow-md hover:shadow-xl hover:-translate-y-0.5 transition-all duration-200 flex items-center justify-between`}>
            <div>
              <p className="text-xs opacity-90 font-semibold">{s.label}</p>
              <h2 className="text-2xl lg:text-3xl font-black mt-1">{s.value}</h2>
            </div>
            <div className="bg-white/20 p-2.5 lg:p-3 rounded-xl text-xl lg:text-2xl">
              <i className={s.icon}></i>
            </div>
          </div>
        ))}
      </div>

      {/* ── Date Filter ── */}
      <div className="bg-white p-4 lg:p-5 rounded-2xl border border-slate-200 shadow-sm">
        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-3">Filter History</p>
        <div className="flex flex-col sm:flex-row items-end gap-3">
          <div className="flex-1 w-full">
            <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1.5 block">From</label>
            <input type="date" value={dateFilter.from}
              onChange={e => setDateFilter(p => ({ ...p, from: e.target.value }))}
              className="w-full p-2.5 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none text-sm"
            />
          </div>
          <div className="flex-1 w-full">
            <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1.5 block">To</label>
            <input type="date" value={dateFilter.to}
              onChange={e => setDateFilter(p => ({ ...p, to: e.target.value }))}
              className="w-full p-2.5 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none text-sm"
            />
          </div>
          <button
            onClick={fetchHistory}
            className="w-full sm:w-auto px-5 py-2.5 bg-blue-600 text-white rounded-xl font-bold hover:bg-blue-700 transition-all text-sm"
          >
            Apply
          </button>
        </div>
      </div>

      {/* ── History Table ── */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="px-5 py-4 border-b border-slate-100 flex items-center gap-2">
          <RiCalendarCheckLine className="text-slate-500" />
          <h3 className="font-bold text-slate-800">Attendance History</h3>
          <span className="ml-auto px-2.5 py-0.5 bg-blue-100 text-blue-700 text-xs font-bold rounded-full">
            {attendance.length} records
          </span>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full min-w-[560px]">
            <thead className="bg-slate-50 border-b border-slate-200">
              <tr>
                {["Date", "Check In", "Check Out", "Hours", "Mode", "Status", "Remarks"].map(h => (
                  <th key={h} className="px-4 py-3 text-left text-[10px] font-black text-slate-500 uppercase tracking-wider">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {attendance.length === 0 ? (
                <tr>
                  <td colSpan="7" className="px-6 py-12 text-center text-slate-400 text-sm">
                    No records for selected period
                  </td>
                </tr>
              ) : attendance.map(record => {
                const mins = record.workingHours || 0;
                const hoursDisplay = mins > 0 ? `${Math.floor(mins / 60)}h ${mins % 60}m` : "—";
                return (
                  <tr key={record._id} className="hover:bg-slate-50 transition-colors">
                    <td className="px-4 py-3 text-sm font-semibold text-slate-700">
                      {new Date(record.date).toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric" })}
                    </td>
                    <td className="px-4 py-3 text-sm text-slate-600 font-mono">{record.checkIn || "—"}</td>
                    <td className="px-4 py-3 text-sm text-slate-600 font-mono">{record.checkOut || "—"}</td>
                    <td className="px-4 py-3 text-sm font-bold text-slate-700">{hoursDisplay}</td>
                    <td className="px-4 py-3 text-sm text-slate-500">{record.workMode || "—"}</td>
                    <td className="px-4 py-3"><StatusBadge status={record.status} /></td>
                    <td className="px-4 py-3 text-sm text-slate-500 max-w-[140px] truncate">{record.notes || "—"}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
};

export default MyAttendance;
