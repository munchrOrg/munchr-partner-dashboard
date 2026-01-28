import type { Cuisine } from './types';
import type { ApiResponse } from '@/types/api';
import apiClient from '@/lib/axios';

export const cuisinesService = {
  getAll: (): Promise<Cuisine[]> =>
    apiClient.get<ApiResponse<Cuisine[]>>('/v1/partner/cuisines').then((res) => res.data.data),

  getById: (id: string): Promise<Cuisine> =>
    apiClient.get<ApiResponse<Cuisine>>(`/v1/partner/cuisines/${id}`).then((res) => res.data.data),

  create: (data: Cuisine): Promise<Cuisine> =>
    apiClient.post<ApiResponse<Cuisine>>('/v1/partner/cuisines', data).then((res) => res.data.data),

  update: (data: Cuisine): Promise<Cuisine> =>
    apiClient
      .put<ApiResponse<Cuisine>>(`/v1/partner/cuisines/${data.id}`, data)
      .then((res) => res.data.data),
};
