'use client';

import type { BranchStep1Input } from '@/validations/branch';
import { zodResolver } from '@hookform/resolvers/zod';
import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { cn } from '@/lib/utils';
import { branchStep1Schema } from '@/validations/branch';

type Step1Props = {
  initialData?: BranchStep1Input;
  onSubmit: (data: BranchStep1Input) => void;
};

export function Step1({ initialData, onSubmit }: Readonly<Step1Props>) {
  const form = useForm<BranchStep1Input>({
    resolver: zodResolver(branchStep1Schema),
    defaultValues: initialData || {
      businessName: '',
      description: '',
      businessEmail: '',
      password: '',
      cuisine: '',
    },
  });

  const description = form.watch('description') ?? '';

  useEffect(() => {
    if (initialData) {
      form.reset(initialData);
    }
  }, [initialData, form]);

  const handleSubmit = (data: BranchStep1Input) => {
    onSubmit(data);
  };

  return (
    <Form {...form}>
      <form
        id="add-branch-step1-form"
        onSubmit={form.handleSubmit(handleSubmit)}
        className="space-y-6"
      >
        <FormField
          control={form.control}
          name="businessName"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-base font-medium">Business Name</FormLabel>
              <FormControl>
                <Input
                  placeholder="Enter business name"
                  className="h-11 rounded-full border-gray-300 px-4 sm:h-12 sm:px-5"
                  {...field}
                />
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
              <FormLabel className="text-base font-medium">Description</FormLabel>
              <FormControl>
                <Textarea
                  placeholder="Enter business description (10-500 characters)"
                  rows={4}
                  className={cn(
                    'w-full rounded-2xl border border-gray-300 bg-transparent px-4 py-3 text-base',
                    'focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[1px]',
                    'aria-invalid:ring-destructive/20 aria-invalid:border-destructive',
                    'placeholder:text-muted-foreground',
                    'resize-none',
                    'min-h-[100px]'
                  )}
                  {...field}
                />
              </FormControl>
              <div className="mt-1 flex justify-between px-1">
                {form.formState.errors.description ? <FormMessage /> : <span />}
                <span
                  className={cn(
                    'text-xs',
                    description.length > 500 || (description.length > 0 && description.length < 10)
                      ? 'text-red-500'
                      : 'text-gray-400'
                  )}
                >
                  {description.length} / 500
                </span>
              </div>
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="businessEmail"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-base font-medium">Business Email Address</FormLabel>
              <FormControl>
                <Input
                  type="email"
                  placeholder="Enter business email"
                  className="h-11 rounded-full border-gray-300 px-4 sm:h-12 sm:px-5"
                  {...field}
                />
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
              <FormLabel className="text-base font-medium">Set Password</FormLabel>
              <FormControl>
                <Input
                  type="password"
                  placeholder="Enter password (min 8 characters)"
                  className="h-11 rounded-full border-gray-300 px-4 sm:h-12 sm:px-5"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="cuisine"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-base font-medium">Cuisine</FormLabel>
              <FormControl>
                <Input
                  placeholder="Enter cuisine"
                  className="h-11 rounded-full border-gray-300 px-4 sm:h-12 sm:px-5"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </form>
    </Form>
  );
}
