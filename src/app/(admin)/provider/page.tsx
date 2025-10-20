import { PlusIcon } from 'lucide-react';
import type { Metadata } from 'next';

import { CreateProviderForm } from '@/components/provider/create-provider-form';
import { providerTableColumns } from '@/components/provider/provider-table-columns';
import { Button } from '@/components/ui/button';
import { DataTable } from '@/components/ui/data-table';
import { DataTablePagination } from '@/components/ui/data-table/data-table-pagination';
import { DataTableProvider } from '@/components/ui/data-table/data-table-provider';
import {
  DialogContent,
  DialogHeader,
  DialogProvider,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { AppHeader } from '@/layouts/app-header';
import { getAllProviders } from '@/services/provider.service';

export const metadata: Metadata = {
  title: 'Provider',
};

export default async function ProviderPage() {
  const providers = await getAllProviders();

  return (
    <div>
      <AppHeader title="Providers" />
      <DialogProvider>
        <DialogTrigger asChild>
          <Button>
            <PlusIcon className="size-4" />
            Create Provider
          </Button>
        </DialogTrigger>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Create Provider</DialogTitle>
          </DialogHeader>
          <CreateProviderForm />
        </DialogContent>
      </DialogProvider>

      <div className="mt-5 max-w-2xl space-y-2">
        <DataTableProvider columns={providerTableColumns} data={providers}>
          <DataTable />
          <DataTablePagination />
        </DataTableProvider>
      </div>
    </div>
  );
}
