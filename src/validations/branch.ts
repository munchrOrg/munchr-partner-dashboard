import { z } from 'zod';

export const branchStep1Schema = z.object({
  businessName: z
    .string()
    .min(1, 'Business name is required')
    .min(2, 'Business name must be at least 2 characters'),
  description: z
    .string()
    .min(1, 'Business description is required')
    .min(10, 'Business description must be at least 10 characters')
    .max(500, 'Business description must be under 500 characters'),
  businessEmail: z.string().min(1, 'Business email is required').email('Invalid email address'),
  password: z.string().min(8, 'Password must be at least 8 characters'),
  cuisine: z.string().min(1, 'Cuisine is required'),
});

export const branchStep2Schema = z.object({
  buildingPlaceName: z.string().optional(),
  street: z.string().min(1, 'Street is required'),
  houseNumber: z.string().min(1, 'House number is required'),
  state: z.string().min(1, 'State is required'),
  city: z.string().optional(),
  area: z.string().optional(),
  postalCode: z.string().min(1, 'Postal code is required'),
  addCommentAboutLocation: z.string().optional(),
  coordinates: z
    .object({
      lat: z.number(),
      lng: z.number(),
    })
    .optional()
    .nullable(),
});

export type BranchStep1Input = z.infer<typeof branchStep1Schema>;
export type BranchStep2Input = z.infer<typeof branchStep2Schema>;
