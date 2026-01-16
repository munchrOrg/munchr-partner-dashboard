'use client';

import type { BusinessHoursFormData, DaySchedule } from '@/types/onboarding';
import type { Step4Input } from '@/validations/profile-setup';
import { zodResolver } from '@hookform/resolvers/zod';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';
import TimeConfirmationDrawer from '@/components/onboarding/shared/TimeConfirmationDrawer';
import { Button } from '@/components/ui/button';
import { Form, FormField, FormItem } from '@/components/ui/form';
import { Icon } from '@/components/ui/icon';
import profilestep4 from '@/public/assets/images/profile-step-4.png';
import { useProfileSetupStore } from '@/stores/profile-setup-store';
import { step4Schema } from '@/validations/profile-setup';

const DAYS_OF_WEEK = [
  { key: 'monday', label: 'Monday' },
  { key: 'tuesday', label: 'Tuesday' },
  { key: 'wednesday', label: 'Wednesday' },
  { key: 'thursday', label: 'Thursday' },
  { key: 'friday', label: 'Friday' },
  { key: 'saturday', label: 'Saturday' },
  { key: 'sunday', label: 'Sunday' },
] as const;

type DayKey = (typeof DAYS_OF_WEEK)[number]['key'];

const defaultBusinessHours: BusinessHoursFormData = {
  monday: { isOpen: false, slots: [] },
  tuesday: { isOpen: false, slots: [] },
  wednesday: { isOpen: false, slots: [] },
  thursday: { isOpen: false, slots: [] },
  friday: { isOpen: false, slots: [] },
  saturday: { isOpen: false, slots: [] },
  sunday: { isOpen: false, slots: [] },
};

export function Step4() {
  const router = useRouter();
  const { formData, setStepData, completeStep, completeSetup, setIsSubmitting } =
    useProfileSetupStore();

  const [editingDay, setEditingDay] = useState<DayKey | null>(null);

  const form = useForm<Step4Input>({
    resolver: zodResolver(step4Schema),
    defaultValues: formData.step4 || defaultBusinessHours,
  });

  const businessHours = formData.step4 || defaultBusinessHours;

  useEffect(() => {
    if (formData.step4) {
      form.reset(formData.step4);
    }
  }, [formData.step4, form]);

  const updateDaySchedule = (day: DayKey, schedule: DaySchedule) => {
    const updatedBusinessHours: BusinessHoursFormData = {
      ...businessHours,
      [day]: schedule,
    };
    setStepData('step4', updatedBusinessHours);
    form.setValue(day, schedule);
  };

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
    <div>
      <div className="mx-auto mt-7 flex max-w-4xl flex-col gap-8 md:flex-row md:items-center md:gap-36">
        <div className="flex-1">
          <Form {...form}>
            <form
              id="profile-setup-step4-form"
              onSubmit={form.handleSubmit(onSubmit)}
              className="space-y-6 md:w-[532px]"
            >
              <div className="rounded-3xl border">
                {DAYS_OF_WEEK.map((day) => {
                  return (
                    <div
                      key={day.key}
                      className="flex items-center justify-between border-b py-3.5 pr-7 pl-3.5 last:border-none"
                    >
                      <div className="flex flex-col">
                        <p className="font-medium text-gray-900">{day.label}</p>
                        {/* <p className="text-sm text-gray-500">{getDayStatus(dayKey)}</p> */}
                      </div>

                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={() => setEditingDay(day.key)}
                        className="flex items-center justify-center gap-2 font-medium"
                      >
                        <Icon name="editIcon" className="h-5 w-5" />
                        Edit
                      </Button>
                    </div>
                  );
                })}
              </div>

              {/* Hidden form field to satisfy form validation */}
              <FormField
                control={form.control}
                name="monday"
                render={() => <FormItem className="hidden" />}
              />
            </form>
          </Form>
        </div>

        <div className="hidden justify-center lg:flex lg:w-1/2 lg:justify-end">
          <div className="relative w-[343px]">
            <Image
              src={profilestep4}
              alt="Profile Setup Step 4"
              className="h-full w-full object-cover"
            />
          </div>
        </div>
      </div>

      <TimeConfirmationDrawer
        editingDay={editingDay}
        businessHours={businessHours}
        updateDaySchedule={updateDaySchedule}
        setEditingDay={setEditingDay}
      />
    </div>
  );
}
