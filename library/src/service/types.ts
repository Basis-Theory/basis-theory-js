import type { AxiosRequestConfig } from 'axios';
import { ApplicationInfo } from '../types';

interface BasisTheoryServiceOptions
  extends Pick<AxiosRequestConfig, 'transformRequest' | 'transformResponse'> {
  apiKey: string;
  baseURL: string;
  appInfo?: ApplicationInfo;
}

type RequestTransformers = Pick<
  AxiosRequestConfig,
  'transformRequest' | 'transformResponse'
>;

export type { BasisTheoryServiceOptions, RequestTransformers };
