'use client';

import { CheckCircle, Clock, DollarSign, ShoppingBag, Star, XCircle } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { StatsCard } from './StatsCard';

type DashboardContentProps = {
  user: {
    name?: string | null;
    email?: string | null;
  };
};

// Placeholder data - will be replaced with React Query hooks when API is ready
const placeholderStats = {
  totalOrders: 156,
  totalRevenue: 12450,
  averageRating: 4.8,
  pendingOrders: 5,
  completedOrders: 145,
  cancelledOrders: 6,
};

const placeholderRecentOrders = [
  {
    id: '1',
    customerName: 'John Doe',
    items: 3,
    total: 45.99,
    status: 'delivered' as const,
    createdAt: '2024-01-15T10:30:00',
  },
  {
    id: '2',
    customerName: 'Jane Smith',
    items: 2,
    total: 28.5,
    status: 'preparing' as const,
    createdAt: '2024-01-15T10:15:00',
  },
  {
    id: '3',
    customerName: 'Mike Johnson',
    items: 5,
    total: 89.99,
    status: 'pending' as const,
    createdAt: '2024-01-15T10:00:00',
  },
  {
    id: '4',
    customerName: 'Sarah Williams',
    items: 1,
    total: 15.0,
    status: 'ready' as const,
    createdAt: '2024-01-15T09:45:00',
  },
  {
    id: '5',
    customerName: 'Tom Brown',
    items: 4,
    total: 62.5,
    status: 'delivered' as const,
    createdAt: '2024-01-15T09:30:00',
  },
];

const statusColors = {
  pending: 'bg-yellow-100 text-yellow-800',
  preparing: 'bg-blue-100 text-blue-800',
  ready: 'bg-purple-100 text-purple-800',
  delivered: 'bg-green-100 text-green-800',
  cancelled: 'bg-red-100 text-red-800',
};

export function DashboardContent({ user }: DashboardContentProps) {
  return (
    <div className="space-y-6">
      {/* Welcome Section */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900">
          Welcome back, {user.name || user.email?.split('@')[0] || 'Partner'}!
        </h1>
        <p className="text-gray-500">Here&apos;s what&apos;s happening with your business today.</p>
      </div>

      {/* Stats Grid */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6">
        <StatsCard
          title="Total Orders"
          value={placeholderStats.totalOrders}
          icon={ShoppingBag}
          trend={{ value: 12, isPositive: true }}
        />
        <StatsCard
          title="Revenue"
          value={`$${placeholderStats.totalRevenue.toLocaleString()}`}
          icon={DollarSign}
          trend={{ value: 8, isPositive: true }}
        />
        <StatsCard
          title="Avg. Rating"
          value={placeholderStats.averageRating}
          icon={Star}
          description="Based on 89 reviews"
        />
        <StatsCard title="Pending" value={placeholderStats.pendingOrders} icon={Clock} />
        <StatsCard title="Completed" value={placeholderStats.completedOrders} icon={CheckCircle} />
        <StatsCard title="Cancelled" value={placeholderStats.cancelledOrders} icon={XCircle} />
      </div>

      {/* Recent Orders */}
      <Card>
        <CardHeader>
          <CardTitle>Recent Orders</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b text-left text-sm font-medium text-gray-500">
                  <th className="pr-4 pb-3">Order ID</th>
                  <th className="pr-4 pb-3">Customer</th>
                  <th className="pr-4 pb-3">Items</th>
                  <th className="pr-4 pb-3">Total</th>
                  <th className="pr-4 pb-3">Status</th>
                  <th className="pb-3">Time</th>
                </tr>
              </thead>
              <tbody>
                {placeholderRecentOrders.map((order) => (
                  <tr key={order.id} className="border-b last:border-0">
                    <td className="py-3 pr-4 text-sm font-medium text-gray-900">#{order.id}</td>
                    <td className="py-3 pr-4 text-sm text-gray-600">{order.customerName}</td>
                    <td className="py-3 pr-4 text-sm text-gray-600">{order.items}</td>
                    <td className="py-3 pr-4 text-sm font-medium text-gray-900">
                      ${order.total.toFixed(2)}
                    </td>
                    <td className="py-3 pr-4">
                      <span
                        className={`inline-flex rounded-full px-2 py-1 text-xs font-medium ${statusColors[order.status]}`}
                      >
                        {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                      </span>
                    </td>
                    <td className="py-3 text-sm text-gray-500">
                      {new Date(order.createdAt).toLocaleTimeString([], {
                        hour: '2-digit',
                        minute: '2-digit',
                      })}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
