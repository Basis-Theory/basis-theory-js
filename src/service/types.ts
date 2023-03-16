import type { AxiosRequestConfig } from 'axios';
import https from 'https';
import type { ApplicationInfo } from '@/types/sdk';

interface BasisTheoryServiceOptions
  extends Pick<AxiosRequestConfig, 'transformRequest' | 'transformResponse'> {
  apiKey: string;
  baseURL: string;
  appInfo?: ApplicationInfo;
  httpsAgent?: https.Agent;
}

type RequestTransformers = Pick<
  AxiosRequestConfig,
  'transformRequest' | 'transformResponse'
>;

export type { BasisTheoryServiceOptions, RequestTransformers };
