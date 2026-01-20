'use client';

import type { BranchStep2Input } from '@/validations/branch';
import { zodResolver } from '@hookform/resolvers/zod';
import { Plus } from 'lucide-react';
import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { Button } from '@/components/ui/button';
import { Form, FormControl, FormField, FormItem, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { cn } from '@/lib/utils';
import { branchStep2Schema } from '@/validations/branch';

type Step2Props = {
  initialData?: Partial<BranchStep2Input>;
  onSubmit: (data: BranchStep2Input) => void;
  onMapClick: () => void;
};

export function Step2({ initialData, onSubmit, onMapClick }: Readonly<Step2Props>) {
  const form = useForm<BranchStep2Input>({
    resolver: zodResolver(branchStep2Schema),
    defaultValues: {
      buildingPlaceName: initialData?.buildingPlaceName ?? '',
      street: initialData?.street ?? '',
      houseNumber: initialData?.houseNumber ?? '',
      state: initialData?.state ?? '',
      city: initialData?.city ?? '',
      area: initialData?.area ?? '',
      postalCode: initialData?.postalCode ?? '',
      addCommentAboutLocation: initialData?.addCommentAboutLocation ?? '',
      coordinates: initialData?.coordinates ?? null,
    },
  });

  useEffect(() => {
    if (initialData) {
      form.reset(initialData);
    }
  }, [initialData, form]);

  const handleSubmit = (data: BranchStep2Input) => {
    onSubmit(data);
  };

  return (
    <Form {...form}>
      <form
        id="add-branch-step2-form"
        onSubmit={form.handleSubmit(handleSubmit)}
        className="space-y-6"
      >
        <FormField
          control={form.control}
          name="buildingPlaceName"
          render={({ field }) => (
            <FormItem>
              <FormControl>
                <Input
                  placeholder="Building or Place Name"
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
          name="street"
          render={({ field }) => (
            <FormItem>
              <FormControl>
                <div className="relative">
                  <Input
                    placeholder="Street"
                    className="h-11 rounded-full border-gray-300 px-4 pr-8 sm:h-12 sm:px-5 sm:pr-8"
                    {...field}
                  />
                  <span className="pointer-events-none absolute top-1/2 right-4 -translate-y-1/2 text-red-500">
                    *
                  </span>
                </div>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="houseNumber"
          render={({ field }) => (
            <FormItem>
              <FormControl>
                <div className="relative">
                  <Input
                    placeholder="House Number"
                    className="h-11 rounded-full border-gray-300 px-4 pr-8 sm:h-12 sm:px-5 sm:pr-8"
                    {...field}
                  />
                  <span className="pointer-events-none absolute top-1/2 right-4 -translate-y-1/2 text-red-500">
                    *
                  </span>
                </div>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="state"
          render={({ field }) => (
            <FormItem>
              <FormControl>
                <div className="relative">
                  <Input
                    placeholder="State"
                    className="h-11 rounded-full border-gray-300 px-4 pr-8 sm:h-12 sm:px-5 sm:pr-8"
                    {...field}
                  />
                  <span className="pointer-events-none absolute top-1/2 right-4 -translate-y-1/2 text-red-500">
                    *
                  </span>
                </div>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="city"
          render={({ field }) => (
            <FormItem>
              <FormControl>
                <Input
                  placeholder="City"
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
          name="area"
          render={({ field }) => (
            <FormItem>
              <FormControl>
                <Input
                  placeholder="Area"
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
          name="postalCode"
          render={({ field }) => (
            <FormItem>
              <FormControl>
                <div className="relative">
                  <Input
                    placeholder="Postal Code"
                    className="h-11 rounded-full border-gray-300 px-4 pr-8 sm:h-12 sm:px-5 sm:pr-8"
                    {...field}
                  />
                  <span className="pointer-events-none absolute top-1/2 right-4 -translate-y-1/2 text-red-500">
                    *
                  </span>
                </div>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="addCommentAboutLocation"
          render={({ field }) => (
            <FormItem>
              <FormControl>
                <Textarea
                  placeholder="Add comment about location"
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
              <FormMessage />
            </FormItem>
          )}
        />

        <Button
          type="button"
          variant="ghost"
          onClick={onMapClick}
          className="flex w-full items-center gap-2 p-0 text-base font-normal text-[#0C0017] hover:bg-transparent hover:text-[#0C0017]"
        >
          <Plus className="h-5 w-5" />
          Confirmation of exact location with Pin Location
        </Button>
      </form>
    </Form>
  );
}
