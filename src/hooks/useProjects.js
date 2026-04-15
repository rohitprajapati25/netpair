import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import axios from 'axios';
import { useAuth } from '../contexts/AuthContext.jsx';

const API_BASE = 'http://localhost:5000/api/admin';

export const useProjects = (filters) => {
  const { token } = useAuth();

  const params = new URLSearchParams(filters).toString();

  return useQuery({
    queryKey: ['projects', filters],
    queryFn: async () => {
      const res = await axios.get(`${API_BASE}/projects?${params}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      const mapped = res.data.projects?.map(p => ({ ...p, id: p._id })) || [];
      return mapped;
    },
    enabled: !!token,
    staleTime: 3 * 60 * 1000,
  });
};

export const useProjectStats = () => {
  const { token } = useAuth();

  return useQuery({
    queryKey: ['projectStats'],
    queryFn: async () => {
      const res = await axios.get(`${API_BASE}/projects/stats`, { headers: { Authorization: `Bearer ${token}` } });
      return res.data.stats || {};
    },
    enabled: !!token,
  });
};

export const useSaveProject = () => {
  const queryClient = useQueryClient();
  const { token } = useAuth();

  return useMutation({
    mutationFn: (data) => {
      if (data._id) {
        // Update existing project
        return axios.put(`${API_BASE}/projects/${data._id}`, data, {
          headers: { Authorization: `Bearer ${token}` }
        });
      } else {
        // Create new project
        return axios.post(`${API_BASE}/projects`, data, {
          headers: { Authorization: `Bearer ${token}` }
        });
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['projects'] });
    },
  });
};

export const useDeleteProject = () => {
  const queryClient = useQueryClient();
  const { token } = useAuth();

  return useMutation({
    mutationFn: (id) => axios.delete(`${API_BASE}/projects/${id}`, {
      headers: { Authorization: `Bearer ${token}` }
    }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['projects'] });
    },
  });
};

