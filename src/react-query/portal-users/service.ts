import apiClient from '@/lib/axios';

export const portalUsersService = {
  getAll: () => apiClient.get('/api/partner/portal-users').then((res) => res.data),
};
