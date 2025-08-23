'use client';

import type { ColumnDef } from '@tanstack/react-table';
import { formatDistanceToNowStrict } from 'date-fns';

import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import { ORDER_STATUS } from '@/types/order';
import type { OrderWithCustomer } from '@/types/service-account';
import { getOrderCode } from '@/utils/order.util';

export const serviceAccountOrderColumns: ColumnDef<OrderWithCustomer>[] = [
  {
    accessorKey: 'id',
    header: 'Order ID',
    cell: ({ row }) => getOrderCode(row.original.id),
  },
  {
    accessorKey: 'email',
    header: 'Email',
  },
  {
    accessorKey: 'customer.phone',
    header: 'Phone',
    enableSorting: false,
  },
  {
    accessorKey: 'accountType',
    header: 'Type',
    enableSorting: false,
  },
  {
    accessorKey: 'startDate',
    header: 'Start Date',
    cell: ({ row }) => new Date(row.original.startDate).toLocaleDateString(),
  },
  {
    accessorKey: 'endDate',
    header: 'End Date',
    cell: ({ row }) => new Date(row.original.endDate).toLocaleDateString(),
  },
  {
    accessorKey: 'leftDays',
    header: 'Left Days',
    cell: ({ row }) => `${formatDistanceToNowStrict(new Date(row.original.endDate))}`,
    accessorFn: (row) => row.endDate,
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
  },
];
