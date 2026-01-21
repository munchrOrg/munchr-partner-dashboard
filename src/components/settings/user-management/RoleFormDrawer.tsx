'use client';

import type { RolePermission } from '@/react-query/roles/types';
import type { Role } from '@/types/roles';
import type { RoleFormInput } from '@/validations/user-management';

import { zodResolver } from '@hookform/resolvers/zod';
import { X } from 'lucide-react';
import { useEffect, useMemo } from 'react';
import { useForm, useWatch } from 'react-hook-form';
import { toast } from 'sonner';

import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Sheet, SheetClose, SheetContent, SheetHeader, SheetTitle } from '@/components/ui/sheet';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Textarea } from '@/components/ui/textarea';

import { useCreateRole, useUpdateRole } from '@/react-query/roles/mutations';
import { useRolePermissions } from '@/react-query/roles/queries';
import { roleFormSchema } from '@/validations/user-management';

/* =========================
   Helpers
========================= */

const mapApiPermissionsToForm = (apiPermissions: RolePermission[]) => {
  const grouped: Record<string, { page: string; view: boolean; edit: boolean; delete: boolean }> =
    {};

  apiPermissions.forEach((perm) => {
    const page = perm.resource;

    if (!grouped[page]) {
      grouped[page] = {
        page,
        view: false,
        edit: false,
        delete: false,
      };
    }

    if (perm.code === 'view') {
      grouped[page].view = true;
    }
    if (perm.code === 'create' || perm.code === 'update') {
      grouped[page].edit = true;
    }
    if (perm.code === 'delete') {
      grouped[page].delete = true;
    }
  });

  return Object.values(grouped);
};

/* =========================
   Props
========================= */

type RoleFormDrawerProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  role?: Role | null;
};

/* =========================
   Component
========================= */

