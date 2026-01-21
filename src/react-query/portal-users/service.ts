import apiClient from '@/lib/axios';

export const portalUsersService = {
  getAll: () => apiClient.get('/partner/portal-users').then((res) => res.data),
  delete: (id: string) => apiClient.delete(`/partner/portal-users/${id}`).then((res) => res.data),
  update: (id: string, data: { name: string; roleIds: string[]; status: string }) =>
    apiClient.put(`/partner/portal-users/${id}`, data).then((res) => res.data),
  create: (data: { name: string; email: string; password: string; roleIds: string[] }) =>
    apiClient.post('/partner/portal-users', data).then((res) => res.data),
};
