import Image from 'next/image';
import Link from 'next/link';

import { Card } from '@/components/ui/card';
import type { ServiceWithServiceAccount } from '@/types/service';

export function ServiceCard({ service }: { service: ServiceWithServiceAccount }) {
  return (
    <Link href={`/service/${service.id}`}>
      <Card className="p-5">
        <div className="flex gap-5">
          <div className="inline-flex items-center justify-center rounded-md border p-2">
            <Image
              alt={service.name}
              className="size-16"
              height={100}
              src={service.logo}
              width={100}
            />
          </div>
          <div className="flex flex-1 flex-col justify-between">
            <h3 className="font-bold text-xl">{service.name}</h3>
            <div className="self-end font-medium text-2xl tabular-nums">
              {service.serviceAccounts.length}
            </div>
          </div>
        </div>
      </Card>
    </Link>
  );
}
