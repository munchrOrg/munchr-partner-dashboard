'use client';

import type { Option } from '@/components/ui/multi-select';
import type { SignUpInput } from '@/validations/auth';
import { zodResolver } from '@hookform/resolvers/zod';
import { isValidPhoneNumber } from 'libphonenumber-js';
import { X } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { useCallback, useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import PhoneInput from 'react-phone-number-input';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { MultiSelect } from '@/components/ui/multi-select';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { signUpSchema } from '@/validations/auth';
import 'react-phone-number-input/style.css';

const CUISINE_OPTIONS: Option[] = [
  { value: 'italian', label: 'Italian', group: 'Cuisines' },
  { value: 'chinese', label: 'Chinese', group: 'Cuisines' },
  { value: 'indian', label: 'Indian', group: 'Cuisines' },
  { value: 'mexican', label: 'Mexican', group: 'Cuisines' },
  { value: 'japanese', label: 'Japanese', group: 'Cuisines' },
  { value: 'thai', label: 'Thai', group: 'Cuisines' },
  { value: 'american', label: 'American', group: 'Cuisines' },
  { value: 'mediterranean', label: 'Mediterranean', group: 'Cuisines' },
  { value: 'french', label: 'French', group: 'Cuisines' },
  { value: 'korean', label: 'Korean', group: 'Cuisines' },
  { value: 'vietnamese', label: 'Vietnamese', group: 'Cuisines' },
  { value: 'greek', label: 'Greek', group: 'Cuisines' },
  { value: 'middle-eastern', label: 'Middle Eastern', group: 'Cuisines' },
  { value: 'caribbean', label: 'Caribbean', group: 'Cuisines' },
  { value: 'african', label: 'African', group: 'Cuisines' },
  { value: 'vegan', label: 'Vegan', group: 'Dietary' },
  { value: 'vegetarian', label: 'Vegetarian', group: 'Dietary' },
  { value: 'gluten-free', label: 'Gluten-Free', group: 'Dietary' },
  { value: 'halal', label: 'Halal', group: 'Dietary' },
  { value: 'kosher', label: 'Kosher', group: 'Dietary' },
  { value: 'keto', label: 'Keto', group: 'Dietary' },
  { value: 'dairy-free', label: 'Dairy-Free', group: 'Dietary' },
  { value: 'nut-free', label: 'Nut-Free', group: 'Dietary' },
  { value: 'organic', label: 'Organic', group: 'Dietary' },
  { value: 'low-carb', label: 'Low-Carb', group: 'Dietary' },
  { value: 'paleo', label: 'Paleo', group: 'Dietary' },
];

const ALLOWED_FILE_TYPES = ['image/jpeg', 'image/png', 'image/webp'];
const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB

export function SignUpForm() {
  const [logoFile, setLogoFile] = useState<File | null>(null);
  const [logoPreview, setLogoPreview] = useState<string | null>(null);
  const [logoError, setLogoError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    control,
    setError,
    watch,
    formState: { errors, isSubmitting, isValid },
  } = useForm<SignUpInput>({
    resolver: zodResolver(signUpSchema),
    mode: 'onChange',
    defaultValues: {
      cuisines: [],
    },
  });

  const serviceProviderType = watch('serviceProviderType');
  const businessDescription = watch('businessDescription') ?? '';

  const getNamePlaceholder = () => {
    if (serviceProviderType === 'home-chef') {
      return 'Enter your Kitchen Name *';
    }
    if (serviceProviderType === 'restaurant') {
      return 'Enter your Business Name *';
    }
    return 'Enter your Business/Kitchen Name *';
  };

  const handleFileChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    setLogoError(null);

    if (!file) {
      return;
    }

    if (!ALLOWED_FILE_TYPES.includes(file.type)) {
      setLogoError('File must be JPG, PNG, or WebP');
      return;
    }

    if (file.size > MAX_FILE_SIZE) {
      setLogoError('File size must be under 5MB');
      return;
    }

    setLogoFile(file);
    const reader = new FileReader();
    reader.onload = (event) => {
      setLogoPreview(event.target?.result as string);
    };
    reader.readAsDataURL(file);
  }, []);

  const handleRemoveLogo = useCallback(() => {
    setLogoFile(null);
    setLogoPreview(null);
    setLogoError(null);
  }, []);

  const onSubmit = async (data: SignUpInput) => {
    // Validate phone number
    if (!isValidPhoneNumber(data.phoneNumber)) {
      setError('phoneNumber', { message: 'Invalid phone number' });
      return;
    }

    try {
      // Handler to be implemented - should send OTP and redirect to verify-otp page
      console.log('Sign up data:', data, logoFile);
    } catch {
      setError('root', { message: 'An unexpected error occurred' });
    }
  };

  return (
    <div className="w-full">
      <h1 className="mb-6 text-xl font-semibold sm:text-2xl">Sign up with your email</h1>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        {errors.root && (
          <Alert variant="destructive">
            <AlertDescription>{errors.root.message}</AlertDescription>
          </Alert>
        )}

        {/* Service Provider Type - First */}
        <div>
          <Controller
            name="serviceProviderType"
            control={control}
            render={({ field }) => (
              <Select value={field.value} onValueChange={field.onChange}>
                <SelectTrigger className="h-11 w-full rounded-full border-gray-300 px-4 sm:h-12 sm:px-5">
                  <SelectValue placeholder="Service provider type *" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="restaurant">Restaurant</SelectItem>
                  <SelectItem value="home-chef">Home Chef</SelectItem>
                </SelectContent>
              </Select>
            )}
          />
          {errors.serviceProviderType && (
            <p className="mt-1 ml-4 text-sm text-red-500">{errors.serviceProviderType.message}</p>
          )}
        </div>

        {/* Business/Kitchen Name - Conditional label */}
        <div>
          <Input
            type="text"
            placeholder={getNamePlaceholder()}
            className="h-11 rounded-full border-gray-300 px-4 sm:h-12 sm:px-5"
            {...register('businessName')}
          />
          {errors.businessName && (
            <p className="mt-1 ml-4 text-sm text-red-500">{errors.businessName.message}</p>
          )}
        </div>

        {/* Business Description with character count */}
        <div>
          <textarea
            placeholder="Enter your business description (10-500 characters) *"
            className="focus:border-ring focus:ring-ring/50 min-h-[100px] w-full resize-none rounded-2xl border border-gray-300 px-4 py-3 text-sm outline-none focus:ring-[3px] sm:px-5"
            {...register('businessDescription')}
          />
          <div className="mt-1 flex justify-between px-4">
            {errors.businessDescription ? (
              <p className="text-sm text-red-500">{errors.businessDescription.message}</p>
            ) : (
              <span />
            )}
            <span
              className={`text-xs ${
                businessDescription.length > 500 ||
                (businessDescription.length > 0 && businessDescription.length < 10)
                  ? 'text-red-500'
                  : 'text-gray-400'
              }`}
            >
              {businessDescription.length} / 500
            </span>
          </div>
        </div>

        {/* Email */}
        <div>
          <Input
            type="email"
            placeholder="Enter your Email *"
            className="h-11 rounded-full border-gray-300 px-4 sm:h-12 sm:px-5"
            {...register('email')}
          />
          {errors.email && <p className="mt-1 ml-4 text-sm text-red-500">{errors.email.message}</p>}
        </div>

        {/* Phone Number with country code */}
        <div>
          <Controller
            name="phoneNumber"
            control={control}
            render={({ field }) => (
              <PhoneInput
                international
                defaultCountry="PK"
                value={field.value}
                onChange={(value) => field.onChange(value ?? '')}
                className="phone-input-container flex h-11 w-full items-center rounded-full border border-gray-300 px-4 sm:h-12 sm:px-5 [&_.PhoneInputCountry]:mr-2 [&_.PhoneInputInput]:flex-1 [&_.PhoneInputInput]:border-none [&_.PhoneInputInput]:bg-transparent [&_.PhoneInputInput]:text-sm [&_.PhoneInputInput]:outline-none"
                placeholder="Enter your Phone Number *"
              />
            )}
          />
          {errors.phoneNumber && (
            <p className="mt-1 ml-4 text-sm text-red-500">{errors.phoneNumber.message}</p>
          )}
        </div>

        {/* Cuisines Multi-Select */}
        <div>
          <Controller
            name="cuisines"
            control={control}
            render={({ field }) => (
              <MultiSelect
                options={CUISINE_OPTIONS}
                selected={field.value}
                onChange={field.onChange}
                placeholder="Select cuisines *"
                emptyMessage="No cuisines found."
              />
            )}
          />
          {errors.cuisines && (
            <p className="mt-1 ml-4 text-sm text-red-500">{errors.cuisines.message}</p>
          )}
        </div>

        {/* Logo Upload with Side-by-Side Preview */}
        <div className="flex gap-4">
          <label className="flex min-h-[100px] flex-1 cursor-pointer flex-col items-center justify-center rounded-2xl border border-dashed border-gray-300 bg-white transition-colors hover:bg-gray-50">
            <input
              type="file"
              accept=".jpg,.jpeg,.png,.webp"
              className="hidden"
              onChange={handleFileChange}
            />
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
              {logoFile ? 'Change logo' : 'Upload logo'}
            </span>
            <span className="mt-1 text-xs text-gray-400">JPG, PNG, WebP (max 5MB)</span>
          </label>

          {logoPreview && (
            <div className="relative">
              <div className="relative h-[100px] w-[100px] overflow-hidden rounded-2xl border border-gray-200">
                <Image src={logoPreview} alt="Logo preview" fill className="object-cover" />
              </div>
              <button
                type="button"
                onClick={handleRemoveLogo}
                className="absolute -top-2 -right-2 rounded-full bg-red-500 p-1 text-white shadow-md hover:bg-red-600"
              >
                <X className="size-3" />
              </button>
            </div>
          )}
        </div>
        {logoError && <p className="ml-4 text-sm text-red-500">{logoError}</p>}

        <Button
          type="submit"
          disabled={isSubmitting || !isValid}
          className="bg-gradient-yellow h-11 w-full rounded-full font-medium text-black sm:h-12"
        >
          {isSubmitting ? 'Creating account...' : 'Continue'}
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
