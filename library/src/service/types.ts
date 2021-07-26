import type { AxiosRequestConfig } from 'axios';

export interface BasisTheoryServiceOptions
  extends Pick<AxiosRequestConfig, 'transformRequest' | 'transformResponse'> {
  apiKey: string;
  baseURL: string;
}

export interface PaginatedList<T> {
  pagination: {
    totalItems: number;
    pageNumber: number;
    pageSize: number;
    totalPages: number;
  };
  data: T[];
}

type QueryValue =
  | boolean
  | number
  | string
  | null
  | undefined
  | (number | string)[];

export interface PaginatedQuery {
  page?: number;
  size?: number;
  [key: string]: QueryValue;
  [key: number]: QueryValue;
}

export interface RequestOptions {
  apiKey?: string;
  correlationId?: string;
}

export interface CRUD<
  T,
  C = unknown,
  U = unknown,
  Q extends PaginatedQuery = PaginatedQuery
> {
  create(payload: C, options?: RequestOptions): Promise<T>;
  retrieve(id: string, options?: RequestOptions): Promise<T>;
  update(id: string, payload: U, options?: RequestOptions): Promise<T>;
  delete(id: string, options?: RequestOptions): Promise<T>;
  list(query?: Q, options?: RequestOptions): Promise<PaginatedList<T>>;
}
