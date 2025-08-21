'use client';

import { addDays, addMonths, addYears, endOfMonth, startOfMonth, subDays } from 'date-fns';
import { useState } from 'react';
import type { DateRange } from 'react-day-picker';

import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';

export default function DateRangePickerDemo() {
  const today = new Date();
  const yesterday = {
    from: subDays(today, 1),
    to: subDays(today, 1),
  };
  const next7Days = {
    from: today,
    to: addDays(today, 6),
  };
  const next30Days = {
    from: today,
    to: addDays(today, 30),
  };
  const nextMonth = {
    from: startOfMonth(addMonths(today, 1)),
    to: endOfMonth(addMonths(today, 1)),
  };
  const nextYear = {
    from: today,
    to: addYears(today, 1),
  };
  const [month, setMonth] = useState(today);
  const [date, setDate] = useState<DateRange | undefined>(undefined);

  return (
    <div>
      <div className="w-fit rounded-md border border-red-500">
        <div className="flex max-sm:flex-col">
          <div className="relative py-4 max-sm:order-1 max-sm:border-t sm:w-32">
            <div className="h-full sm:border-e">
              <div className="flex flex-col px-2">
                <Button
                  className="w-full justify-start"
                  onClick={() => {
                    setDate({
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
                  className="w-full justify-start"
                  onClick={() => {
                    setDate(yesterday);
                    setMonth(yesterday.to);
                  }}
                  size="sm"
                  variant="ghost"
                >
                  Yesterday
                </Button>
                <Button
                  className="w-full justify-start"
                  onClick={() => {
                    setDate(next7Days);
                    setMonth(next7Days.to);
                  }}
                  size="sm"
                  variant="ghost"
                >
                  Next 7 days
                </Button>
                <Button
                  className="w-full justify-start"
                  onClick={() => {
                    setDate(next30Days);
                    setMonth(next30Days.to);
                  }}
                  size="sm"
                  variant="ghost"
                >
                  Next 30 days
                </Button>
                <Button
                  className="w-full justify-start"
                  onClick={() => {
                    setDate(nextMonth);
                    setMonth(nextMonth.to);
                  }}
                  size="sm"
                  variant="ghost"
                >
                  Next month
                </Button>
                <Button
                  className="w-full justify-start"
                  onClick={() => {
                    setDate(nextYear);
                    setMonth(nextYear.to);
                  }}
                  size="sm"
                  variant="ghost"
                >
                  Next year
                </Button>
              </div>
            </div>
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
                setDate(newDate);
              }
            }}
            selected={date}
          />
        </div>
      </div>
    </div>
  );
}
