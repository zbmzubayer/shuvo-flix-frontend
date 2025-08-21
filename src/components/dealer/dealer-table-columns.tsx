'use client';

import { useMutation } from '@tanstack/react-query';
import type { ColumnDef } from '@tanstack/react-table';
import { EditIcon, TrashIcon } from 'lucide-react';
import { toast } from 'sonner';

import { EditDealerForm } from '@/components/dealer/edit-dealer-form';
import DeleteAlertDialog from '@/components/delete-alert-dialog';
import { DialogControlled } from '@/components/dialog-controlled';
import { Button } from '@/components/ui/button';
import { DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { UserAvatar } from '@/components/user-avatar';
import { deleteDealer } from '@/services/dealer.service';
import type { Dealer } from '@/types/dealer';

export const dealerTableColumns: ColumnDef<Dealer>[] = [
  {
    accessorKey: 'logo',
    header: 'Logo',
    cell: ({ row }) => (
      <div className="inline-flex size-8 items-center justify-center rounded-md border bg-foreground">
        <UserAvatar alt={row.original.name} height={32} src={row.original.logo} width={32} />
      </div>
    ),
    enableSorting: false,
  },
  { accessorKey: 'name', header: 'Name' },
  {
    accessorKey: 'createdAt',
    header: 'Created At',
    cell: ({ row }) => new Date(row.original.createdAt).toLocaleString(),
  },
  {
    accessorKey: 'Actions',
    header: () => <div className="text-center">Actions</div>,
    cell: ({ row }) => {
      const { mutateAsync } = useMutation({
        mutationFn: () => deleteDealer(row.original.id),
        onSuccess: () => {
          toast.success('Dealer deleted successfully');
        },
        onError: () => {
          toast.error('Failed to delete dealer');
        },
      });

      return (
        <div className="flex justify-center gap-2">
          <DialogControlled
            trigger={
              <Button className="size-8" variant="outline">
                <EditIcon />
              </Button>
            }
          >
            <DialogContent className="sm:max-w-md" onOpenAutoFocus={(e) => e.preventDefault()}>
              <DialogHeader>
                <DialogTitle>Edit Dealer</DialogTitle>
              </DialogHeader>
              <EditDealerForm dealer={row.original} />
            </DialogContent>
          </DialogControlled>

          <DeleteAlertDialog onConfirm={async () => await mutateAsync()}>
            <Button className="size-8" variant="destructive">
              <TrashIcon />
            </Button>
          </DeleteAlertDialog>
        </div>
      );
    },
    enableSorting: false,
  },
];
