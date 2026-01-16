'use client';

import type { BusinessHoursFormData, TimeSlot } from '@/types/onboarding';
import { Plus, Trash2 } from 'lucide-react';
import { useState } from 'react';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
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
import { useProfileSetupStore } from '@/stores/profile-setup-store';

const TIME_OPTIONS = Array.from({ length: 48 }, (_, i) => {
  const hour = Math.floor(i / 2);
  const minute = i % 2 === 0 ? '00' : '30';
  const period = hour >= 12 ? 'PM' : 'AM';
  let displayHour: number;
  if (hour === 0) {
    displayHour = 12;
  } else if (hour > 12) {
    displayHour = hour - 12;
  } else {
    displayHour = hour;
  }
  return {
    value: `${String(hour).padStart(2, '0')}:${minute}`,
    label: `${displayHour}:${minute} ${period}`,
  };
});

const DAYS_OF_WEEK = [
  { key: 'monday', label: 'Monday' },
  { key: 'tuesday', label: 'Tuesday' },
  { key: 'wednesday', label: 'Wednesday' },
  { key: 'thursday', label: 'Thursday' },
  { key: 'friday', label: 'Friday' },
  { key: 'saturday', label: 'Saturday' },
  { key: 'sunday', label: 'Sunday' },
] as const;

const DEFAULT_SLOT: TimeSlot = { open: '09:00', close: '22:00' };

type DayKey = (typeof DAYS_OF_WEEK)[number]['key'];

