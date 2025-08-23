'use client';

import type { ColumnDef, FilterFn } from '@tanstack/react-table';
import { formatDistanceToNowStrict } from 'date-fns';
import { LinkIcon } from 'lucide-react';

import { CustomerDropdown } from '@/components/customer/customer-dropdown';
import type { CustomerDetails } from '@/types/customer';

const multiColumnFilterFn: FilterFn<CustomerDetails> = (row, _columnId, filterValue) => {
  const searchableRowContent =
    `${row.original.name}${row.original.personalEmail}${row.original.phone}`.toLowerCase();
  const searchTerm = (filterValue ?? '').toLowerCase();
  return searchableRowContent.includes(searchTerm);
};

export const customerTableColumns: ColumnDef<CustomerDetails>[] = [
  {
    accessorKey: 'id',
    header: 'Customer ID',
  },
  {
    accessorKey: 'name',
    header: 'Name',
  },
  {
    accessorKey: 'personalEmail',
    header: 'Personal Email',
  },
  {
    accessorKey: 'phone',
    header: 'Phone',
    filterFn: multiColumnFilterFn,
    enableSorting: false,
  },
  {
    accessorKey: 'lastPurchase',
    header: 'Last Purchase',
    cell: ({ row }) => `${formatDistanceToNowStrict(new Date(row.original.lastPurchase))} ago`,
  },
  {
    accessorKey: 'createdAt',
    header: 'Join Date',
    cell: ({ row }) => `${new Date(row.original.createdAt).toLocaleDateString()}`,
  },
  {
    accessorKey: 'social',
    header: 'Social',
    cell: ({ row }) => row.original.social || 'N/A',
    enableSorting: false,
  },
  {
    accessorKey: 'socialLink',
    header: 'Social Link',
    cell: ({ row }) =>
      row.original.socialLink ? (
        <a href={row.original.socialLink} rel="noopener noreferrer" target="_blank">
          <LinkIcon className="inline size-4" />
        </a>
      ) : (
        'N/A'
      ),
    enableSorting: false,
  },

  {
    accessorKey: 'actions',
    header: () => <span className="sr-only">Actions</span>,
    cell: ({ row }) => <CustomerDropdown customer={row.original} />,
    enableSorting: false,
    // cell: ({ row }) => {
    //   const { mutateAsync } = useMutation({
    //     mutationFn: () => deleteCustomer(row.original.id),
    //     onSuccess: () => {
    //       toast.success('Customer deleted successfully');
    //     },
    //     onError: () => {
    //       toast.error('Failed to delete customer');
    //     },
    //   });

    //   return (
    //     <div className="flex justify-center gap-2">
    //       <DialogProvider>
    //         <DialogProviderTrigger asChild>
    //           <Button className="size-8" variant="outline">
    //             <EditIcon />
    //           </Button>
    //         </DialogProviderTrigger>
    //         <DialogContent className="sm:max-w-md" onOpenAutoFocus={(e) => e.preventDefault()}>
    //           <DialogHeader>
    //             <DialogTitle>Edit Customer</DialogTitle>
    //           </DialogHeader>
    //           <EditCustomerForm customer={row.original} />
    //         </DialogContent>
    //       </DialogProvider>

    //       <DeleteAlertDialog onConfirm={async () => await mutateAsync()}>
    //         <Button className="size-8" variant="destructive">
    //           <TrashIcon />
    //         </Button>
    //       </DeleteAlertDialog>
    //     </div>
    //   );
    // },
  },
];
