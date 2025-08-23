// 'use client';

// import {
//   type ColumnFiltersState,
//   getCoreRowModel,
//   getFacetedRowModel,
//   getFacetedUniqueValues,
//   getFilteredRowModel,
//   getSortedRowModel,
//   type SortingState,
//   useReactTable,
// } from '@tanstack/react-table';
// import { useState } from 'react';

// import { orderFilterFields, orderTableColumns } from '@/components/order/order-table-columns';
// import { OrderDataTableToolbar } from '@/components/order/order-table-toolbar';
// import { DataTable2 } from '@/components/ui/data-table/data-table2';
// import type { OrderDetails } from '@/types/order';

// export function OrderTable({ orders }: { orders: OrderDetails[] }) {
//   const [sorting, setSorting] = useState<SortingState>([]);
//   const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
//   const table = useReactTable({
//     data: orders,
//     columns: orderTableColumns,
//     state: {
//       // rowSelection,
//       columnFilters,
//       sorting,
//     },
//     getCoreRowModel: getCoreRowModel(),
//     getFilteredRowModel: getFilteredRowModel(),
//     getFacetedRowModel: getFacetedRowModel(),
//     getFacetedUniqueValues: getFacetedUniqueValues(),
//     getSortedRowModel: getSortedRowModel(),
//     onColumnFiltersChange: setColumnFilters,
//     onSortingChange: setSorting,
//   });

//   return (
//     <>
//       <OrderDataTableToolbar filterFields={orderFilterFields} table={table} />
//       <DataTable2 columnLength={orderTableColumns.length} table={table} />
//     </>
//   );
// }
