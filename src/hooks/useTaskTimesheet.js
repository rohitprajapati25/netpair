import { useQuery } from '@tanstack/react-query';
import axios from 'axios';
import { useAuth } from '../contexts/AuthContext.jsx';

const API_BASE = 'http://localhost:5000/api/admin';

export const useTasks = () => {
  const { token } = useAuth();

  return useQuery({
    queryKey: ['tasks'],
    queryFn: async () => {
      const res = await axios.get(`${API_BASE}/tasks`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      return res.data.records || res.data.tasks || res.data || [];
    },
    enabled: !!token,
    staleTime: 3 * 60 * 1000,
  });
};

export const useTimesheets = () => {
  const { token } = useAuth();

  return useQuery({
    queryKey: ['timesheets'],
    queryFn: async () => {
      const res = await axios.get(`${API_BASE}/timesheets`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      return res.data.records || res.data.timesheets || res.data || [];
    },
    enabled: !!token,
    staleTime: 3 * 60 * 1000,
  });
};

export const useProjects = () => {
  const { token } = useAuth();

  return useQuery({
    queryKey: ['projects-list'],
    queryFn: async () => {
      const res = await axios.get(`${API_BASE}/projects`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      return res.data.projects || [];
    },
    enabled: !!token,
  });
};

