import type { BusinessHoursFormData, DaySchedule, TimeSlot } from '@/types/onboarding';
import { Plus, Trash2 } from 'lucide-react';
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

type TimeConfirmationDrawerProps = {
  editingDay: DayKey | null;
  businessHours: BusinessHoursFormData;
  updateDaySchedule: (day: DayKey, schedule: DaySchedule) => void;
  setEditingDay: (day: DayKey | null) => void;
};

export default function TimeConfirmationDrawer({
  editingDay,
  businessHours,
  updateDaySchedule,
  setEditingDay,
}: TimeConfirmationDrawerProps) {
  const toggleDay = () => {
    if (!editingDay) {
      return;
    }
    const current = businessHours[editingDay];
    updateDaySchedule(editingDay, {
      isOpen: !current.isOpen,
      slots: !current.isOpen ? [DEFAULT_SLOT] : [],
    });
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

  const handleReset = () => {
    if (!editingDay) {
      return;
    }
    updateDaySchedule(editingDay, {
      isOpen: false,
      slots: [],
    });
  };

  const editingDayData = editingDay ? businessHours[editingDay] : null;
  const editingDayLabel = editingDay ? DAYS_OF_WEEK.find((d) => d.key === editingDay)?.label : '';

  return (
    <Sheet open={!!editingDay} onOpenChange={() => setEditingDay(null)}>
      <SheetContent
        side="right"
        className="flex w-full flex-col overflow-y-auto rounded-l-2xl px-6 pt-6 pb-10 sm:max-w-xl"
      >
        <SheetHeader className="pb-4">
          <SheetTitle className="text-3xl font-bold">{editingDayLabel}</SheetTitle>
          <div className="flex items-center justify-between pt-4">
            <p className="text-lg font-medium">
              Open on
              {editingDayLabel}
            </p>
            <Switch checked={editingDayData?.isOpen || false} onCheckedChange={toggleDay} />
          </div>
        </SheetHeader>

        <div className="mt-6 flex flex-1 flex-col">
          {editingDayData?.isOpen ? (
            <div className="space-y-4 border-y py-4">
              {editingDayData?.slots.map((slot, index) => {
                // Slots are never reordered, only added/removed, so position is stable
                const slotId = `${editingDay}-shift-${index}`;
                return (
                  <div key={slotId} className="p-4">
                    <div className="mb-3">
                      <span className="text-sm font-medium text-gray-700">Shift {index + 1}</span>
                    </div>

                    <div className="flex items-start justify-start gap-3">
                      <div className="w-fit">
                        <Select
                          value={slot.open}
                          onValueChange={(value) => handleSlotChange(index, 'open', value)}
                        >
                          <SelectTrigger id={`open-${editingDay}-${index}`}>
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
                          onValueChange={(value) => handleSlotChange(index, 'close', value)}
                        >
                          <SelectTrigger id={`close-${editingDay}-${index}`}>
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

                      {editingDayData.slots.length > 1 && (
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          onClick={() => handleRemoveSlot(index)}
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
                onClick={handleAddSlot}
                className="text-purple-dark w-fit text-base font-bold"
              >
                <Plus className="size-5" />
                Add Shift
              </Button>
            </div>
          ) : (
            <div className="flex flex-1 items-center justify-center text-center text-gray-500">
              <p>
                Toggle the switch above to set hours for
                {editingDayLabel}
              </p>
            </div>
          )}

          <Button
            onClick={handleReset}
            className="bg-gradient-yellow mt-auto w-full rounded-full py-6 text-base font-semibold text-black hover:opacity-90"
          >
            Reset
          </Button>
        </div>
      </SheetContent>
    </Sheet>
  );
}
