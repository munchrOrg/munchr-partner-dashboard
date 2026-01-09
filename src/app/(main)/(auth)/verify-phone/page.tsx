import { Suspense } from 'react';
import { VerifyOtpForm } from '@/components/pages/verify/VerifyOtpForm';

export default function VerifyPhonePage() {
  return (
    <Suspense
      fallback={
        <div className="flex items-center justify-center py-12">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-amber-400 border-t-transparent" />
        </div>
      }
    >
      <VerifyOtpForm type="phone" />
    </Suspense>
  );
}
