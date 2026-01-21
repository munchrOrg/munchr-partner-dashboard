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
import { useUpdateBranch } from '@/react-query/branches/mutations';
import { useBranchOnboardingProfile } from '@/react-query/branches/queries';
import { useProfileSetupStore } from '@/stores/profile-setup-store';
import { step3Schema } from '@/validations/profile-setup';

export function Step3() {
  const { formData, setStepData, completeStep, nextStep } = useProfileSetupStore();
  const { mutate: updateBranch } = useUpdateBranch();
  const [useExistingAddress, setUseExistingAddress] = React.useState(
    formData.step3?.useExistingAddress || false
  );
  const form = useForm<Step3Input>({
    resolver: zodResolver(step3Schema),
    defaultValues: formData.step3 || {
      accountTitle: '',
      bankName: '',
      iban: '',
      useExistingAddress,
    },
  });
  const {
    register,
    handleSubmit,
    formState: { errors },
  }: any = form;

  useEffect(() => {
    if (formData.step3 && !form.formState.isDirty) {
      form.reset({
        ...formData.step3,
        useExistingAddress: formData.step3.useExistingAddress || false,
      });
    }
  }, [formData.step3, form]);

  const { data: branchData }: any = useBranchOnboardingProfile();
  const branchName = branchData?.data?.branch?.branchName;
  const address = branchData?.data?.branch?.location;

  const onSubmit = async (data: Step3Input) => {
    setStepData('step3', data);
    const payload: any = {
      accountDetail: data.accountTitle,
      bankName: data.bankName,
      iban: data.iban,
      businessName: branchName,
      billingAddressAreSame: data.useExistingAddress,
    };

    if (!data.useExistingAddress) {
      // payload.address = data.address;
      payload.buildingPlaceName = data.buildingName;
      payload.street = data.street;
      payload.houseNumber = data.houseNumber;
      payload.state = data.billingState;
      payload.city = data.billingCity;
      payload.area = data.area;
      payload.postalCode = data.billingPostalCode;
    }

    await updateBranch(payload);

    completeStep(3);
    nextStep();
  };

  return (
    <div className="mx-auto mt-4 flex max-w-4xl flex-col gap-8 md:flex-row md:items-center md:gap-12">
      <div>
        <Form {...form}>
          <form
            id="profile-setup-step3-form"
            onSubmit={handleSubmit(onSubmit)}
            className="space-y-6 md:w-[450px]"
          >
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
                  onCheckedChange={(checked) => {
                    const newValue = checked === true;
                    setUseExistingAddress(newValue);
                    form.setValue('useExistingAddress', newValue, {
                      shouldValidate: true,
                      shouldDirty: true,
                    });
                    setStepData('step3', {
                      ...form.getValues(), // saare current form values
                      useExistingAddress: newValue, // toggle ka updated value
                    });
                  }}
                />

                <label
                  htmlFor="useExistingAddress"
                  className="text-base leading-none font-medium peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                >
                  Select from existing address
                </label>
              </div>

              {useExistingAddress ? (
                address && (
                  <div className="rounded-lg border border-gray-200 bg-gray-50 p-4">
                    <div className="mb-2 text-base font-bold text-gray-900">Billing Address</div>
                    <div className="text-base whitespace-pre-line text-gray-700">
                      {`
${address.buildingPlaceName || ''} ${address.houseNumber || ''}
${address.street || ''}, ${address.area || ''}
${address.city || ''}, ${address.state || ''} ${address.postalCode || ''}
            `}
                    </div>
                  </div>
                )
              ) : (
                <div className="space-y-4">
                  <Input
                    placeholder="Building or Place Name"
                    {...register('buildingName')}
                    className="h-12 rounded-full border-gray-300 px-4"
                  />

                  <div>
                    <Input
                      placeholder="Street *"
                      {...register('street')}
                      className="h-12 rounded-full border-gray-300 px-4"
                    />
                    {errors.street && (
                      <p className="mt-1 text-sm text-red-500">{errors.street.message}</p>
                    )}
                  </div>

                  <div>
                    <Input
                      placeholder="House Number *"
                      {...register('houseNumber')}
                      className="h-12 rounded-full border-gray-300 px-4"
                    />
                    {errors.houseNumber && (
                      <p className="mt-1 text-sm text-red-500">{errors.houseNumber.message}</p>
                    )}
                  </div>

                  <div>
                    <Input
                      placeholder="State *"
                      {...register('billingState')}
                      className="h-12 rounded-full border-gray-300 px-4"
                    />
                    {errors.billingState && (
                      <p className="mt-1 text-sm text-red-500">{errors.billingState.message}</p>
                    )}
                  </div>

                  <Input
                    placeholder="City"
                    {...register('billingCity')}
                    className="h-12 rounded-full border-gray-300 px-4"
                  />

                  <Input
                    placeholder="Area"
                    {...register('area')}
                    className="h-12 rounded-full border-gray-300 px-4"
                  />

                  <div>
                    <Input
                      placeholder="Postal Code *"
                      {...register('billingPostalCode')}
                      className="h-12 rounded-full border-gray-300 px-4"
                    />
                    {errors.billingPostalCode && (
                      <p className="mt-1 text-sm text-red-500">
                        {errors.billingPostalCode.message}
                      </p>
                    )}
                  </div>
                </div>
              )}
            </div>
          </form>
        </Form>
      </div>

      {/* Illustration Section */}
      <div className="hidden justify-center lg:flex lg:w-1/2 lg:justify-end">
        <Image
          src="/assets/images/step-3-bank.png"
          alt="Banking details illustration"
          width={284}
          height={300}
          className="object-cover"
          priority
        />
      </div>
    </div>
  );
}
