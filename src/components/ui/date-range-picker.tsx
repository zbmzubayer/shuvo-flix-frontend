'use client';

import { addDays, addMonths, addYears } from 'date-fns';
import { CalendarIcon } from 'lucide-react';
import { useState } from 'react';
import type { DateRange } from 'react-day-picker';

import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';

interface DatePickerProps {
  value?: DateRange;
  onChange: (date?: DateRange) => void;
}

const today = new Date();
const next7Days = {
  from: today,
  to: addDays(today, 6),
};
const next30Days = {
  from: today,
  to: addDays(today, 30),
};
const nextMonth = {
  from: today,
  to: addMonths(today, 1),
};
const next3months = {
  from: today,
  to: addMonths(today, 3),
};
const next6months = {
  from: today,
  to: addMonths(today, 6),
};
const nextYear = {
  from: today,
  to: addYears(today, 1),
};

export function DateRangePicker({ value, onChange }: DatePickerProps) {
  const [month, setMonth] = useState(today);

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button className="w-full justify-between font-normal" variant="outline">
          {value?.from && value?.to
            ? `${value.from?.toLocaleDateString()} - ${value.to?.toLocaleDateString()}`
            : 'Select date'}
          <CalendarIcon className="text-muted-foreground" />
        </Button>
      </PopoverTrigger>
      <PopoverContent align="start" className="w-auto overflow-hidden p-0">
        <div className="flex flex-col-reverse sm:flex-row">
          <div className="flex flex-col p-2 max-sm:border-t sm:border-r">
            <Button
              className="w-full justify-start font-normal"
              onClick={() => {
                onChange({
                  from: today,
                  to: today,
                });
                setMonth(today);
              }}
              size="sm"
              variant="ghost"
            >
              Today
            </Button>
            <Button
              className="w-full justify-start font-normal"
              onClick={() => {
                onChange(next7Days);
                setMonth(next7Days.to);
              }}
              size="sm"
              variant="ghost"
            >
              Next 7 days
            </Button>
            <Button
              className="w-full justify-start font-normal"
              onClick={() => {
                onChange(next30Days);
                setMonth(next30Days.to);
              }}
              size="sm"
              variant="ghost"
            >
              Next 30 days
            </Button>
            <Button
              className="w-full justify-start font-normal"
              onClick={() => {
                onChange(nextMonth);
                setMonth(nextMonth.to);
              }}
              size="sm"
              variant="ghost"
            >
              Next month
            </Button>
            <Button
              className="w-full justify-start font-normal"
              onClick={() => {
                onChange(next3months);
                setMonth(next3months.to);
              }}
              size="sm"
              variant="ghost"
            >
              Next 3 months
            </Button>
            <Button
              className="w-full justify-start font-normal"
              onClick={() => {
                onChange(next6months);
                setMonth(next6months.to);
              }}
              size="sm"
              variant="ghost"
            >
              Next 6 months
            </Button>
            <Button
              className="w-full justify-start font-normal"
              onClick={() => {
                onChange(nextYear);
                setMonth(nextYear.to);
              }}
              size="sm"
              variant="ghost"
            >
              Next year
            </Button>
          </div>
          <Calendar
            className="p-2"
            // disabled={[
            //   { before: today }, // Dates before today
            // ]}
            mode="range"
            month={month}
            onMonthChange={setMonth}
            onSelect={(newDate) => {
              if (newDate) {
                onChange(newDate);
              }
            }}
            selected={value}
          />
        </div>
      </PopoverContent>
    </Popover>
  );
}
