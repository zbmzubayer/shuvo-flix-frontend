'use client';

import { CalendarIcon } from 'lucide-react';
import { useState } from 'react';
import type { DropdownNavProps, DropdownProps } from 'react-day-picker';

import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

interface DatePickerProps {
  value?: Date;
  onChange: (date: Date | undefined) => void;
}

export function DatePicker({ value, onChange }: DatePickerProps) {
  const [open, setOpen] = useState(false);

  return (
    <Popover onOpenChange={setOpen} open={open}>
      <PopoverTrigger asChild>
        <Button className="justify-between font-normal" id="date" variant="outline">
          {value ? value.toLocaleDateString() : 'Select date'}
          <CalendarIcon className="text-muted-foreground" />
        </Button>
      </PopoverTrigger>
      <PopoverContent align="start" className="w-auto overflow-hidden p-0">
        <Calendar
          captionLayout="dropdown"
          className="rounded-md border p-2"
          classNames={{
            month_caption: 'mx-0',
          }}
          components={{ DropdownNav, Dropdown }}
          defaultMonth={new Date()}
          endMonth={new Date(new Date().getFullYear() + 10, 11)}
          hideNavigation
          mode="single"
          onSelect={(selectedDate) => {
            onChange(selectedDate);
            setOpen(false);
          }}
          selected={value}
          startMonth={new Date(1980, 6)}
        />
      </PopoverContent>
    </Popover>
  );
}

function DropdownNav(props: DropdownNavProps) {
  return <div className="flex w-full items-center gap-2">{props.children}</div>;
}

function Dropdown(props: DropdownProps) {
  const handleCalendarChange = (
    _value: string | number,
    _e: React.ChangeEventHandler<HTMLSelectElement>
  ) => {
    const _event = {
      target: {
        value: String(_value),
      },
    } as React.ChangeEvent<HTMLSelectElement>;
    _e(_event);
  };
  return (
    <Select
      onValueChange={(value) => {
        if (props.onChange) {
          handleCalendarChange(value, props.onChange);
        }
      }}
      value={String(props.value)}
    >
      <SelectTrigger className="h-8 w-fit font-medium first:grow">
        <SelectValue />
      </SelectTrigger>
      <SelectContent className="max-h-[min(17rem,var(--radix-select-content-available-height))] min-w-fit">
        {props.options?.map((option) => (
          <SelectItem disabled={option.disabled} key={option.value} value={String(option.value)}>
            {option.label}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}
