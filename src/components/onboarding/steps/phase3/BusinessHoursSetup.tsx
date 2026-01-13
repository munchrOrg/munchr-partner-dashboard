'use client';

import type { DaySchedule } from '@/types/onboarding';

import { useState } from 'react';
import { StepHeader } from '@/components/onboarding/shared/StepHeader';
import TimeConfirmationDrawer from '@/components/onboarding/shared/TimeConfirmationDrawer';
import { Button } from '@/components/ui/button';
import { Icon } from '@/components/ui/icon';

import { useOnboardingStore } from '@/stores/onboarding-store';

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

export function BusinessHoursSetup() {
  const { formData, setFormData } = useOnboardingStore();
  const [editingDay, setEditingDay] = useState<DayKey | null>(null);

  const businessHours = formData.businessHours || {
    monday: { isOpen: false, slots: [] },
    tuesday: { isOpen: false, slots: [] },
    wednesday: { isOpen: false, slots: [] },
    thursday: { isOpen: false, slots: [] },
    friday: { isOpen: false, slots: [] },
    saturday: { isOpen: false, slots: [] },
    sunday: { isOpen: false, slots: [] },
  };

  const updateDaySchedule = (day: DayKey, schedule: DaySchedule) => {
    setFormData('businessHours', {
      ...businessHours,
      [day]: schedule,
    });
  };

  return (
    <div className="mx-auto flex h-full max-w-6xl items-center justify-center px-4 py-8 sm:px-8">
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
    </div>
  );
}
