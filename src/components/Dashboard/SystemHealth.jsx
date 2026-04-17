import React, { useState, useEffect, useCallback } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import axios from 'axios';
import {
  RiHeartPulseLine, RiDatabase2Line, RiCpuLine, RiServerLine,
  RiTimeLine, RiAlertLine, RiRefreshLine, RiArrowRightLine,
  RiWifiLine, RiCheckboxCircleLine, RiCloseCircleLine
} from 'react-icons/ri';
import { useNavigate } from 'react-router-dom';
import API_URL from '../../config/api';

// ── helpers ───────────────────────────────────────────────────────────────────
const STATUS = {
  healthy:  { bg: 'bg-emerald-500', text: 'text-emerald-600', light: 'bg-emerald-50  border-emerald-200' },
  degraded: { bg: 'bg-amber-500',   text: 'text-amber-600',   light: 'bg-amber-50   border-amber-200'   },
  critical: { bg: 'bg-red-500',     text: 'text-red-600',     light: 'bg-red-50     border-red-200'     },
};

const ProgressBar = ({ value, max = 100 }) => {
  const pct = Math.min(100, Math.round((value / max) * 100));
  const color = pct > 85 ? 'bg-red-500' : pct > 65 ? 'bg-amber-500' : 'bg-blue-500';
  return (
    <div className="flex items-center gap-2">
      <div className="flex-1 bg-slate-100 rounded-full h-1.5 overflow-hidden">
        <div className={`h-full rounded-full transition-all duration-700 ${color}`} style={{ width: `${pct}%` }} />
      </div>
      <span className="text-[10px] font-black text-slate-600 w-8 text-right">{pct}%</span>
    </div>
  );
};

