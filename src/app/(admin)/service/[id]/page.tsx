import { BadgeAlertIcon, BadgeCheckIcon, ListCheckIcon, ListXIcon, PlusIcon } from 'lucide-react';

import { CreateServiceAccountForm } from '@/components/service-account/create-service-account-form';
import { serviceAccountTableColumns } from '@/components/service-account/service-account-table-columns';
import { ServiceAccountDataTableToolbar } from '@/components/service-account/service-account-table-toolbar';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { DataTable } from '@/components/ui/data-table';
import type { FilterField } from '@/components/ui/data-table/data-table.interface';
import { DataTablePagination } from '@/components/ui/data-table/data-table-pagination';
import { DataTableProvider } from '@/components/ui/data-table/data-table-provider';
import {
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogProvider,
  DialogProviderTrigger,
  DialogTitle,
} from '@/components/ui/dialog';
import { AppHeader } from '@/layouts/app-header';
import { getAllDealers } from '@/services/dealer.service';
import { getServiceById } from '@/services/service.service';
import {
  ACCOUNT_STATUS,
  SERVICE_ACCOUNT_PAYMENT,
  SERVICE_ACCOUNT_STATUS,
  type ServiceAccount,
} from '@/types/service-account';

const calculateAccountStats = (accounts: ServiceAccount[]) => {
  let totalActiveAccounts = 0;
  let totalSoldPersonalSlots = 0;
  let totalSoldSharedSlots = 0;
  let totalUnsoldPersonalSlots = 0;
  let totalUnsoldSharedSlots = 0;
  let expiredAccounts = 0;

  accounts.forEach((account) => {
    if (account.status !== SERVICE_ACCOUNT_STATUS.disabled) totalActiveAccounts++;
    if (account.expiryDate < new Date()) expiredAccounts++;
    totalSoldPersonalSlots += account.soldPersonalSlots;
    totalSoldSharedSlots += account.soldSharedSlots;
    totalUnsoldPersonalSlots += account.personalSlots - account.soldPersonalSlots;
    totalUnsoldSharedSlots += account.sharedSlots - account.soldSharedSlots;
  });

  return {
    totalActiveAccounts,
    totalSoldPersonalSlots,
    totalSoldSharedSlots,
    totalUnsoldPersonalSlots,
    totalUnsoldSharedSlots,
    expiredAccounts,
  };
};

