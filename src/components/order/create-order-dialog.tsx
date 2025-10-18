'use client';

import { PlusIcon } from 'lucide-react';

import { CreateOrderForm } from '@/components/order/create-order-form';
import { Button } from '@/components/ui/button';
import {
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogProvider,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';

export function CreateOrderDialog() {
  return (
    <DialogProvider>
      <DialogTrigger asChild>
        <Button size="sm">
          <PlusIcon />
          Create Order
        </Button>
      </DialogTrigger>
      <DialogContent
        className="flex flex-col gap-0 p-0 sm:max-w-xl"
        onInteractOutside={(e) => {
          e.preventDefault();
        }}
      >
        <div className="overflow-y-auto p-6">
          <DialogHeader className="mb-2">
            <DialogTitle>Create Order</DialogTitle>
            <DialogDescription>Fill in the details below to create a new order.</DialogDescription>
          </DialogHeader>
          <CreateOrderForm />
        </div>
      </DialogContent>
    </DialogProvider>
  );
}
