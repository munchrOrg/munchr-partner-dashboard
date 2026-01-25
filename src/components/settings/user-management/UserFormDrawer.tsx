'use client';

import type { Option } from '@/components/ui/multi-select';
import type { PortalUser } from '@/react-query/portal-users/types';
import type { UserFormInput } from '@/validations/user-management';

import { zodResolver } from '@hookform/resolvers/zod';
import { X } from 'lucide-react';
import { useEffect, useMemo } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { toast } from 'sonner';

import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { MultiSelect } from '@/components/ui/multi-select';
import { Sheet, SheetClose, SheetContent, SheetHeader, SheetTitle } from '@/components/ui/sheet';

import { useCreatePortalUser, useUpdatePortalUser } from '@/react-query/portal-users/mutations';
import { useAllRoles } from '@/react-query/roles/queries';
import { userFormSchema } from '@/validations/user-management';

type UserFormDrawerProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  user?: PortalUser | null;
};

export function UserFormDrawer({ open, onOpenChange, user }: Readonly<UserFormDrawerProps>) {
  const isEditMode = !!user;
  const createUserMutation = useCreatePortalUser();
  const updateUserMutation = useUpdatePortalUser();

  const { data: roles, isLoading: rolesLoading } = useAllRoles();

  const roleOptions: Option[] = useMemo(() => {
    if (!roles) {
      return [];
    }
    return roles.map((role) => ({
      value: role.id,
      label: role.name,
    }));
  }, [roles]);

  const form = useForm<UserFormInput>({
    resolver: zodResolver(userFormSchema),
    defaultValues: {
      name: '',
      email: '',
      password: '',
      roleIds: [],
    },
  });

  useEffect(() => {
    if (open && user) {
      form.reset({
        name: user.name,
        email: user.email,
        password: '',
        roleIds: user.roles?.map((r) => r.id) || [],
      });
    } else if (open && !user) {
      form.reset({
        name: '',
        email: '',
        password: '',
        roleIds: [],
      });
    }
  }, [open, user, form]);

  const onSubmit = async (data: UserFormInput) => {
    try {
      if (isEditMode && user) {
        await updateUserMutation.mutateAsync({
          id: user.id,
          data: {
            name: data.name,
            roleIds: data.roleIds,
          },
        });
        toast.success('User updated successfully');
      } else {
        await createUserMutation.mutateAsync({
          name: data.name,
          email: data.email,
          password: data.password,
          roleIds: data.roleIds,
        });
        toast.success('User created successfully');
      }
      onOpenChange(false);
      form.reset();
    } catch (error: any) {
      const errorMessage = error?.response?.data?.message || error?.message || 'An error occurred';
      toast.error(errorMessage);
    }
  };

  const isLoading = createUserMutation.isPending || updateUserMutation.isPending;

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
              {isEditMode ? 'Edit User' : 'Create New User'}
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
                        User Name <span className="text-destructive">*</span>
                      </FormLabel>
                      <FormControl>
                        <Input placeholder="Enter User Name" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {!isEditMode && (
                  <FormField
                    control={form.control}
                    name="email"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>
                          Email Address <span className="text-destructive">*</span>
                        </FormLabel>
                        <FormControl>
                          <Input type="email" placeholder="Enter Email Address" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                )}

                {!isEditMode && (
                  <FormField
                    control={form.control}
                    name="password"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>
                          Password <span className="text-destructive">*</span>
                        </FormLabel>
                        <FormControl>
                          <Input type="password" placeholder="Enter Password" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                )}

                <Controller
                  control={form.control}
                  name="roleIds"
                  render={({ field, fieldState }) => (
                    <FormItem>
                      <FormLabel>
                        Roles <span className="text-destructive">*</span>
                      </FormLabel>
                      <MultiSelect
                        options={roleOptions}
                        selected={field.value}
                        onChange={field.onChange}
                        placeholder="Select roles"
                        emptyMessage="No roles found"
                        isLoading={rolesLoading}
                      />
                      {fieldState.error && (
                        <p className="text-destructive text-sm">{fieldState.error.message}</p>
                      )}
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
                  {isLoading ? 'Saving...' : isEditMode ? 'Update User' : 'Create User'}
                </Button>
              </div>
            </form>
          </Form>
        </div>
      </SheetContent>
    </Sheet>
  );
}