export function RoleFormDrawer({ open, onOpenChange, role }: Readonly<RoleFormDrawerProps>) {
  const isEditMode = !!role;

  const { data: permissionsResponse } = useRolePermissions();

  const form = useForm<RoleFormInput>({
    resolver: zodResolver(roleFormSchema),
    defaultValues: {
      name: '',
      description: '',
      permissions: [],
    },
  });

  const permissions = useWatch({
    control: form.control,
    name: 'permissions',
  });

  /* =========================
     Select All Logic
  ========================= */

  const selectAll = useMemo(() => {
    if (!permissions?.length) {
      return false;
    }

    const allSelected = permissions.every((p) => p.view && p.edit && p.delete);
    const noneSelected = permissions.every((p) => !p.view && !p.edit && !p.delete);

    return allSelected && !noneSelected;
  }, [permissions]);

  /* =========================
     Load permissions from API
  ========================= */

  useEffect(() => {
    if (!open || !permissionsResponse?.data) {
      return;
    }

    const basePermissions = mapApiPermissionsToForm(permissionsResponse.data).map((p) => ({
      ...p,
      view: false,
      edit: false,
      delete: false,
    }));

    if (isEditMode && role) {
      const mergedPermissions = basePermissions.map((p) => {
        const existing = role.permissions.find((rp) => rp.page === p.page);
        return existing ?? p;
      });
      form.reset({
        name: role.name,
        description: role.description,
        permissions: mergedPermissions,
      });
    } else {
      form.reset({
        name: '',
        description: '',
        permissions: basePermissions,
      });
    }
  }, [open, permissionsResponse, role, isEditMode, form]);

  /* =========================
     Handlers
  ========================= */

  const handleSelectAll = (checked: boolean) => {
    const updated = permissions.map((p) => ({
      ...p,
      view: checked,
      edit: checked,
      delete: checked,
    }));
    form.setValue('permissions', updated);
  };

  const handlePermissionChange = (
    index: number,
    action: 'view' | 'edit' | 'delete',
    checked: boolean
  ) => {
    const updated: any = [...permissions];
    updated[index] = {
      ...updated[index],
      [action]: checked,
    };
    form.setValue('permissions', updated);
  };

  const createRoleMutation: any = useCreateRole();
  const updateRoleMutation: any = useUpdateRole();

  const onSubmit = async (data: RoleFormInput) => {
    try {
      // Collect selected permissionIds from permissionsResponse
      const selectedPermissionIds: string[] = [];
      if (permissionsResponse?.data) {
        data.permissions.forEach((perm) => {
          permissionsResponse.data.forEach((apiPerm) => {
            if (
              apiPerm.resource === perm.page &&
              ((apiPerm.code === 'view' && perm.view) ||
                ((apiPerm.code === 'create' || apiPerm.code === 'update') && perm.edit) ||
                (apiPerm.code === 'delete' && perm.delete))
            ) {
              selectedPermissionIds.push(apiPerm.id);
            }
          });
        });
      }

      if (isEditMode && role) {
        await updateRoleMutation.mutateAsync({
          id: role.id,
          data: {
            name: data.name,
            description: data.description,
            permissionIds: selectedPermissionIds,
          },
        });
        toast.success('Role updated successfully');
      } else {
        await createRoleMutation.mutateAsync({
          name: data.name,
          description: data.description,
          permissionIds: selectedPermissionIds,
        });
        toast.success('Role created successfully');
      }
      onOpenChange(false);
      form.reset();
    } catch (error: any) {
      toast.error(error?.response?.data?.message || error?.message || 'Something went wrong');
    }
  };

  const isLoading = createRoleMutation.isLoading || updateRoleMutation.isLoading;

  /* =========================
     Render
  ========================= */

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent
        side="right"
        hideCloseButton
        className="flex h-full w-full flex-col rounded-l-[15px] px-0 sm:max-w-md"
      >
        <SheetHeader className="flex flex-row items-center justify-between px-[30px] pt-8">
          <SheetTitle className="text-xl font-bold">
            {isEditMode ? 'Update Role' : 'Create New Role'}
          </SheetTitle>
          <SheetClose asChild>
            <Button variant="ghost" size="icon" className="h-8 w-8 rounded-full">
              <X className="h-7 w-7" />
            </Button>
          </SheetClose>
        </SheetHeader>

        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="flex flex-1 flex-col overflow-hidden"
          >
            <div className="flex-1 space-y-6 overflow-y-auto px-[30px] pt-4">
              {/* Name */}
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Role Name</FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Description */}
              <FormField
                control={form.control}
                name="description"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Description</FormLabel>
                    <FormControl>
                      <Textarea {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Permissions */}
              <FormItem>
                <div className="mb-3 flex justify-between">
                  <FormLabel className="font-semibold">Page Access Permission</FormLabel>
                  <div className="flex items-center gap-2">
                    <Checkbox checked={selectAll} onCheckedChange={handleSelectAll} />
                    <span className="text-sm">Select All</span>
                  </div>
                </div>

                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Page</TableHead>
                      <TableHead className="text-center">View</TableHead>
                      <TableHead className="text-center">Edit</TableHead>
                      <TableHead className="text-center">Delete</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {permissions.map((p, i) => (
                      <TableRow key={p.page}>
                        <TableCell>{p.page}</TableCell>
                        {(['view', 'edit', 'delete'] as const).map((action) => (
                          <TableCell key={action} className="text-center">
                            <Checkbox
                              checked={p[action]}
                              onCheckedChange={(checked) =>
                                handlePermissionChange(i, action, checked as boolean)
                              }
                            />
                          </TableCell>
                        ))}
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </FormItem>
            </div>

            <div className="flex gap-2 border-t px-[30px] py-4">
              <Button
                type="button"
                variant="outline"
                onClick={() => onOpenChange(false)}
                className="w-1/2 rounded-full"
              >
                Cancel
              </Button>
              <Button type="submit" className="w-1/2 rounded-full" disabled={isLoading}>
                {isLoading ? 'Saving...' : isEditMode ? 'Update Role' : 'Create Role'}
              </Button>
            </div>
          </form>
        </Form>
      </SheetContent>
    </Sheet>
  );
}
