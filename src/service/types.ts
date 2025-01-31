import type { AxiosRequestConfig } from 'axios';
import type { ApplicationInfo } from '@/types/sdk';

interface BasisTheoryServiceOptions
  extends Pick<AxiosRequestConfig, 'transformRequest' | 'transformResponse'> {
  apiKey: string;
  baseURL: string;
  debug?: boolean;
  appInfo?: ApplicationInfo;
}

type RequestTransformers = Pick<
  AxiosRequestConfig,
  'transformRequest' | 'transformResponse'
>;

export type { BasisTheoryServiceOptions, RequestTransformers };
