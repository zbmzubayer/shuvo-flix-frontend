'use client';

import { PlusIcon, SearchIcon } from 'lucide-react';
import { useMemo, useState } from 'react';

import { CreateServiceForm } from '@/components/service/create-service-form';
import { ServiceCard } from '@/components/service/service-card';
import { Button } from '@/components/ui/button';
import {
  DialogContent,
  DialogHeader,
  DialogProvider,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import type { ServiceWithServiceAccount } from '@/types/service';

export function ServiceList({ services }: { services: ServiceWithServiceAccount[] }) {
  const [searchTerm, setSearchTerm] = useState('');

  const filteredServices = useMemo(() => {
    return services.filter((service) =>
      service.name.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [services, searchTerm]);

  return (
    <div className="mt-5">
      <div className="flex items-center justify-between">
        <div className="relative">
          <Input
            className="rounded-full ps-9 lg:w-[300px]"
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search services..."
            value={searchTerm}
          />
          <div className="pointer-events-none absolute inset-y-0 start-0 flex items-center justify-center ps-3 text-muted-foreground/80 peer-disabled:opacity-50">
            <SearchIcon className="size-4" />
          </div>
        </div>
        <DialogProvider>
          <DialogTrigger asChild>
            <Button>
              <PlusIcon className="size-4" />
              Create Service
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle>Create Service</DialogTitle>
            </DialogHeader>
            <CreateServiceForm />
          </DialogContent>
        </DialogProvider>
      </div>
      <div className="mt-5 grid gap-4 *:data-[slot=card]:bg-gradient-to-t *:data-[slot=card]:from-primary/5 *:data-[slot=card]:to-card *:data-[slot=card]:shadow-xs md:grid-cols-2 lg:grid-cols-3 dark:*:data-[slot=card]:bg-card">
        {filteredServices.length ? (
          filteredServices.map((service) => <ServiceCard key={service.id} service={service} />)
        ) : (
          <p>No services found</p>
        )}
      </div>
    </div>
  );
}
