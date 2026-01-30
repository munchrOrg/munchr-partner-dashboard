import type { Role, RolePermission } from './types';
import type { ApiResponse } from '@/types/api';
import { partnerClient } from '@/lib/axios';

export const rolesService = {
  getPermissions: () =>
    partnerClient
      .get<ApiResponse<RolePermission[]>>('/partner/roles/permissions')
      .then((res) => res.data.data),
  create: (data: { name: string; description: string; permissionIds: string[] }) =>
    partnerClient.post<ApiResponse<Role>>('/partner/roles', data).then((res) => res.data.data),
  update: (id: string, data: { name: string; description: string; permissionIds: string[] }) =>
    partnerClient.put<ApiResponse<Role>>(`/partner/roles/${id}`, data).then((res) => res.data.data),
  getAll: () =>
    partnerClient.get<ApiResponse<Role[]>>('/partner/roles').then((res) => res.data.data),
  getById: (id: string) =>
    partnerClient.get<ApiResponse<Role>>(`/partner/roles/${id}`).then((res) => res.data.data),
};
