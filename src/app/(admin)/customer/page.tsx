import { PlusIcon } from 'lucide-react';

import { CreateCustomerForm } from '@/components/customer/create-customer-form';
import { customerTableColumns } from '@/components/customer/customer-table-columns';
import { CustomerDataTableToolbar } from '@/components/customer/customer-table-toolbar';
import { Button } from '@/components/ui/button';
import { DataTableProvider } from '@/components/ui/data-table/data-table-provider';
import { DataTable2 } from '@/components/ui/data-table/data-table2';
import {
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogProvider,
  DialogProviderTrigger,
  DialogTitle,
} from '@/components/ui/dialog';
import { AppHeader } from '@/layouts/app-header';
import { getAllCustomers } from '@/services/customer.service';

export default async function CustomerPage() {
  const customers = await getAllCustomers();

  return (
    <div>
      <AppHeader title="Customers" />
      <DialogProvider>
        <DialogProviderTrigger asChild>
          <Button>
            <PlusIcon />
            Create Customer
          </Button>
        </DialogProviderTrigger>
        <DialogContent className="flex flex-col gap-0 p-0 sm:max-w-md">
          <div className="overflow-y-auto p-6">
            <DialogHeader className="mb-2">
              <DialogTitle>Create Customer</DialogTitle>
              <DialogDescription>
                Fill in the details below to create a new customer.
              </DialogDescription>
            </DialogHeader>
            <CreateCustomerForm />
          </div>
        </DialogContent>
      </DialogProvider>

      <div className="mt-5 space-y-2">
        <DataTableProvider columns={customerTableColumns} data={customers}>
          <CustomerDataTableToolbar />
          <DataTable2 />
        </DataTableProvider>
      </div>
    </div>
  );
}
