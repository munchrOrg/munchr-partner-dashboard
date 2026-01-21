import type { RoleCreateResponse, RolePermissionsResponse } from './types';
import apiClient from '@/lib/axios';

export const rolesService = {
  getPermissions: () =>
    apiClient.get<RolePermissionsResponse>('/partner/roles/permissions').then((res) => res.data),
  create: (data: { name: string; description: string; permissionIds: string[] }) =>
    apiClient.post<RoleCreateResponse>('/partner/roles', data).then((res) => res.data),
  update: (id: string, data: { name: string; description: string; permissionIds: string[] }) =>
    apiClient.put<RoleCreateResponse>(`/partner/roles/${id}`, data).then((res) => res.data),
};
