'use client';

import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { toast } from 'sonner';

import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useUpdateProfile } from '@/react-query/auth/mutations';
import { useOnboardingStore } from '@/stores/onboarding-store';
import { OnboardingPhase, OnboardingStep } from '@/types/onboarding';

export function EmailConfirmModal() {
  const router = useRouter();
  const updateProfileMutation = useUpdateProfile();
  const {
    formData,
    setFormData,
    completeStep,
    completePhase,
    isEmailConfirmModalOpen,
    closeEmailConfirmModal,
    profile,
  } = useOnboardingStore();

  // Initialize email from formData - uses key prop on Dialog to reset state when modal opens
  const initialEmail = formData.businessInfo?.email || '';
  const [email, setEmail] = useState(initialEmail);

  // Handle modal open/close - reset email when opening
  const handleOpenChange = (open: boolean) => {
    if (open) {
      setEmail(formData.businessInfo?.email || '');
    } else {
      closeEmailConfirmModal();
    }
  };

  const handleConfirm = async () => {
    // Check if email matches partner email
    if (profile?.partner?.email && email === profile.partner.email) {
      toast.error('This email is already in use. Please use a different email address.');
      return;
    }

    // Update email in formData if it was changed
    if (email !== formData.businessInfo?.email && formData.businessInfo) {
      setFormData('businessInfo', {
        ...formData.businessInfo,
        email,
      });
    }
    try {
      await updateProfileMutation.mutateAsync({
        currentPage: OnboardingStep.BUSINESS_INFO_REVIEW,
        email,
      } as any);
    } catch (err) {
      console.error('Failed to update profile with email:', err);
    }

    // Complete the step
    completeStep(OnboardingStep.BUSINESS_INFO_REVIEW);

    // Complete Phase 1
    completePhase(OnboardingPhase.ADD_BUSINESS);

    // Close modal and route to Welcome
    closeEmailConfirmModal();
    router.push(`/onboarding/${OnboardingStep.WELCOME}`);
  };

  return (
    <Dialog open={isEmailConfirmModalOpen} onOpenChange={handleOpenChange}>
      <DialogContent className="rounded-4xl sm:max-w-2xl">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold">Confirm you email</DialogTitle>
          <DialogDescription className="text-base text-black">
            This is where we’ll send your partnership contract and important updates. Please confirm
            the address below is correct.
          </DialogDescription>
        </DialogHeader>

        <div className="relative">
          <Input
            id="email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder=" "
            className="peer h-12 rounded-full px-4 pt-9 pb-4"
          />

          <Label
            htmlFor="email"
            className="text-gray-light pointer-events-none absolute top-1/2 left-4 -translate-y-1/2 text-sm transition-all duration-200 ease-out peer-not-placeholder-shown:top-2 peer-not-placeholder-shown:translate-y-0 peer-not-placeholder-shown:text-xs peer-focus:top-2 peer-focus:translate-y-0 peer-focus:text-xs"
          >
            Enter your Business Email <span className="text-red-500">*</span>
          </Label>
        </div>

        <DialogFooter>
          <Button
            onClick={handleConfirm}
            disabled={!email}
            className="bg-gradient-yellow h-12 w-full rounded-full text-lg font-medium text-black disabled:opacity-50"
          >
            Continue
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