export default async function ServiceAccountPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const [service, dealers] = await Promise.all([getServiceById(Number(id)), getAllDealers()]);
  const accounts = service.serviceAccounts || [];

  const {
    totalActiveAccounts,
    totalSoldPersonalSlots,
    totalSoldSharedSlots,
    totalUnsoldPersonalSlots,
    totalUnsoldSharedSlots,
    expiredAccounts,
  } = calculateAccountStats(accounts);

  const filterFields: FilterField[] = [
    {
      column: 'payment',
      title: 'Payment',
      options: [
        { label: SERVICE_ACCOUNT_PAYMENT.paid, value: SERVICE_ACCOUNT_PAYMENT.paid },
        { label: SERVICE_ACCOUNT_PAYMENT.due, value: SERVICE_ACCOUNT_PAYMENT.due },
        { label: SERVICE_ACCOUNT_PAYMENT.unpaid, value: SERVICE_ACCOUNT_PAYMENT.unpaid },
      ],
    },
    {
      column: 'status',
      title: 'Status',
      options: [
        { label: SERVICE_ACCOUNT_STATUS.new, value: SERVICE_ACCOUNT_STATUS.new },
        { label: SERVICE_ACCOUNT_STATUS.partial, value: SERVICE_ACCOUNT_STATUS.partial },
        { label: SERVICE_ACCOUNT_STATUS.full, value: SERVICE_ACCOUNT_STATUS.full },
        { label: SERVICE_ACCOUNT_STATUS.disabled, value: SERVICE_ACCOUNT_STATUS.disabled },
      ],
    },
    {
      column: 'accountStatus',
      title: 'Account Status',
      options: [
        { label: ACCOUNT_STATUS.active, value: ACCOUNT_STATUS.active },
        { label: ACCOUNT_STATUS.expired, value: ACCOUNT_STATUS.expired },
        { label: ACCOUNT_STATUS.expiringSoon, value: ACCOUNT_STATUS.expiringSoon },
      ],
    },
    {
      column: 'dealerId',
      title: 'Dealer',
      options: dealers.map((dealer) => ({
        label: dealer.name,
        value: dealer.id,
      })),
    },
  ];

  return (
    <div>
      <AppHeader title={`Accounts - ${service.name}`} />

      <div className="mt-5 grid gap-4 *:data-[slot=card]:bg-gradient-to-t *:data-[slot=card]:from-primary/5 *:data-[slot=card]:to-card *:data-[slot=card]:shadow-xs md:grid-cols-2 lg:grid-cols-4 dark:*:data-[slot=card]:bg-card">
        <Card className="gap-2 p-0 pb-2">
          <div className="flex items-center justify-center gap-2 border-b py-2">
            <BadgeCheckIcon className="size-5 text-green-500" />
            <h3 className="font-semibold">Total Active Account</h3>
          </div>
          <p className="text-center font-bold text-2xl tabular-nums">{totalActiveAccounts}</p>
        </Card>
        <Card className="gap-2 p-0 pb-2">
          <div className="flex items-center justify-center gap-2 border-b py-2">
            <ListCheckIcon className="size-5 text-green-500" />
            <h3 className="font-semibold">Total Sold Slot</h3>
          </div>
          <div className="flex items-center justify-center gap-5">
            <p className="font-bold text-2xl tabular-nums">
              {totalSoldPersonalSlots + totalSoldSharedSlots}
            </p>
            <div className="inline-flex gap-2 font-medium text-xs">
              <div className="inline-flex items-center justify-center rounded-lg border-2 px-3 py-2">
                Personal: {totalSoldPersonalSlots}
              </div>
              <div className="inline-flex items-center justify-center rounded-lg border-2 px-3 py-2">
                Shared: {totalSoldSharedSlots}
              </div>
            </div>
          </div>
        </Card>
        <Card className="gap-2 p-0 pb-2">
          <div className="flex items-center justify-center gap-2 border-b py-2">
            <ListXIcon className="size-5 text-orange-600" />
            <h3 className="font-semibold">Total Unsold Slot</h3>
          </div>
          <div className="flex items-center justify-center gap-5">
            <p className="font-bold text-2xl tabular-nums">
              {totalUnsoldPersonalSlots + totalUnsoldSharedSlots}
            </p>
            <div className="inline-flex gap-2 font-medium text-xs">
              <div className="inline-flex items-center justify-center rounded-lg border-2 px-3 py-2">
                Personal: {totalUnsoldPersonalSlots}
              </div>
              <div className="inline-flex items-center justify-center rounded-lg border-2 px-3 py-2">
                Shared: {totalUnsoldSharedSlots}
              </div>
            </div>
          </div>
        </Card>
        <Card className="gap-2 p-0 pb-2">
          <div className="flex items-center justify-center gap-2 border-b py-2">
            <BadgeAlertIcon className="size-5 text-red-500" />
            <h3 className="font-semibold">Expired Account</h3>
          </div>
          <p className="text-center font-bold text-2xl tabular-nums">{expiredAccounts}</p>
        </Card>
      </div>

      <div className="mt-5 space-y-2">
        <DataTableProvider columns={serviceAccountTableColumns} data={accounts}>
          <div className="flex items-center justify-between">
            <ServiceAccountDataTableToolbar filterFields={filterFields} />
            <DialogProvider>
              <DialogProviderTrigger asChild>
                <Button size="sm">
                  <PlusIcon />
                  Create account
                </Button>
              </DialogProviderTrigger>
              <DialogContent className="flex flex-col gap-0 p-0 sm:max-w-xl">
                <div className="overflow-y-auto p-6">
                  <DialogHeader className="mb-2">
                    <DialogTitle>Create Account</DialogTitle>
                    <DialogDescription>
                      Please enter the details for the new account.
                    </DialogDescription>
                  </DialogHeader>
                  <CreateServiceAccountForm />
                </div>
              </DialogContent>
            </DialogProvider>
          </div>
          <DataTable />
          <DataTablePagination />
        </DataTableProvider>
      </div>
    </div>
  );
}
