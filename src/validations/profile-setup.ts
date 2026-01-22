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

export const step3Schema = z
  .object({
    accountTitle: z.string().min(1, 'Account title is required'),
    bankName: z.string().min(1, 'Bank name is required'),
    iban: z.string().min(1, 'IBAN is required'),
    useExistingAddress: z.boolean().optional(),
    address: z.string().optional(),
    buildingName: z.string().optional(),
    street: z.string().optional(),
    houseNumber: z.string().optional(),
    billingState: z.string().optional(),
    billingCity: z.string().optional(),
    area: z.string().optional(),
    billingPostalCode: z.string().optional(),
  })
  .superRefine((data, ctx) => {
    if (!data.useExistingAddress) {
      // if (!data.address || data.address.trim() === '') {
      //   ctx.addIssue({ path: ['address'], message: 'Address is required', code: 'custom' });
      // }
      if (!data.street || data.street.trim() === '') {
        ctx.addIssue({ path: ['street'], message: 'Street is required', code: 'custom' });
      }
      if (!data.houseNumber || data.houseNumber.trim() === '') {
        ctx.addIssue({
          path: ['houseNumber'],
          message: 'House number is required',
          code: 'custom',
        });
      }
      if (!data.billingState || data.billingState.trim() === '') {
        ctx.addIssue({ path: ['billingState'], message: 'State is required', code: 'custom' });
      }
      if (!data.billingPostalCode || data.billingPostalCode.trim() === '') {
        ctx.addIssue({
          path: ['billingPostalCode'],
          message: 'Postal code is required',
          code: 'custom',
        });
      }
    }
  });

const timeSlotSchema = z.object({
  open: z.string().min(1, 'Open time is required'),
  close: z.string().min(1, 'Close time is required'),
});

const dayScheduleSchema = z.object({
  isOpen: z.boolean(),
  slots: z.array(timeSlotSchema),
});

export const step4Schema = z
  .object({
    monday: dayScheduleSchema,
    tuesday: dayScheduleSchema,
    wednesday: dayScheduleSchema,
    thursday: dayScheduleSchema,
    friday: dayScheduleSchema,
    saturday: dayScheduleSchema,
    sunday: dayScheduleSchema,
  })
  .refine(
    (data) => {
      const days = [
        data.monday,
        data.tuesday,
        data.wednesday,
        data.thursday,
        data.friday,
        data.saturday,
        data.sunday,
      ];
      return days.some((day) => day.isOpen);
    },
    {
      message: 'At least one day must be open',
    }
  )
  .refine(
    (data) => {
      const days = [
        data.monday,
        data.tuesday,
        data.wednesday,
        data.thursday,
        data.friday,
        data.saturday,
        data.sunday,
      ];
      return days.every((day) => !day.isOpen || day.slots.length > 0);
    },
    {
      message: 'Open days must have at least one time slot',
    }
  );

export type Step1Input = z.infer<typeof step1Schema>;
export type Step2Input = z.infer<typeof step2Schema>;
export type Step3Input = z.infer<typeof step3Schema>;
export type Step4Input = z.infer<typeof step4Schema>;
