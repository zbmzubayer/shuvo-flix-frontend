import { PlusIcon } from 'lucide-react';

import { CreateDealerForm } from '@/components/dealer/create-dealer-form';
import { dealerTableColumns } from '@/components/dealer/dealer-table-columns';
import { Button } from '@/components/ui/button';
import { DataTable } from '@/components/ui/data-table';
import { DataTablePagination } from '@/components/ui/data-table/data-table-pagination';
import { DataTableProvider } from '@/components/ui/data-table/data-table-provider';
import {
  DialogContent,
  DialogHeader,
  DialogProvider,
  DialogProviderTrigger,
  DialogTitle,
} from '@/components/ui/dialog';
import { AppHeader } from '@/layouts/app-header';
import { getAllDealers } from '@/services/dealer.service';

export default async function DealerPage() {
  const dealers = await getAllDealers();

  return (
    <div>
      <AppHeader title="Dealers" />
      <DialogProvider>
        <DialogProviderTrigger asChild>
          <Button>
            <PlusIcon />
            Create Dealer
          </Button>
        </DialogProviderTrigger>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Create Dealer</DialogTitle>
          </DialogHeader>
          <CreateDealerForm />
        </DialogContent>
      </DialogProvider>

      <div className="mt-5 max-w-2xl space-y-2">
        <DataTableProvider columns={dealerTableColumns} data={dealers}>
          <DataTable />
          <DataTablePagination />
        </DataTableProvider>
      </div>
    </div>
  );
}
