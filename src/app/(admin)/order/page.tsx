import { PlusIcon } from 'lucide-react';

import { CreateOrderForm } from '@/components/order/create-order-form';
import { orderFilterFields, orderTableColumns } from '@/components/order/order-table-columns';
import { Button } from '@/components/ui/button';
import { DataTable } from '@/components/ui/data-table';
import {
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogProvider,
  DialogProviderTrigger,
  DialogTitle,
} from '@/components/ui/dialog';
import { AppHeader } from '@/layouts/app-header';
import { getAllOrders } from '@/services/order.service';

export default async function OrderPage() {
  const orders = await getAllOrders();

  return (
    <div>
      <AppHeader title="Orders" />
      <DialogProvider>
        <DialogProviderTrigger asChild>
          <Button>
            <PlusIcon />
            Create Order
          </Button>
        </DialogProviderTrigger>
        <DialogContent className="flex flex-col gap-0 p-0 sm:max-w-xl">
          <div className="overflow-y-auto p-6">
            <DialogHeader className="mb-2">
              <DialogTitle>Create Order</DialogTitle>
              <DialogDescription>
                Fill in the details below to create a new order.
              </DialogDescription>
            </DialogHeader>
            <CreateOrderForm />
          </div>
        </DialogContent>
      </DialogProvider>

      <div className="mt-5">
        <DataTable columns={orderTableColumns} data={orders} filterFields={orderFilterFields} />
        {/* <OrderTable orders={orders} /> */}
      </div>
    </div>
  );
}
