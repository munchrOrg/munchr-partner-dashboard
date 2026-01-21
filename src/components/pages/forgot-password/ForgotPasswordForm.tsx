'use client';

import { isValidPhoneNumber } from 'libphonenumber-js';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import PhoneInput from 'react-phone-number-input';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';

import {
  useForgotPassword,
  useResendEmailOtp,
  useResendPhoneOtp,
  useVerifyForgotPasswordOtp,
} from '@/react-query/auth/mutations';
import 'react-phone-number-input/style.css';

type ForgotPasswordState = {
  userId: string | null;
  email: string | null;
  phone: string | null;
  expiresAt: Date | null;
  canResendAt: Date | null;
  resetToken: string | null;
  currentStep: 'enter-contact' | 'enter-otp' | 'success';
};

export function ForgotPasswordForm() {
  const [state, setState] = useState<ForgotPasswordState>({
    userId: null,
    email: null,
    phone: null,
    expiresAt: null,
    canResendAt: null,
    resetToken: null,
    currentStep: 'enter-contact',
  });

  const [contactType, setContactType] = useState<'email' | 'phone'>('email');
  const [contactValue, setContactValue] = useState('');

  // Clear input when switching between email and phone
  const handleContactTypeChange = (value: 'email' | 'phone') => {
    setContactType(value);
    if (value === 'phone') {
      setContactValue('+92'); // Set default Pakistan country code
    } else {
      setContactValue(''); // Clear for email
    }
  };
  const [otp, setOtp] = useState('');
  const [otpError, setOtpError] = useState('');
  const [timeLeft, setTimeLeft] = useState({ otpExpiry: 0, resendCooldown: 0 });

  const forgotPasswordMutation = useForgotPassword();
  const verifyOtpMutation = useVerifyForgotPasswordOtp();
  const resendEmailOtpMutation = useResendEmailOtp();
  const resendPhoneOtpMutation = useResendPhoneOtp();

  // Timer effects
  useEffect(() => {
    const interval = setInterval(() => {
      const now = new Date();
      const otpExpiry = state.expiresAt
        ? Math.max(0, Math.ceil((state.expiresAt.getTime() - now.getTime()) / 1000))
        : 0;
      const resendCooldown = state.canResendAt
        ? Math.max(0, Math.ceil((state.canResendAt.getTime() - now.getTime()) / 1000))
        : 0;

      setTimeLeft({ otpExpiry, resendCooldown });

      // Auto redirect to success if OTP expired
      if (state.currentStep === 'enter-otp' && otpExpiry === 0 && state.expiresAt) {
        toast.error('OTP expired, please request a new one');
        setState((prev) => ({
          ...prev,
          currentStep: 'enter-contact',
          userId: null,
          email: null,
          phone: null,
          expiresAt: null,
          canResendAt: null,
        }));
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [state.expiresAt, state.canResendAt, state.currentStep]);

  const onContactSubmit = async () => {
    if (!contactValue.trim()) {
      toast.error(`Please enter your ${contactType}`);
      return;
    }

    // Validate phone number if phone is selected
    if (contactType === 'phone' && !isValidPhoneNumber(contactValue)) {
      toast.error('Please enter a valid phone number');
      return;
    }

    try {
      const requestData =
        contactType === 'email'
          ? { email: contactValue }
          : { phone: contactValue.replace(/^\+/, '') }; // Remove + prefix from phone number

      const response = await forgotPasswordMutation.mutateAsync(requestData);
      console.warn('Forgot password response:', response, 'Request data:', requestData);

      if (response.success && response.userId) {
        // User exists, proceed to OTP step
        setState({
          userId: response.userId,
          email: response.email || null,
          phone: response.phone || null,
          expiresAt: response.expiresAt ? new Date(response.expiresAt) : null,
          canResendAt: response.canResendAt ? new Date(response.canResendAt) : null,
          resetToken: null,
          currentStep: 'enter-otp',
        });
        toast.success('OTP sent successfully! Check your email/phone.');
      } else if (response.success) {
        toast.success(
          response.message ||
            'If an account with this email/phone exists, a password reset OTP has been sent.'
        );
        // Still proceed to OTP step for better UX
        setState((prev) => ({
          ...prev,
          email: contactType === 'email' ? contactValue : null,
          phone: contactType === 'phone' ? contactValue : null,
          currentStep: 'enter-otp',
        }));
      } else {
        toast.error(response.message || 'Failed to send OTP');
      }
    } catch (error) {
      console.warn('Forgot password error:', error);
      toast.error('An unexpected error occurred');
    }
  };

  const onOtpSubmit = async () => {
    if (!state.userId && !state.email && !state.phone) {
      return;
    }

    if (otp.length !== 6) {
      setOtpError('Please enter a valid 6-digit OTP');
      return;
    }

    try {
      const requestData: { userId?: string; email?: string; phone?: string; otp: string } = { otp };

      // Use userId if available, otherwise use email or phone for identification
      if (state.userId) {
        requestData.userId = state.userId;
      } else if (state.email) {
        requestData.email = state.email;
      } else if (state.phone) {
        requestData.phone = state.phone.replace(/^\+/, ''); // Remove + prefix
      }

      const response = await verifyOtpMutation.mutateAsync(requestData);

      if (response.success) {
        // Navigate to reset password page with resetToken
        window.location.href = `/reset-password?token=${encodeURIComponent(response.resetToken)}`;
        toast.success('OTP verified successfully!');
      } else {
        toast.error(response.message || 'Invalid OTP');
      }
    } catch (error) {
      console.warn('Verify OTP error:', error);
      toast.error('An unexpected error occurred');
    }
  };

  const handleResendOtp = async () => {
    if (!state.userId || timeLeft.resendCooldown > 0) {
      return;
    }

    try {
      let response;
      if (state.email) {
        response = await resendEmailOtpMutation.mutateAsync({
          userId: state.userId,
          email: state.email,
          purpose: 'password_reset',
        });
      } else if (state.phone) {
        response = await resendPhoneOtpMutation.mutateAsync({
          userId: state.userId,
          phone: state.phone.replace(/^\+/, ''), // Remove + prefix from phone number
          purpose: 'password_reset',
        });
      } else {
        return; // Should not happen
      }

      if (response.success) {
        setState((prev) => ({
          ...prev,
          expiresAt: response.expiresAt ? new Date(response.expiresAt) : prev.expiresAt,
          canResendAt: response.canResendAt ? new Date(response.canResendAt) : prev.canResendAt,
        }));
        toast.success('OTP sent successfully!');
      } else {
        toast.error(response.message || 'Failed to resend OTP');
      }
    } catch (error) {
      console.warn('Resend OTP error:', error);
      toast.error('An unexpected error occurred');
    }
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const maskContact = (contact: string | null, type: 'email' | 'phone') => {
    if (!contact) {
      return '';
    }
    if (type === 'email') {
      const parts = contact.split('@');
      if (parts.length === 2) {
        const [local, domain] = parts as [string, string];
        return `${local.slice(0, 2)}***@${domain}`;
      }
      return contact; // Return as-is if not a valid email format
    } else {
      // Phone masking
      return `${contact.slice(0, 3)}***${contact.slice(-3)}`;
    }
  };

  // Step 1: Enter Contact (Email or Phone)
  if (state.currentStep === 'enter-contact') {
    return (
      <div className="w-full">
        <h1 className="mb-2 text-xl font-semibold sm:text-2xl">Trouble logging in?</h1>
        <p className="mb-6 text-sm text-gray-600">
          Enter your email or phone number and we&apos;ll send you an OTP to reset your password
        </p>

        <div className="space-y-4">
          {/* Contact Type Selection */}
          <RadioGroup
            value={contactType}
            onValueChange={handleContactTypeChange}
            className="flex gap-6"
          >
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="email" id="email" />
              <Label htmlFor="email" className="text-sm">
                Email
              </Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="phone" id="phone" />
              <Label htmlFor="phone" className="text-sm">
                Phone
              </Label>
            </div>
          </RadioGroup>

          {/* Contact Input */}
          <div>
            {contactType === 'email' ? (
              <Input
                type="email"
                placeholder="Enter your email"
                className="h-11 rounded-full border-gray-300 px-4 sm:h-12 sm:px-5"
                value={contactValue}
                onChange={(e) => setContactValue(e.target.value)}
              />
            ) : (
              <PhoneInput
                international
                defaultCountry="PK"
                value={contactValue}
                onChange={(value) => setContactValue(value || '')}
                className="flex h-11 w-full items-center rounded-full border border-gray-300 px-4 sm:h-12 sm:px-5 [&_.PhoneInputCountry]:mr-2 [&_.PhoneInputInput]:flex-1 [&_.PhoneInputInput]:border-none [&_.PhoneInputInput]:bg-transparent [&_.PhoneInputInput]:text-sm [&_.PhoneInputInput]:outline-none"
                placeholder="Enter your phone number"
              />
            )}
          </div>

          <Button
            onClick={onContactSubmit}
            disabled={!contactValue.trim() || forgotPasswordMutation.isPending}
            className="h-11 w-full rounded-full bg-gray-100 font-medium text-black hover:bg-gray-200 sm:h-12"
          >
            {forgotPasswordMutation.isPending ? 'Sending OTP...' : 'Send OTP'}
          </Button>

          <div className="text-center">
            <Link href="/sign-in" className="text-sm font-medium text-amber-500 hover:underline">
              Back
            </Link>
          </div>
        </div>
      </div>
    );
  }

  // Step 2: Enter OTP
  if (state.currentStep === 'enter-otp') {
    const displayContact = state.email || state.phone;
    const displayType = state.email ? 'email' : 'phone';
    const maskedContact = maskContact(displayContact, displayType);

    return (
      <div className="w-full">
        <h1 className="mb-2 text-xl font-semibold sm:text-2xl">Enter OTP</h1>
        <p className="mb-6 text-sm text-gray-600">
          We&apos;ve sent a 6-digit OTP to <strong>{maskedContact}</strong>
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
            {/* {timeLeft.otpExpiry > 0 && (
              <p className="mt-1 text-xs text-gray-500 text-center">
                OTP expires in {formatTime(timeLeft.otpExpiry)}
              </p>
            )} */}
          </div>

          <Button
            onClick={onOtpSubmit}
            disabled={otp.length !== 6 || verifyOtpMutation.isPending}
            className="h-11 w-full rounded-full bg-gray-100 font-medium text-black hover:bg-gray-200 sm:h-12"
          >
            {verifyOtpMutation.isPending ? 'Verifying...' : 'Verify OTP'}
          </Button>

          <div className="space-y-2 text-center">
            <Button
              type="button"
              variant="ghost"
              onClick={handleResendOtp}
              disabled={
                timeLeft.resendCooldown > 0 ||
                resendEmailOtpMutation.isPending ||
                resendPhoneOtpMutation.isPending
              }
              className="text-sm text-amber-500 hover:underline disabled:opacity-50"
            >
              {timeLeft.resendCooldown > 0
                ? `Resend OTP in ${formatTime(timeLeft.resendCooldown)}`
                : 'Resend OTP'}
            </Button>

            <button
              type="button"
              onClick={() =>
                setState((prev) => ({
                  ...prev,
                  currentStep: 'enter-contact',
                  userId: null,
                  email: null,
                  phone: null,
                  expiresAt: null,
                  canResendAt: null,
                }))
              }
              className="block text-sm font-medium text-amber-500 hover:underline"
            >
              Back
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Step 3: Success
  return (
    <div className="w-full">
      <h1 className="mb-2 text-xl font-semibold sm:text-2xl">Password Reset Successful!</h1>
      <p className="mb-6 text-sm text-gray-600">
        Your password has been reset successfully. You will be redirected to the sign-in page
        shortly.
      </p>

      <div className="text-center">
        <Link href="/sign-in" className="text-sm font-medium text-amber-500 hover:underline">
          Go to Sign In
        </Link>
      </div>
    </div>
  );
}
