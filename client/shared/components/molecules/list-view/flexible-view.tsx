'use client';

import {
  ColumnDef,
  ColumnFiltersState,
  ColumnSort,
  getCoreRowModel,
  getFacetedRowModel,
  SortDirection,
  useReactTable,
  Row,
} from '@tanstack/react-table';

import { ReactNode } from 'react';
import { FlexibleViewPagination } from './flexible-pagination';
import { FlexibleViewToolbar } from './flexible-view-toolbar';

interface CardViewProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[];
  data: TData[];
  meta: {
    total: number;
    totalPages: number;
  };
  search: string | null;
  sortBy: string | null;
  sortDir: SortDirection | null;
  page: number | null;
  pageSize: number | null;
  filter?: ColumnFiltersState | null;
  onSearchChange: (search: string | null) => void;
  onSortByChange: (sort: string | null) => void;
  onSortDirChange: (sort: SortDirection | null) => void;
  onPageChange: (page: number) => void;
  onPageSizeChange: (page: number) => void;
  onFilterChange?: (filters: ColumnFiltersState) => void;
  isLoading: boolean;
  isError: boolean;
  
  renderCard: (item: TData, row: Row<TData>) => ReactNode;
  className?: string;
  emptyStateContent?: ReactNode;
  loadingStateContent?: ReactNode;
  showToolbar?: boolean;
}

export function FlexibleView<TData, TValue>({
  columns,
  data,
  meta,
  search,
  sortBy,
  sortDir,
  page,
  pageSize,
  filter,
  onSearchChange,
  onSortByChange,
  onSortDirChange,
  onPageChange,
  onPageSizeChange,
  onFilterChange,
  isLoading,
  
  renderCard,
  className = "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4",
  emptyStateContent = <div className="flex justify-center items-center h-24">Aucun résultat.</div>,
  loadingStateContent = <div className="flex justify-center items-center h-24">Chargement...</div>,
  showToolbar = true,
}: CardViewProps<TData, TValue>) {
  
  const sort: ColumnSort[] = sortBy && sortDir ? [{ id: sortBy, desc: sortDir === 'desc' }] : [];

  const table = useReactTable({
    data,
    columns,
    state: {
      globalFilter: search ?? '',
      sorting: sort ?? [],
      columnFilters: filter ?? [],
      pagination: {
        pageIndex: (page ?? 1) - 1,
        pageSize: pageSize ?? 10,
      },
    },
    getCoreRowModel: getCoreRowModel(),
    getFacetedRowModel: getFacetedRowModel(),
    manualFiltering: true,
    manualSorting: true,
    manualPagination: true,
    pageCount: meta.totalPages,
    rowCount: meta.total,
    onGlobalFilterChange: (updater) => {
      const value = typeof updater === 'function' ? updater(search || '') : updater;
      onSearchChange(value);
    },
    onSortingChange: (updater) => {
      const value = typeof updater === 'function' ? updater(sort || []) : updater;
      onSortByChange(value.length ? value[0].id : null);
      onSortDirChange(value.length ? (value[0].desc ? 'desc' : 'asc') : null);
    },
    onColumnFiltersChange: (updater) => {
      const value = typeof updater === 'function' ? updater(filter || []) : updater;
      onFilterChange?.(value);
    },
    onPaginationChange: (updater) => {
      const value =
        typeof updater === 'function' ? updater({ pageIndex: page - 1, pageSize }) : updater;
      onPageChange(value.pageIndex + 1);
      onPageSizeChange(value.pageSize);
    },
    debugAll: false,
  });

  const rows = table.getRowModel().rows;

  return (
    <>
      {showToolbar && <FlexibleViewToolbar data={table} />}
      
      <div className={className}>
        {isLoading ? (
          loadingStateContent
        ) : data.length === 0 ? (
          emptyStateContent
        ) : (
          rows.map((row) => {
            return (
              <div key={row.id}>
                {renderCard(row.original, row)}
              </div>
            );
          })
        )}
      </div>
      
      <FlexibleViewPagination data={table} />
    </>
  );
}