import { Suspense } from 'react';
import { ResetPasswordForm } from '@/components/pages/reset-password/ResetPasswordForm';

export const dynamic = 'force-dynamic';

export default function ResetPasswordPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <ResetPasswordForm />
    </Suspense>
  );
}
