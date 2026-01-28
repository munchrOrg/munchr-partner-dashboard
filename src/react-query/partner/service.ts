import type { Cuisine } from './types';
import type { ApiResponse } from '@/types/api';
import apiClient from '@/lib/axios';

export const partnerService = {
  getCuisines: async (): Promise<Cuisine[]> => {
    const response = await apiClient.get<ApiResponse<Cuisine[]>>('v1/partner/cuisines');
    return response.data.data;
  },
};
