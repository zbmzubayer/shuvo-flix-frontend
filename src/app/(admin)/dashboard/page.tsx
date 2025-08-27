import { ContactIcon, NotebookPenIcon } from 'lucide-react';
import type { Metadata } from 'next';

import { Card } from '@/components/ui/card';
import { AppHeader } from '@/layouts/app-header';
import { getDashboardData } from '@/services/dashboard.service';

export const metadata: Metadata = {
  title: 'Dashboard',
};

export default async function DashboardPage() {
  const dashboardData = await getDashboardData();

  return (
    <div>
      <AppHeader title="Dashboard" />
      <div className="my-5 grid grid-cols-2 gap-4 *:data-[slot=card]:bg-gradient-to-t *:data-[slot=card]:from-primary/5 *:data-[slot=card]:to-card *:data-[slot=card]:shadow-xs md:grid-cols-3 lg:grid-cols-3 dark:*:data-[slot=card]:bg-card">
        <Card className="items-center justify-center gap-3">
          <div className="flex items-center gap-2">
            <ContactIcon className="size-5 text-muted-foreground" />
            <h3 className="font-semibold">Total Customers</h3>
          </div>
          <p className="font-bold text-2xl tabular-nums">{dashboardData.totalCustomer}</p>
        </Card>
        <Card className="items-center justify-center gap-3">
          <div className="flex items-center gap-2">
            <ContactIcon className="size-5 text-muted-foreground" />
            <h3 className="font-semibold">New Customers</h3>
          </div>
          <p className="font-bold text-2xl tabular-nums">{dashboardData.newCustomer}</p>
        </Card>
        <Card className="items-center justify-center gap-3">
          <div className="flex items-center gap-2">
            <NotebookPenIcon className="size-5 text-muted-foreground" />
            <h3 className="font-semibold">Total Orders</h3>
          </div>
          <p className="font-bold text-2xl tabular-nums">{dashboardData.totalOrder}</p>
        </Card>
        <Card className="items-center justify-center gap-3">
          <div className="flex items-center gap-2">
            <NotebookPenIcon className="size-5 text-green-500" />
            <h3 className="font-semibold">Active Orders</h3>
          </div>
          <p className="font-bold text-2xl tabular-nums">{dashboardData.activeOrder}</p>
        </Card>
        <Card className="items-center justify-center gap-3">
          <div className="flex items-center gap-2">
            <NotebookPenIcon className="size-5 text-red-500" />
            <h3 className="font-semibold">Expired Orders</h3>
          </div>
          <p className="font-bold text-2xl tabular-nums">{dashboardData.expiredOrder}</p>
        </Card>
        <Card className="items-center justify-center gap-3">
          <div className="flex items-center gap-2">
            <NotebookPenIcon className="size-5 text-orange-500" />
            <h3 className="font-semibold">Upcoming Expiration</h3>
          </div>
          <p className="font-bold text-2xl tabular-nums">{dashboardData.upcomingExpiredOrder}</p>
        </Card>
      </div>
      {/* <DashboardChart /> */}
    </div>
  );
}
