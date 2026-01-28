'use client';

import type { Role, RolePermission } from '@/react-query/roles/types';
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

type GroupedPermissions = {
  resource: string;
  codes: string[];
  permissionMap: Record<string, string>;
};

const groupPermissionsByResource = (
  apiPermissions: RolePermission[]
): { grouped: GroupedPermissions[]; allCodes: string[] } => {
  const resourceMap: Record<string, { codes: Set<string>; permissionMap: Record<string, string> }> =
    {};
  const allCodesSet = new Set<string>();

  apiPermissions.forEach((perm) => {
    if (!resourceMap[perm.resource]) {
      resourceMap[perm.resource] = { codes: new Set(), permissionMap: {} };
    }
    const entry = resourceMap[perm.resource];
    if (entry) {
      entry.codes.add(perm.code);
      entry.permissionMap[perm.code] = perm.id;
    }
    allCodesSet.add(perm.code);
  });

  const codeOrder = [
    'view',
    'create',
    'update',
    'delete',
    'cancel',
    'export',
    'submit',
    'process',
    'respond',
  ];
  const allCodes = codeOrder.filter((c) => allCodesSet.has(c));

  const grouped = Object.entries(resourceMap).map(([resource, data]) => ({
    resource,
    codes: Array.from(data.codes),
    permissionMap: data.permissionMap,
  }));

  return { grouped, allCodes };
};

const formatResourceName = (resource: string) => {
  return resource
    .split(/[-_]/)
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
};

const formatCodeName = (code: string) => {
  return code.charAt(0).toUpperCase() + code.slice(1);
};

type RoleFormDrawerProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  role?: Role | null;
};

export function RoleFormDrawer({ open, onOpenChange, role }: Readonly<RoleFormDrawerProps>) {
  const isEditMode = !!role;

  const { data: permissionsResponse } = useRolePermissions();

  const { grouped, allCodes } = useMemo(() => {
    if (!permissionsResponse) {
      return { grouped: [], allCodes: [] };
    }
    return groupPermissionsByResource(permissionsResponse);
  }, [permissionsResponse]);

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

  const selectAll = useMemo(() => {
    if (!permissions?.length) {
      return false;
    }
    return permissions.every((p) => Object.values(p.permissions).every((v) => v));
  }, [permissions]);

  useEffect(() => {
    if (!open || !permissionsResponse || !grouped.length) {
      return;
    }

    const basePermissions = grouped.map((g) => ({
      resource: g.resource,
      permissions: g.codes.reduce(
        (acc, code) => {
          acc[code] = false;
          return acc;
        },
        {} as Record<string, boolean>
      ),
    }));

    if (isEditMode && role?.permissions) {
      const roleLookup: Record<string, Set<string>> = {};
      role.permissions.forEach((perm: RolePermission) => {
        if (!roleLookup[perm.resource]) {
          roleLookup[perm.resource] = new Set();
        }
        roleLookup[perm.resource]?.add(perm.code);
      });

      const mergedPermissions = basePermissions.map((p) => {
        const enabledCodes = roleLookup[p.resource] || new Set();
        const updatedPerms = { ...p.permissions };
        Object.keys(updatedPerms).forEach((code) => {
          updatedPerms[code] = enabledCodes.has(code);
        });
        return { resource: p.resource, permissions: updatedPerms };
      });

      form.reset({
        name: role.name,
        description: role.description || '',
        permissions: mergedPermissions,
      });
    } else {
      form.reset({
        name: '',
        description: '',
        permissions: basePermissions,
      });
    }
  }, [open, permissionsResponse, role, isEditMode, form, grouped]);

  const handleSelectAll = (checked: boolean) => {
    const updated = permissions.map((p) => ({
      ...p,
      permissions: Object.keys(p.permissions).reduce(
        (acc, code) => {
          acc[code] = checked;
          return acc;
        },
        {} as Record<string, boolean>
      ),
    }));
    form.setValue('permissions', updated);
  };

  const handlePermissionChange = (resourceIndex: number, code: string, checked: boolean) => {
    const updated = [...permissions];
    const current = updated[resourceIndex];
    if (current) {
      updated[resourceIndex] = {
        resource: current.resource,
        permissions: {
          ...current.permissions,
          [code]: checked,
        },
      };
    }
    form.setValue('permissions', updated);
  };

  const createRoleMutation = useCreateRole();
  const updateRoleMutation = useUpdateRole();

  const onSubmit = async (data: RoleFormInput) => {
    try {
      const selectedPermissionIds: string[] = [];

      data.permissions.forEach((resourcePerm) => {
        const groupData = grouped.find((g) => g.resource === resourcePerm.resource);
        if (!groupData) {
          return;
        }

        Object.entries(resourcePerm.permissions).forEach(([code, enabled]) => {
          if (enabled && groupData.permissionMap[code]) {
            selectedPermissionIds.push(groupData.permissionMap[code]);
          }
        });
      });

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

  const isLoading = createRoleMutation.isPending || updateRoleMutation.isPending;

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent
        side="right"
        hideCloseButton
        className="flex h-full w-full flex-col rounded-l-[15px] px-0 sm:max-w-2xl"
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

              <FormItem>
                <div className="mb-3 flex justify-between">
                  <FormLabel className="font-semibold">Permissions</FormLabel>
                  <div className="flex items-center gap-2">
                    <Checkbox checked={selectAll} onCheckedChange={handleSelectAll} />
                    <span className="text-sm">Select All</span>
                  </div>
                </div>

                <div className="overflow-x-auto rounded border">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead className="bg-background sticky left-0">Resource</TableHead>
                        {allCodes.map((code) => (
                          <TableHead key={code} className="text-center capitalize">
                            {formatCodeName(code)}
                          </TableHead>
                        ))}
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {permissions.map((p, i) => {
                        const groupData = grouped.find((g) => g.resource === p.resource);
                        return (
                          <TableRow key={p.resource}>
                            <TableCell className="bg-background sticky left-0 font-medium">
                              {formatResourceName(p.resource)}
                            </TableCell>
                            {allCodes.map((code) => {
                              const hasCode = groupData?.codes.includes(code);
                              return (
                                <TableCell key={code} className="text-center">
                                  {hasCode ? (
                                    <Checkbox
                                      checked={p.permissions[code] || false}
                                      onCheckedChange={(checked) =>
                                        handlePermissionChange(i, code, checked as boolean)
                                      }
                                    />
                                  ) : (
                                    <span className="text-muted-foreground">—</span>
                                  )}
                                </TableCell>
                              );
                            })}
                          </TableRow>
                        );
                      })}
                    </TableBody>
                  </Table>
                </div>
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
