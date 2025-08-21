import { PlusIcon } from 'lucide-react';

import { CreateServiceForm } from '@/components/service/create-service-form';
import { ServiceCard } from '@/components/service/service-card';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import {
  DialogContent,
  DialogHeader,
  DialogProvider,
  DialogProviderTrigger,
  DialogTitle,
} from '@/components/ui/dialog';
import { AppHeader } from '@/layouts/app-header';
import { getAllServices } from '@/services/service.service';
import type { ServiceAccount } from '@/types/service-account';

export default async function ServicePage() {
  const services = await getAllServices();

  const totalActiveAccounts = services.reduce((acc, service) => {
    const active = service.serviceAccounts.find((account) => account.isActive);
    if (active) {
      acc.push(active);
    }
    return acc;
  }, [] as ServiceAccount[]);

  const expiredSoonAccounts = services.reduce((acc, service) => {
    const soonExpired = service.serviceAccounts.find(
      (account) =>
        account.isActive &&
        new Date(account.expiryDate) < new Date(Date.now() + 2 * 24 * 60 * 60 * 1000) // within two days
    );
    if (soonExpired) {
      acc.push(soonExpired);
    }
    return acc;
  }, [] as ServiceAccount[]);

  const expiredAccounts = services.reduce((acc, service) => {
    const expired = service.serviceAccounts.find((account) => !account.isActive);
    if (expired) {
      acc.push(expired);
    }
    return acc;
  }, [] as ServiceAccount[]);

  return (
    <div>
      <AppHeader title="Services" />
      <DialogProvider>
        <DialogProviderTrigger asChild>
          <Button>
            <PlusIcon className="size-4" />
            Create Service
          </Button>
        </DialogProviderTrigger>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Create Service</DialogTitle>
          </DialogHeader>
          <CreateServiceForm />
        </DialogContent>
      </DialogProvider>
      <div className="mt-5 grid gap-4 *:data-[slot=card]:bg-gradient-to-t *:data-[slot=card]:from-primary/5 *:data-[slot=card]:to-card *:data-[slot=card]:shadow-xs md:grid-cols-2 lg:grid-cols-3 dark:*:data-[slot=card]:bg-card">
        <Card className="p-0 pb-5">
          <div className="border-b px-10 py-3">
            <h3 className="font-semibold">Total Active Account</h3>
          </div>
          <div className="px-10">
            <p className="font-bold text-2xl tabular-nums">{totalActiveAccounts.length}</p>
          </div>
        </Card>
        <Card className="p-0 pb-5">
          <div className="border-b px-10 py-3">
            <h3 className="font-semibold">Expired Soon</h3>
          </div>
          <div className="px-10">
            <p className="font-bold text-2xl tabular-nums">{expiredSoonAccounts.length}</p>
          </div>
        </Card>
        <Card className="p-0 pb-5">
          <div className="border-b px-10 py-3">
            <h3 className="font-semibold">Expired Account</h3>
          </div>
          <div className="px-10">
            <p className="font-bold text-2xl tabular-nums">{expiredAccounts.length}</p>
          </div>
        </Card>
      </div>
      <div className="mt-5 grid gap-4 *:data-[slot=card]:bg-gradient-to-t *:data-[slot=card]:from-primary/5 *:data-[slot=card]:to-card *:data-[slot=card]:shadow-xs md:grid-cols-2 lg:grid-cols-3 dark:*:data-[slot=card]:bg-card">
        {services.length ? (
          services.map((service) => <ServiceCard key={service.id} service={service} />)
        ) : (
          <p>No services found</p>
        )}
      </div>
    </div>
  );
}
