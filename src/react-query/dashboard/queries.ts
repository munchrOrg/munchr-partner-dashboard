import { useQuery } from '@tanstack/react-query';
import { dashboardKeys } from './keys';
import { dashboardService } from './service';

export function useDashboardStats() {
  return useQuery({
    queryKey: dashboardKeys.stats(),
    queryFn: dashboardService.getStats,
    staleTime: 1000 * 60 * 5, // 5 minutes
  });
}

export function useDashboardOverview() {
  return useQuery({
    queryKey: dashboardKeys.overview(),
    queryFn: dashboardService.getOverview,
    staleTime: 1000 * 60 * 5, // 5 minutes
  });
}

export function useRecentOrders(limit = 5) {
  return useQuery({
    queryKey: [...dashboardKeys.recentOrders(), limit],
    queryFn: () => dashboardService.getRecentOrders(limit),
    staleTime: 1000 * 60 * 2, // 2 minutes
  });
}

export function usePerformance(period: 'week' | 'month' | 'year' = 'week') {
  return useQuery({
    queryKey: dashboardKeys.performance(period),
    queryFn: () => dashboardService.getPerformance(period),
    staleTime: 1000 * 60 * 10, // 10 minutes
  });
}
