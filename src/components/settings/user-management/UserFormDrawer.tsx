'use client';

import type { UserFormInput } from '@/validations/user-management';
import { zodResolver } from '@hookform/resolvers/zod';
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Sheet, SheetClose, SheetContent, SheetHeader, SheetTitle } from '@/components/ui/sheet';
import { useCreateUser, useUpdateUser } from '@/react-query/users/mutations';
import { userFormSchema } from '@/validations/user-management';

type User = {
  id: string;
  name: string;
  email: string;
  role: string;
  status?: 'approved' | 'pending';
};

type UserFormDrawerProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  user?: User | null;
};

export function UserFormDrawer({ open, onOpenChange, user }: Readonly<UserFormDrawerProps>) {
  const isEditMode = !!user;
  const createUserMutation = useCreateUser();
  const updateUserMutation = useUpdateUser();

  const form = useForm<UserFormInput>({
    resolver: zodResolver(userFormSchema),
    defaultValues: {
      name: '',
      email: '',
      password: '',
      role: undefined,
    },
  });

  useEffect(() => {
    if (open && user) {
      form.reset({
        name: user.name,
        email: user.email,
        password: '',
        role: user.role as 'Admin' | 'Super Admin' | 'Editor',
      });
    } else if (open && !user) {
      form.reset({
        name: '',
        email: '',
        password: '',
        role: undefined,
      });
    }
  }, [open, user, form]);

  const onSubmit = async (data: UserFormInput) => {
    try {
      if (isEditMode && user) {
        await updateUserMutation.mutateAsync({
          id: user.id,
          data,
        });
        toast.success('User updated successfully');
      } else {
        await createUserMutation.mutateAsync(data);
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
            <SheetTitle className="text-xl font-bold">
              {isEditMode ? 'Update User' : 'Create New User'}
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
                  name="role"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>
                        Role <span className="text-destructive">*</span>
                      </FormLabel>
                      <Select onValueChange={field.onChange} value={field.value}>
                        <FormControl>
                          <SelectTrigger className="w-full">
                            <SelectValue placeholder="Choose a Role" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="Admin">Admin</SelectItem>
                          <SelectItem value="Super Admin">Super Admin</SelectItem>
                          <SelectItem value="Editor">Editor</SelectItem>
                        </SelectContent>
                      </Select>
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
