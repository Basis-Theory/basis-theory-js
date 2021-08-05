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
  [key: string]: QueryValue;
  [key: number]: QueryValue;
  page?: number;
  size?: number;
}

export interface RequestOptions {
  apiKey?: string;
  correlationId?: string;
}
