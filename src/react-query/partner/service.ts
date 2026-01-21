import type { Cuisine, CuisinesResponse } from './types';
import apiClient from '@/lib/axios';

export const partnerService = {
  getCuisines: async (): Promise<Cuisine[]> => {
    const response = await apiClient.get<CuisinesResponse>('v1/partner/cuisines');
    const data = response.data;
    // Handle both array and { data: array } response formats
    return Array.isArray(data) ? data : Array.isArray(data?.data) ? data.data : [];
  },
};
