import { EyeIcon, TicketCheckIcon, TicketMinusIcon, TicketXIcon } from 'lucide-react';
import type { Metadata } from 'next';

import { ServiceList } from '@/components/service/service-list';
import { serviceAccountExpiredTableColumns } from '@/components/service-account/service-account-expired-columns';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { DataTable } from '@/components/ui/data-table';
import { DataTableProvider } from '@/components/ui/data-table/data-table-provider';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { AppHeader } from '@/layouts/app-header';
import { getAllServices } from '@/services/service.service';
import { SERVICE_ACCOUNT_STATUS, type ServiceAccount } from '@/types/service-account';

export const metadata: Metadata = {
  title: 'Service',
};

export default async function ServicePage() {
  const services = await getAllServices();

  // TODO Need tp optimize this three functions
  const { totalActiveAccounts, expiredSoonAccounts, expiredAccounts } = services.reduce(
    (acc, service) => {
      for (const account of service.serviceAccounts) {
        if (account.status === SERVICE_ACCOUNT_STATUS.disabled) {
          continue;
        }

        acc.totalActiveAccounts.push(account);

        const expiryDate = new Date(new Date(account.expiryDate).setHours(23, 59, 59, 999));
        const currentDate = new Date();

        if (expiryDate < currentDate) {
          acc.expiredAccounts.push(account);
        } else {
          const soonThreshold = new Date();
          soonThreshold.setDate(currentDate.getDate() + 2);
          soonThreshold.setHours(23, 59, 59, 999);

          if (new Date() < expiryDate && expiryDate <= soonThreshold) {
            acc.expiredSoonAccounts.push(account);
          }
        }
      }
      return acc;
    },
    {
      totalActiveAccounts: [] as ServiceAccount[],
      expiredSoonAccounts: [] as ServiceAccount[],
      expiredAccounts: [] as ServiceAccount[],
    }
  );

  return (
    <div>
      <AppHeader title="Services" />
      <div className="grid gap-4 *:data-[slot=card]:bg-gradient-to-t *:data-[slot=card]:from-primary/5 *:data-[slot=card]:to-card *:data-[slot=card]:shadow-xs md:grid-cols-2 lg:grid-cols-3 dark:*:data-[slot=card]:bg-card">
        <Card className="p-0 pb-5">
          <div className="flex items-center gap-2 border-b px-10 py-3">
            <TicketCheckIcon className="size-6 text-green-500" />
            <h3 className="font-semibold">Total Active Account</h3>
          </div>
          <div className="px-10">
            <p className="font-bold text-2xl tabular-nums">{totalActiveAccounts.length}</p>
          </div>
        </Card>
        <Card className="p-0 pb-5">
          <div className="flex items-center gap-2 border-b px-10 py-3">
            <TicketMinusIcon className="size-6 text-orange-600" />
            <h3 className="font-semibold">Expired Soon</h3>
          </div>
          <div className="px-10">
            <p className="font-bold text-2xl tabular-nums">{expiredSoonAccounts.length}</p>
          </div>
        </Card>
        <Card className="p-0 pb-5">
          <div className="flex items-center gap-2 border-b px-10 py-3">
            <TicketXIcon className="size-6 text-red-500" />
            <h3 className="font-semibold">Expired Account</h3>
            <Dialog>
              <DialogTrigger asChild>
                <Button className="ml-auto" size="sm" variant="outline">
                  <EyeIcon />
                  View
                </Button>
              </DialogTrigger>
              <DialogContent className="flex flex-col gap-0 p-0 sm:max-w-7xl">
                <div className="overflow-y-auto p-6">
                  <DialogHeader className="mb-2">
                    <DialogTitle>Expired Accounts</DialogTitle>
                    <DialogDescription>The following accounts have expired:</DialogDescription>
                  </DialogHeader>
                  <DataTableProvider
                    columns={serviceAccountExpiredTableColumns}
                    data={expiredAccounts}
                  >
                    <DataTable />
                  </DataTableProvider>
                </div>
              </DialogContent>
            </Dialog>
          </div>
          <div className="px-10">
            <p className="font-bold text-2xl tabular-nums">{expiredAccounts.length}</p>
          </div>
        </Card>
      </div>
      {/* <div className="mt-5 grid gap-4 *:data-[slot=card]:bg-gradient-to-t *:data-[slot=card]:from-primary/5 *:data-[slot=card]:to-card *:data-[slot=card]:shadow-xs md:grid-cols-2 lg:grid-cols-3 dark:*:data-[slot=card]:bg-card">
        {services.length ? (
          services.map((service) => <ServiceCard key={service.id} service={service} />)
        ) : (
          <p>No services found</p>
        )}
      </div> */}
      <ServiceList services={services} />
    </div>
  );
}
