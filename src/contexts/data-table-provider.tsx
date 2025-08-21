'use client';

import {
  type ColumnDef,
  type ColumnFiltersState,
  getCoreRowModel,
  getFacetedRowModel,
  getFacetedUniqueValues,
  getFilteredRowModel,
  getSortedRowModel,
  type SortingState,
  useReactTable,
} from '@tanstack/react-table';
import { createContext, useContext, useState } from 'react';

interface DataTableContextProps<TData> {
  table: ReturnType<typeof useReactTable<TData>>;
}

// biome-ignore lint/suspicious/noExplicitAny: <explanation>
export const DataTableContext = createContext<DataTableContextProps<any> | undefined>(undefined);

interface DataTableProviderProps<TData, TValue> {
  children: React.ReactNode;
  columns: ColumnDef<TData, TValue>[];
  data: TData[];
}

export function DataTableProvider<TData, TValue>({
  children,
  columns,
  data,
}: DataTableProviderProps<TData, TValue>) {
  const [sorting, setSorting] = useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);

  const table = useReactTable({
    data,
    columns,
    state: {
      // rowSelection,
      columnFilters,
      sorting,
    },
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getFacetedRowModel: getFacetedRowModel(),
    getFacetedUniqueValues: getFacetedUniqueValues(),
    getSortedRowModel: getSortedRowModel(),
    onColumnFiltersChange: setColumnFilters,
    onSortingChange: setSorting,
  });

  return <DataTableContext.Provider value={{ table }}>{children}</DataTableContext.Provider>;
}

export const useDataTable = () => {
  const context = useContext(DataTableContext);
  if (!context) {
    throw new Error('useDataTable must be used within a DataTableProvider');
  }

  return context;
};
