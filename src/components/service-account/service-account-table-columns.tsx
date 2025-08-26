'use client';

import type { ColumnDef, FilterFn } from '@tanstack/react-table';
import { formatDistanceToNowStrict } from 'date-fns';

import { ServiceAccountDropdown } from '@/components/service-account/service-account-dropdown';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import {
  ACCOUNT_STATUS,
  type AccountStatus,
  SERVICE_ACCOUNT_PAYMENT,
  SERVICE_ACCOUNT_STATUS,
  type ServiceAccount,
} from '@/types/service-account';

const multiColumnFilterFn: FilterFn<ServiceAccount> = (row, _columnId, filterValue) => {
  const searchableRowContent = `${row.original.name}${row.original.email}`.toLowerCase();
  const searchTerm = (filterValue ?? '').toLowerCase();
  return searchableRowContent.includes(searchTerm);
};

export const serviceAccountTableColumns: ColumnDef<ServiceAccount>[] = [
  {
    accessorKey: 'name',
    header: 'Name',
    filterFn: multiColumnFilterFn,
  },
  {
    accessorKey: 'email',
    header: 'Email',
  },
  { accessorKey: 'password', header: 'Password' },
  {
    accessorKey: 'personalSlots',
    header: 'Personal Slots',
    cell: ({ row }) => `${row.original.soldPersonalSlots || 0}/${row.original.personalSlots || 0}`,
  },
  {
    accessorKey: 'sharedSlots',
    header: 'Shared Slots',
    cell: ({ row }) => `${row.original.soldSharedSlots || 0}/${row.original.sharedSlots || 0}`,
  },
  {
    accessorKey: 'joinDate',
    header: 'Join Date',
    cell: ({ row }) => new Date(row.original.joinDate).toLocaleDateString(),
  },
  {
    accessorKey: 'expiryDate',
    header: 'Expiry Date',
    cell: ({ row }) =>
      `${new Date(row.original.expiryDate).toLocaleDateString()} (${formatDistanceToNowStrict(new Date(row.original.expiryDate))})`,
  },
  {
    accessorKey: 'accountStatus',
    header: 'Acc Status',
    accessorFn: (row): AccountStatus => {
      const today = new Date();
      const endDate = new Date(row.expiryDate);
      if (endDate < today) return ACCOUNT_STATUS.expired;
      today.setDate(today.getDate() + 2);
      if (endDate < today) return ACCOUNT_STATUS.expiringSoon;
      return ACCOUNT_STATUS.active;
    },
    filterFn: 'arrIncludesSome',
    enableSorting: false,
  },
  {
    accessorKey: 'payment',
    header: 'Payment',
    cell: ({ row }) => (
      <Badge
        className={cn('text-white', {
          'bg-green-500': row.original.payment === SERVICE_ACCOUNT_PAYMENT.paid,
          'bg-yellow-500': row.original.payment === SERVICE_ACCOUNT_PAYMENT.due,
          'bg-red-500': row.original.payment === SERVICE_ACCOUNT_PAYMENT.unpaid,
        })}
      >
        {row.original.payment}
      </Badge>
    ),
    enableSorting: false,
  },
  {
    accessorKey: 'status',
    header: 'Status',
    cell: ({ row }) => (
      <Badge
        className={cn('text-white', {
          'bg-green-500': row.original.status === SERVICE_ACCOUNT_STATUS.new,
          'bg-sky-500': row.original.status === SERVICE_ACCOUNT_STATUS.partial,
          'bg-orange-500': row.original.status === SERVICE_ACCOUNT_STATUS.full,
          'bg-red-500': row.original.status === SERVICE_ACCOUNT_STATUS.disabled,
        })}
      >
        {row.original.status}
      </Badge>
    ),
    enableSorting: false,
    filterFn: 'arrIncludesSome',
  },
  {
    accessorKey: 'actions',
    // cell: ({ row }) => {
    //   const { mutateAsync } = useMutation({
    //     mutationFn: () => deleteServiceAccount(row.original.id),
    //     onSuccess: () => {
    //       toast.success('Service account deleted successfully');
    //     },
    //     onError: () => {
    //       toast.error('Failed to delete service account');
    //     },
    //   });

    //   return (
    //     <div className="flex gap-2">
    //       <Button className="size-8 text-yellow-500" variant="outline">
    //         <EditIcon />
    //       </Button>
    //       <DeleteAlertDialog onConfirm={async () => await mutateAsync()}>
    //         <Button className="size-8" variant="destructive">
    //           <TrashIcon />
    //         </Button>
    //       </DeleteAlertDialog>
    //     </div>
    //   );
    // },
    cell: ({ row }) => <ServiceAccountDropdown account={row.original} />,
    header: () => <span className="sr-only">Actions</span>,
    enableSorting: false,
  },
];
