import { ProtectedRouteGuard } from '@/components/auth/ProtectedRouteGuard';
import { SessionProvider } from '@/components/providers/SessionProvider';

export default function ProtectedLayout({ children }: { children: React.ReactNode }) {
  return (
    <SessionProvider>
      <ProtectedRouteGuard requireVerification enforceCurrentStep>
        {children}
      </ProtectedRouteGuard>
    </SessionProvider>
  );
}
