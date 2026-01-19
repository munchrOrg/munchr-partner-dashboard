export const dashboardKeys = {
  all: ['dashboard'] as const,
  stats: () => [...dashboardKeys.all, 'stats'] as const,
  overview: () => [...dashboardKeys.all, 'overview'] as const,
  recentOrders: () => [...dashboardKeys.all, 'recent-orders'] as const,
  performance: (period?: string) => [...dashboardKeys.all, 'performance', period] as const,
};
