import { format, formatDistance } from 'date-fns';
import { ClockIcon, LockIcon, MailIcon } from 'lucide-react';

import { Badge } from '@/components/ui/badge';
import { Card } from '@/components/ui/card';
import type { ServiceAccount } from '@/types/service-account';

import { ServiceAccountDropdown } from './service-account-dropdown';

export function ServiceAccountCard({ account }: { account: ServiceAccount }) {
  return (
    <Card className="flex-row justify-between p-5">
      <div className="flex flex-col justify-between">
        <div className="space-y-1">
          <h3 className="mb-2 font-semibold">{account.name}</h3>
          <div className="flex items-center text-sm">
            <MailIcon className="size-4 text-muted-foreground" />
            <span className="ml-2">{account.email}</span>
          </div>
          <div className="flex items-center text-sm">
            <LockIcon className="size-4 text-muted-foreground" />
            <span className="ml-2">{account.password}</span>
          </div>
        </div>

        <p className="text-muted-foreground text-xs">{format(new Date(account.joinDate), 'PPP')}</p>
      </div>
      <div className="flex gap-3">
        <div className="flex flex-col justify-between gap-5">
          <div className="inline-flex flex-col gap-2 font-medium text-xs">
            <div className="inline-flex items-center justify-center rounded-full border-2 px-3 py-2">
              Personal: {account.personalSlots}
            </div>
            <div className="inline-flex items-center justify-center rounded-full border-2 px-3 py-2">
              Shared: {account.sharedSlots}
            </div>
          </div>
          <Badge>
            <ClockIcon />
            {formatDistance(new Date(account.expiryDate), new Date())} left
          </Badge>
        </div>
        <ServiceAccountDropdown account={account} />
      </div>
    </Card>
  );
}
