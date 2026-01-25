import type { CreatePortalUserRequest, PortalUser, UpdatePortalUserRequest } from './types';
import type { ApiResponse } from '@/types/api';
import apiClient from '@/lib/axios';

export const portalUsersService = {
  getAll: () =>
    apiClient.get<ApiResponse<PortalUser[]>>('/partner/portal-users').then((res) => res.data.data),

  getById: (id: string) =>
    apiClient
      .get<ApiResponse<PortalUser>>(`/partner/portal-users/${id}`)
      .then((res) => res.data.data),

  create: (data: CreatePortalUserRequest) =>
    apiClient
      .post<ApiResponse<PortalUser>>('/partner/portal-users', data)
      .then((res) => res.data.data),

  update: (id: string, data: UpdatePortalUserRequest) =>
    apiClient
      .put<ApiResponse<PortalUser>>(`/partner/portal-users/${id}`, data)
      .then((res) => res.data.data),

  delete: (id: string) =>
    apiClient.delete<ApiResponse<null>>(`/partner/portal-users/${id}`).then((res) => res.data.data),
};
