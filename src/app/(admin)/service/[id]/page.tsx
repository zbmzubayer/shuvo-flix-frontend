import { DialogControlled } from '@/components/dialog-controlled';
import { CreateServiceAccountForm } from '@/components/service-account/create-service-account-form';
import { serviceAccountTableColumns } from '@/components/service-account/service-account-table-columns';
import { ServiceAccountDataTableToolbar } from '@/components/service-account/service-account-table-toolbar';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { DataTableProvider } from '@/components/ui/data-table/data-table-provider';
import { DataTable2 } from '@/components/ui/data-table/data-table2';
import {
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { AppHeader } from '@/layouts/app-header';
import { getServiceById } from '@/services/service.service';
import { SERVICE_ACCOUNT_STATUS, type ServiceAccount } from '@/types/service-account';

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
  const service = await getServiceById(id);

  const accounts = service.serviceAccounts || [];

  const {
    totalActiveAccounts,
    totalSoldPersonalSlots,
    totalSoldSharedSlots,
    totalUnsoldPersonalSlots,
    totalUnsoldSharedSlots,
    expiredAccounts,
  } = calculateAccountStats(accounts);

  return (
    <div>
      <AppHeader title={`Accounts - ${service.name}`} />
      <DialogControlled trigger={<Button>Create account</Button>}>
        <DialogContent className="flex flex-col gap-0 p-0 sm:max-w-xl">
          <div className="overflow-y-auto p-6">
            <DialogHeader className="mb-2">
              <DialogTitle>Create Account</DialogTitle>
              <DialogDescription>Please enter the details for the new account.</DialogDescription>
            </DialogHeader>
            <CreateServiceAccountForm />
          </div>
        </DialogContent>
      </DialogControlled>

      <div className="mt-5 grid gap-4 *:data-[slot=card]:bg-gradient-to-t *:data-[slot=card]:from-primary/5 *:data-[slot=card]:to-card *:data-[slot=card]:shadow-xs md:grid-cols-2 lg:grid-cols-4 dark:*:data-[slot=card]:bg-card">
        <Card className="gap-2 p-0 pb-2">
          <div className="border-b px-10 py-2">
            <h3 className="font-semibold">Total Active Account</h3>
          </div>
          <div className="px-10">
            <p className="font-bold text-2xl tabular-nums">{totalActiveAccounts}</p>
          </div>
        </Card>
        <Card className="gap-2 p-0 pb-2">
          <div className="border-b px-10 py-2">
            <h3 className="font-semibold">Total Sold Slot</h3>
          </div>
          <div className="flex justify-between px-10">
            <p className="font-bold text-2xl tabular-nums">
              {totalSoldPersonalSlots + totalSoldSharedSlots}
            </p>
            <div className="inline-flex flex-col gap-2 font-medium text-xs">
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
          <div className="border-b px-10 py-2">
            <h3 className="font-semibold">Total Unsold Slot</h3>
          </div>
          <div className="flex justify-between px-10">
            <p className="font-bold text-2xl tabular-nums">
              {totalUnsoldPersonalSlots + totalUnsoldSharedSlots}
            </p>
            <div className="inline-flex flex-col gap-2 font-medium text-xs">
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
          <div className="border-b px-10 py-2">
            <h3 className="font-semibold">Expired Account</h3>
          </div>
          <div className="px-10">
            <p className="font-bold text-2xl tabular-nums">{expiredAccounts}</p>
          </div>
        </Card>
      </div>

      {/* <div className="mt-5 grid gap-4 *:data-[slot=card]:bg-gradient-to-t *:data-[slot=card]:from-primary/5 *:data-[slot=card]:to-card *:data-[slot=card]:shadow-xs md:grid-cols-2 lg:grid-cols-3 dark:*:data-[slot=card]:bg-card">
        {accounts.length ? (
          accounts.map((account) => <ServiceAccountCard account={account} key={account.id} />)
        ) : (
          <p>No accounts found</p>
        )}
      </div> */}
      <div className="mt-5 space-y-2">
        <DataTableProvider columns={serviceAccountTableColumns} data={accounts}>
          <ServiceAccountDataTableToolbar />
          <DataTable2 />
        </DataTableProvider>
      </div>
    </div>
  );
}
