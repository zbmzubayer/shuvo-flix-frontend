'use client';

import type { ColumnDef, FilterFn } from '@tanstack/react-table';
import { formatDistanceToNowStrict } from 'date-fns';
import Image from 'next/image';
import type { DateRange } from 'react-day-picker';

import { OrderDropdown } from '@/components/order/order-dropdown';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import { ORDER_STATUS, type OrderDetails } from '@/types/order';
import { ACCOUNT_STATUS, type AccountStatus } from '@/types/service-account';

const multiColumnFilterFn: FilterFn<OrderDetails> = (row, _columnId, filterValue) => {
  const searchableRowContent =
    `${row.original.customer.name}${row.original.customer.phone}${row.original.email}SF-${row.original.id.toString().padStart(6, '0')}`.toLowerCase();
  const searchTerm = (filterValue ?? '').toLowerCase();
  return searchableRowContent.includes(searchTerm);
};

export const orderTableColumns: ColumnDef<OrderDetails>[] = [
  {
    accessorKey: 'id',
    header: 'Order No',
    cell: ({ row }) => `SF-${row.original.id.toString().padStart(6, '0')}`,
    enableSorting: false,
  },
  {
    accessorKey: 'fullName',
    header: 'Full Name',
    cell: ({ row }) => {
      return (
        <div className="flex flex-col">
          <span>{row.original.customer.name}</span>
          <span>{row.original.customer.personalEmail}</span>
        </div>
      );
    },
    enableSorting: false,
  },
  {
    accessorKey: 'phone',
    header: 'Phone',
    cell: ({ row }) => `${row.original.customer.phone}`,
    filterFn: multiColumnFilterFn,
    enableSorting: false,
  },
  {
    accessorKey: 'startDate',
    header: 'Start Date',
    cell: ({ row }) => `${new Date(row.original.startDate).toLocaleDateString()}`,
  },
  {
    accessorKey: 'endDate',
    header: 'End Date',
    cell: ({ row }) =>
      `${new Date(row.original.endDate).toLocaleDateString()} (${formatDistanceToNowStrict(new Date(row.original.endDate).setHours(23, 59, 59, 999))})`,
  },
  // {
  //   accessorKey: 'leftDays',
  //   header: 'Left Days',
  //   cell: ({ row }) => `${formatDistanceToNowStrict(new Date(row.original.endDate))}`,
  //   accessorFn: (row) => row.endDate,
  // },
  {
    accessorKey: 'createdAt',
    header: 'Order Date',
    cell: ({ row }) => new Date(row.original.createdAt).toLocaleDateString(),
    filterFn: (row, _columnId, filterValue: DateRange) => {
      const createdAt = new Date(row.original.createdAt);
      if (!(filterValue.from && filterValue.to)) return true;

      const from = new Date(filterValue.from);
      from.setHours(0, 0, 0, 0);
      const to = new Date(filterValue.to);
      to.setHours(23, 59, 59, 999);

      return createdAt >= from && createdAt <= to;
    },
  },
  {
    accessorKey: 'providerId',
    header: 'Provider',
    cell: ({ row }) => `${row.original.provider.name}`,
    enableSorting: false,
    filterFn: (row, columnId, filterValue) => filterValue.includes(row.getValue(columnId)),
  },
  {
    accessorKey: 'serviceId',
    header: 'Service Account',
    cell: ({ row }) => (
      <span className="flex items-center">
        <Image
          alt={row.original.service.name}
          className="me-1 inline aspect-square size-7 rounded border p-px"
          height={24}
          src={row.original.service.logo}
          width={24}
        />
        <span>
          {row.original.serviceAccount.name}{' '}
          <span className="font-medium text-muted-foreground text-xs">
            ({row.original.accountType})
          </span>
        </span>
      </span>
    ),
    filterFn: (row, columnId, filterValue) => filterValue.includes(row.getValue(columnId)),
    enableSorting: false,
  },
  {
    accessorKey: 'accountStatus',
    header: 'Acc Status',
    accessorFn: (row): AccountStatus => {
      const today = new Date();
      // set end date to last millisecond of the day
      const endDate = new Date(row.endDate);
      endDate.setHours(23, 59, 59, 999);
      if (endDate < today) return ACCOUNT_STATUS.expired;
      today.setDate(today.getDate() + 2);
      if (endDate < today) return ACCOUNT_STATUS.expiringSoon;
      return ACCOUNT_STATUS.active;
    },
    filterFn: 'arrIncludesSome',
    enableSorting: false,
  },
  {
    accessorKey: 'status',
    header: 'Status',
    cell: ({ row }) => (
      <Badge
        className={cn('text-white', {
          'bg-green-500': row.original.status === ORDER_STATUS.paid,
          'bg-yellow-500': row.original.status === ORDER_STATUS.due,
          'bg-red-500': row.original.status === ORDER_STATUS.unpaid,
          'bg-purple-500': row.original.status === ORDER_STATUS.gift,
          'bg-cyan-500': row.original.status === ORDER_STATUS.combo,
        })}
      >
        {row.original.status}
      </Badge>
    ),
    enableSorting: false,
    filterFn: (row, columnId, filterValue) => filterValue.includes(row.getValue(columnId)),
  },
  {
    accessorKey: 'actions',
    header: () => <span className="sr-only">Actions</span>,
    cell: ({ row }) => <OrderDropdown order={row.original} />,
    enableSorting: false,
  },
];
