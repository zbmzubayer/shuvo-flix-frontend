'use client';

import { SearchIcon, XIcon } from 'lucide-react';
import type { DateRange } from 'react-day-picker';

import { Button } from '@/components/ui/button';
import type { FilterField } from '@/components/ui/data-table/data-table.interface';
import { DataTableFacetedFilter } from '@/components/ui/data-table/data-table-faceted-filter';
import { useDataTable } from '@/components/ui/data-table/data-table-provider';
import { DateRangePicker } from '@/components/ui/date-range-picker';
import { Input } from '@/components/ui/input';

// export const filterFields: FilterField[] = [
//   {
//     column: 'status',
//     title: 'Status',
//     options: [
//       { label: ORDER_STATUS.paid, value: ORDER_STATUS.paid },
//       { label: ORDER_STATUS.due, value: ORDER_STATUS.due },
//       { label: ORDER_STATUS.unpaid, value: ORDER_STATUS.unpaid },
//     ],
//   },
//   {
//     column: 'accountStatus',
//     title: 'Account Status',
//     options: [
//       { label: ACCOUNT_STATUS.active, value: ACCOUNT_STATUS.active },
//       { label: ACCOUNT_STATUS.expired, value: ACCOUNT_STATUS.expired },
//       { label: ACCOUNT_STATUS.expiringSoon, value: ACCOUNT_STATUS.expiringSoon },
//     ],
//   },
// ];

export function OrderDataTableToolbar({ filterFields }: { filterFields: FilterField[] }) {
  const { table } = useDataTable();
  const isFiltered = table.getState().columnFilters.length > 0;

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
        {filterFields.map((field) => (
          <DataTableFacetedFilter
            column={table.getColumn(field.column)}
            key={field.column}
            options={field.options}
            title={field.title}
          />
        ))}
        <DateRangePicker
          className="h-8 w-56"
          onChange={(range) => {
            table.getColumn('createdAt')?.setFilterValue(range);
          }}
          rangeType="previous"
          value={table.getColumn('createdAt')?.getFilterValue() as DateRange}
        />
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
