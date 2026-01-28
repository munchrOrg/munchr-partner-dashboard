'use client';

import { useProfile } from '@/react-query/auth/queries';
import { Header } from './Header';
import { Sidebar } from './Sidebar';

type DashboardLayoutProps = {
  children: React.ReactNode;
};

export function DashboardLayout({ children }: Readonly<DashboardLayoutProps>) {
  const { data: profile } = useProfile();

  const user = {
    name: profile?.user?.name ?? null,
    email: profile?.user?.email ?? null,
    image: profile?.businessProfile?.logoImageUrl ?? null,
  };

  return (
    <div className="flex h-screen">
      {/* Sidebar */}
      <Sidebar />

      {/* Main content area */}
      <div className="flex flex-1 flex-col overflow-hidden">
        {/* Header */}
        <Header user={user} />

        {/* Page content */}
        <main className="flex-1 overflow-y-auto px-10">{children}</main>
      </div>
    </div>
  );
}
