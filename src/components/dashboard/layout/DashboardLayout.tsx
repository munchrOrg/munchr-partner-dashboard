import { auth } from '@/lib/auth';
import { Header } from './Header';
import { Sidebar } from './Sidebar';

type DashboardLayoutProps = {
  children: React.ReactNode;
};

// TODO: Remove dummy user when auth flow is implemented
const dummyUser = {
  name: 'Test User',
  email: 'test@example.com',
};

export async function DashboardLayout({ children }: Readonly<DashboardLayoutProps>) {
  const session = await auth();
  const user = session?.user ?? dummyUser;

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
