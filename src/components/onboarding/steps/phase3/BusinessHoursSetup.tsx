'use client';

import type { DaySchedule, TimeSlot } from '@/types/onboarding';
import { Clock, Plus, Trash2 } from 'lucide-react';

import { useState } from 'react';
import { StepHeader } from '@/components/onboarding/shared/StepHeader';
import { Button } from '@/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Sheet, SheetContent, SheetHeader, SheetTitle } from '@/components/ui/sheet';
import { Switch } from '@/components/ui/switch';
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

const TIME_OPTIONS = Array.from({ length: 48 }, (_, i) => {
  const hour = Math.floor(i / 2);
  const minute = i % 2 === 0 ? '00' : '30';
  const period = hour >= 12 ? 'PM' : 'AM';
  const displayHour = hour === 0 ? 12 : hour > 12 ? hour - 12 : hour;
  return {
    value: `${String(hour).padStart(2, '0')}:${minute}`,
    label: `${displayHour}:${minute} ${period}`,
  };
});

const DEFAULT_SLOT: TimeSlot = { open: '09:00', close: '22:00' };

type DayKey = (typeof DAYS_OF_WEEK)[number]['key'];

export function BusinessHoursSetup() {
  const { formData, setFormData } = useOnboardingStore();
  const [editingDay, setEditingDay] = useState<DayKey | null>(null);

  const businessHours = formData.businessHours || {
    monday: { isOpen: true, slots: [DEFAULT_SLOT] },
    tuesday: { isOpen: true, slots: [DEFAULT_SLOT] },
    wednesday: { isOpen: true, slots: [DEFAULT_SLOT] },
    thursday: { isOpen: true, slots: [DEFAULT_SLOT] },
    friday: { isOpen: true, slots: [DEFAULT_SLOT] },
    saturday: { isOpen: true, slots: [DEFAULT_SLOT] },
    sunday: { isOpen: false, slots: [] },
  };

  const updateDaySchedule = (day: DayKey, schedule: DaySchedule) => {
    setFormData('businessHours', {
      ...businessHours,
      [day]: schedule,
    });
  };

  const toggleDay = (day: DayKey) => {
    const current = businessHours[day];
    updateDaySchedule(day, {
      isOpen: !current.isOpen,
      slots: !current.isOpen ? [DEFAULT_SLOT] : [],
    });
  };

  const formatTimeSlot = (slot: TimeSlot) => {
    const formatTime = (time: string) => {
      const [hour = '0', minute = '00'] = time.split(':');
      const h = Number.parseInt(hour, 10);
      const period = h >= 12 ? 'PM' : 'AM';
      const displayHour = h === 0 ? 12 : h > 12 ? h - 12 : h;
      return `${displayHour}:${minute} ${period}`;
    };
    return `${formatTime(slot.open)} - ${formatTime(slot.close)}`;
  };

  const handleAddSlot = () => {
    if (!editingDay) {
      return;
    }
    const current = businessHours[editingDay];
    updateDaySchedule(editingDay, {
      ...current,
      slots: [...current.slots, DEFAULT_SLOT],
    });
  };

  const handleRemoveSlot = (index: number) => {
    if (!editingDay) {
      return;
    }
    const current = businessHours[editingDay];
    updateDaySchedule(editingDay, {
      ...current,
      slots: current.slots.filter((_, i) => i !== index),
    });
  };

  const handleSlotChange = (index: number, field: 'open' | 'close', value: string) => {
    if (!editingDay) {
      return;
    }
    const current = businessHours[editingDay];
    const updatedSlots = current.slots.map((slot, i) =>
      i === index ? { ...slot, [field]: value } : slot
    );
    updateDaySchedule(editingDay, {
      ...current,
      slots: updatedSlots,
    });
  };

  const editingDayData = editingDay ? businessHours[editingDay] : null;
  const editingDayLabel = editingDay ? DAYS_OF_WEEK.find((d) => d.key === editingDay)?.label : '';

  return (
    <div className="mx-auto max-w-xl px-4 py-8 sm:px-8">
      <StepHeader
        title="Set your business hours"
        description="Configure when your restaurant is open to receive orders."
      />

      <div className="mt-6 space-y-3">
        {DAYS_OF_WEEK.map((day) => {
          const schedule = businessHours[day.key];
          return (
            <div key={day.key} className="flex items-center justify-between rounded-lg border p-4">
              <div className="flex items-center gap-4">
                <Switch checked={schedule.isOpen} onCheckedChange={() => toggleDay(day.key)} />
                <div>
                  <p className="font-medium text-gray-900">{day.label}</p>
                  {schedule.isOpen && schedule.slots.length > 0 ? (
                    <p className="text-sm text-gray-500">
                      {schedule.slots.map(formatTimeSlot).join(', ')}
                    </p>
                  ) : (
                    <p className="text-sm text-gray-400">Closed</p>
                  )}
                </div>
              </div>

              {schedule.isOpen && (
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={() => setEditingDay(day.key)}
                  className="text-purple-700"
                >
                  <Clock className="mr-1 h-4 w-4" />
                  Edit
                </Button>
              )}
            </div>
          );
        })}
      </div>

      {/* Time Slots Drawer */}
      <Sheet open={!!editingDay} onOpenChange={() => setEditingDay(null)}>
        <SheetContent side="right" className="w-full max-w-md">
          <SheetHeader>
            <SheetTitle>{editingDayLabel} Hours</SheetTitle>
          </SheetHeader>

          <div className="mt-6 space-y-4">
            {editingDayData?.slots.map((slot, index) => (
              <div
                key={`${editingDay}-${slot.open}-${slot.close}-${index}`}
                className="rounded-lg border p-4"
              >
                <div className="mb-3 flex items-center justify-between">
                  <span className="text-sm font-medium text-gray-700">Shift {index + 1}</span>
                  {editingDayData.slots.length > 1 && (
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={() => handleRemoveSlot(index)}
                      className="h-8 w-8 p-0 text-red-500 hover:text-red-600"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  )}
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label
                      htmlFor={`open-${editingDay}-${index}`}
                      className="mb-1 block text-xs text-gray-500"
                    >
                      Opens at
                    </label>
                    <Select
                      value={slot.open}
                      onValueChange={(value) => handleSlotChange(index, 'open', value)}
                    >
                      <SelectTrigger id={`open-${editingDay}-${index}`} className="h-10">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {TIME_OPTIONS.map((time) => (
                          <SelectItem key={time.value} value={time.value}>
                            {time.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <label
                      htmlFor={`close-${editingDay}-${index}`}
                      className="mb-1 block text-xs text-gray-500"
                    >
                      Closes at
                    </label>
                    <Select
                      value={slot.close}
                      onValueChange={(value) => handleSlotChange(index, 'close', value)}
                    >
                      <SelectTrigger id={`close-${editingDay}-${index}`} className="h-10">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {TIME_OPTIONS.map((time) => (
                          <SelectItem key={time.value} value={time.value}>
                            {time.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </div>
            ))}

            <Button type="button" variant="outline" onClick={handleAddSlot} className="w-full">
              <Plus className="mr-2 h-4 w-4" />
              Add another shift
            </Button>
          </div>
        </SheetContent>
      </Sheet>
    </div>
  );
}
