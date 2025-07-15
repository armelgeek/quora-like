import { useQueryState, parseAsInteger } from 'nuqs';
import { SortDirection } from '@tanstack/react-table';

export function useTableParams() {
  const [search, setSearch] = useQueryState('search');
  const [sortBy, setSortBy] = useQueryState('sortBy');
  const [sortDir, setSortDir] = useQueryState('sortDir');
  const [page, setPage] = useQueryState('page', {
    defaultValue: '1',
    parse: parseAsInteger,
  });
  const [pageSize, setPageSize] = useQueryState('pageSize', {
    defaultValue: '10',
    parse: parseAsInteger,
  });

  const params = {
    search: search || '',
    sortBy: sortBy || '',
    sortDir: sortDir || 'asc',
    page: page || 1,
    pageSize: pageSize || 10,
  };

  const handlers = {
    onSearchChange: setSearch,
    onSortByChange: setSortBy,
    onSortDirChange: (dir: SortDirection | null) => setSortDir(dir || 'asc'),
    onPageChange: setPage,
    onPageSizeChange: setPageSize,
  };

  return {
    params,
    tableProps: {
      search,
      sortBy,
      sortDir: sortDir as SortDirection,
      page: Number(page) || 1,
      pageSize: Number(pageSize) || 10,
      ...handlers,
    },
  };
}
