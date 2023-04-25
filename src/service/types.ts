import type { AxiosRequestConfig } from 'axios';
import type { ApplicationInfo } from '@/types/sdk';

interface BasisTheoryServiceOptions
  extends Pick<AxiosRequestConfig, 'transformRequest' | 'transformResponse'> {
  apiKey: string;
  baseURL: string;
  appInfo?: ApplicationInfo;
  // 'any' is the type accepted by axios, this avoids having to import 'https'
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  httpsAgent?: any;
}

type RequestTransformers = Pick<
  AxiosRequestConfig,
  'transformRequest' | 'transformResponse'
>;

export type { BasisTheoryServiceOptions, RequestTransformers };
