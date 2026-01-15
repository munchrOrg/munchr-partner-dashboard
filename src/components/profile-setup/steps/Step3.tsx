'use client';

import type { Step3Input } from '@/validations/profile-setup';
import { zodResolver } from '@hookform/resolvers/zod';
import { useEffect } from 'react';
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { useProfileSetupStore } from '@/stores/profile-setup-store';
import { step3Schema } from '@/validations/profile-setup';

const notificationOptions = [
  { id: 'email', label: 'Email Notifications' },
  { id: 'sms', label: 'SMS Notifications' },
  { id: 'push', label: 'Push Notifications' },
];

export function Step3() {
  const { formData, setStepData, completeStep, nextStep } = useProfileSetupStore();

  const form = useForm<Step3Input>({
    resolver: zodResolver(step3Schema),
    defaultValues: formData.step3 || {
      languagePreference: '',
      timezone: '',
      notificationPreferences: [],
    },
  });

  useEffect(() => {
    if (formData.step3) {
      form.reset(formData.step3);
    }
  }, [formData.step3, form]);

  const onSubmit = (data: Step3Input) => {
    setStepData('step3', data);
    completeStep(3);
    nextStep();
  };

  return (
    <div className="space-y-6">
      <Form {...form}>
        <form
          id="profile-setup-step3-form"
          onSubmit={form.handleSubmit(onSubmit)}
          className="space-y-4"
        >
          <FormField
            control={form.control}
            name="languagePreference"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Language Preference</FormLabel>
                <Select onValueChange={field.onChange} value={field.value}>
                  <FormControl>
                    <SelectTrigger className="h-11 rounded-full border-gray-300 px-4 sm:h-12 sm:px-5">
                      <SelectValue placeholder="Select your preferred language" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="en">English</SelectItem>
                    <SelectItem value="fr">French</SelectItem>
                    <SelectItem value="es">Spanish</SelectItem>
                    <SelectItem value="de">German</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="timezone"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Timezone</FormLabel>
                <Select onValueChange={field.onChange} value={field.value}>
                  <FormControl>
                    <SelectTrigger className="h-11 rounded-full border-gray-300 px-4 sm:h-12 sm:px-5">
                      <SelectValue placeholder="Select your timezone" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="utc">UTC</SelectItem>
                    <SelectItem value="est">Eastern Time (EST)</SelectItem>
                    <SelectItem value="pst">Pacific Time (PST)</SelectItem>
                    <SelectItem value="gmt">Greenwich Mean Time (GMT)</SelectItem>
                    <SelectItem value="cet">Central European Time (CET)</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="notificationPreferences"
            render={() => (
              <FormItem>
                <div className="mb-4">
                  <FormLabel className="text-base">Notification Preferences</FormLabel>
                  <p className="text-muted-foreground text-sm">
                    Select how you would like to receive notifications
                  </p>
                </div>
                {notificationOptions.map((option) => (
                  <FormField
                    key={option.id}
                    control={form.control}
                    name="notificationPreferences"
                    render={({ field }) => {
                      return (
                        <FormItem
                          key={option.id}
                          className="flex flex-row items-start space-y-0 space-x-3"
                        >
                          <FormControl>
                            <Checkbox
                              checked={field.value?.includes(option.id)}
                              onCheckedChange={(checked) => {
                                return checked
                                  ? field.onChange([...field.value, option.id])
                                  : field.onChange(
                                      field.value?.filter((value) => value !== option.id)
                                    );
                              }}
                            />
                          </FormControl>
                          <FormLabel className="font-normal">{option.label}</FormLabel>
                        </FormItem>
                      );
                    }}
                  />
                ))}
                <FormMessage />
              </FormItem>
            )}
          />
        </form>
      </Form>
    </div>
  );
}
