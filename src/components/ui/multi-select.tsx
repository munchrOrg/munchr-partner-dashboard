'use client';

import { Check, ChevronsUpDown, X } from 'lucide-react';
import * as React from 'react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from '@/components/ui/command';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { cn } from '@/lib/utils';

export type Option = {
  value: string;
  label: string;
  group?: string;
};

type MultiSelectProps = {
  options: Option[];
  selected: string[];
  onChange: (values: string[]) => void;
  placeholder?: string;
  emptyMessage?: string;
  className?: string;
  disabled?: boolean;
};

export function MultiSelect({
  options,
  selected,
  onChange,
  placeholder = 'Select options...',
  emptyMessage = 'No options found.',
  className,
  disabled = false,
}: MultiSelectProps) {
  const [open, setOpen] = React.useState(false);

  const handleSelect = (value: string) => {
    if (selected.includes(value)) {
      onChange(selected.filter((v) => v !== value));
    } else {
      onChange([...selected, value]);
    }
  };

  const handleRemove = (value: string, e: React.MouseEvent) => {
    e?.stopPropagation();
    onChange(selected.filter((v) => v !== value));
  };

  // Helper for keyboard removal
  const handleRemoveKeyboard = (value: string) => {
    onChange(selected.filter((v) => v !== value));
  };

  const selectedLabels = selected.map((value) => {
    const option = options.find((o) => o.value === value);
    return option?.label ?? value;
  });

  const groupedOptions = options.reduce(
    (acc, option) => {
      const group = option.group ?? 'Options';
      if (!acc[group]) {
        acc[group] = [];
      }
      acc[group].push(option);
      return acc;
    },
    {} as Record<string, Option[]>
  );

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          disabled={disabled}
          className={cn(
            'h-auto min-h-11 w-full justify-between rounded-full border-gray-300 px-4 font-normal hover:bg-transparent sm:min-h-12 sm:px-5',
            !selected.length && 'text-muted-foreground',
            className
          )}
        >
          <div className="flex flex-1 flex-wrap gap-1.5">
            {selected.length === 0 ? (
              <span>{placeholder}</span>
            ) : (
              selected.map((value, index) => (
                <Badge
                  key={value}
                  variant="secondary"
                  className="flex items-center bg-amber-100 text-amber-800 hover:bg-amber-200"
                >
                  {selectedLabels[index]}
                  <span
                    role="button"
                    tabIndex={0}
                    aria-label={`Remove ${selectedLabels[index]}`}
                    className="ml-1 cursor-pointer rounded-full outline-none hover:bg-amber-300"
                    onClick={(e) => handleRemove(value, e)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' || e.key === ' ') {
                        handleRemoveKeyboard(value);
                      }
                    }}
                  >
                    <X className="size-3" />
                  </span>
                </Badge>
              ))
            )}
          </div>
          <ChevronsUpDown className="ml-2 size-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[var(--radix-popover-trigger-width)] p-0" align="start">
        <Command>
          <CommandInput placeholder="Search..." />
          <CommandList>
            <CommandEmpty>{emptyMessage}</CommandEmpty>
            {Object.entries(groupedOptions).map(([group, groupOptions]) => (
              <CommandGroup key={group} heading={group}>
                {groupOptions.map((option) => (
                  <CommandItem
                    key={option.value}
                    value={option.label}
                    onSelect={() => handleSelect(option.value)}
                    className="cursor-pointer"
                  >
                    <div
                      className={cn(
                        'mr-2 flex size-4 items-center justify-center rounded border',
                        selected.includes(option.value)
                          ? 'border-amber-500 bg-amber-500 text-white'
                          : 'border-gray-300'
                      )}
                    >
                      {selected.includes(option.value) && <Check className="size-3" />}
                    </div>
                    {option.label}
                  </CommandItem>
                ))}
              </CommandGroup>
            ))}
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
}
