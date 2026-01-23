'use client';

import type { BusinessHoursFormData, DaySchedule } from '@/types/onboarding';
import { useState } from 'react';
import { toast } from 'sonner';
import { StepHeader } from '@/components/onboarding/shared/StepHeader';
import TimeConfirmationDrawer from '@/components/onboarding/shared/TimeConfirmationDrawer';
import { Button } from '@/components/ui/button';
import { Icon } from '@/components/ui/icon';
import { useOnboardingUpdateProfile } from '@/hooks/useOnboardingUpdateProfile';
import { useOnboardingProfileStore } from '@/stores/onboarding-profile-store';
import { OnboardingStep } from '@/types/onboarding';

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

const DEFAULT_BUSINESS_HOURS: BusinessHoursFormData = {
  monday: { isOpen: false, slots: [] },
  tuesday: { isOpen: false, slots: [] },
  wednesday: { isOpen: false, slots: [] },
  thursday: { isOpen: false, slots: [] },
  friday: { isOpen: false, slots: [] },
  saturday: { isOpen: false, slots: [] },
  sunday: { isOpen: false, slots: [] },
};

function convertOperatingHoursToFormData(
  operatingHours:
    | Array<{ dayOfWeek: number; startTime?: string; endTime?: string; isClosed: boolean }>
    | undefined
): BusinessHoursFormData {
  if (!operatingHours || operatingHours.length === 0) {
    return DEFAULT_BUSINESS_HOURS;
  }

  const dayMapping: Record<number, DayKey> = {
    0: 'sunday',
    1: 'monday',
    2: 'tuesday',
    3: 'wednesday',
    4: 'thursday',
    5: 'friday',
    6: 'saturday',
  };

  const result = { ...DEFAULT_BUSINESS_HOURS };

  operatingHours.forEach((hour) => {
    const dayKey = dayMapping[hour.dayOfWeek];
    if (dayKey) {
      if (hour.isClosed) {
        result[dayKey] = { isOpen: false, slots: [] };
      } else if (hour.startTime && hour.endTime) {
        const existingSlots = result[dayKey].slots;
        result[dayKey] = {
          isOpen: true,
          slots: [...existingSlots, { open: hour.startTime, close: hour.endTime }],
        };
      }
    }
  });

  return result;
}

export function BusinessHoursSetup() {
  const { profileData, formData, setStepFormData } = useOnboardingProfileStore();
  const { updateProfile } = useOnboardingUpdateProfile();
  const [editingDay, setEditingDay] = useState<DayKey | null>(null);

  const [businessHours, setBusinessHours] = useState<BusinessHoursFormData>(() => {
    if (formData.businessHours) {
      return formData.businessHours;
    }
    return convertOperatingHoursToFormData(profileData?.primaryBranch?.operatingHours);
  });

  const updateDaySchedule = (day: DayKey, schedule: DaySchedule) => {
    setBusinessHours((prev) => ({
      ...prev,
      [day]: schedule,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const days = [
      'monday',
      'tuesday',
      'wednesday',
      'thursday',
      'friday',
      'saturday',
      'sunday',
    ] as const;
    const hasOpenDay = days.some((day) => businessHours[day].isOpen);
    if (!hasOpenDay) {
      toast.error('Please mark at least one day as open.');
      return;
    }

    for (const day of days) {
      const schedule = businessHours[day];
      if (schedule.isOpen && schedule.slots.length === 0) {
        toast.error('Please add time slots for all open days or mark them as closed.');
        return;
      }
    }

    setStepFormData('businessHours', businessHours);

    const dayMapping = {
      monday: 1,
      tuesday: 2,
      wednesday: 3,
      thursday: 4,
      friday: 5,
      saturday: 6,
      sunday: 0,
    };

    const operatingHoursPayload: any[] = [];
    Object.entries(businessHours).forEach(([day, schedule]) => {
      const dayOfWeek = dayMapping[day as keyof typeof dayMapping];
      if (schedule.isOpen && schedule.slots.length > 0) {
        schedule.slots.forEach((slot) => {
          operatingHoursPayload.push({
            dayOfWeek,
            startTime: slot.open,
            endTime: slot.close,
            isClosed: false,
          });
        });
      } else {
        operatingHoursPayload.push({
          dayOfWeek,
          startTime: '00:00',
          endTime: '00:00',
          isClosed: true,
        });
      }
    });

    try {
      await updateProfile(
        {
          completeStep: OnboardingStep.BUSINESS_HOURS_SETUP,
          operatingHours: operatingHoursPayload,
        },
        { shouldAdvanceStep: true }
      );
    } catch (error) {
      console.error('Failed to save business hours:', error);
      toast.error('Failed to save data. Please try again.');
    }
  };

  return (
    <form
      id="onboarding-step-form"
      onSubmit={handleSubmit}
      className="mx-auto flex h-full max-w-6xl items-center justify-center px-4 py-8 sm:px-8"
    >
      <div className="flex w-full flex-col gap-8 lg:flex-row lg:items-center lg:gap-16">
        <div className="flex flex-1 flex-col justify-center">
          <StepHeader
            title="Set your business hours"
            description="Configure when your restaurant is open to receive orders."
          />

          <div className="mt-6 rounded-3xl border">
            {DAYS_OF_WEEK.map((day) => {
              return (
                <div
                  key={day.key}
                  className="flex items-center justify-between border-b p-4 last:border-none"
                >
                  <div className="flex flex-col">
                    <p className="font-medium text-gray-900">{day.label}</p>
                  </div>

                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={() => setEditingDay(day.key)}
                    className="flex items-center justify-center gap-2 font-bold"
                  >
                    <Icon name="editIcon" className="h-4 w-4" />
                    Edit
                  </Button>
                </div>
              );
            })}
          </div>
        </div>

        <div className="flex h-full items-center justify-center lg:w-[40%] lg:justify-end">
          <Icon name="calendarIllustration" className="h-full max-h-96 w-full max-w-96" />
        </div>
      </div>

      <TimeConfirmationDrawer
        editingDay={editingDay}
        businessHours={businessHours}
        updateDaySchedule={updateDaySchedule}
        setEditingDay={setEditingDay}
      />
    </form>
  );
}
