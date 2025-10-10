'use client';

import type { ColumnDef } from '@tanstack/react-table';
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

export const serviceAccountExpiredTableColumns: ColumnDef<ServiceAccount>[] = [
  {
    accessorKey: 'name',
    header: 'Name',
  },
  {
    accessorKey: 'email',
    header: 'Email & Pass',
    cell: ({ row }) => (
      <div className="flex flex-col">
        <span>{row.original.email}</span>
        <span className="text-muted-foreground">{row.original.password}</span>
      </div>
    ),
  },
  {
    accessorKey: 'personalSlots',
    header: 'Personal Slots',
    cell: ({ row }) => `${row.original.soldPersonalSlots || 0}/${row.original.personalSlots || 0}`,
    // accessorFn: (row) =>
    //   row.soldPersonalSlots && row.personalSlots ? row.soldPersonalSlots / row.personalSlots : 0,
    enableSorting: false,
  },
  {
    accessorKey: 'sharedSlots',
    header: 'Shared Slots',
    cell: ({ row }) => `${row.original.soldSharedSlots || 0}/${row.original.sharedSlots || 0}`,
    // accessorFn: (row) =>
    //   row.soldSharedSlots && row.sharedSlots ? row.soldSharedSlots / row.sharedSlots : 0,
    enableSorting: false,
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
      `${new Date(row.original.expiryDate).toLocaleDateString()} (${formatDistanceToNowStrict(new Date(new Date(row.original.expiryDate).setHours(23, 59, 59, 999)), { addSuffix: true })})`,
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
