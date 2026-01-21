import { z } from 'zod';

export const signInSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(1, 'Password is required'),
});

export const serviceProviderTypes = ['restaurant', 'home-chef'] as const;

export const signUpSchema = z.object({
  serviceProviderType: z.enum(serviceProviderTypes, {
    message: 'Please select a service type',
  }),
  businessName: z.string().min(1, 'This field is required'),
  businessDescription: z
    .string()
    .min(10, 'Description must be at least 10 characters')
    .max(500, 'Description must be under 500 characters'),
  email: z.string().email('Invalid email address'),
  password: z.string().min(8, 'Password must be at least 8 characters'),
  phoneNumber: z.string().min(1, 'Phone number is required'),
  cuisines: z.array(z.string()).min(1, 'Please select at least one cuisine'),
});

export const otpSchema = z.object({
  otp: z.string().length(6, 'OTP must be 6 digits').regex(/^\d+$/, 'OTP must be numeric'),
});

export const forgotPasswordSchema = z
  .object({
    email: z.string().email('Invalid email address').optional(),
    phone: z
      .string()
      .regex(/^923\d{9}$/, 'Phone must be in format 923XXXXXXXXX')
      .optional(),
  })
  .refine((data) => data.email || data.phone, {
    message: 'Either email or phone is required',
    path: ['email'],
  });

export const resetPasswordSchema = z
  .object({
    password: z.string().min(8, 'Password must be at least 8 characters'),
    confirmPassword: z.string().min(1, 'Please confirm your password'),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: 'Passwords do not match',
    path: ['confirmPassword'],
  });

export type SignInInput = z.infer<typeof signInSchema>;
export type SignUpInput = z.infer<typeof signUpSchema>;
export type OTPInput = z.infer<typeof otpSchema>;
export type ForgotPasswordInput = z.infer<typeof forgotPasswordSchema>;
export type ResetPasswordInput = z.infer<typeof resetPasswordSchema>;
