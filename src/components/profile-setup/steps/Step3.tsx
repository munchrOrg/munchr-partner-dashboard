'use client';

import type { Step3Input } from '@/validations/profile-setup';
import { zodResolver } from '@hookform/resolvers/zod';
import Image from 'next/image';
import React, { useEffect } from 'react';
import { useForm } from 'react-hook-form';
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
import { useProfileSetupStore } from '@/stores/profile-setup-store';
import { step3Schema } from '@/validations/profile-setup';

export function Step3() {
  const { formData, setStepData, completeStep, nextStep } = useProfileSetupStore();
  const [useExistingAddress, setUseExistingAddress] = React.useState(false);

  const form = useForm<Step3Input>({
    resolver: zodResolver(step3Schema),
    defaultValues: formData.step3 || {
      accountTitle: '',
      bankName: '',
      iban: '',
    },
  });

  useEffect(() => {
    if (formData.step3 && !form.formState.isDirty) {
      form.reset(formData.step3);
    }
  }, [formData.step3, form]);

  const onSubmit = (data: Step3Input) => {
    setStepData('step3', data);
    completeStep(3);
    nextStep();
  };

  return (
    <div className="mx-auto flex max-w-4xl flex-col gap-8 md:flex-row md:items-center md:gap-12">
      <div>
        <Form {...form}>
          <form
            id="profile-setup-step3-form"
            onSubmit={form.handleSubmit(onSubmit)}
            className="space-y-6 md:w-[450px]"
          >
            <div className="mb-4">
              <h3 className="mb-4 text-base font-bold">Enter Bank account details</h3>
            </div>

            <FormField
              control={form.control}
              name="bankName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-base font-medium">Bank Name</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Bank Name"
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
              name="accountTitle"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-base font-medium">Account details</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Account details"
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
              name="iban"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-base font-medium">IBAN</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="IBAN"
                      className="h-11 rounded-full border-gray-300 px-4 sm:h-12 sm:px-5"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div>
              <div className="mb-4 flex items-center justify-between">
                <h3 className="text-base font-bold">Select Billing Address</h3>
              </div>

              <div className="mb-4 flex items-center space-x-2">
                <Checkbox
                  id="useExistingAddress"
                  checked={useExistingAddress}
                  onCheckedChange={(checked) => setUseExistingAddress(checked === true)}
                />
                <label
                  htmlFor="useExistingAddress"
                  className="text-base leading-none font-medium peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                >
                  Select from existing address
                </label>
              </div>

              {formData?.step1?.location && (
                <div className="rounded-lg border border-gray-200 bg-gray-50 p-4">
                  <div className="mb-2 text-base font-bold text-gray-900">Billing Address</div>
                  <div className="text-base whitespace-pre-line text-gray-700">
                    {formData?.step1?.location}
                  </div>
                </div>
              )}
            </div>
          </form>
        </Form>
      </div>

      {/* Illustration Section - Right */}
      <div className="hidden justify-center lg:flex lg:w-1/2 lg:justify-end">
        <div className="relative h-64 w-64 sm:h-80 sm:w-80">
          <Image
            src="/assets/images/step-3-bank.png"
            alt="Banking details illustration"
            fill
            className="object-contain"
            priority
          />
        </div>
      </div>
    </div>
  );
}
