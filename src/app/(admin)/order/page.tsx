import type { Metadata } from 'next';

import { CreateOrderDialog } from '@/components/order/create-order-dialog';
import { orderTableColumns } from '@/components/order/order-table-columns';
import { OrderDataTableToolbar } from '@/components/order/order-table-toolbar';
import { DataTable } from '@/components/ui/data-table';
import type { FilterField } from '@/components/ui/data-table/data-table.interface';
import { DataTablePagination } from '@/components/ui/data-table/data-table-pagination';
import { DataTableProvider } from '@/components/ui/data-table/data-table-provider';
import { AppHeader } from '@/layouts/app-header';
import { getAllOrders } from '@/services/order.service';
import { getAllProviders } from '@/services/provider.service';
import { getAllServices } from '@/services/service.service';
import { ORDER_STATUS } from '@/types/order';
import { ACCOUNT_STATUS } from '@/types/service-account';

export const metadata: Metadata = {
  title: 'Order',
};

export default async function OrderPage() {
  const [orders, services, providers] = await Promise.all([
    getAllOrders(),
    getAllServices(),
    getAllProviders(),
  ]);

  const filterFields: FilterField[] = [
    {
      column: 'status',
      title: 'Status',
      options: [
        { label: ORDER_STATUS.paid, value: ORDER_STATUS.paid },
        { label: ORDER_STATUS.due, value: ORDER_STATUS.due },
        { label: ORDER_STATUS.unpaid, value: ORDER_STATUS.unpaid },
      ],
    },
    {
      column: 'accountStatus',
      title: 'Account Status',
      options: [
        { label: ACCOUNT_STATUS.active, value: ACCOUNT_STATUS.active },
        { label: ACCOUNT_STATUS.expired, value: ACCOUNT_STATUS.expired },
        { label: ACCOUNT_STATUS.expiringSoon, value: ACCOUNT_STATUS.expiringSoon },
      ],
    },
    {
      column: 'serviceId',
      title: 'Service',
      options: services.map((service) => ({
        label: service.name,
        value: service.id,
      })),
    },
    {
      column: 'providerId',
      title: 'Provider',
      options: providers.map((provider) => ({
        label: provider.name,
        value: provider.id,
      })),
    },
  ];

  return (
    <div>
      <AppHeader title="Orders" />
      <div className="space-y-2">
        <DataTableProvider columns={orderTableColumns} data={orders}>
          <div className="flex items-center justify-between">
            <OrderDataTableToolbar filterFields={filterFields} />
            <CreateOrderDialog />
          </div>
          <DataTable />
          <DataTablePagination />
        </DataTableProvider>

        {/* <OrderTable orders={orders} /> */}
      </div>
    </div>
  );
}
