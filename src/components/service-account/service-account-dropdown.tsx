'use client';

import { CircleXIcon, EditIcon, EllipsisVerticalIcon, EyeIcon } from 'lucide-react';
import { useState } from 'react';

import { EditServiceAccountForm } from '@/components/service-account/edit-service-account-form';
import { Button } from '@/components/ui/button';
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
import type { ServiceAccount } from '@/types/service-account';

export function ServiceAccountDropdown({ account }: { account: ServiceAccount }) {
  const [open, setOpen] = useState(false);

  return (
    <>
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

          <DropdownMenuItem>
            <EyeIcon />
            View
          </DropdownMenuItem>
          <DropdownMenuItem>
            <CircleXIcon className="text-destructive" />
            Disable
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
      <Dialog onOpenChange={setOpen} open={open}>
        <DialogContent
          className="flex flex-col gap-0 p-0 sm:max-w-xl"
          onOpenAutoFocus={(e) => e.preventDefault()}
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
    </>
  );
}
