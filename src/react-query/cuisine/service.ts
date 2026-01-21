import type { Cuisine } from './types';
import apiClient from '@/lib/axios';

export const cuisinesService = {
  getAll: (): Promise<Cuisine[]> =>
    apiClient.get('/v1/partner/cuisines').then((res) => res.data.data),

  getById: (id: string): Promise<Cuisine> =>
    apiClient.get(`/v1/partner/cuisines/${id}`).then((res) => res.data),

  create: (data: Cuisine): Promise<Cuisine> =>
    apiClient.post('/v1/partner/cuisines', data).then((res) => res.data),

  update: (data: Cuisine): Promise<Cuisine> =>
    apiClient.put(`/a pi/v1/partner/cuisines/${data.id}`, data).then((res) => res.data),
};