// ── component ─────────────────────────────────────────────────────────────────
const SystemHealth = () => {
  const { token, user } = useAuth();
  const navigate  = useNavigate();
  const role = user?.role?.toLowerCase();
  const isSuperAdmin = role === 'superadmin';

  const [health,     setHealth]     = useState(null);
  const [loading,    setLoading]    = useState(true);
  const [lastUpdate, setLastUpdate] = useState(null);
  const [expanded,   setExpanded]   = useState(false);

  const fetchHealth = useCallback(async () => {
    if (!token) return;
    const startTime = Date.now();

    try {
      // ── Try dedicated endpoint first ────────────────────────────────────
      const res = await axios.get(
        `${API_URL}/admin/dashboard/health`,
        { headers: { Authorization: `Bearer ${token}` }, timeout: 5000 }
      );
      if (res.data.success) {
        setHealth(res.data.health);
        setLastUpdate(new Date());
        setLoading(false);
        return;
      }
    } catch {
      // Endpoint not available yet — build health from existing APIs
    }

    // ── Fallback: derive health from existing working endpoints ──────────
    try {
      const apiStart = Date.now();

      const [statsRes, auditRes] = await Promise.allSettled([
        axios.get(`${API_URL}/admin/dashboard/stats`,
          { headers: { Authorization: `Bearer ${token}` }, timeout: 5000 }),
        isSuperAdmin
          ? axios.get(`${API_URL}/admin/audit-logs?limit=5&severity=HIGH&dateRange=today`,
              { headers: { Authorization: `Bearer ${token}` }, timeout: 5000 })
          : Promise.resolve({ data: { logs: [], total: 0 } }),
      ]);

      const apiLatency = Date.now() - apiStart;
      const dbOk       = statsRes.status === 'fulfilled';
      const stats      = dbOk ? (statsRes.value.data.stats || {}) : {};
      const alerts     = auditRes.status === 'fulfilled'
        ? (auditRes.value.data.logs || [])
        : [];
      const alertCount = auditRes.status === 'fulfilled'
        ? (auditRes.value.data.total || 0)
        : 0;

      // Score
      let score = 100;
      if (!dbOk)            score -= 40;
      if (apiLatency > 500) score -= 15;
      if (alertCount > 10)  score -= 10;
      if (alertCount > 50)  score -= 20;
      score = Math.max(0, score);

      const status = score >= 80 ? 'healthy' : score >= 50 ? 'degraded' : 'critical';

      setHealth({
        status,
        score,
        uptime:   '—',
        database: { healthy: dbOk, status: dbOk ? 'connected' : 'error', latency: dbOk ? Math.round(apiLatency / 2) : -1, name: 'ims' },
        memory:   { heapUsed: 0, heapTotal: 0, heapPercent: 0, systemPercent: 0 },
        cpu:      { model: 'Server CPU', cores: 0, percent: 0 },
        api:      { avgResponseTime: apiLatency, node: 'Node.js', platform: 'server', pid: '—' },
        alerts:   {
          total24h: alertCount,
          recent:   alerts.map((a) => ({
            action:   a.action,
            resource: a.resource,
            details:  a.details,
            severity: a.severity,
            user:     a.user?.name || 'System',
            time:     a.timestamp,
          })),
        },
        data: { totalEmployees: stats.totalEmployees || 0 },
        _fallback: true,
      });
      setLastUpdate(new Date());
    } catch (err) {
      console.error('Health fetch error:', err);
    } finally {
      setLoading(false);
    }
  }, [token]);

  // Auto-refresh every 30s
  useEffect(() => {
    fetchHealth();
    const t = setInterval(fetchHealth, 30000);
    return () => clearInterval(t);
  }, [fetchHealth]);

  if (loading) {
    return (
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-5 animate-pulse">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-8 h-8 bg-slate-200 rounded-xl" />
          <div className="h-4 bg-slate-200 rounded w-32" />
          <div className="ml-auto h-5 bg-slate-200 rounded-full w-20" />
        </div>
        <div className="grid grid-cols-4 gap-2">
          {[...Array(4)].map((_, i) => <div key={i} className="h-14 bg-slate-200 rounded-xl" />)}
        </div>
      </div>
    );
  }

  if (!health) return null;

  const sc = STATUS[health.status] || STATUS.healthy;

  return (
    <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">

      {/* ── Header ── */}
      <div
        className="flex items-center gap-3 px-5 py-4 cursor-pointer hover:bg-slate-50 transition-colors select-none"
        onClick={() => setExpanded(v => !v)}
      >
        <div className={`p-2 rounded-xl border ${sc.light}`}>
          <RiHeartPulseLine size={16} className={sc.text} />
        </div>

        <div className="flex-1 min-w-0">
          <h3 className="font-bold text-slate-900 text-sm">System Health</h3>
          <p className="text-[10px] text-slate-400">
            {health._fallback ? 'Derived from API · ' : ''}
            {lastUpdate
              ? `Updated ${lastUpdate.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })}`
              : 'Loading...'}
          </p>
        </div>

        {/* Score badge */}
        <div className={`flex items-center gap-1.5 px-3 py-1 rounded-full border text-xs font-black ${sc.light} ${sc.text}`}>
          <div className={`w-2 h-2 rounded-full ${sc.bg} ${health.status === 'healthy' ? 'animate-pulse' : ''}`} />
          {health.status.toUpperCase()} · {health.score}%
        </div>

        <RiArrowRightLine size={14} className={`text-slate-400 transition-transform duration-200 ${expanded ? 'rotate-90' : ''}`} />
      </div>

      {/* ── Quick metrics bar ── */}
      <div className="grid grid-cols-4 border-t border-slate-100 divide-x divide-slate-100">
        {[
          {
            icon: RiDatabase2Line,
            label: 'Database',
            value: health.database.healthy
              ? (health.database.latency >= 0 ? `${health.database.latency}ms` : 'OK')
              : 'DOWN',
            ok: health.database.healthy,
          },
          {
            icon: RiWifiLine,
            label: 'API',
            value: `${health.api.avgResponseTime}ms`,
            ok: health.api.avgResponseTime < 500,
          },
          {
            icon: RiAlertLine,
            label: 'Alerts',
            value: health.alerts.total24h,
            ok: health.alerts.total24h === 0,
          },
          {
            icon: RiCheckboxCircleLine,
            label: 'Status',
            value: health.status === 'healthy' ? 'OK' : health.status === 'degraded' ? 'WARN' : 'ERR',
            ok: health.status === 'healthy',
          },
        ].map((m, i) => (
          <div key={i} className="flex flex-col items-center py-3 gap-1">
            <m.icon size={14} className={m.ok ? 'text-emerald-500' : 'text-red-500'} />
            <span className={`text-xs font-black ${m.ok ? 'text-slate-800' : 'text-red-600'}`}>{m.value}</span>
            <span className="text-[9px] text-slate-400 uppercase tracking-wider">{m.label}</span>
          </div>
        ))}
      </div>

      {/* ── Expanded details ── */}
      {expanded && (
        <div className="border-t border-slate-100 p-5 space-y-4">

          {/* DB */}
          <div className="flex items-center justify-between p-3 rounded-xl border bg-slate-50">
            <div className="flex items-center gap-2">
              <RiDatabase2Line size={14} className="text-blue-500" />
              <span className="text-xs font-semibold text-slate-700">Database</span>
            </div>
            <div className="flex items-center gap-2">
              {health.database.latency >= 0 && (
                <span className="text-[10px] text-slate-400">{health.database.latency}ms</span>
              )}
              <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                health.database.healthy ? 'bg-emerald-100 text-emerald-700' : 'bg-red-100 text-red-700'
              }`}>
                {health.database.status}
              </span>
            </div>
          </div>

          {/* API response */}
          <div className="flex items-center justify-between p-3 rounded-xl border bg-slate-50">
            <div className="flex items-center gap-2">
              <RiWifiLine size={14} className="text-teal-500" />
              <span className="text-xs font-semibold text-slate-700">API Response Time</span>
            </div>
            <span className={`text-xs font-black ${health.api.avgResponseTime < 300 ? 'text-emerald-600' : health.api.avgResponseTime < 500 ? 'text-amber-600' : 'text-red-600'}`}>
              {health.api.avgResponseTime}ms
            </span>
          </div>

          {/* Memory (only if real data) */}
          {!health._fallback && health.memory.heapTotal > 0 && (
            <div className="p-3 rounded-xl border bg-slate-50 space-y-2">
              <div className="flex items-center gap-2 mb-1">
                <RiServerLine size={14} className="text-purple-500" />
                <span className="text-xs font-semibold text-slate-700">Memory</span>
              </div>
              <div>
                <div className="flex justify-between mb-1">
                  <span className="text-[10px] text-slate-500">Heap</span>
                  <span className="text-[10px] font-bold text-slate-700">{health.memory.heapUsed}/{health.memory.heapTotal} MB</span>
                </div>
                <ProgressBar value={health.memory.heapUsed} max={health.memory.heapTotal} />
              </div>
            </div>
          )}

          {/* CPU (only if real data) */}
          {!health._fallback && health.cpu.percent > 0 && (
            <div className="p-3 rounded-xl border bg-slate-50 space-y-2">
              <div className="flex items-center gap-2 mb-1">
                <RiCpuLine size={14} className="text-orange-500" />
                <span className="text-xs font-semibold text-slate-700">CPU — {health.cpu.cores} cores</span>
              </div>
              <ProgressBar value={health.cpu.percent} max={100} />
            </div>
          )}

          {/* Uptime */}
          {health.uptime && health.uptime !== '—' && (
            <div className="flex items-center justify-between p-3 rounded-xl border bg-slate-50">
              <div className="flex items-center gap-2">
                <RiTimeLine size={14} className="text-slate-400" />
                <span className="text-xs font-semibold text-slate-700">Server Uptime</span>
              </div>
              <span className="text-xs font-black text-slate-800">{health.uptime}</span>
            </div>
          )}

          {/* Recent alerts */}
          {health.alerts.total24h > 0 && (
            <div>
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <RiAlertLine size={13} className="text-red-500" />
                  <span className="text-[10px] font-black text-slate-500 uppercase tracking-wider">
                    {health.alerts.total24h} Alert{health.alerts.total24h !== 1 ? 's' : ''} Today
                  </span>
                </div>
                <button
                  onClick={(e) => { e.stopPropagation(); navigate(isSuperAdmin ? '/audit-logs' : '/reports'); }}
                  className="text-[10px] font-bold text-blue-600 hover:underline"
                >
                  View All
                </button>
              </div>
              <div className="space-y-1.5">
                {health.alerts.recent.slice(0, 5).map((alert, i) => (
                  <div key={i} className={`flex items-start gap-2 p-2.5 rounded-xl border text-xs ${
                    alert.severity === 'HIGH' ? 'bg-red-50 border-red-100' : 'bg-amber-50 border-amber-100'
                  }`}>
                    <div className={`w-1.5 h-1.5 rounded-full mt-1 shrink-0 ${alert.severity === 'HIGH' ? 'bg-red-500' : 'bg-amber-500'}`} />
                    <div className="min-w-0 flex-1">
                      <p className="font-semibold text-slate-800 truncate">{(alert.action || '').replace(/_/g, ' ')}</p>
                      <p className="text-[10px] text-slate-500 truncate">{alert.details}</p>
                    </div>
                    <span className="text-[9px] text-slate-400 shrink-0">
                      {alert.time ? new Date(alert.time).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : ''}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {health.alerts.total24h === 0 && (
            <div className="flex items-center gap-2 p-3 bg-emerald-50 border border-emerald-100 rounded-xl">
              <RiCheckboxCircleLine size={16} className="text-emerald-500 shrink-0" />
              <span className="text-xs font-semibold text-emerald-700">No alerts in the last 24 hours</span>
            </div>
          )}

          {/* Refresh */}
          <button
            onClick={(e) => { e.stopPropagation(); fetchHealth(); }}
            className="w-full flex items-center justify-center gap-2 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-600 font-semibold rounded-xl text-xs transition-colors"
          >
            <RiRefreshLine size={13} /> Refresh Health Check
          </button>
        </div>
      )}
    </div>
  );
};

export default SystemHealth;
