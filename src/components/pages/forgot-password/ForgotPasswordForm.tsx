'use client';

import Link from 'next/link';
import { useState } from 'react';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

export function ForgotPasswordForm() {
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [email, setEmail] = useState('');
  const [isSuccess, setIsSuccess] = useState(false);

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    try {
      // Handler to be implemented - should send reset link to email
      setIsSuccess(true);
    } catch {
      setError('An unexpected error occurred');
    } finally {
      setIsLoading(false);
    }
  };

  if (isSuccess) {
    return (
      <div className="w-full text-center">
        <h1 className="mb-4 text-xl font-semibold sm:text-2xl">Check your email</h1>
        <p className="mb-6 text-sm text-gray-600">
          We&apos;ve sent a password reset link to <strong>{email}</strong>
        </p>
        <Link href="/sign-in" className="text-sm font-medium text-amber-500 hover:underline">
          Back to sign in
        </Link>
      </div>
    );
  }

  return (
    <div className="w-full">
      <h1 className="mb-2 text-xl font-semibold sm:text-2xl">Trouble logging in?</h1>
      <p className="mb-6 text-sm text-gray-600">
        Enter your email and we&apos;ll send you a link to reset your password
      </p>

      <form onSubmit={onSubmit} className="space-y-4">
        {error && (
          <Alert variant="destructive">
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        <Input
          type="email"
          placeholder="Enter your email"
          className="h-11 rounded-full border-gray-300 px-4 sm:h-12 sm:px-5"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />

        <Button
          type="submit"
          disabled={isLoading || !email.trim()}
          className="h-11 w-full rounded-full bg-gray-100 font-medium text-black hover:bg-gray-200 sm:h-12"
        >
          {isLoading ? 'Sending...' : 'Send reset link'}
        </Button>

        <div className="text-center">
          <Link href="/sign-in" className="text-sm font-medium text-amber-500 hover:underline">
            Back
          </Link>
        </div>
      </form>
    </div>
  );
}
