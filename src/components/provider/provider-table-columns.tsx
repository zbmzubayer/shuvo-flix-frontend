'use client';

import { useMutation } from '@tanstack/react-query';
import type { ColumnDef } from '@tanstack/react-table';
import { EditIcon, TrashIcon } from 'lucide-react';
import { toast } from 'sonner';

import DeleteAlertDialog from '@/components/delete-alert-dialog';
import { EditProviderForm } from '@/components/provider/edit-provider-form';
import { Button } from '@/components/ui/button';
import {
  DialogContent,
  DialogHeader,
  DialogProvider,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { UserAvatar } from '@/components/user-avatar';
import { deleteProvider } from '@/services/provider.service';
import type { Provider } from '@/types/provider';

export const providerTableColumns: ColumnDef<Provider>[] = [
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
        mutationFn: () => deleteProvider(row.original.id),
        onSuccess: () => {
          toast.success('Provider deleted successfully');
        },
        onError: () => {
          toast.error('Failed to delete provider');
        },
      });

      return (
        <div className="flex justify-center gap-2">
          <DialogProvider>
            <DialogTrigger asChild>
              <Button className="size-8" variant="outline">
                <EditIcon />
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-md" onOpenAutoFocus={(e) => e.preventDefault()}>
              <DialogHeader>
                <DialogTitle>Edit Provider</DialogTitle>
              </DialogHeader>
              <EditProviderForm provider={row.original} />
            </DialogContent>
          </DialogProvider>

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
