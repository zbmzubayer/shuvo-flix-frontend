import Component from '@/components/comp-315';
import { DialogControlled } from '@/components/dialog-controlled';
import { CreateServiceAccountForm } from '@/components/service-account/create-service-account-form';
import { DialogContent, DialogDescription, DialogTitle } from '@/components/ui/dialog';
import { AppHeader } from '@/layouts/app-header';
import { getServiceById } from '@/services/service.service';

export default async function ServiceAccountPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const service = await getServiceById(id);

  return (
    <div>
      <AppHeader title={`Accounts - ${service.name}`} />
      <DialogControlled trigger="Create account">
        <DialogContent className="flex flex-col gap-0 p-0 sm:max-w-xl [&>button:last-child]:hidden">
          <div className="overflow-y-auto p-6">
            <DialogTitle>Create Account</DialogTitle>
            <DialogDescription>Please enter the details for the new account.</DialogDescription>
            <CreateServiceAccountForm />
          </div>
        </DialogContent>
      </DialogControlled>
      <Component />
    </div>
  );
}
