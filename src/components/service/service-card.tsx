import { EditIcon } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';

import { EditServiceForm } from '@/components/service/edit-service-form';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import {
  DialogContent,
  DialogHeader,
  DialogProvider,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import type { ServiceWithServiceAccount } from '@/types/service';

export function ServiceCard({ service }: { service: ServiceWithServiceAccount }) {
  return (
    <Card className="p-5">
      <div className="flex gap-5">
        <Link href={`/service/${service.id}`}>
          <div className="inline-flex items-center justify-center rounded-md border p-2">
            <Image
              alt={service.name}
              className="size-16"
              height={100}
              src={service.logo}
              width={100}
            />
          </div>
        </Link>
        <div className="flex flex-1 flex-col justify-between">
          <div className="flex items-center justify-between">
            <Link href={`/service/${service.id}`}>
              <h3 className="font-bold text-xl">{service.name}</h3>
            </Link>
            <DialogProvider>
              <DialogTrigger asChild>
                <Button className="size-8 text-yellow-600" variant="ghost">
                  <EditIcon />
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-md">
                <DialogHeader>
                  <DialogTitle>Edit Service</DialogTitle>
                </DialogHeader>
                <EditServiceForm service={service} />
              </DialogContent>
            </DialogProvider>
          </div>
          <div className="self-end pr-2 font-medium text-2xl tabular-nums">
            {service.serviceAccounts.length}
          </div>
        </div>
      </div>
    </Card>
  );
}
