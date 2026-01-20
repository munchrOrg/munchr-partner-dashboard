import type { RolePermissionsResponse } from './types';
import apiClient from '@/lib/axios';

export const rolesService = {
  getPermissions: () =>
    apiClient
      .get<RolePermissionsResponse>('/api/partner/roles/permissions')
      .then((res) => res.data),
};
