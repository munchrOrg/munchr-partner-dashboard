'use client';

import type { BranchStep1Input } from '@/validations/branch';
import { zodResolver } from '@hookform/resolvers/zod';
import { useEffect, useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
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
import { Textarea } from '@/components/ui/textarea';
import { cn } from '@/lib/utils';
import { branchStep1Schema } from '@/validations/branch';

type Step1Props = {
  initialData?: BranchStep1Input;
  onSubmit: (data: BranchStep1Input) => void;
};

export function Step1({ initialData, onSubmit }: Readonly<Step1Props>) {
  //  const { mutate: createBranch } = useCreateBranch();
  //  const [step1Data, setStep1Data] = useState<BranchStep1Input | null>(null);
  const [cuisineOptions, setCuisineOptions] = useState<
    { value: string; label: string; group: string }[]
  >([]);
  const form = useForm<BranchStep1Input>({
    resolver: zodResolver(branchStep1Schema),
    defaultValues: initialData || {
      businessName: '',
      description: '',
      businessEmail: '',
      password: '',
      cuisines: [],
    },
  });

  const {
    control,
    formState: { errors },
    watch,
  } = form;
  const description = watch('description') ?? '';

  useEffect(() => {
    if (initialData) {
      form.reset(initialData);
    }
  }, [initialData, form]);

  useEffect(() => {
    let mounted = true;
    const fetchCuisines = async () => {
      try {
        const base = process.env.NEXT_PUBLIC_BACKEND_URL || '';
        const r = await fetch(`${base}/v1/partner/cuisines`);
        if (!r.ok) {
          throw new Error('Failed to fetch cuisines');
        }
        const resJson = await r.json();
        const items = Array.isArray(resJson)
          ? resJson
          : Array.isArray(resJson?.data)
            ? resJson.data
            : [];
        const opts = items.map((c: any) => ({
          value: c.id,
          label: c.name,
          group: 'Cuisines',
        }));
        if (mounted) {
          setCuisineOptions(opts);
        }
      } catch (error) {
        console.error(error);
      }
    };
    fetchCuisines();
    return () => {
      mounted = false;
    };
  }, []);

  const handleSubmit = (data: BranchStep1Input) => {
    onSubmit(data); // now using the prop properly
  };

  return (
    <Form {...form}>
      <form
        id="add-branch-step1-form"
        onSubmit={form.handleSubmit(handleSubmit)}
        className="space-y-6"
      >
        <FormField
          control={control}
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
          control={control}
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
                {errors.description ? <FormMessage /> : <span />}
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
          control={control}
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
          control={control}
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

        <Controller
          name="cuisines"
          control={control}
          render={({ field }) => (
            <MultiSelect
              options={cuisineOptions}
              selected={field.value}
              onChange={field.onChange}
              placeholder="Select cuisines *"
              emptyMessage="No cuisines found."
            />
          )}
        />
        {errors.cuisines && (
          <p className="mt-1 ml-4 text-sm text-red-500">{errors.cuisines.message}</p>
        )}
      </form>
    </Form>
  );
}
