export interface Pagination {
  page: number;
  pageSize: number;
  pageCount: number;
  total: number;
}

export interface PaginatedResponse<T> {
  total: number;
  data: T[];
  page: number
  limit: number
}