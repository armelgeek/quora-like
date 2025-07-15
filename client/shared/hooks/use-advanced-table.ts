import { useEffect, useState } from 'react';
import { ColumnFiltersState } from '@tanstack/react-table';
import { parseAsInteger, useQueryState } from 'nuqs';
import { keepPreviousData, useQuery } from '@tanstack/react-query';

interface UseTableStateProps<T> {
  queryKey: (params: QueryParams) => readonly string[];
  queryFn: (params: QueryParams) => Promise<T>;
}


interface QueryParams {
  search?: string;
  page?: number;
  pageSize?: number;
  sortBy?: string;
  sortDir?: string;
}

interface UseTableStateReturn<T> {
  // State
  search: string;
  page: number;
  pageSize: number;
  sortBy: string;
  sortDir: string;
  filter: ColumnFiltersState;

  data: T | undefined | null;
  isPending: boolean;
  isError: boolean;

  setSearch: (value: string | null) => void;
  setPage: (value: number | null) => void;
  setPageSize: (value: number | null) => void;
  setSortBy: (value: string | null) => void;
  setSortDir: (value: string | null) => void;
  handleFilterChange: (filters: ColumnFiltersState) => void;
}

export function useAdvancedTable<T>({ queryKey, queryFn }: UseTableStateProps<T>): UseTableStateReturn<T> {

  const [search, setSearch] = useQueryState('q', { defaultValue: '' });
  const [page, setPage] = useQueryState('page', parseAsInteger.withDefault(1));
  const [pageSize, setPageSize] = useQueryState('pageSize', parseAsInteger.withDefault(10));
  const [sortBy, setSortBy] = useQueryState('sortBy', { defaultValue: '' });
  const [sortDir, setSortDir] = useQueryState('sortDir', { defaultValue: '' });

  const [filter, setFilter] = useState<ColumnFiltersState>([]);

  useEffect(() => {
    const newFilters: ColumnFiltersState = [];

  
    setFilter(newFilters);
  }, []);

  const queryParams = {
    ...(search && { search }),
    ...(page && { page }),
    ...(pageSize && { pageSize }),
    ...(sortBy && { sortBy }),
    ...(sortDir && { sortDir })
  };
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  //@ts-expect-error
  const queryP = [...queryKey, queryParams];
  const { data, isPending, isError } = useQuery({
    queryKey: queryP,
    queryFn: () => queryFn(queryParams),
    placeholderData: keepPreviousData,
  });

  const handleFilterChange = (filters: ColumnFiltersState) => {
    setFilter(filters);
  };

  return {
    search,
    page,
    pageSize,
    sortBy,
    sortDir,
    filter,
    data,
    isPending,
    isError,
    setSearch,
    setPage,
    setPageSize,
    setSortBy,
    setSortDir,
    handleFilterChange,
  };
}
