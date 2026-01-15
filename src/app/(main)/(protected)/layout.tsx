import { SessionProvider } from '@/components/providers/SessionProvider';
import { auth } from '@/lib/auth';

export default async function ProtectedLayout({ children }: { children: React.ReactNode }) {
  // TODO: Commenting out this auth guard , nextjs proxy should handle this
  await auth();

  // if (!session) {
  //   redirect('/sign-in');
  // }

  return <SessionProvider>{children}</SessionProvider>;
}
