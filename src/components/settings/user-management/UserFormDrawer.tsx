'use client';

import type { UserFormInput } from '@/validations/user-management';
import { zodResolver } from '@hookform/resolvers/zod';
import { useQuery } from '@tanstack/react-query';
import { X } from 'lucide-react';
import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
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
// ...existing code...
import { Sheet, SheetClose, SheetContent, SheetHeader, SheetTitle } from '@/components/ui/sheet';
import { useCreatePortalUser } from '@/react-query/portal-users/mutations.create';
import { rolesKeys } from '@/react-query/roles/keys';
import { rolesService } from '@/react-query/roles/service.all';
import { userFormSchema } from '@/validations/user-management';

type User = {
  id: string;
  name: string;
  email: string;
  roleIds: string[];
  status?: 'approved' | 'pending';
};

type UserFormDrawerProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  user?: User | null;
};

export function UserFormDrawer({ open, onOpenChange, user }: Readonly<UserFormDrawerProps>) {
  const isEditMode = !!user;
  const createUserMutation = useCreatePortalUser();

  const { data: roles, isLoading: rolesLoading } = useQuery({
    queryKey: rolesKeys.all,
    queryFn: rolesService.getAll,
  });
  console.log('Roles data:', rolesLoading);

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
        roleIds: user.roleIds || [],
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
      // Only create user, not update
      await createUserMutation.mutateAsync({
        name: data.name,
        email: data.email,
        password: data.password,
        roleIds: data.roleIds,
      });
      toast.success('User created successfully');
      onOpenChange(false);
      form.reset();
    } catch (error: any) {
      const errorMessage = error?.response?.data?.message || error?.message || 'An error occurred';
      toast.error(errorMessage);
    }
  };

  const isLoading = createUserMutation.isPending;

  const getButtonText = () => {
    if (isLoading) {
      return 'Loading...';
    }
    if (isEditMode) {
      return 'Update User';
    }
    return 'Create User';
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
            <SheetTitle className="text-xl font-bold">Create New User</SheetTitle>
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

                <FormField
                  control={form.control}
                  name="roleIds"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>
                        Roles <span className="text-destructive">*</span>
                      </FormLabel>
                      <select
                        multiple
                        value={field.value}
                        onChange={(e) => {
                          const selected = Array.from(
                            e.target.selectedOptions,
                            (option) => option.value
                          );
                          field.onChange(selected);
                        }}
                        className="w-full rounded border px-2 py-1"
                        required
                      >
                        {roles?.data?.map((role: any) => (
                          <option key={role.id} value={role.id}>
                            {role.name}
                          </option>
                        ))}
                      </select>
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
