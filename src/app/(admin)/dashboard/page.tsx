import { ContactIcon, HandshakeIcon, NotebookPenIcon, RadioIcon } from 'lucide-react';

import { DashboardChart } from '@/components/dashboard/dashboar-chart';
import { Card } from '@/components/ui/card';
import { AppHeader } from '@/layouts/app-header';

export default function DashboardPage() {
  return (
    <div>
      <AppHeader title="Dashboard" />
      <div className="my-5 grid grid-cols-2 gap-4 *:data-[slot=card]:bg-gradient-to-t *:data-[slot=card]:from-primary/5 *:data-[slot=card]:to-card *:data-[slot=card]:shadow-xs md:grid-cols-2 lg:grid-cols-4 dark:*:data-[slot=card]:bg-card">
        <Card className="items-center justify-center gap-3">
          <div className="flex items-center gap-2">
            <NotebookPenIcon className="size-5 text-muted-foreground" />
            <h3 className="font-semibold">Total Orders</h3>
          </div>
          <p className="font-bold text-2xl tabular-nums">{100}</p>
        </Card>
        <Card className="items-center justify-center gap-3">
          <div className="flex items-center gap-2">
            <ContactIcon className="size-5 text-muted-foreground" />
            <h3 className="font-semibold">Total Customers</h3>
          </div>
          <p className="font-bold text-2xl tabular-nums">{100}</p>
        </Card>
        <Card className="items-center justify-center gap-3">
          <div className="flex items-center gap-2">
            <RadioIcon className="size-5 text-muted-foreground" />
            <h3 className="font-semibold">Total Providers</h3>
          </div>
          <p className="font-bold text-2xl tabular-nums">{100}</p>
        </Card>
        <Card className="items-center justify-center gap-3">
          <div className="flex items-center gap-2">
            <HandshakeIcon className="size-5 text-muted-foreground" />
            <h3 className="font-semibold">Total Dealers</h3>
          </div>
          <p className="font-bold text-2xl tabular-nums">{100}</p>
        </Card>
      </div>
      <DashboardChart />
    </div>
  );
}
