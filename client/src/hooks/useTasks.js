import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { taskAPI } from '../utils/api';
import toast from 'react-hot-toast';

export const useTasks = (filters = {}) => {
  return useQuery({
    queryKey: ['tasks', filters],
    queryFn: () => taskAPI.getAll(filters),
  });
};

export const useCreateTask = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: taskAPI.create,
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['tasks'] });
      toast.success('Task created', {
        icon: '✨',
        style: {
          borderRadius: '10px',
          background: '#0a0a0a',
          color: '#fff',
        },
      });
    },
    onError: (err) => toast.error(err.response?.data?.message || 'Failed to create task'),
  });
};

export const useUpdateTask = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }) => taskAPI.update(id, data),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['tasks'] });
      toast.success('Task updated', {
        icon: '✏️',
        style: {
          borderRadius: '10px',
          background: '#0a0a0a',
          color: '#fff',
        },
      });
    },
    onError: (err) => toast.error(err.response?.data?.message || 'Failed to update task'),
  });
};

export const useDeleteTask = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: taskAPI.delete,
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['tasks'] });
      toast.success('Task deleted', {
        icon: '🗑️',
        style: {
          borderRadius: '10px',
          background: '#ef4444',
          color: '#fff',
        },
      });
    },
    onError: () => toast.error('Failed to delete task'),
  });
};