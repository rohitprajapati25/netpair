import { useQuery } from '@tanstack/react-query';
import axios from 'axios';
import { useAuth } from '../contexts/AuthContext.jsx';

const API_BASE = 'http://localhost:5000/api/admin';

export const useAttendance = (filters) => {
  const { token } = useAuth();

  const params = new URLSearchParams(filters).toString();

  return useQuery({
    queryKey: ['attendance', filters],
    queryFn: async () => {
      const res = await axios.get(`${API_BASE}/attendance?${params}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      return res.data;
    },
    enabled: !!token,
    staleTime: 2 * 60 * 1000, // 2min
    retry: 1,
  });
};

export const useAttendanceStats = () => {
  const { token } = useAuth();

  return useQuery({
    queryKey: ['attendanceStats'],
    queryFn: async () => {
      const [totalRes, activeRes] = await Promise.all([
        axios.get(`${API_BASE}/employees?page=1&limit=1`, {
          headers: { Authorization: `Bearer ${token}` }
        }),
        axios.get(`${API_BASE}/attendance/today-stats`, {
          headers: { Authorization: `Bearer ${token}` }
        })
      ]);
      return {
        totalEmployees: totalRes.data.pagination?.total || totalRes.data.total || 0,
        activeEmployees: activeRes.data.presentToday || activeRes.data.activeEmployees || 0,
      };
    },
    enabled: !!token,
    staleTime: 5 * 60 * 1000,
  });
};

