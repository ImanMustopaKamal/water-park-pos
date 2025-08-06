export interface PaginationResult<T> {
  data: T[];
  total: number;
  totalPages: number;
  currentPage: number;
}

export interface PaginationQuery {
  page: number;
  limit: number;
  search?: string;
  status?: boolean;
}
