import type { Branch, BranchProfileResponse, BranchProfileUpdateRequest } from './types';
import apiClient from '@/lib/axios';

export const branchesService = {
  getAll: () => apiClient.get('/partner/branches').then((res) => res.data),
  create: (data: Branch) => apiClient.post('/partner/branches', data).then((res) => res.data),
  getById: (id: string) => apiClient.get(`/partner/branches/${id}`).then((res) => res.data.data),

  getBranchProfile: (): Promise<BranchProfileResponse> =>
    apiClient.get('/partner/branches/profile').then((res) => res.data),
  updateBranchProfile: (data: BranchProfileUpdateRequest): Promise<BranchProfileResponse> =>
    apiClient.put('/partner/branches/profile', data).then((res) => res.data),
};
