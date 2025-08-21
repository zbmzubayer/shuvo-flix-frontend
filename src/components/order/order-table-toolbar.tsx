'use client';

import type { Table } from '@tanstack/react-table';
import { XIcon } from 'lucide-react';

import { Button } from '@/components/ui/button';
import type { FilterField } from '@/components/ui/data-table/data-table';
import { DataTableFacetedFilter } from '@/components/ui/data-table/data-table-faceted-filter';
import { Input } from '@/components/ui/input';

interface OrderDataTableToolbarProps<TData> {
  table: Table<TData>;
  filterFields?: FilterField[];
}

export function OrderDataTableToolbar<TData>({
  table,
  filterFields,
}: OrderDataTableToolbarProps<TData>) {
  const isFiltered = table.getState().columnFilters.length > 0;

  return (
    <div className="flex items-center justify-between">
      <div className="flex flex-1 items-center space-x-2">
        <Input
          className="h-8 w-[150px] lg:w-[250px]"
          onChange={(event) => table.getColumn('phone')?.setFilterValue(event.target.value)}
          placeholder="Search by phone"
          value={(table.getColumn('phone')?.getFilterValue() as string) ?? ''}
        />

        {filterFields?.map((field) => (
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
