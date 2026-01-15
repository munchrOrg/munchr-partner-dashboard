import { z } from 'zod';

export const step1Schema = z.object({
  businessName: z
    .string()
    .min(1, 'Business name is required')
    .min(2, 'Business name must be at least 2 characters'),
  businessDescription: z
    .string()
    .min(1, 'Business description is required')
    .min(10, 'Business description must be at least 10 characters'),
  cuisines: z.string().min(1, 'Cuisines is required'),
  location: z.string().min(1, 'Location is required'),
});

export const step2Schema = z.object({
  phoneNumber: z
    .string()
    .min(1, 'Phone number is required')
    .min(10, 'Phone number must be at least 10 digits'),
  address: z.string().min(1, 'Address is required').min(5, 'Address must be at least 5 characters'),
  city: z.string().min(1, 'City is required').min(2, 'City must be at least 2 characters'),
});

export const step3Schema = z.object({
  languagePreference: z.string().min(1, 'Please select a language preference'),
  timezone: z.string().min(1, 'Please select a timezone'),
  notificationPreferences: z
    .array(z.string())
    .min(1, 'Please select at least one notification preference'),
});

export const step4Schema = z.object({
  termsAndConditions: z.boolean().refine((val) => val === true, {
    message: 'You must accept the terms and conditions',
  }),
  privacyPolicy: z.boolean().refine((val) => val === true, {
    message: 'You must accept the privacy policy',
  }),
  marketingEmails: z.boolean(),
});

export type Step1Input = z.infer<typeof step1Schema>;
export type Step2Input = z.infer<typeof step2Schema>;
export type Step3Input = z.infer<typeof step3Schema>;
export type Step4Input = z.infer<typeof step4Schema>;
