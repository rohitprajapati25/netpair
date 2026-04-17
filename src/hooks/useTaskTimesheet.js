import { useQuery, useQueryClient } from '@tanstack/react-query';
import axios from 'axios';
import { useAuth } from '../contexts/AuthContext.jsx';
import API_URL from '../config/api';

const API_BASE = API_URL + '/admin';

export const useTasks = () => {
  const { token } = useAuth();
  return useQuery({
    queryKey: ['tasks'],
    queryFn: async () => {
      const res = await axios.get(`${API_BASE}/tasks?limit=500`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      return res.data.tasks || res.data.records || res.data || [];
    },
    enabled: !!token,
    staleTime: 2 * 60 * 1000,
  });
};

export const useTimesheets = () => {
  const { token } = useAuth();
  return useQuery({
    queryKey: ['timesheets'],
    queryFn: async () => {
      const res = await axios.get(`${API_BASE}/timesheets?limit=500`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      return res.data.timesheets || res.data.records || res.data || [];
    },
    enabled: !!token,
    staleTime: 2 * 60 * 1000,
  });
};

export const useProjects = () => {
  const { token } = useAuth();
  return useQuery({
    queryKey: ['projects-list'],
    queryFn: async () => {
      const res = await axios.get(`${API_BASE}/projects?limit=500`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      return res.data.projects || [];
    },
    enabled: !!token,
    staleTime: 5 * 60 * 1000,
  });
};

