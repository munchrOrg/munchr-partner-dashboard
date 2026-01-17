import { useMutation } from '@tanstack/react-query';

export function useResendEmailOtp() {
  return useMutation({
    mutationFn: async ({ partnerId, email }: { partnerId: string; email: string }) => {
      const resp = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}partner/otp/resend-email`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          entityId: partnerId,
          entityType: 'partner',
          email,
          purpose: 'email_signup',
        }),
      });
      if (!resp.ok) {
        throw new Error('Failed to resend email OTP');
      }
      return resp.json();
    },
  });
}

export function useResendPhoneOtp() {
  return useMutation({
    mutationFn: async ({ partnerId, phone }: { partnerId: string; phone: string }) => {
      const resp = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}partner/otp/resend-phone`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          entityId: partnerId,
          entityType: 'partner',
          phone,
          purpose: 'phone_signup',
        }),
      });
      if (!resp.ok) {
        throw new Error('Failed to resend phone OTP');
      }
      return resp.json();
    },
  });
}
