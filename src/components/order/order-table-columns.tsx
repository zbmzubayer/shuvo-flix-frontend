'use client';

import type { ColumnDef, FilterFn } from '@tanstack/react-table';
import { formatDistanceToNowStrict } from 'date-fns';

import { OrderDropdown } from '@/components/order/order-dropdown';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import { ORDER_STATUS, type OrderDetails } from '@/types/order';

const multiColumnFilterFn: FilterFn<OrderDetails> = (row, _columnId, filterValue) => {
  const searchableRowContent =
    `${row.original.customer.name}${row.original.customer.phone}${row.original.email}`.toLowerCase();
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
    cell: ({ row }) => `${new Date(row.original.endDate).toLocaleDateString()}`,
  },
  {
    accessorKey: 'leftDays',
    header: 'Left Days',
    cell: ({ row }) => `${formatDistanceToNowStrict(new Date(row.original.endDate))}`,
    accessorFn: (row) => row.endDate,
  },
  {
    accessorKey: 'createdAt',
    header: 'Order Date',
    cell: ({ row }) => new Date(row.original.createdAt).toLocaleDateString(),
  },
  {
    accessorKey: 'serviceAccount.name',
    header: 'Service Account',
    cell: ({ row }) => `${row.original.serviceAccount.name} (${row.original.accountType})`,
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
        })}
      >
        {row.original.status}
      </Badge>
    ),
    enableSorting: false,
    filterFn: (row, id, value) => value.includes(row.getValue(id)),
  },
  {
    accessorKey: 'actions',
    header: () => <span className="sr-only">Actions</span>,
    cell: ({ row }) => <OrderDropdown order={row.original} />,
    enableSorting: false,
  },
];
