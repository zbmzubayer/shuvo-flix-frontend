'use client';

import { useMemo, useState } from 'react';
import type { DateRange } from 'react-day-picker';

import { DateRangePicker } from '@/components/ui/date-range-picker';

type ItemWithCreatedAt = { createdAt: Date; endDate?: Date };
type ItemWithEndDate = { endDate: Date; createdAt?: Date };

type DashboardDateRangeCardProps =
  | {
      items: ItemWithCreatedAt[];
      field: 'createdAt';
    }
  | {
      items: ItemWithEndDate[];
      field: 'endDate';
    };

export function DashboardDateRangeCard({ items, field }: DashboardDateRangeCardProps) {
  const [dateRange, setDateRange] = useState<DateRange | undefined>(undefined);

  const filteredItems = useMemo(() => {
    if (!dateRange) return items;
    if (dateRange.from === undefined && dateRange.to === undefined) return items;

    return items.filter((item) => {
      const dateValue = item[field];
      if (!dateValue) return false;

      const dateField = new Date(dateValue);
      if (field === 'createdAt') {
        return (
          (!dateRange.from || dateField >= dateRange.from) &&
          (!dateRange.to || dateField <= dateRange.to)
        );
      }
      dateField.setHours(23, 59, 59, 999);

      return (
        (!dateRange.from || dateField >= dateRange.from) &&
        (!dateRange.to || dateField <= dateRange.to)
      );
    });
  }, [items, dateRange, field]);

  return (
    <>
      <p className="font-bold text-2xl tabular-nums">{filteredItems.length}</p>
      <DateRangePicker
        className="h-8 w-56"
        onChange={(range) => {
          const from = range?.from ? new Date(range.from.setHours(0, 0, 0, 0)) : undefined;
          const to = range?.to ? new Date(range.to.setHours(23, 59, 59, 999)) : undefined;
          setDateRange({ from, to });
        }}
        rangeType="previous"
        value={dateRange}
      />
    </>
  );
}
