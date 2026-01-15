'use client';

import type { Step4Input } from '@/validations/profile-setup';
import { zodResolver } from '@hookform/resolvers/zod';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';
import { Checkbox } from '@/components/ui/checkbox';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { useProfileSetupStore } from '@/stores/profile-setup-store';
import { step4Schema } from '@/validations/profile-setup';

export function Step4() {
  const router = useRouter();
  const { formData, setStepData, completeStep, completeSetup, setIsSubmitting } =
    useProfileSetupStore();

  const form = useForm<Step4Input>({
    resolver: zodResolver(step4Schema),
    defaultValues: formData.step4 || {
      termsAndConditions: false,
      privacyPolicy: false,
      marketingEmails: false,
    },
  });

  useEffect(() => {
    if (formData.step4) {
      form.reset(formData.step4);
    }
  }, [formData.step4, form]);

  const onSubmit = async (data: Step4Input) => {
    setIsSubmitting(true);
    try {
      setStepData('step4', data);
      completeStep(4);
      completeSetup();

      // Simulate API call - replace with actual API call
      await new Promise((resolve) => setTimeout(resolve, 1000));

      toast.success('Profile setup completed successfully!');
      router.push('/dashboard');
    } catch (error) {
      toast.error('Failed to complete profile setup. Please try again.');
      console.error('Profile setup error:', error);
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-6">
      <Form {...form}>
        <form
          id="profile-setup-step4-form"
          onSubmit={form.handleSubmit(onSubmit)}
          className="space-y-4"
        >
          <FormField
            control={form.control}
            name="termsAndConditions"
            render={({ field }) => (
              <FormItem className="flex flex-row items-start space-y-0 space-x-3">
                <FormControl>
                  <Checkbox checked={field.value} onCheckedChange={field.onChange} />
                </FormControl>
                <div className="space-y-1 leading-none">
                  <FormLabel>I accept the Terms and Conditions</FormLabel>
                  <p className="text-muted-foreground text-sm">
                    You must accept the terms and conditions to continue.
                  </p>
                </div>
              </FormItem>
            )}
          />
          <FormMessage />

          <FormField
            control={form.control}
            name="privacyPolicy"
            render={({ field }) => (
              <FormItem className="flex flex-row items-start space-y-0 space-x-3">
                <FormControl>
                  <Checkbox checked={field.value} onCheckedChange={field.onChange} />
                </FormControl>
                <div className="space-y-1 leading-none">
                  <FormLabel>I accept the Privacy Policy</FormLabel>
                  <p className="text-muted-foreground text-sm">
                    You must accept the privacy policy to continue.
                  </p>
                  <FormMessage />
                </div>
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="marketingEmails"
            render={({ field }) => (
              <FormItem className="flex flex-row items-start space-y-0 space-x-3">
                <FormControl>
                  <Checkbox checked={field.value} onCheckedChange={field.onChange} />
                </FormControl>
                <div className="space-y-1 leading-none">
                  <FormLabel>I would like to receive marketing emails</FormLabel>
                  <p className="text-muted-foreground text-sm">
                    Optional: Receive updates about new features and promotions.
                  </p>
                </div>
              </FormItem>
            )}
          />
        </form>
      </Form>
    </div>
  );
}
