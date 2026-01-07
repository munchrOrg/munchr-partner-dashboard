'use client';

import Link from 'next/link';
import { useState } from 'react';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

export function ResetPasswordForm() {
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    if (password.length < 8) {
      setError('Password must be at least 8 characters');
      return;
    }

    setIsLoading(true);

    try {
      // Handler to be implemented - should reset password and redirect to sign-in
    } catch {
      setError('An unexpected error occurred');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="w-full">
      <h1 className="mb-2 text-xl font-semibold sm:text-2xl">Reset Password</h1>
      <p className="mb-6 text-sm text-gray-600">
        Make sure your password is different from previous password
      </p>

      <form onSubmit={onSubmit} className="space-y-4">
        {error && (
          <Alert variant="destructive">
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        <Input
          type="password"
          placeholder="Enter your New password"
          className="h-11 rounded-full border-gray-300 px-4 sm:h-12 sm:px-5"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />

        <Input
          type="password"
          placeholder="Re-type password"
          className="h-11 rounded-full border-gray-300 px-4 sm:h-12 sm:px-5"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          required
        />

        <Button
          type="submit"
          disabled={isLoading || !password.trim() || !confirmPassword.trim()}
          className="h-11 w-full rounded-full text-black sm:h-12"
          style={{
            background: 'linear-gradient(90deg, #FFBE0D 0%, #F9F993 100%)',
          }}
        >
          {isLoading ? 'Resetting...' : 'Submit'}
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
