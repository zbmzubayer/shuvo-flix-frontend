'use client';

import {
  type ColumnDef,
  flexRender,
  getCoreRowModel,
  getSortedRowModel,
  type SortingState,
  useReactTable,
} from '@tanstack/react-table';
import { ArrowUpDownIcon, ChevronDownIcon, ChevronUpIcon } from 'lucide-react';
import { useState } from 'react';

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';
import { cn } from '@/lib/utils';

interface DataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[];
  data: TData[];
  // filterFields?: FilterField;
}

export function DataTable<TData, TValue>({ data, columns }: DataTableProps<TData, TValue>) {
  // const [rowSelection, setRowSelection] = useState({});
  const [sorting, setSorting] = useState<SortingState>([]);
  const table = useReactTable({
    data,
    columns,
    state: {
      // rowSelection,
      sorting,
    },
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    onSortingChange: setSorting,
  });

  return (
    <Table>
      <TableHeader>
        {table.getHeaderGroups().map((headerGroup) => (
          <TableRow className="bg-muted/50" key={headerGroup.id}>
            {headerGroup.headers.map((header) => {
              return (
                <TableHead
                  aria-sort={
                    header.column.getIsSorted() === 'asc'
                      ? 'ascending'
                      : header.column.getIsSorted() === 'desc'
                        ? 'descending'
                        : 'none'
                  }
                  className="relative h-10 select-none border-t"
                  key={header.id}
                >
                  {header.isPlaceholder ? null : header.column.getCanSort() ? (
                    <button
                      className={cn(
                        header.column.getCanSort() &&
                          'flex h-full cursor-pointer select-none items-center justify-between gap-2'
                      )}
                      onClick={header.column.getToggleSortingHandler()}
                      onKeyDown={(e) => {
                        // Enhanced keyboard handling for sorting
                        if (header.column.getCanSort() && (e.key === 'Enter' || e.key === ' ')) {
                          e.preventDefault();
                          header.column.getToggleSortingHandler()?.(e);
                        }
                      }}
                      tabIndex={header.column.getCanSort() ? 0 : undefined}
                      type="button"
                    >
                      {flexRender(header.column.columnDef.header, header.getContext())}
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <ArrowUpDownIcon className="size-3.5" />
                        </TooltipTrigger>
                        <TooltipContent>
                          {header.column.getIsSorted() === 'asc'
                            ? 'Sorted ascending'
                            : header.column.getIsSorted() === 'desc'
                              ? 'Sorted descending'
                              : 'Default sorting'}
                        </TooltipContent>
                      </Tooltip>
                      {{
                        asc: (
                          <ChevronUpIcon
                            aria-hidden="true"
                            className="shrink-0 opacity-60"
                            size={16}
                          />
                        ),
                        desc: (
                          <ChevronDownIcon
                            aria-hidden="true"
                            className="shrink-0 opacity-60"
                            size={16}
                          />
                        ),
                      }[header.column.getIsSorted() as string] ?? (
                        <span aria-hidden="true" className="size-4" />
                      )}
                    </button>
                  ) : (
                    flexRender(header.column.columnDef.header, header.getContext())
                  )}
                </TableHead>
              );
            })}
          </TableRow>
        ))}
      </TableHeader>
      <TableBody>
        {table.getRowModel().rows?.length ? (
          table.getRowModel().rows.map((row) => (
            <TableRow data-state={row.getIsSelected() && 'selected'} key={row.id}>
              {row.getVisibleCells().map((cell) => (
                <TableCell key={cell.id}>
                  {flexRender(cell.column.columnDef.cell, cell.getContext())}
                </TableCell>
              ))}
            </TableRow>
          ))
        ) : (
          <TableRow>
            <TableCell className="h-24 text-center" colSpan={columns.length}>
              No results.
            </TableCell>
          </TableRow>
        )}
      </TableBody>
    </Table>
  );
}
