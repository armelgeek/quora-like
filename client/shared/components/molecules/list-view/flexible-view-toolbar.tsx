'use client';

import { Table } from '@tanstack/react-table';

import { DebouncedInput } from '@/shared/components/atoms/ui/debounced-input';

interface DataTableToolbarProps<TData> {
  data: Table<TData>;
}

export function FlexibleViewToolbar<TData>({ data }: DataTableToolbarProps<TData>) {
  return (
    <div className="flex items-center justify-between">
      <div className="flex flex-1 items-center space-x-2">
        <div className="relative">
          <DebouncedInput
            placeholder="Search ..."
            value={data.getState().globalFilter ?? ''}
            onChange={(value) => data.setGlobalFilter(value)}
            className="w-[150px]  lg:w-[250px]"
          />

        </div>
      </div>
    </div>
  );
}
