'use client';

import type { ColumnDef } from '@tanstack/react-table';
import { formatDistanceToNowStrict } from 'date-fns';

import type { Customer } from '@/types/customer';

// export const customerFilterFields: FilterField[] = [
//   {
//     column: 'status',
//     title: 'Status',
//     options: [
//       { label: 'Active', value: 'active' },
//       { label: 'Inactive', value: 'inactive' },
//       { label: 'Suspended', value: 'suspended' },
//     ],
//   },
// ];

export const customerTableColumns: ColumnDef<Customer>[] = [
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

  // {
  //   accessorKey: 'Actions',
  //   header: () => <div className="text-center">Actions</div>,
  //   cell: ({ row }) => {
  //     const { mutateAsync } = useMutation({
  //       mutationFn: () => deleteCustomer(row.original.id),
  //       onSuccess: () => {
  //         toast.success('Customer deleted successfully');
  //       },
  //       onError: () => {
  //         toast.error('Failed to delete customer');
  //       },
  //     });

  //     return (
  //       <div className="flex justify-center gap-2">
  //         <DialogProvider>
  //           <DialogProviderTrigger asChild>
  //             <Button className="size-8" variant="outline">
  //               <EditIcon />
  //             </Button>
  //           </DialogProviderTrigger>
  //           <DialogContent className="sm:max-w-md" onOpenAutoFocus={(e) => e.preventDefault()}>
  //             <DialogHeader>
  //               <DialogTitle>Edit Customer</DialogTitle>
  //             </DialogHeader>
  //             <EditCustomerForm customer={row.original} />
  //           </DialogContent>
  //         </DialogProvider>

  //         <DeleteAlertDialog onConfirm={async () => await mutateAsync()}>
  //           <Button className="size-8" variant="destructive">
  //             <TrashIcon />
  //           </Button>
  //         </DeleteAlertDialog>
  //       </div>
  //     );
  //   },
  //   enableSorting: false,
  // },
];
