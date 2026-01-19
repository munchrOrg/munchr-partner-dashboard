export type DashboardStats = {
  totalOrders: number;
  totalRevenue: number;
  averageRating: number;
  pendingOrders: number;
  completedOrders: number;
  cancelledOrders: number;
};

export type RecentOrder = {
  id: string;
  customerName: string;
  items: number;
  total: number;
  status: 'pending' | 'preparing' | 'ready' | 'delivered' | 'cancelled';
  createdAt: string;
};

export type DashboardData = {
  stats: DashboardStats;
  recentOrders: RecentOrder[];
};

export type PerformanceMetric = {
  date: string;
  orders: number;
  revenue: number;
};

export type DashboardOverview = {
  stats: DashboardStats;
  recentOrders: RecentOrder[];
  performanceMetrics: PerformanceMetric[];
};
