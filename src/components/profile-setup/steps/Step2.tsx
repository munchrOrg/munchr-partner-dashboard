'use client';

import type { Step2Input } from '@/validations/profile-setup';
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
import { useProfileSetupStore } from '@/stores/profile-setup-store';
import { step2Schema } from '@/validations/profile-setup';

export function Step2() {
  const { formData, setStepData, completeStep, nextStep } = useProfileSetupStore();

  const form = useForm<Step2Input>({
    resolver: zodResolver(step2Schema),
    defaultValues: formData.step2 || {
      phoneNumber: '',
      address: '',
      city: '',
    },
  });

  useEffect(() => {
    if (formData.step2) {
      form.reset(formData.step2);
    }
  }, [formData.step2, form]);

  const onSubmit = (data: Step2Input) => {
    setStepData('step2', data);
    completeStep(2);
    nextStep();
  };

  return (
    <div className="space-y-6">
      <Form {...form}>
        <form
          id="profile-setup-step2-form"
          onSubmit={form.handleSubmit(onSubmit)}
          className="space-y-4"
        >
          <FormField
            control={form.control}
            name="phoneNumber"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Phone Number</FormLabel>
                <FormControl>
                  <Input
                    type="tel"
                    placeholder="Enter your phone number"
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
            name="address"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Address</FormLabel>
                <FormControl>
                  <Input
                    placeholder="Enter your address"
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
            name="city"
            render={({ field }) => (
              <FormItem>
                <FormLabel>City</FormLabel>
                <FormControl>
                  <Input
                    placeholder="Enter your city"
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
    </div>
  );
}
