'use client';

import type { Role } from '@/types/roles';
import type { RoleFormInput } from '@/validations/user-management';
import { zodResolver } from '@hookform/resolvers/zod';
import { X } from 'lucide-react';
import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
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
import { AVAILABLE_PAGES } from '@/types/roles';
import { roleFormSchema } from '@/validations/user-management';

type RoleFormDrawerProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  role?: Role | null;
};

// Initialize permissions for all pages
const initializePermissions = () =>
  AVAILABLE_PAGES.map((page) => ({
    page,
    view: false,
    edit: false,
    delete: false,
  }));

export function RoleFormDrawer({ open, onOpenChange, role }: Readonly<RoleFormDrawerProps>) {
  const isEditMode = !!role;
  const [selectAll, setSelectAll] = useState(false);

  const form = useForm<RoleFormInput>({
    resolver: zodResolver(roleFormSchema),
    defaultValues: {
      name: '',
      description: '',
      permissions: initializePermissions(),
    },
  });

  const permissions = form.watch('permissions');

  // Update selectAll state based on current permissions
  useEffect(() => {
    const allSelected = permissions.every((p) => p.view && p.edit && p.delete);
    const noneSelected = permissions.every((p) => !p.view && !p.edit && !p.delete);
    setSelectAll(allSelected && !noneSelected);
  }, [permissions]);

  useEffect(() => {
    if (open && role) {
      // Convert role permissions to form format
      const formPermissions = AVAILABLE_PAGES.map((page) => {
        const existingPermission = role.permissions.find((p) => p.page === page);
        return existingPermission || { page, view: false, edit: false, delete: false };
      });

      form.reset({
        name: role.name,
        description: role.description,
        permissions: formPermissions,
      });
    } else if (open && !role) {
      form.reset({
        name: '',
        description: '',
        permissions: initializePermissions(),
      });
    }
  }, [open, role, form]);

  const handleSelectAll = (checked: boolean) => {
    const updatedPermissions = permissions.map((p) => ({
      ...p,
      view: checked,
      edit: checked,
      delete: checked,
    }));
    form.setValue('permissions', updatedPermissions);
    setSelectAll(checked);
  };

  const handlePermissionChange = (
    pageIndex: number,
    action: 'view' | 'edit' | 'delete',
    checked: boolean
  ) => {
    const updatedPermissions = [...permissions];
    const currentPermission = updatedPermissions[pageIndex];
    if (currentPermission) {
      updatedPermissions[pageIndex] = {
        page: currentPermission.page,
        view: action === 'view' ? checked : currentPermission.view,
        edit: action === 'edit' ? checked : currentPermission.edit,
        delete: action === 'delete' ? checked : currentPermission.delete,
      };
      form.setValue('permissions', updatedPermissions);
    }
  };

  const onSubmit = async (_data: RoleFormInput) => {
    try {
      // TODO: Connect to API when available
      if (isEditMode) {
        toast.success('Role updated successfully');
      } else {
        toast.success('Role created successfully');
      }
      onOpenChange(false);
      form.reset();
    } catch (error: any) {
      const errorMessage = error?.response?.data?.message || error?.message || 'An error occurred';
      toast.error(errorMessage);
    }
  };

  const isLoading = false; // TODO: Connect to mutation when available

  const getButtonText = () => {
    if (isLoading) {
      return 'Loading...';
    }
    if (isEditMode) {
      return 'Update Role';
    }
    return 'Create Role';
  };

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent
        side="right"
        hideCloseButton
        className="flex h-full w-full flex-col rounded-l-[15px] px-0 sm:max-w-md"
      >
        <div className="flex flex-1 flex-col overflow-hidden">
          <SheetHeader className="flex flex-row items-center justify-between px-[30px] pt-8">
            <SheetTitle className="text-xl font-bold">
              {isEditMode ? 'Update Role' : 'Create New Role'}
            </SheetTitle>
            <SheetClose asChild>
              <Button variant="ghost" size="icon" className="h-8 w-8 rounded-full">
                <X className="h-7 w-7" />
                <span className="sr-only">Close</span>
              </Button>
            </SheetClose>
          </SheetHeader>

          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(onSubmit)}
              className="flex flex-1 flex-col overflow-hidden"
            >
              <div className="mt-2 flex-1 space-y-6 overflow-y-auto px-[30px]">
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>
                        Role Name <span className="text-destructive">*</span>
                      </FormLabel>
                      <FormControl>
                        <Input placeholder="Enter Role Name" {...field} />
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
                      <FormLabel>
                        Description <span className="text-destructive">*</span>
                      </FormLabel>
                      <FormControl>
                        <Textarea placeholder="Description (English)" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="permissions"
                  render={() => (
                    <FormItem>
                      <div className="mb-4 flex items-center justify-between">
                        <FormLabel className="text-base font-semibold">
                          Page Access Permission
                        </FormLabel>
                        <div className="flex items-center space-x-2">
                          <Checkbox
                            id="select-all"
                            checked={selectAll}
                            onCheckedChange={handleSelectAll}
                          />
                          <label
                            htmlFor="select-all"
                            className="text-sm leading-none font-medium peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                          >
                            Select All
                          </label>
                        </div>
                      </div>
                      <div className="rounded-md border">
                        <Table>
                          <TableHeader>
                            <TableRow>
                              <TableHead className="font-semibold">Page Name</TableHead>
                              <TableHead className="text-center font-semibold">View</TableHead>
                              <TableHead className="text-center font-semibold">Edit</TableHead>
                              <TableHead className="text-center font-semibold">Delete</TableHead>
                            </TableRow>
                          </TableHeader>
                          <TableBody>
                            {permissions.map((permission, index) => (
                              <TableRow key={permission.page}>
                                <TableCell className="font-medium">{permission.page}</TableCell>
                                <TableCell className="text-center">
                                  <Checkbox
                                    checked={permission.view}
                                    onCheckedChange={(checked) =>
                                      handlePermissionChange(index, 'view', checked as boolean)
                                    }
                                  />
                                </TableCell>
                                <TableCell className="text-center">
                                  <Checkbox
                                    checked={permission.edit}
                                    onCheckedChange={(checked) =>
                                      handlePermissionChange(index, 'edit', checked as boolean)
                                    }
                                  />
                                </TableCell>
                                <TableCell className="text-center">
                                  <Checkbox
                                    checked={permission.delete}
                                    onCheckedChange={(checked) =>
                                      handlePermissionChange(index, 'delete', checked as boolean)
                                    }
                                  />
                                </TableCell>
                              </TableRow>
                            ))}
                          </TableBody>
                        </Table>
                      </div>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <div
                className="mt-auto flex w-full gap-2 border-t px-[30px] py-4"
                style={{ boxShadow: '0px -4px 20px 0px rgba(0, 0, 0, 0.1)' }}
              >
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => onOpenChange(false)}
                  disabled={isLoading}
                  className="w-1/2 rounded-full"
                >
                  Cancel
                </Button>
                <Button type="submit" disabled={isLoading} className="w-1/2 rounded-full">
                  {getButtonText()}
                </Button>
              </div>
            </form>
          </Form>
        </div>
      </SheetContent>
    </Sheet>
  );
}
