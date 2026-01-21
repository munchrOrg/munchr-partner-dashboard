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

export const pagePermissionSchema = z.object({
  page: z.string().min(1, 'Page name is required'),
  view: z.boolean(),
  edit: z.boolean(),
  delete: z.boolean(),
});

export const roleFormSchema = z.object({
  name: z.string().min(1, 'Role name is required'),
  description: z.string().min(1, 'Description is required'),
  permissions: z
    .array(pagePermissionSchema)
    .min(1, 'At least one permission is required')
    .refine(
      (permissions) => permissions.some((p) => p.view || p.edit || p.delete),
      'At least one permission action must be enabled'
    ),
});

export type RoleFormInput = z.infer<typeof roleFormSchema>;
export type PagePermissionInput = z.infer<typeof pagePermissionSchema>;
