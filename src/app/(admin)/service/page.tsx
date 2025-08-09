import { CreateServiceForm } from '@/components/service/create-service-form';
import { ServiceCard } from '@/components/service/service-card';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
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
        new Date(account.expiryDate) < new Date(Date.now() + 7 * 24 * 60 * 60 * 1000) // within a week
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
      <div className="max-w-md space-y-4">
        <Card>
          <CardHeader>
            <CardTitle>Create Service</CardTitle>
          </CardHeader>
          <CardContent>
            <CreateServiceForm />
          </CardContent>
        </Card>
      </div>
      <div className="grid gap-4 *:data-[slot=card]:bg-gradient-to-t *:data-[slot=card]:from-primary/5 *:data-[slot=card]:to-card *:data-[slot=card]:shadow-xs md:grid-cols-2 lg:grid-cols-3 dark:*:data-[slot=card]:bg-card">
        {services.length ? (
          services.map((service) => <ServiceCard key={service.id} service={service} />)
        ) : (
          <p>No services found</p>
        )}
      </div>
    </div>
  );
}
