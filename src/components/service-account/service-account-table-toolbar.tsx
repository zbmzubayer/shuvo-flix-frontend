'use client';

import { SearchIcon, XIcon } from 'lucide-react';

import { Button } from '@/components/ui/button';
import type { FilterField } from '@/components/ui/data-table/data-table';
import { DataTableFacetedFilter } from '@/components/ui/data-table/data-table-faceted-filter';
import { useDataTable } from '@/components/ui/data-table/data-table-provider';
import { Input } from '@/components/ui/input';
import { SERVICE_ACCOUNT_PAYMENT, SERVICE_ACCOUNT_STATUS } from '@/types/service-account';

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
];

export function ServiceAccountDataTableToolbar() {
  const { table } = useDataTable();
  const isFiltered = table.getState().columnFilters.length > 0;

  return (
    <div className="flex items-center justify-between">
      <div className="flex flex-1 items-center space-x-2">
        <div className="relative">
          <Input
            className="h-8 ps-9 lg:w-[300px]"
            onChange={(e) => table.getColumn('name')?.setFilterValue(e.target.value)}
            placeholder="Search by name or email"
            value={(table.getColumn('name')?.getFilterValue() as string) ?? ''}
          />
          <div className="pointer-events-none absolute inset-y-0 start-0 flex items-center justify-center ps-3 text-muted-foreground/80 peer-disabled:opacity-50">
            <SearchIcon className="size-4" />
          </div>
        </div>

        {filterFields.map((field) => (
          <DataTableFacetedFilter
            column={table.getColumn(field.column)}
            key={field.column}
            options={field.options}
            title={field.title}
          />
        ))}
        {isFiltered && (
          <Button
            className="h-8 px-2 lg:px-3"
            onClick={() => table.resetColumnFilters()}
            variant="ghost"
          >
            Reset
            <XIcon />
          </Button>
        )}
      </div>
      {/* <DataTableViewOptions table={table} /> */}
    </div>
  );
}
