import apiClient from '@/lib/axios';

export const portalUsersService = {
  getAll: () => apiClient.get('/partner/portal-users').then((res) => res.data),
  delete: (id: string) => apiClient.delete(`/partner/portal-users/${id}`).then((res) => res.data),
};
