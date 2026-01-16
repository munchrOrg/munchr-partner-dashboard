import type { DashboardOverview, DashboardStats, PerformanceMetric, RecentOrder } from './types';
import apiClient from '@/lib/axios';

export const dashboardService = {
  getStats: () => apiClient.get<DashboardStats>('/dashboard/stats').then((res) => res.data),

  getOverview: () =>
    apiClient.get<DashboardOverview>('/dashboard/overview').then((res) => res.data),

  getRecentOrders: (limit = 5) =>
    apiClient
      .get<RecentOrder[]>('/dashboard/recent-orders', { params: { limit } })
      .then((res) => res.data),

  getPerformance: (period: 'week' | 'month' | 'year' = 'week') =>
    apiClient
      .get<PerformanceMetric[]>('/dashboard/performance', { params: { period } })
      .then((res) => res.data),
};
