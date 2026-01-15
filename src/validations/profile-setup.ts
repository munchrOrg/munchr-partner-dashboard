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
  bankProofFiles: z
    .array(
      z.object({
        name: z.string(),
        url: z.string(),
        size: z.number().optional(),
      })
    )
    .min(1, 'At least one bank proof file is required'),
});

export const step3Schema = z.object({
  accountTitle: z.string().min(1, 'Account title is required'),
  bankName: z.string().min(1, 'Bank name is required'),
  iban: z.string().min(1, 'IBAN is required'),
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
