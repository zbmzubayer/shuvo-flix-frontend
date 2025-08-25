import { PlusIcon } from 'lucide-react';

import { CreateOrderForm } from '@/components/order/create-order-form';
import { orderTableColumns } from '@/components/order/order-table-columns';
import { OrderDataTableToolbar } from '@/components/order/order-table-toolbar';
import { Button } from '@/components/ui/button';
import { DataTablePagination } from '@/components/ui/data-table/data-table-pagination';
import { DataTableProvider } from '@/components/ui/data-table/data-table-provider';
import { DataTable2 } from '@/components/ui/data-table/data-table2';
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
      <div className="space-y-2">
        <DataTableProvider columns={orderTableColumns} data={orders}>
          <div className="flex items-center justify-between">
            <OrderDataTableToolbar />
            <DialogProvider>
              <DialogProviderTrigger asChild>
                <Button size="sm">
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
          </div>
          <DataTable2 />
          <DataTablePagination />
        </DataTableProvider>

        {/* <OrderTable orders={orders} /> */}
      </div>
    </div>
  );
}
