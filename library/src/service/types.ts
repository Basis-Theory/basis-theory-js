import type { AxiosRequestConfig } from 'axios';

interface BasisTheoryServiceOptions
  extends Pick<AxiosRequestConfig, 'transformRequest' | 'transformResponse'> {
  apiKey: string;
  baseURL: string;
}

interface PaginatedList<T> {
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

interface PaginatedQuery {
  [key: string]: QueryValue;
  [key: number]: QueryValue;
  page?: number;
  size?: number;
}

interface RequestOptions {
  apiKey?: string;
  correlationId?: string;
}

type RequestTransformers = Pick<
  AxiosRequestConfig,
  'transformRequest' | 'transformResponse'
>;

export type {
  BasisTheoryServiceOptions,
  PaginatedList,
  PaginatedQuery,
  RequestOptions,
  RequestTransformers,
};
