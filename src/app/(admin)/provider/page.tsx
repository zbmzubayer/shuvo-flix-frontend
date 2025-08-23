import { PlusIcon } from 'lucide-react';

import { CreateProviderForm } from '@/components/provider/create-provider-form';
import { providerTableColumns } from '@/components/provider/provider-table-columns';
import { Button } from '@/components/ui/button';
import { DataTableProvider } from '@/components/ui/data-table/data-table-provider';
import { DataTable2 } from '@/components/ui/data-table/data-table2';
import {
  DialogContent,
  DialogHeader,
  DialogProvider,
  DialogProviderTrigger,
  DialogTitle,
} from '@/components/ui/dialog';
import { AppHeader } from '@/layouts/app-header';
import { getAllProviders } from '@/services/provider.service';

export default async function ProviderPage() {
  const providers = await getAllProviders();

  return (
    <div>
      <AppHeader title="Providers" />
      <DialogProvider>
        <DialogProviderTrigger asChild>
          <Button>
            <PlusIcon className="size-4" />
            Create Provider
          </Button>
        </DialogProviderTrigger>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Create Provider</DialogTitle>
          </DialogHeader>
          <CreateProviderForm />
        </DialogContent>
      </DialogProvider>

      <div className="mt-5 max-w-lg overflow-hidden rounded-md border">
        <DataTableProvider columns={providerTableColumns} data={providers}>
          <DataTable2 />
        </DataTableProvider>
      </div>
    </div>
  );
}
