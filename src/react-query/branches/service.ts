import type { Branch } from './types';
import apiClient from '@/lib/axios';

export const branchesService = {
  getAll: () => apiClient.get('/partner/branches').then((res) => res.data),
  create: (data: Branch) => apiClient.post('/partner/branches', data).then((res) => res.data),
  getOnboardingProfile: () =>
    apiClient.get('/partner/branches/onboarding/profile').then((res) => res.data),
  getById: (id: string) => apiClient.get(`/partner/branches/${id}`).then((res) => res.data.data),
  update: (data: Branch) =>
    apiClient.put('/partner/branches/onboarding/update', data).then((res) => res.data),
};
