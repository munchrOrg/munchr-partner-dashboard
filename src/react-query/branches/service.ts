import type {
  Branch,
  BranchListItem,
  BranchProfile,
  BranchProfileUpdateRequest,
  GetBranchesResponse,
} from './types';
import type { ApiResponse } from '@/types/api';
import apiClient from '@/lib/axios';

export const branchesService = {
  getAll: (): Promise<GetBranchesResponse> =>
    apiClient
      .get<ApiResponse<GetBranchesResponse>>('/partner/branches')
      .then((res) => res.data.data),

  create: (
    data: Branch
  ): Promise<{ branch: BranchListItem; branchUser: { id: string; email: string } | null }> =>
    apiClient.post('/partner/branches', data).then((res) => res.data.data),

  getById: (id: string): Promise<BranchListItem> =>
    apiClient
      .get<ApiResponse<BranchListItem>>(`/partner/branches/${id}`)
      .then((res) => res.data.data),

  getBranchProfile: (): Promise<BranchProfile> =>
    apiClient
      .get<ApiResponse<BranchProfile>>('/partner/branches/profile')
      .then((res) => res.data.data),

  updateBranchProfile: (data: BranchProfileUpdateRequest): Promise<BranchProfile> =>
    apiClient
      .put<ApiResponse<BranchProfile>>('/partner/branches/profile', data)
      .then((res) => res.data.data),
};
