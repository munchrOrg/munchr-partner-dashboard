'use client';

import type { ForgotPasswordInput, ResetPasswordInput } from '@/validations/auth';
import { zodResolver } from '@hookform/resolvers/zod';
import Link from 'next/link';
import { useState } from 'react';
import { useForm, useForm as useForm2 } from 'react-hook-form';
import { toast } from 'sonner';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';

import { useForgotPassword, useResetPassword } from '@/react-query/auth/mutations';
import { forgotPasswordSchema, resetPasswordSchema } from '@/validations/auth';

export function ForgotPasswordForm() {
  const [emailSent, setEmailSent] = useState(false);
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [submittedEmail, setSubmittedEmail] = useState('');
  const [otp, setOtp] = useState('');
  const [otpError, setOtpError] = useState('');

  const forgotPasswordMutation = useForgotPassword();
  const resetPasswordMutation = useResetPassword();

  const emailForm = useForm<ForgotPasswordInput>({
    resolver: zodResolver(forgotPasswordSchema),
  });

  const passwordForm = useForm2<ResetPasswordInput>({
    resolver: zodResolver(resetPasswordSchema),
  });

  const onEmailSubmit = async (data: ForgotPasswordInput) => {
    try {
      const response = await forgotPasswordMutation.mutateAsync({
        email: data.email,
      });

      if (response.success) {
        setSubmittedEmail(data.email);
        setEmailSent(true);
        toast.success('OTP sent successfully! Check your email.');
        if (response.code) {
          console.warn('OTP Code received:', response.code);
        }
      } else {
        toast.error(response.message || 'Failed to send OTP');
      }
    } catch {
      emailForm.setError('root', { message: 'An unexpected error occurred' });
    }
  };

  const onOtpSubmit = () => {
    if (otp.length !== 6) {
      setOtpError('Please enter a valid 6-digit OTP');
      return;
    }
    setOtpError('');
    setShowPasswordModal(true);
  };

  const onPasswordSubmit = async (data: ResetPasswordInput) => {
    try {
      await resetPasswordMutation.mutateAsync({
        email: submittedEmail,
        otp,
        newPassword: data.password,
      });

      if (resetPasswordMutation.data?.success) {
        toast.success('Password reset successful! Redirecting...');
        setTimeout(() => {
          window.location.href = '/sign-up';
        }, 2000);
      } else {
        toast.error(resetPasswordMutation.data?.message || 'Password reset failed');
      }
    } catch (error) {
      console.warn('Reset password error:', error);
      toast.error('An unexpected error occurred');
    }
  };

  if (emailSent && !showPasswordModal) {
    return (
      <div className="w-full">
        <h1 className="mb-2 text-xl font-semibold sm:text-2xl">Enter OTP</h1>
        <p className="mb-6 text-sm text-gray-600">
          We&apos;ve sent a 6-digit OTP to <strong>{submittedEmail}</strong>
        </p>

        <div className="space-y-4">
          <div>
            <Input
              type="text"
              placeholder="Enter 6-digit OTP"
              className="h-11 rounded-full border-gray-300 px-4 text-center font-mono text-lg tracking-widest sm:h-12 sm:px-5"
              value={otp}
              onChange={(e) => {
                const value = e.target.value.replace(/\D/g, '').slice(0, 6);
                setOtp(value);
                setOtpError('');
              }}
              maxLength={6}
            />
            {otpError && <p className="mt-1 ml-4 text-sm text-red-500">{otpError}</p>}
          </div>

          <Button
            onClick={onOtpSubmit}
            disabled={otp.length !== 6}
            className="h-11 w-full rounded-full bg-gray-100 font-medium text-black hover:bg-gray-200 sm:h-12"
          >
            Verify OTP
          </Button>

          <div className="text-center">
            <button
              type="button"
              onClick={() => setEmailSent(false)}
              className="text-sm font-medium text-amber-500 hover:underline"
            >
              Back
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="w-full">
        <h1 className="mb-2 text-xl font-semibold sm:text-2xl">Trouble logging in?</h1>
        <p className="mb-6 text-sm text-gray-600">
          Enter your email and we&apos;ll send you an OTP to reset your password
        </p>

        <form onSubmit={emailForm.handleSubmit(onEmailSubmit)} className="space-y-4">
          {emailForm.formState.errors.root && (
            <Alert variant="destructive">
              <AlertDescription>{emailForm.formState.errors.root.message}</AlertDescription>
            </Alert>
          )}

          <div>
            <Input
              type="email"
              placeholder="Enter your email"
              className="h-11 rounded-full border-gray-300 px-4 sm:h-12 sm:px-5"
              {...emailForm.register('email')}
            />
            {emailForm.formState.errors.email && (
              <p className="mt-1 ml-4 text-sm text-red-500">
                {emailForm.formState.errors.email.message}
              </p>
            )}
          </div>

          <Button
            type="submit"
            disabled={emailForm.formState.isSubmitting || forgotPasswordMutation.isPending}
            className="h-11 w-full rounded-full bg-gray-100 font-medium text-black hover:bg-gray-200 sm:h-12"
          >
            {emailForm.formState.isSubmitting || forgotPasswordMutation.isPending
              ? 'Sending OTP...'
              : 'Send OTP'}
          </Button>

          <div className="text-center">
            <Link href="/sign-in" className="text-sm font-medium text-amber-500 hover:underline">
              Back
            </Link>
          </div>
        </form>
      </div>

      <Dialog open={showPasswordModal} onOpenChange={setShowPasswordModal}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Reset Password</DialogTitle>
          </DialogHeader>

          <form onSubmit={passwordForm.handleSubmit(onPasswordSubmit)} className="space-y-4">
            {passwordForm.formState.errors.root && (
              <Alert variant="destructive">
                <AlertDescription>{passwordForm.formState.errors.root.message}</AlertDescription>
              </Alert>
            )}

            <div>
              <Input
                type="password"
                placeholder="Enter new password"
                className="h-11 rounded-full border-gray-300 px-4 sm:h-12 sm:px-5"
                {...passwordForm.register('password')}
              />
              {passwordForm.formState.errors.password && (
                <p className="mt-1 ml-4 text-sm text-red-500">
                  {passwordForm.formState.errors.password.message}
                </p>
              )}
            </div>

            <div>
              <Input
                type="password"
                placeholder="Confirm new password"
                className="h-11 rounded-full border-gray-300 px-4 sm:h-12 sm:px-5"
                {...passwordForm.register('confirmPassword')}
              />
              {passwordForm.formState.errors.confirmPassword && (
                <p className="mt-1 ml-4 text-sm text-red-500">
                  {passwordForm.formState.errors.confirmPassword.message}
                </p>
              )}
            </div>

            <Button
              type="submit"
              disabled={passwordForm.formState.isSubmitting}
              className="bg-gradient-yellow h-11 w-full rounded-full text-black sm:h-12"
            >
              {passwordForm.formState.isSubmitting ? 'Resetting...' : 'Reset Password'}
            </Button>
          </form>
        </DialogContent>
      </Dialog>
    </>
  );
}
