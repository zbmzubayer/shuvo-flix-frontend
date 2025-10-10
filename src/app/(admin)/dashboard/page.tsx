import { ContactIcon, NotebookPenIcon } from 'lucide-react';
import type { Metadata } from 'next';

import { DashboardDatePickerCard } from '@/components/dashboard/dasbhoard-date-picker-card';
import { DashboardDateRangeCard } from '@/components/dashboard/dashboard-date-range-card';
import { Card } from '@/components/ui/card';
import { AppHeader } from '@/layouts/app-header';
import { getAllCustomers } from '@/services/customer.service';
import { getAllOrders } from '@/services/order.service';

export const metadata: Metadata = {
  title: 'Dashboard',
};

export default async function DashboardPage() {
  const [customers, orders] = await Promise.all([getAllCustomers(), getAllOrders()]);

  // Customer of today
  const newCustomer = customers.filter((customer) => {
    const createdAt = new Date(customer.createdAt);
    const today = new Date();
    return (
      createdAt.getDate() === today.getDate() &&
      createdAt.getMonth() === today.getMonth() &&
      createdAt.getFullYear() === today.getFullYear()
    );
  }).length;

  const totalOrder = orders.length;
  let activeOrder = 0;
  for (let i = 0; i < totalOrder; i++) {
    const endDate = new Date(orders[i].endDate).setHours(23, 59, 59, 999);
    if (endDate > Date.now()) {
      activeOrder++;
    }
  }

  return (
    <div>
      <AppHeader title="Dashboard" />
      <div className="my-5 grid grid-cols-2 gap-4 *:data-[slot=card]:bg-gradient-to-t *:data-[slot=card]:from-primary/5 *:data-[slot=card]:to-card *:data-[slot=card]:shadow-xs md:grid-cols-3 lg:grid-cols-3 dark:*:data-[slot=card]:bg-card">
        <Card className="items-center justify-center gap-3">
          <div className="flex items-center gap-2">
            <ContactIcon className="size-5 text-muted-foreground" />
            <h3 className="font-semibold">Total Customers</h3>
          </div>
          <div className="flex items-center gap-5">
            <DashboardDateRangeCard field="createdAt" items={customers} />
          </div>
        </Card>
        <Card className="items-center justify-center gap-3">
          <div className="flex items-center gap-2">
            <ContactIcon className="size-5 text-muted-foreground" />
            <h3 className="font-semibold">New Customers</h3>
          </div>
          <p className="font-bold text-2xl tabular-nums">{newCustomer}</p>
        </Card>
        <Card className="items-center justify-center gap-3">
          <div className="flex items-center gap-2">
            <NotebookPenIcon className="size-5 text-muted-foreground" />
            <h3 className="font-semibold">Total Orders</h3>
          </div>
          <div className="flex items-center gap-5">
            <DashboardDateRangeCard field="createdAt" items={orders} />
          </div>
        </Card>
        <Card className="items-center justify-center gap-3">
          <div className="flex items-center gap-2">
            <NotebookPenIcon className="size-5 text-green-500" />
            <h3 className="font-semibold">Active Orders</h3>
          </div>
          <p className="font-bold text-2xl tabular-nums">{activeOrder}</p>
        </Card>
        <Card className="items-center justify-center gap-3">
          <div className="flex items-center gap-2">
            <NotebookPenIcon className="size-5 text-red-500" />
            <h3 className="font-semibold">Expired Orders</h3>
          </div>
          <p className="font-bold text-2xl tabular-nums">{totalOrder - activeOrder}</p>
        </Card>
        <Card className="items-center justify-center gap-3">
          <div className="flex items-center gap-2">
            <NotebookPenIcon className="size-5 text-orange-500" />
            <h3 className="font-semibold">Upcoming Expiration</h3>
          </div>
          <div className="flex items-center gap-5">
            <DashboardDatePickerCard field="endDate" items={orders} />
          </div>
        </Card>
      </div>
      {/* <DashboardChart /> */}
    </div>
  );
}
