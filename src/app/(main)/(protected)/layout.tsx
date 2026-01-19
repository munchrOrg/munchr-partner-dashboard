import { AuthGuard } from '@/components/auth/AuthGuard';
import { SessionProvider } from '@/components/providers/SessionProvider';

export default function ProtectedLayout({ children }: { children: React.ReactNode }) {
  return (
    <SessionProvider>
      <AuthGuard requireVerification enforceCurrentStep>
        {children}
      </AuthGuard>
    </SessionProvider>
  );
}
