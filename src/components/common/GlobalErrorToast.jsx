import React, { useState, useEffect, useCallback } from 'react';
import { RiCloseLine, RiAlertLine, RiWifiOffLine, RiServerLine } from 'react-icons/ri';
import axios from 'axios';

// Global event bus for errors
const errorListeners = new Set();

export const emitError = (message, type = 'error') => {
  errorListeners.forEach(fn => fn({ message, type, id: Date.now() }));
};

const GlobalErrorToast = () => {
  const [toasts, setToasts] = useState([]);

  const addToast = useCallback((toast) => {
    setToasts(prev => {
      // Deduplicate same message within 2s
      const isDuplicate = prev.some(t => t.message === toast.message && Date.now() - t.id < 2000);
      if (isDuplicate) return prev;
      return [...prev.slice(-2), toast]; // max 3 toasts
    });
    setTimeout(() => {
      setToasts(prev => prev.filter(t => t.id !== toast.id));
    }, 5000);
  }, []);

  useEffect(() => {
    errorListeners.add(addToast);
    return () => errorListeners.delete(addToast);
  }, [addToast]);

  // Intercept axios errors globally
  useEffect(() => {
    const interceptor = axios.interceptors.response.use(
      res => res,
      err => {
        const status  = err.response?.status;
        const message = err.response?.data?.message;

        // Don't show toast for 401 (handled by AuthContext) or cancelled requests
        if (status === 401 || axios.isCancel(err)) return Promise.reject(err);

        if (!err.response) {
          // Network error
          addToast({ message: 'Network error — check your connection', type: 'network', id: Date.now() });
        } else if (status === 403) {
          addToast({ message: 'Access denied — insufficient permissions', type: 'error', id: Date.now() });
        } else if (status === 404) {
          // Only show for non-dashboard endpoints (dashboard 404s are handled gracefully)
          if (!err.config?.url?.includes('dashboard')) {
            addToast({ message: message || 'Resource not found', type: 'warning', id: Date.now() });
          }
        } else if (status === 500) {
          addToast({ message: 'Server error — please try again', type: 'error', id: Date.now() });
        } else if (status >= 400 && message) {
          addToast({ message, type: 'warning', id: Date.now() });
        }

        return Promise.reject(err);
      }
    );
    return () => axios.interceptors.response.eject(interceptor);
  }, [addToast]);

  if (!toasts.length) return null;

  return (
    <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-[9998] flex flex-col gap-2 items-center pointer-events-none">
      {toasts.map(toast => (
        <Toast key={toast.id} toast={toast} onClose={() => setToasts(prev => prev.filter(t => t.id !== toast.id))} />
      ))}
    </div>
  );
};

const Toast = ({ toast, onClose }) => {
  const styles = {
    error:   { bg: 'bg-red-600',    icon: <RiAlertLine size={16} /> },
    warning: { bg: 'bg-amber-500',  icon: <RiAlertLine size={16} /> },
    network: { bg: 'bg-slate-700',  icon: <RiWifiOffLine size={16} /> },
    server:  { bg: 'bg-orange-600', icon: <RiServerLine size={16} /> },
  };
  const s = styles[toast.type] || styles.error;

  return (
    <div className={`pointer-events-auto flex items-center gap-3 px-4 py-3 rounded-2xl shadow-2xl text-white text-sm font-semibold max-w-sm ${s.bg} animate-fade-in`}>
      {s.icon}
      <span className="flex-1">{toast.message}</span>
      <button onClick={onClose} className="p-0.5 hover:bg-white/20 rounded-lg transition-colors shrink-0">
        <RiCloseLine size={16} />
      </button>
    </div>
  );
};

export default GlobalErrorToast;
