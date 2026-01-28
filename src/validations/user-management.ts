import { z } from 'zod';

export const userFormSchema = z.object({
  name: z.string().min(1, 'User name is required'),
  email: z.string().email('Invalid email address'),
  password: z.string().min(8, 'Password must be at least 8 characters'),
  roleIds: z.array(z.string()).min(1, 'At least one role is required'),
});

export type UserFormInput = z.infer<typeof userFormSchema>;

export const updateUserSchema = z.object({
  name: z.string().min(1),
  roleIds: z.array(z.string()).min(1),
});

export const resourcePermissionSchema = z.object({
  resource: z.string(),
  permissions: z.record(z.string(), z.boolean()),
});

export const roleFormSchema = z.object({
  name: z.string().min(1, 'Role name is required'),
  description: z.string().min(1, 'Description is required'),
  permissions: z
    .array(resourcePermissionSchema)
    .min(1, 'At least one permission is required')
    .refine(
      (perms) => perms.some((p) => Object.values(p.permissions).some((v) => v)),
      'At least one permission action must be enabled'
    ),
});

export type RoleFormInput = z.infer<typeof roleFormSchema>;
export type ResourcePermissionInput = z.infer<typeof resourcePermissionSchema>;
