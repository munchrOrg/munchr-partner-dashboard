'use client';

import type { PendingApprovalError, VerificationRequiredError } from '@/react-query/auth/types';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { getUserType } from '@/constants/roles';
import { usePhoneLogin } from '@/react-query/auth/mutations';
import { FormFooter } from './FormFooter';

type PhoneLoginFormProps = {
  onSwitchToEmail: () => void;
};

export function PhoneLoginForm({ onSwitchToEmail }: PhoneLoginFormProps) {
  const router = useRouter();
  const [phoneNumber, setPhoneNumber] = useState('');
  const [password, setPassword] = useState('');

  const phoneLoginMutation = usePhoneLogin();

  const isLoading = phoneLoginMutation.isPending;

  const normalizePhoneNumber = (phone: string) => {
    const p = phone.trim();
    if (p.startsWith('+92')) {
      return p;
    }
    if (p.startsWith('0')) {
      return `+92${p.slice(1)}`;
    }
    return `+92${p}`;
  };

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const formattedPhone = normalizePhoneNumber(phoneNumber);
      const loginResponse = await phoneLoginMutation.mutateAsync({
        phoneNumber: formattedPhone,
        password,
      });

      const userType = getUserType(loginResponse.user?.roles);
      const skipOnboarding = loginResponse.onboarding?.skipOnboarding;
      const isOnboardingCompleted = loginResponse.onboarding?.isOnboardingCompleted;

      if (isOnboardingCompleted || skipOnboarding) {
        window.location.replace('/dashboard');
        return;
      }

      if (userType === 'owner') {
        window.location.replace('/onboarding');
      } else if (userType === 'branch_manager') {
        window.location.replace('/profile-setup');
      } else if (userType === 'branch_user') {
        window.location.replace('/dashboard');
      } else {
        toast.error('User role not configured. Please contact support.');
      }
    } catch (err: any) {
      const status = err?.response?.status;
      const errorData = err?.response?.data;

      if (status === 403 && errorData?.error === 'verification_required') {
        const verificationError = errorData as VerificationRequiredError;
        const verificationData = verificationError.data;
        const formattedPhone = normalizePhoneNumber(phoneNumber);
        const userId = verificationData?.userId || '';
        const email = verificationData?.email || '';

        if (!verificationData?.emailVerified) {
          const params = new URLSearchParams({
            type: 'login',
            userId,
            email,
            phone: formattedPhone,
          });
          router.push(`/verify-email?${params.toString()}`);
        } else if (!verificationData?.phoneVerified) {
          const params = new URLSearchParams({
            type: 'login',
            userId,
            email,
            phone: formattedPhone,
          });
          router.push(`/verify-phone?${params.toString()}`);
        }
        return;
      }

      if (status === 403 && errorData?.error === 'pending_approval') {
        const approvalError = errorData as PendingApprovalError;
        toast.error(
          approvalError.message || 'Your account is pending approval. Please wait for verification.'
        );
      }
    }
  };

  return (
    <div className="flex w-full flex-col items-start">
      <h1 className="mb-6 text-center text-xl font-semibold sm:text-2xl">Log in with your phone</h1>

      <form onSubmit={onSubmit} className="space-y-4">
        <div>
          <Input
            type="tel"
            placeholder="Enter your phone number eg +92xxxxxxx"
            className="h-11 rounded-full border-gray-300 px-4 sm:h-12 sm:px-5"
            value={phoneNumber}
            onChange={(e) => setPhoneNumber(e.target.value)}
          />
        </div>
        <div>
          <Input
            type="password"
            placeholder="Enter your password"
            className="h-11 rounded-full border-gray-300 px-4 sm:h-12 sm:px-5"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>

        <Button
          type="submit"
          disabled={isLoading || !phoneNumber.trim() || !password.trim()}
          className="h-11 w-full rounded-full bg-amber-400 font-medium text-black hover:bg-amber-500 sm:h-12"
        >
          {isLoading ? 'Logging in...' : 'Continue'}
        </Button>

        <div className="my-4 flex items-center gap-4">
          <div className="h-px flex-1 bg-gray-200" />
          <span className="text-sm text-gray-400">OR</span>
          <div className="h-px flex-1 bg-gray-200" />
        </div>

        <Button
          type="button"
          variant="outline"
          className="h-11 w-full rounded-full border-gray-300 sm:h-12"
          onClick={onSwitchToEmail}
        >
          Log in with email
        </Button>

        <FormFooter />
      </form>
    </div>
  );
}
