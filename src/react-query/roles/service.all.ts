import apiClient from '@/lib/axios';

export const rolesService = {
  getAll: () => apiClient.get('/partner/roles').then((res) => res.data),
  getById: (id: string) => apiClient.get(`/partner/roles/${id}`).then((res) => res.data),
};
