'use client';

import { useState } from 'react';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { FormFooter } from './FormFooter';

type PhoneLoginFormProps = {
  onSwitchToEmail: () => void;
};

export function PhoneLoginForm({ onSwitchToEmail }: PhoneLoginFormProps) {
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [phoneNumber, setPhoneNumber] = useState('');

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    try {
      // Handler to be implemented - should redirect to OTP page
      // Example: router.push(`/verify-otp?phone=${encodeURIComponent(phoneNumber)}&type=login`);
    } catch {
      setError('An unexpected error occurred');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="w-full">
      <h1 className="mb-6 text-center text-xl font-semibold sm:text-2xl">Log in with your phone</h1>

      <form onSubmit={onSubmit} className="space-y-4">
        {error && (
          <Alert variant="destructive">
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        <div>
          <Input
            type="tel"
            placeholder="Enter your phone number"
            className="h-11 rounded-full border-gray-300 px-4 sm:h-12 sm:px-5"
            value={phoneNumber}
            onChange={(e) => setPhoneNumber(e.target.value)}
          />
        </div>

        <Button
          type="submit"
          disabled={isLoading || !phoneNumber.trim()}
          className="h-11 w-full rounded-full bg-amber-400 font-medium text-black hover:bg-amber-500 sm:h-12"
        >
          {isLoading ? 'Sending OTP...' : 'Continue'}
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
