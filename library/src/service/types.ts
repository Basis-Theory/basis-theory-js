import type { AxiosRequestConfig } from 'axios';

interface BasisTheoryServiceOptions
  extends Pick<AxiosRequestConfig, 'transformRequest' | 'transformResponse'> {
  apiKey: string;
  baseURL: string;
}

type RequestTransformers = Pick<
  AxiosRequestConfig,
  'transformRequest' | 'transformResponse'
>;

export type { BasisTheoryServiceOptions, RequestTransformers };
