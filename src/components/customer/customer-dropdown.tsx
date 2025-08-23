'use client';

import { format } from 'date-fns';
import { EditIcon, EllipsisVerticalIcon, MoveRightIcon, NotebookPenIcon } from 'lucide-react';
import Image from 'next/image';
import { useState } from 'react';

import { EditCustomerForm } from '@/components/customer/edit-customer-form';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
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
import { cn } from '@/lib/utils';
import type { CustomerDetails } from '@/types/customer';
import { ORDER_STATUS } from '@/types/order';
import { getOrderCode } from '@/utils/order.util';

export function CustomerDropdown({ customer }: { customer: CustomerDetails }) {
  const [open, setOpen] = useState(false);
  const [orderHistoryOpen, setOrderHistoryOpen] = useState(false);

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

          <DropdownMenuItem onClick={() => setOrderHistoryOpen(true)}>
            <NotebookPenIcon />
            Orders
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
              <DialogTitle>Edit Customer</DialogTitle>
              <DialogDescription>Edit the details for the customer.</DialogDescription>
            </DialogHeader>
            <EditCustomerForm customer={customer} setOpen={setOpen} />
          </div>
        </DialogContent>
      </Dialog>
      <Dialog onOpenChange={setOrderHistoryOpen} open={orderHistoryOpen}>
        <DialogContent className="flex flex-col gap-0 p-0 sm:max-w-3xl">
          <div className="overflow-y-auto p-3">
            <DialogHeader className="mb-5 items-center">
              <DialogTitle>Customer Order History</DialogTitle>
            </DialogHeader>
            <div className="grid gap-3 lg:grid-cols-2">
              {customer.orders.map((order) => (
                <Card className="gap-2 rounded-sm p-2 text-sm" key={order.id}>
                  <div className="flex items-center justify-between">
                    Order ID - {getOrderCode(order.id)}
                    <Badge
                      className={cn('text-white', {
                        'bg-green-500': order.status === ORDER_STATUS.paid,
                        'bg-yellow-500': order.status === ORDER_STATUS.due,
                        'bg-red-500': order.status === ORDER_STATUS.unpaid,
                      })}
                    >
                      {order.status}
                    </Badge>
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <div className="inline-flex size-10 items-center justify-center rounded-md border bg-foreground">
                        <Image
                          alt={order.service.name}
                          className="size-8 rounded-full"
                          height={32}
                          src={order.service.logo}
                          width={32}
                        />
                      </div>
                      <div>
                        <div className="flex items-center gap-1">
                          <p>{order.service.name}</p>
                          <MoveRightIcon className="size-3" />
                          <p>{order.serviceAccount.name}</p>
                        </div>
                        <p>{order.email}</p>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center justify-between text-muted-foreground text-xs">
                    <p>Start:{format(new Date(order.startDate), 'MMM dd, yyyy')}</p>
                    <p>End:{format(new Date(order.endDate), 'MMM dd, yyyy')}</p>
                  </div>
                </Card>
              ))}
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
