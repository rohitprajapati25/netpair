import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import ExpiryWarning from '../components/common/ExpiryWarning.jsx';
import API_URL from '../config/api';

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [role, setRole] = useState(null);
  const [showExpiryWarning, setShowExpiryWarning] = useState(false);
  const [timeLeft, setTimeLeft] = useState(0);
  const [savedEmail, setSavedEmail] = useState('');
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  // Hydrate from localStorage on mount
  useEffect(() => {
    const initAuth = () => {
      const savedToken = localStorage.getItem('token');
      const savedUser = localStorage.getItem('user');
      const savedEmailLocal = localStorage.getItem('email');
      
      if (savedToken && savedUser) {
        try {
          const userData = JSON.parse(savedUser);
          setToken(savedToken);
          setUser(userData);
          setRole(userData.role);
          setSavedEmail(savedEmailLocal);
          axios.defaults.headers.common['Authorization'] = `Bearer ${savedToken}`;
        } catch (err) {
          console.error('Invalid stored auth data');
          localStorage.removeItem('token');
          localStorage.removeItem('user');
          localStorage.removeItem('email');
          logout();
        }
      }
      if (savedEmailLocal) setSavedEmail(savedEmailLocal);
      setLoading(false);
    };

    initAuth();
  }, []);

  const isTokenExpired = (token) => {
    if (!token) return true;
    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      return payload.exp * 1000 < Date.now();
    } catch {
      return true;
    }
  };

  const checkExpiry = useCallback(() => {
    if (isTokenExpired(token)) {
      logout();
    }
  }, [token]);

  const updateWarning = useCallback(() => {
    if (!token) return;
    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      const timeLeftMs = payload.exp * 1000 - Date.now();
      const tl = Math.floor(timeLeftMs / 1000);
      setTimeLeft(tl);
      if (tl < 300 && tl > 0) {
        setShowExpiryWarning(true);
      } else if (tl <= 0) {
        checkExpiry();
      }
    } catch (e) {
      checkExpiry();
    }
  }, [token, checkExpiry]);

  const extendSession = async (password) => {
    if (!savedEmail || !password) {
      logout();
      return { success: false, error: 'No credentials available' };
    }
    const result = await login(savedEmail, password);
    if (result.success) {
      setShowExpiryWarning(false);
      setTimeLeft(0);
    }
    return result;
  };

  const login = async (email, password) => {
    try {
      const res = await axios.post(`${API_URL}/auth/login`, { email, password });
      const { token: newToken, user: newUser } = res.data;
      
      // Save to state and localStorage
      setToken(newToken);
      setUser(newUser);
      setRole(newUser.role);
      setSavedEmail(newUser.email);
      localStorage.setItem('email', newUser.email);
      localStorage.setItem('token', newToken);
      localStorage.setItem('user', JSON.stringify(newUser));
      axios.defaults.headers.common['Authorization'] = `Bearer ${newToken}`;
      
      // Role-based redirect
      if (newUser.role === 'superadmin' || newUser.role === 'admin') {
        navigate('/dashboard');
      } else if (newUser.role === 'hr') {
        navigate('/dashboard');
      } else {
        navigate('/employee-dashboard');
      }
      
      return { success: true, user: newUser };
    } catch (error) {
      return { success: false, error: error.response?.data?.message || 'Login failed' };
    }
  };

  const logout = useCallback(() => {
    setUser(null);
    setToken(null);
    setRole(null);
    setShowExpiryWarning(false);
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    localStorage.removeItem('email');
    delete axios.defaults.headers.common['Authorization'];
    navigate('/');
  }, [navigate]);

  // Global 401 interceptor
  useEffect(() => {
    const interceptor = axios.interceptors.response.use(
      (response) => response,
      (error) => {
        if (error.response?.status === 401 && token) {
          logout();
        }
        return Promise.reject(error);
      }
    );
    return () => {
      axios.interceptors.response.eject(interceptor);
    };
  }, [token, logout]);

  // Expiry monitoring — paused when warning modal is open (modal has its own countdown)
  useEffect(() => {
    if (!token || showExpiryWarning) return;
    const expiryTimer  = setInterval(checkExpiry,   60000);
    const warningTimer = setInterval(updateWarning, 30000);
    updateWarning();
    return () => {
      clearInterval(expiryTimer);
      clearInterval(warningTimer);
    };
  }, [token, showExpiryWarning, checkExpiry, updateWarning]);

  const value = {
    user,
    token,
    role,
    login,
    logout,
    loading,
    showExpiryWarning,
    timeLeft,
    extendSession
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && (
        <>
          {children}
          {showExpiryWarning && token && (
            <ExpiryWarning 
              timeLeft={timeLeft}
              onExtend={extendSession}
              onLogout={logout}
            />
          )}
        </>
      )}
    </AuthContext.Provider>
  );
};

