'use client';

import { useQuery } from '@tanstack/react-query';
import {
  CircleCheckIcon,
  CircleXIcon,
  EditIcon,
  EllipsisVerticalIcon,
  EyeIcon,
} from 'lucide-react';
import { useState } from 'react';
import { toast } from 'sonner';

import { invalidateCache } from '@/actions/cache.action';
import { EditServiceAccountForm } from '@/components/service-account/edit-service-account-form';
import { serviceAccountOrderColumns } from '@/components/service-account/service-account-order-columns';
import { Button } from '@/components/ui/button';
import { DataTable } from '@/components/ui/data-table';
import { DataTableProvider } from '@/components/ui/data-table/data-table-provider';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Spinner } from '@/components/ui/spinner';
import {
  getServiceAccountById,
  SERVICE_ACCOUNT_CACHE_KEY,
  toggleServiceAccountStatus,
} from '@/services/service-account.service';
import { SERVICE_ACCOUNT_STATUS, type ServiceAccount } from '@/types/service-account';

export function ServiceAccountDropdown({ account }: { account: ServiceAccount }) {
  const [open, setOpen] = useState(false);
  const [viewOpen, setViewOpen] = useState(false);

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button className="size-7" variant="ghost">
          <EllipsisVerticalIcon className="size-3.5" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuItem onClick={() => setOpen(true)}>
          <EditIcon />
          Edit
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => setViewOpen(true)}>
          <EyeIcon />
          View
        </DropdownMenuItem>
        <DropdownMenuItem
          onClick={async () => {
            try {
              await toggleServiceAccountStatus(account.id);
              invalidateCache(SERVICE_ACCOUNT_CACHE_KEY);
            } catch (error) {
              if (error instanceof Error) {
                toast.error('Failed to toggle account status', {
                  description: error.message,
                });
              }
            }
          }}
        >
          {account.status === SERVICE_ACCOUNT_STATUS.disabled ? (
            <>
              <CircleCheckIcon className="text-green-500" />
              Activate
            </>
          ) : (
            <>
              <CircleXIcon className="text-destructive" />
              Disable
            </>
          )}
        </DropdownMenuItem>
      </DropdownMenuContent>
      <Dialog onOpenChange={setOpen} open={open}>
        <DialogContent
          className="flex flex-col gap-0 p-0 sm:max-w-xl"
          onOpenAutoFocus={(e) => e.preventDefault()}
          onWheel={(e) => e.stopPropagation()}
        >
          <div className="overflow-y-auto p-6">
            <DialogHeader className="mb-2">
              <DialogTitle>Edit Account</DialogTitle>
              <DialogDescription>Edit the details for the service account.</DialogDescription>
            </DialogHeader>
            <EditServiceAccountForm account={account} setOpen={setOpen} />
          </div>
        </DialogContent>
      </Dialog>
      <Dialog onOpenChange={setViewOpen} open={viewOpen}>
        <DialogContent
          className="flex flex-col gap-0 p-0 sm:max-w-5xl"
          onOpenAutoFocus={(e) => e.preventDefault()}
        >
          <div className="overflow-y-auto p-6">
            <DialogHeader className="mb-5 items-center">
              <DialogTitle>{account.name} - Orders</DialogTitle>
            </DialogHeader>
            <ServiceAccountOrdersTable accountId={account.id} />
          </div>
        </DialogContent>
      </Dialog>
    </DropdownMenu>
  );
}

function ServiceAccountOrdersTable({ accountId }: { accountId: number }) {
  const { data, isFetching } = useQuery({
    queryKey: ['service-account', accountId],
    queryFn: () => getServiceAccountById(accountId),
  });

  return isFetching ? (
    <div className="flex justify-center">
      <Spinner />
    </div>
  ) : (
    <DataTableProvider columns={serviceAccountOrderColumns} data={data?.orders || []}>
      <DataTable />
    </DataTableProvider>
  );
}