export function ProfileSetupScheduleDrawer() {
  const { isScheduleDrawerOpen, closeScheduleDrawer, formData, setStepData } =
    useProfileSetupStore();

  const defaultBusinessHours: BusinessHoursFormData = {
    monday: { isOpen: false, slots: [] },
    tuesday: { isOpen: false, slots: [] },
    wednesday: { isOpen: false, slots: [] },
    thursday: { isOpen: false, slots: [] },
    friday: { isOpen: false, slots: [] },
    saturday: { isOpen: false, slots: [] },
    sunday: { isOpen: false, slots: [] },
  };

  // Use a key to reset state when drawer opens - this avoids calling setState in useEffect
  // The key changes when the drawer opens, forcing a remount with fresh state
  const drawerKey = isScheduleDrawerOpen ? JSON.stringify(formData.step4) : 'closed';

  const [localBusinessHours, setLocalBusinessHours] = useState<BusinessHoursFormData>(
    () => formData.step4 || defaultBusinessHours
  );

  const toggleDay = (day: DayKey) => {
    const current = localBusinessHours[day];
    const newIsOpen = !current.isOpen;
    setLocalBusinessHours({
      ...localBusinessHours,
      [day]: {
        isOpen: newIsOpen,
        slots: newIsOpen ? [DEFAULT_SLOT] : [],
      },
    });
  };

  const handleAddSlot = (day: DayKey) => {
    const current = localBusinessHours[day];
    setLocalBusinessHours({
      ...localBusinessHours,
      [day]: {
        ...current,
        slots: [...current.slots, DEFAULT_SLOT],
      },
    });
  };

  const handleRemoveSlot = (day: DayKey, index: number) => {
    const current = localBusinessHours[day];
    setLocalBusinessHours({
      ...localBusinessHours,
      [day]: {
        ...current,
        slots: current.slots.filter((_, i) => i !== index),
      },
    });
  };

  const handleSlotChange = (day: DayKey, index: number, field: 'open' | 'close', value: string) => {
    const current = localBusinessHours[day];
    const updatedSlots = current.slots.map((slot, i) =>
      i === index ? { ...slot, [field]: value } : slot
    );
    setLocalBusinessHours({
      ...localBusinessHours,
      [day]: {
        ...current,
        slots: updatedSlots,
      },
    });
  };

  const handleReset = () => {
    const resetHours: BusinessHoursFormData = {
      monday: { isOpen: false, slots: [] },
      tuesday: { isOpen: false, slots: [] },
      wednesday: { isOpen: false, slots: [] },
      thursday: { isOpen: false, slots: [] },
      friday: { isOpen: false, slots: [] },
      saturday: { isOpen: false, slots: [] },
      sunday: { isOpen: false, slots: [] },
    };
    setLocalBusinessHours(resetHours);
  };

  const handleSave = () => {
    setStepData('step4', localBusinessHours);
    closeScheduleDrawer();
  };

  return (
    <Sheet open={isScheduleDrawerOpen} onOpenChange={closeScheduleDrawer}>
      <SheetContent
        key={drawerKey}
        side="right"
        className="flex w-full flex-col overflow-y-auto rounded-l-2xl px-6 pt-6 pb-10 sm:max-w-xl"
      >
        <SheetHeader className="pb-4">
          <SheetTitle className="text-3xl font-bold">Edit regular schedule</SheetTitle>
        </SheetHeader>

        <div className="mt-6 flex flex-1 flex-col">
          <Accordion type="multiple" className="w-full">
            {DAYS_OF_WEEK.map((day) => {
              const dayData = localBusinessHours[day.key];
              return (
                <AccordionItem key={day.key} value={day.key} className="border-b">
                  <div className="flex items-center justify-between pr-4">
                    <AccordionTrigger className="flex-1 py-4">
                      <span className="text-base font-medium">{day.label}</span>
                    </AccordionTrigger>
                    <Switch
                      checked={dayData.isOpen}
                      onCheckedChange={() => toggleDay(day.key)}
                      onClick={(e) => e.stopPropagation()}
                    />
                  </div>
                  {dayData.isOpen && (
                    <AccordionContent>
                      <div className="space-y-4 pb-4">
                        {dayData.slots.map((slot, index) => {
                          const slotId = `${day.key}-shift-${index}`;
                          return (
                            <div key={slotId} className="p-4">
                              <div className="mb-3">
                                <span className="text-sm font-medium text-gray-700">
                                  Shift {index + 1}
                                </span>
                              </div>

                              <div className="flex items-start justify-start gap-3">
                                <div className="w-fit">
                                  <Select
                                    value={slot.open}
                                    onValueChange={(value) =>
                                      handleSlotChange(day.key, index, 'open', value)
                                    }
                                  >
                                    <SelectTrigger id={`open-${day.key}-${index}`}>
                                      <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent className="w-full">
                                      {TIME_OPTIONS.map((time) => (
                                        <SelectItem key={time.value} value={time.value}>
                                          {time.label}
                                        </SelectItem>
                                      ))}
                                    </SelectContent>
                                  </Select>
                                </div>

                                <div className="mt-2 text-sm text-gray-500">to</div>

                                <div className="w-fit">
                                  <Select
                                    value={slot.close}
                                    onValueChange={(value) =>
                                      handleSlotChange(day.key, index, 'close', value)
                                    }
                                  >
                                    <SelectTrigger id={`close-${day.key}-${index}`}>
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

                                {dayData.slots.length > 1 && (
                                  <Button
                                    type="button"
                                    variant="ghost"
                                    size="sm"
                                    onClick={() => handleRemoveSlot(day.key, index)}
                                    className="size-9 p-0 text-red-500 hover:text-red-600"
                                  >
                                    <Trash2 className="h-5 w-5" />
                                  </Button>
                                )}
                              </div>
                            </div>
                          );
                        })}

                        <Button
                          type="button"
                          variant="ghost"
                          onClick={() => handleAddSlot(day.key)}
                          className="text-purple-dark w-fit text-base font-bold"
                        >
                          <Plus className="size-5" />
                          Add Shift
                        </Button>
                      </div>
                    </AccordionContent>
                  )}
                </AccordionItem>
              );
            })}
          </Accordion>

          <div className="mt-auto flex gap-4 pt-6">
            <Button
              type="button"
              variant="outline"
              onClick={handleReset}
              className="flex-1 rounded-full border-gray-400 py-6 text-base font-semibold text-black"
            >
              Reset
            </Button>
            <Button
              type="button"
              onClick={handleSave}
              className="bg-gradient-yellow flex-1 rounded-full py-6 text-base font-semibold text-black hover:opacity-90"
            >
              Save
            </Button>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
}
