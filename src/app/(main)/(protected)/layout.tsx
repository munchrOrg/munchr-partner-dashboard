import { redirect } from 'next/navigation';
import { SessionProvider } from '@/components/providers/SessionProvider';
import { auth } from '@/lib/auth';

export default async function ProtectedLayout({ children }: { children: React.ReactNode }) {
  const session = await auth();

  if (!session) {
    redirect('/sign-in');
  }

  return <SessionProvider>{children}</SessionProvider>;
}
