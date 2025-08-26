'use client';

import { useMutation } from '@tanstack/react-query';
import type { ColumnDef } from '@tanstack/react-table';
import { EditIcon, TrashIcon } from 'lucide-react';
import Image from 'next/image';
import { toast } from 'sonner';

import DeleteAlertDialog from '@/components/delete-alert-dialog';
import { Button } from '@/components/ui/button';
import { deleteService } from '@/services/service.service';
import type { Service } from '@/types/service';

export const serviceTableColumns: ColumnDef<Service>[] = [
  {
    accessorKey: 'logo',
    header: 'Logo',
    cell: ({ row }) => (
      <div className="inline-flex size-8 items-center justify-center rounded-md border bg-foreground">
        <Image
          alt={row.original.name}
          className="size-6 rounded-full"
          height={32}
          src={row.original.logo}
          width={32}
        />
      </div>
    ),
    enableSorting: false,
  },
  {
    accessorKey: 'name',
    header: 'Name',
  },
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
        mutationFn: () => deleteService(row.original.id),
        onSuccess: () => {
          toast.success('Service deleted successfully');
        },
        onError: () => {
          toast.error('Failed to delete service');
        },
      });

      return (
        <div className="flex gap-2">
          <Button className="size-8" variant="outline">
            <EditIcon />
          </Button>
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
