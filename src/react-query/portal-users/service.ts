import type { CreatePortalUserRequest, PortalUser, UpdatePortalUserRequest } from './types';
import type { ApiResponse } from '@/types/api';
import { partnerClient } from '@/lib/axios';

export const portalUsersService = {
  getAll: () =>
    partnerClient
      .get<ApiResponse<PortalUser[]>>('/partner/portal-users')
      .then((res) => res.data.data),

  getById: (id: string) =>
    partnerClient
      .get<ApiResponse<PortalUser>>(`/partner/portal-users/${id}`)
      .then((res) => res.data.data),

  create: (data: CreatePortalUserRequest) =>
    partnerClient
      .post<ApiResponse<PortalUser>>('/partner/portal-users', data)
      .then((res) => res.data.data),

  update: (id: string, data: UpdatePortalUserRequest) =>
    partnerClient
      .put<ApiResponse<PortalUser>>(`/partner/portal-users/${id}`, data)
      .then((res) => res.data.data),

  delete: (id: string) =>
    partnerClient
      .delete<ApiResponse<null>>(`/partner/portal-users/${id}`)
      .then((res) => res.data.data),
};
