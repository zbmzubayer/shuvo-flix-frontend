'use client';

import { SearchIcon } from 'lucide-react';

import { useDataTable } from '@/components/ui/data-table/data-table-provider';
import { Input } from '@/components/ui/input';

export function CustomerDataTableToolbar() {
  const { table } = useDataTable();

  return (
    <div className="flex items-center justify-between">
      <div className="flex flex-1 items-center space-x-2">
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
      </div>
      {/* <DataTableViewOptions table={table} /> */}
    </div>
  );
}
