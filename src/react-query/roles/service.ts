import type { Role, RolePermission } from './types';
import type { ApiResponse } from '@/types/api';
import apiClient from '@/lib/axios';

export const rolesService = {
  getPermissions: () =>
    apiClient
      .get<ApiResponse<RolePermission[]>>('/partner/roles/permissions')
      .then((res) => res.data.data),
  create: (data: { name: string; description: string; permissionIds: string[] }) =>
    apiClient.post<ApiResponse<Role>>('/partner/roles', data).then((res) => res.data.data),
  update: (id: string, data: { name: string; description: string; permissionIds: string[] }) =>
    apiClient.put<ApiResponse<Role>>(`/partner/roles/${id}`, data).then((res) => res.data.data),
  getAll: () => apiClient.get<ApiResponse<Role[]>>('/partner/roles').then((res) => res.data.data),
  getById: (id: string) =>
    apiClient.get<ApiResponse<Role>>(`/partner/roles/${id}`).then((res) => res.data.data),
};
