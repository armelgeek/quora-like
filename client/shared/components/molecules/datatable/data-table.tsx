'use client';

import React from 'react';
import {
  ColumnDef,
  ColumnFiltersState,
  ColumnSort,
  flexRender,
  getCoreRowModel,
  getFacetedRowModel,
  SortDirection,
  useReactTable,
  Row,
  Table,
} from '@tanstack/react-table';
import { useTheme } from 'next-themes';

import { DataTablePagination } from '@/shared/components/molecules/datatable/data-table-pagination';
import {
  Table as UITable,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/shared/components/atoms/ui/table';

import { Input } from '@/shared/components/atoms/ui/input';
import { Button } from '@/shared/components/atoms/ui/button';
import { Skeleton } from '@/shared/components/atoms/ui/skeleton';

interface DataTableProps<TData, TValue> {
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
  renderRowActions?: (row: Row<TData>) => React.ReactNode;
  // Ajout pour bulk selection
  rowSelection?: Record<string, boolean>;
  onRowSelectionChange?: (rowSelection: Record<string, boolean>) => void;
  toolbarActions?: React.ReactNode | ((selectedRows: TData[]) => React.ReactNode);
  searchEnabled?: boolean;
}

function DataTableToolbar<TData>({ table, toolbarActions }: { table: Table<TData>; toolbarActions?: React.ReactNode | ((selectedRows: TData[]) => React.ReactNode) }) {
  const selectedRows = table.getSelectedRowModel().rows.map(r => r.original as TData);
  const selectedCount = selectedRows.length;
  return (
    <div className="flex items-center gap-2">
      {selectedCount > 0 && (
        <span className="text-sm text-muted-foreground">{selectedCount} sélectionné(s)</span>
      )}
      <div className="flex-1" />
      {typeof toolbarActions === 'function'
        ? toolbarActions(selectedRows)
        : toolbarActions}
    </div>
  );
}

export function DataTable<TData, TValue>({
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
  renderRowActions,
  rowSelection,
  onRowSelectionChange,
  toolbarActions,
  searchEnabled,
}: DataTableProps<TData, TValue>) {
  const { theme } = useTheme();
  const sort: ColumnSort[] = sortBy && sortDir ? [{ id: sortBy, desc: sortDir === 'desc' }] : [];

  const safeOnSearchChange = React.useCallback(
    (value: string | null) => {
      if (search !== value) onSearchChange(value);
    },
    [search, onSearchChange]
  );

  const safeOnSortByChange = React.useCallback(
    (value: string | null) => {
      if (sortBy !== value) onSortByChange(value);
    },
    [sortBy, onSortByChange]
  );

  const safeOnSortDirChange = React.useCallback(
    (value: SortDirection | null) => {
      if (sortDir !== value) onSortDirChange(value);
    },
    [sortDir, onSortDirChange]
  );

  const safeOnPageChange = React.useCallback(
    (newPage: number) => {
      if (page !== newPage) onPageChange(newPage);
    },
    [page, onPageChange]
  );

  const safeOnPageSizeChange = React.useCallback(
    (newSize: number) => {
      if (pageSize !== newSize) onPageSizeChange(newSize);
    },
    [pageSize, onPageSizeChange]
  );

  const table = useReactTable({
    data,
    columns,
    getRowId: (row) => String((row as { id?: string | number }).id ?? ''),
    state: {
      globalFilter: search ?? '',
      columnFilters: filter ?? [],
      pagination: {
        pageIndex: (page ?? 1) - 1,
        pageSize: pageSize ?? 10,
      },
      rowSelection: rowSelection ?? {},
    },
    onRowSelectionChange: onRowSelectionChange
      ? (updaterOrValue) => {
        const value =
          typeof updaterOrValue === 'function'
            ? updaterOrValue(rowSelection ?? {})
            : updaterOrValue;
        onRowSelectionChange(value);
      }
      : undefined,
    enableRowSelection: true,
    getCoreRowModel: getCoreRowModel(),
    getFacetedRowModel: getFacetedRowModel(),
    manualFiltering: true,
    manualSorting: true,
    manualPagination: true,
    pageCount: meta.totalPages,
    rowCount: meta.total,
    onGlobalFilterChange: (updater) => {
      const value = typeof updater === 'function' ? updater(search || '') : updater;
      safeOnSearchChange(value);
    },
    onSortingChange: (updater) => {
      const value = typeof updater === 'function' ? updater(sort || []) : updater;
      safeOnSortByChange(value.length ? value[0].id : null);
      safeOnSortDirChange(value.length ? (value[0].desc ? 'desc' : 'asc') : null);
    },
    onColumnFiltersChange: (updater) => {
      const value = typeof updater === 'function' ? updater(filter || []) : updater;
      onFilterChange?.(value);
    },
    onPaginationChange: (updater) => {
      const safePage = page ?? 1;
      const safePageSize = pageSize ?? 10;
      const value =
        typeof updater === 'function' ? updater({ pageIndex: safePage - 1, pageSize: safePageSize }) : updater;
      safeOnPageChange(value.pageIndex + 1);
      safeOnPageSizeChange(value.pageSize);
    },
    debugAll: false,
  });

  return (
    <div className="space-y-4">
      {searchEnabled !== false && (
        <div className="flex items-center gap-2 py-2">
          <div className="relative w-full max-w-xs">
            <Input
              type="text"
              placeholder="Rechercher..."
              value={table.getState().globalFilter ?? ''}
              onChange={e => table.setGlobalFilter(e.target.value)}
              className="pl-8"
              aria-label="Recherche globale"
            />
            <span className="absolute left-2 top-1/2 -translate-y-1/2 text-gray-400">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><circle cx="11" cy="11" r="8" /><line x1="21" y1="21" x2="16.65" y2="16.65" /></svg>
            </span>
          </div>
          {table.getState().globalFilter && (
            <Button
              variant="ghost"
              size="sm"
              onClick={() => table.setGlobalFilter('')}
              aria-label="Effacer la recherche"
            >
              Effacer
            </Button>
          )}
        </div>
      )}
      <DataTableToolbar<TData> table={table} toolbarActions={toolbarActions} />
      <div className="rounded-md border">
        <UITable>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow
                key={headerGroup.id}
                className={
                  (theme === 'dark'
                    ? 'bg-primary/30 text-white'
                    : 'bg-primary/10 text-primary-foreground')
                }
              >
                {headerGroup.headers.map((header) => {
                  const isBeforeActions = renderRowActions && header.id === 'actions';
                  return (
                    <React.Fragment key={header.id}>
                      {isBeforeActions && <TableHead className='w-[250px]'> </TableHead>}
                      <TableHead
                        colSpan={header.colSpan}
                        style={{ width: header.getSize(), fontWeight: 'bold', textTransform: 'uppercase' }}
                        className={'text-primary'}
                      >
                        {header.isPlaceholder
                          ? null
                          : flexRender(header.column.columnDef.header, header.getContext())}
                      </TableHead>
                    </React.Fragment>
                  );
                })}
                {renderRowActions && !table.getHeaderGroups()[0].headers.some(h => h.id === 'actions') && <TableHead> </TableHead>}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {isLoading ? (
              Array.from({ length: pageSize ?? 10 }).map((_, idx) => (
                <TableRow key={"skeleton-" + idx}>
                  {columns.map((col, cidx) => (
                    <TableCell key={col.id || cidx}>
                      <Skeleton className="h-5 w-full" />
                    </TableCell>
                  ))}
                  {renderRowActions && (
                    <TableCell>
                      <Skeleton className="h-5 w-16" />
                    </TableCell>
                  )}
                </TableRow>
              ))
            ) : data.length === 0 ? (
              <TableRow>
                <TableCell
                  colSpan={columns.length + (renderRowActions ? 1 : 0)}
                  className="h-24 text-center"
                >
                  No result.
                </TableCell>
              </TableRow>
            ) : (
              table.getRowModel().rows.map((row) => {
                const cells = row.getVisibleCells();
                const actionsIdx = cells.findIndex(cell => cell.column.id === 'actions');
                return (
                  <TableRow
                    key={row.id}
                    data-state={row.getIsSelected() && 'selected'}
                  >
                    {cells.map((cell, idx) => (
                      <React.Fragment key={cell.id}>
                        {renderRowActions && idx === actionsIdx && <TableCell>{renderRowActions(row)}</TableCell>}
                        <TableCell>
                          {flexRender(cell.column.columnDef.cell, cell.getContext())}
                        </TableCell>
                      </React.Fragment>
                    ))}
                    {renderRowActions && actionsIdx === -1 && <TableCell>{renderRowActions(row)}</TableCell>}
                  </TableRow>
                );
              })
            )}
          </TableBody>
        </UITable>
      </div>
      {meta && meta.totalPages > 1 && (
        <DataTablePagination table={table} />
      )}

    </div>
  );
}
