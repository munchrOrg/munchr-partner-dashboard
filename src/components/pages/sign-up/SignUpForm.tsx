'use client';

import Link from 'next/link';
import { useState } from 'react';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

export function SignUpForm() {
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    businessName: '',
    businessDescription: '',
    email: '',
    phoneNumber: '',
    cuisines: '',
    serviceProviderType: '',
  });
  const [logoFile, setLogoFile] = useState<File | null>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSelectChange = (name: string, value: string) => {
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null;
    setLogoFile(file);
  };

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    try {
      // Handler to be implemented - should send OTP and redirect to verify-otp page
      // Example: router.push(`/verify-otp?phone=${encodeURIComponent(formData.phoneNumber)}&type=signup`);
    } catch {
      setError('An unexpected error occurred');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="w-full">
      <h1 className="mb-6 text-xl font-semibold sm:text-2xl">Sign up with your email</h1>

      <form onSubmit={onSubmit} className="space-y-4">
        {error && (
          <Alert variant="destructive">
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        <Input
          type="text"
          name="businessName"
          placeholder="Enter your Business Name"
          className="h-11 rounded-full border-gray-300 px-4 sm:h-12 sm:px-5"
          value={formData.businessName}
          onChange={handleChange}
          required
        />

        <textarea
          name="businessDescription"
          placeholder="Enter you business description"
          className="focus:border-ring focus:ring-ring/50 min-h-[100px] w-full resize-none rounded-2xl border border-gray-300 px-4 py-3 text-sm outline-none focus:ring-[3px] sm:px-5"
          value={formData.businessDescription}
          onChange={handleChange}
          required
        />

        <Input
          type="email"
          name="email"
          placeholder="Enter your Email"
          className="h-11 rounded-full border-gray-300 px-4 sm:h-12 sm:px-5"
          value={formData.email}
          onChange={handleChange}
          required
        />

        <Input
          type="tel"
          name="phoneNumber"
          placeholder="Enter your Phone Number"
          className="h-11 rounded-full border-gray-300 px-4 sm:h-12 sm:px-5"
          value={formData.phoneNumber}
          onChange={handleChange}
          required
        />

        <Select
          value={formData.cuisines}
          onValueChange={(value) => handleSelectChange('cuisines', value)}
          required
        >
          <SelectTrigger className="h-11 w-full rounded-full border-gray-300 px-4 sm:h-12 sm:px-5">
            <SelectValue placeholder="Cuisines" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="italian">Italian</SelectItem>
            <SelectItem value="chinese">Chinese</SelectItem>
            <SelectItem value="indian">Indian</SelectItem>
            <SelectItem value="mexican">Mexican</SelectItem>
            <SelectItem value="japanese">Japanese</SelectItem>
            <SelectItem value="thai">Thai</SelectItem>
            <SelectItem value="american">American</SelectItem>
            <SelectItem value="other">Other</SelectItem>
          </SelectContent>
        </Select>

        <Select
          value={formData.serviceProviderType}
          onValueChange={(value) => handleSelectChange('serviceProviderType', value)}
          required
        >
          <SelectTrigger className="h-11 w-full rounded-full border-gray-300 px-4 sm:h-12 sm:px-5">
            <SelectValue placeholder="Service provider type" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="restaurant">Restaurant</SelectItem>
            <SelectItem value="cafe">Café</SelectItem>
            <SelectItem value="food-truck">Food Truck</SelectItem>
            <SelectItem value="cloud-kitchen">Cloud Kitchen</SelectItem>
            <SelectItem value="catering">Catering</SelectItem>
          </SelectContent>
        </Select>

        <label className="flex min-h-[100px] w-full cursor-pointer flex-col items-center justify-center rounded-2xl border border-dashed border-gray-300 bg-white transition-colors hover:bg-gray-50">
          <input type="file" accept="image/*" className="hidden" onChange={handleFileChange} />
          <svg
            className="mb-2 h-6 w-6 text-gray-400"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12"
            />
          </svg>
          <span className="text-sm text-gray-500">
            {logoFile ? logoFile.name : 'Upload Restaurant logo'}
          </span>
        </label>

        <Button
          type="submit"
          disabled={isLoading}
          className="h-11 w-full rounded-full bg-amber-400 font-medium text-black hover:bg-amber-500 sm:h-12"
        >
          {isLoading ? 'Creating account...' : 'Continue'}
        </Button>

        <p className="mt-4 text-center text-xs text-gray-400">
          By continuing you acknowledge that your personal data will be processed
          <br className="hidden sm:block" />
          <span className="sm:hidden"> </span>
          in accordance with the{' '}
          <Link href="/privacy" className="hover:underline">
            Privacy Statement
          </Link>
        </p>

        <p className="mt-6 text-center text-sm">
          Already have an account?{' '}
          <Link href="/sign-in" className="ml-2 font-medium text-amber-500 hover:underline">
            Sign in
          </Link>
        </p>
      </form>
    </div>
  );
}
