'use client';

import type { ColumnDef } from '@tanstack/react-table';
import { formatDistanceToNowStrict } from 'date-fns';

import { Badge } from '@/components/ui/badge';
import type { FilterField } from '@/components/ui/data-table';
import { cn } from '@/lib/utils';
import { ORDER_STATUS, type OrderDetails } from '@/types/order';

export const orderFilterFields: FilterField[] = [
  {
    column: 'status',
    title: 'Status',
    options: [
      { label: ORDER_STATUS.paid, value: ORDER_STATUS.paid },
      { label: ORDER_STATUS.due, value: ORDER_STATUS.due },
      { label: ORDER_STATUS.unpaid, value: ORDER_STATUS.unpaid },
    ],
  },
];

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
    filterFn: (row, _id, value) => row.original.customer.phone.includes(value),
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

  // {
  //   accessorKey: 'actions',
  //   header: () => <div className="text-center">Actions</div>,
  //   cell: ({ row }) => {
  //     const { mutateAsync } = useMutation({
  //       mutationFn: () => deleteOrder(row.original.id),
  //       onSuccess: () => {
  //         toast.success('Order deleted successfully');
  //       },
  //       onError: () => {
  //         toast.error('Failed to delete order');
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
  //               <DialogTitle>Edit Order</DialogTitle>
  //             </DialogHeader>
  //             <EditOrderForm order={row.original} />
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
