'use client';

import { useMemo, useState } from 'react';

import { DatePicker } from '@/components/ui/date-picker';

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

export function DashboardDatePickerCard({ items, field }: DashboardDateRangeCardProps) {
  const [date, setDate] = useState<Date | undefined>(undefined);

  const filteredItems = useMemo(() => {
    // Upcoming Expiration
    if (!date) {
      const today = Date.now();
      const twoDaysLater = new Date(new Date().setDate(new Date().getDate() + 2)).setHours(
        23,
        59,
        59,
        999
      );

      return items.filter((item) => {
        const dateValue = item[field];
        if (!dateValue) return false;

        const dateField = new Date(dateValue).setHours(23, 59, 59, 999);
        return dateField >= today && dateField <= twoDaysLater;
      });
    }

    return items.filter((item) => {
      const dateValue = item[field];
      if (!dateValue) return false;

      const dateField = new Date(dateValue);
      if (field === 'createdAt') {
        return dateField.toDateString() === date.toDateString();
      }
      // Upcoming Expiration 2days
      dateField.setHours(23, 59, 59, 999);
      const twoDaysLater = new Date(date);
      twoDaysLater.setDate(twoDaysLater.getDate() + 2);
      twoDaysLater.setHours(23, 59, 59, 999);
      return date < dateField && dateField <= twoDaysLater;
    });
  }, [items, date]);

  return (
    <>
      <p className="font-bold text-2xl tabular-nums">{filteredItems.length}</p>
      <DatePicker onChange={setDate} value={date} />
    </>
  );
}
