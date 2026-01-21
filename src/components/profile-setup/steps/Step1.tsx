'use client';

import type { Step1Input } from '@/validations/profile-setup';
import { zodResolver } from '@hookform/resolvers/zod';
import Image from 'next/image';
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
import { Icon } from '@/components/ui/icon';
import { Input } from '@/components/ui/input';
import { cn } from '@/lib/utils';
import { useProfile } from '@/react-query/auth/queries';
import { useUpdateBranch } from '@/react-query/branches/mutations';
import { branchesService } from '@/react-query/branches/service';
import { useCuisines } from '@/react-query/cuisine/queries';
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

  const {
    control,
    setValue,
    reset,
    formState: { errors },
  } = form;
  useEffect(() => {
    if (formData.step1 && !form.formState.isDirty) {
      reset(formData.step1);
    }
  }, [formData.step1, reset, form.formState.isDirty]);

  useEffect(() => {
    if (formData.step1?.location) {
      setValue('location', formData.step1.location);
    }
  }, [formData.step1?.location, setValue]);
  const { mutate: updateBranch } = useUpdateBranch();
  const { data: profile }: any = useProfile();
  const [branchData, setBranchData] = useState<any>(null);
  console.warn('branchData', branchData);
  const { data: cuisinesList = [] } = useCuisines();
  const cuisineOptions = cuisinesList.map((c) => ({ label: c.name, value: c.id }));
  useEffect(() => {
    const id = profile?.onboarding?.branchId;
    if (!id) {
      return;
    }
    const fetchBranch = async () => {
      try {
        const data = await branchesService.getById(id);
        setBranchData(data);
        reset({
          businessName: data.branchName || '',
          businessDescription: data.description || '',
          cuisines: data.cuisineIds?.[0] || '',
          location: data.area || '',
        });
      } catch (err) {
        console.error('Error fetching branch:', err);
      }
    };
    fetchBranch();
  }, [profile, reset]);

  const onSubmit = async (data: Step1Input) => {
    setStepData('step1', data);

    await updateBranch({
      businessName: data.businessName,
      description: data.businessDescription,
      cuisineIds: [data.cuisines],
      area: data.location,
    } as any);

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
              control={control}
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
                      {...field}
                      className="h-11 rounded-full border-gray-300 px-4 sm:h-12 sm:px-5"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={control}
              name="businessDescription"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-base font-medium">Business description</FormLabel>
                  <FormControl>
                    <textarea
                      placeholder="Kababjees Fried Chicken"
                      {...field}
                      rows={4}
                      className={cn(
                        'w-full rounded-2xl border border-gray-300 bg-transparent px-4 py-3 text-base',
                        'focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[1px]',
                        'aria-invalid:ring-destructive/20 aria-invalid:border-destructive',
                        'placeholder:text-muted-foreground min-h-[100px] resize-none'
                      )}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormItem>
              <FormLabel className="text-base font-medium">Cuisines</FormLabel>
              <FormControl>
                <Controller
                  name="cuisines"
                  control={control}
                  render={({ field }) => (
                    <select
                      {...field}
                      className="focus:border-ring focus:ring-ring h-11 w-full rounded-full border border-gray-300 px-4 focus:ring-1 focus:outline-none sm:h-12 sm:px-5"
                    >
                      <option value="">Select cuisine</option>
                      {cuisineOptions.map((c) => (
                        <option key={c.value} value={c.value}>
                          {c.label}
                        </option>
                      ))}
                    </select>
                  )}
                />
              </FormControl>
              {errors.cuisines && (
                <p className="mt-1 ml-4 text-sm text-red-500">{errors.cuisines.message}</p>
              )}
            </FormItem>

            <FormField
              control={control}
              name="location"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-base font-medium">Location</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Location Here"
                      {...field}
                      className="h-11 rounded-full border-gray-300 px-4 sm:h-12 sm:px-5"
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
