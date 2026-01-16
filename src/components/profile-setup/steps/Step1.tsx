'use client';

import type { Step1Input } from '@/validations/profile-setup';
import { zodResolver } from '@hookform/resolvers/zod';
import Image from 'next/image';
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
import { Icon } from '@/components/ui/icon';
import { Input } from '@/components/ui/input';
import { cn } from '@/lib/utils';
import { useProfileSetupStore } from '@/stores/profile-setup-store';
import { step1Schema } from '@/validations/profile-setup';

export function Step1() {
  const { formData, setStepData, completeStep, nextStep, openMapDrawer } = useProfileSetupStore();

  const form = useForm<Step1Input>({
    resolver: zodResolver(step1Schema),
    defaultValues: formData.step1 || {
      businessName: '',
      businessDescription: '',
      cuisines: '',
      location: '',
    },
  });

  useEffect(() => {
    if (formData.step1 && !form.formState.isDirty) {
      form.reset(formData.step1);
    }
  }, [formData.step1, form]);

  // Update form when location changes from map drawer
  useEffect(() => {
    if (formData.step1?.location) {
      form.setValue('location', formData.step1.location);
    }
  }, [formData.step1?.location, form]);

  const onSubmit = (data: Step1Input) => {
    setStepData('step1', data);
    completeStep(1);
    nextStep();
  };

  return (
    <div className="mx-auto mt-9 flex max-w-4xl flex-col gap-8 lg:flex-row lg:items-start lg:gap-12">
      <div className="flex-1">
        <Form {...form}>
          <form
            id="profile-setup-step1-form"
            onSubmit={form.handleSubmit(onSubmit)}
            className="space-y-6 md:w-[450px]"
          >
            <FormField
              control={form.control}
              name="businessName"
              render={({ field }) => (
                <FormItem>
                  <div className="flex items-center justify-between gap-2">
                    <FormLabel className="text-base font-medium">Business Name</FormLabel>
                    <Icon name="editIcon" className="size-4" />
                  </div>
                  <FormControl>
                    <Input
                      placeholder="Kababjees Fried Chicken"
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
              name="businessDescription"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-base font-medium">Business description</FormLabel>
                  <FormControl>
                    <textarea
                      placeholder="Kababjees Fried Chicken"
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

            <FormField
              control={form.control}
              name="cuisines"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-base font-medium">Cuisines</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Pakistani"
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
              name="location"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-base font-medium">Location</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Location Here"
                      className="h-11 rounded-full border-gray-300 px-4 sm:h-12 sm:px-5"
                      {...field}
                    />
                  </FormControl>
                  <div className="flex w-full justify-end">
                    <button
                      type="button"
                      onClick={openMapDrawer}
                      className="text-sm font-medium text-[#2C2F2E] hover:underline"
                    >
                      Change Location
                    </button>
                  </div>
                  <FormMessage />
                </FormItem>
              )}
            />
          </form>
        </Form>
      </div>

      {/* Illustration Section - Right */}
      <div className="hidden justify-center lg:flex lg:w-1/2 lg:justify-end">
        <div className="relative h-64 w-64 sm:h-80 sm:w-80">
          <Image
            src="/assets/images/First-step-image.png"
            alt="Profile setup illustration"
            fill
            className="object-contain"
            priority
          />
        </div>
      </div>
    </div>
  );
}
