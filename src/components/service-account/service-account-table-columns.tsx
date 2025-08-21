'use client';

import type { ColumnDef } from '@tanstack/react-table';

import { ServiceAccountDropdown } from '@/components/service-account/service-account-dropdown';
import type { ServiceAccount } from '@/types/service-account';

export const serviceAccountTableColumns: ColumnDef<ServiceAccount>[] = [
  {
    accessorKey: 'name',
    header: 'Name',
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
    accessorKey: 'isActive',
    header: 'Status',
    cell: ({ row }) => (row.original.isActive ? 'Active' : 'Inactive'),
  },
  {
    accessorKey: 'joinDate',
    header: 'Join Date',
    cell: ({ row }) => new Date(row.original.joinDate).toLocaleDateString(),
  },
  {
    accessorKey: 'expiryDate',
    header: 'Expiry Date',
    cell: ({ row }) => new Date(row.original.expiryDate).toLocaleDateString(),
  },
  {
    accessorKey: 'createdAt',
    header: 'Created Date',
    cell: ({ row }) => new Date(row.original.createdAt).toLocaleDateString(),
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
