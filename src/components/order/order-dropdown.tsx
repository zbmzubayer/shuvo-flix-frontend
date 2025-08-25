'use client';

import { EditIcon, EllipsisVerticalIcon } from 'lucide-react';
import { useState } from 'react';

import { EditOrderForm } from '@/components/order/edit-order-form';
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
import type { OrderDetails } from '@/types/order';

export function OrderDropdown({ order }: { order: OrderDetails }) {
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
        </DropdownMenuContent>
      </DropdownMenu>
      <Dialog onOpenChange={setOpen} open={open}>
        <DialogContent
          className="flex flex-col gap-0 p-0 sm:max-w-xl"
          onOpenAutoFocus={(e) => e.preventDefault()}
        >
          <div className="overflow-y-auto p-6">
            <DialogHeader className="mb-2">
              <DialogTitle>Edit Order</DialogTitle>
              <DialogDescription>Edit the details for the order.</DialogDescription>
            </DialogHeader>
            <EditOrderForm order={order} setOpen={setOpen} />
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
