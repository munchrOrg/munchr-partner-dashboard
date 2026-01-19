import { DashboardContent } from '@/components/dashboard/widgets/DashboardContent';
import { auth } from '@/lib/auth';

// TODO: Remove dummy user when auth flow is implemented
const dummyUser = {
  name: 'Test User',
  email: 'test@example.com',
};

export default async function DashboardPage() {
  const session = await auth();
  const user = session?.user ?? dummyUser;

  return <DashboardContent user={user} />;
}
