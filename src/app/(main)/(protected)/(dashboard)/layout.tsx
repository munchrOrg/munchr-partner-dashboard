import { DashboardLayout } from '@/components/dashboard/layout/DashboardLayout';

export default function DashboardRoutesLayout({ children }: { children: React.ReactNode }) {
  return <DashboardLayout>{children}</DashboardLayout>;
}
