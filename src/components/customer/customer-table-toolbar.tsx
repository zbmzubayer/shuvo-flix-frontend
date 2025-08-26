'use client';

import { SearchIcon, XIcon } from 'lucide-react';

import { Button } from '@/components/ui/button';
import type { FilterField } from '@/components/ui/data-table/data-table.interface';
import { DataTableFacetedFilter } from '@/components/ui/data-table/data-table-faceted-filter';
import { useDataTable } from '@/components/ui/data-table/data-table-provider';
import { Input } from '@/components/ui/input';
import { CUSTOMER_SOCIAL } from '@/types/customer';

export const filterFields: FilterField[] = [
  {
    column: 'social',
    title: 'Social',
    options: [
      { label: CUSTOMER_SOCIAL.facebook, value: CUSTOMER_SOCIAL.facebook },
      { label: CUSTOMER_SOCIAL.whatsapp, value: CUSTOMER_SOCIAL.whatsapp },
      { label: CUSTOMER_SOCIAL.instagram, value: CUSTOMER_SOCIAL.instagram },
      { label: CUSTOMER_SOCIAL.twitter, value: CUSTOMER_SOCIAL.twitter },
    ],
  },
];

export function CustomerDataTableToolbar() {
  const { table } = useDataTable();
  const isFiltered = table.getState().columnFilters.length > 0;

  return (
    <div className="flex items-center justify-between">
      <div className="flex flex-1 items-center gap-2">
        <div className="relative">
          <Input
            className="h-8 ps-9 lg:w-[300px]"
            onChange={(e) => table.getColumn('phone')?.setFilterValue(e.target.value)}
            placeholder="Search by name, email or phone"
            value={(table.getColumn('phone')?.getFilterValue() as string) ?? ''}
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
