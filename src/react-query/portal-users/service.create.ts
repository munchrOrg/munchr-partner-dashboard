import apiClient from '@/lib/axios';

export const portalUsersService = {
  create: (data: { name: string; email: string; password: string; roleIds: string[] }) =>
    apiClient.post('/partner/portal-users', data).then((res) => res.data),
};
