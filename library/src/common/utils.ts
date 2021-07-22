import camelcaseKeys from 'camelcase-keys';
import snakecaseKeys from 'snakecase-keys';
import type {
  AxiosRequestConfig,
  AxiosResponse,
  AxiosTransformer,
} from 'axios';
import type { RequestOptions } from '../service';
import { API_KEY_HEADER, BT_TRACE_ID_HEADER } from './constants';

export const assertInit = <T>(prop: T): NonNullable<T> => {
  if (prop === null || prop === undefined) {
    throw new Error('BasisTheory has not yet been properly initialized.');
  }
  return prop as NonNullable<T>;
};

export const findScript = (url: string): HTMLScriptElement | null => {
  return document.querySelector<HTMLScriptElement>(`script[src^="${url}"]`);
};

export const injectScript = (url: string): HTMLScriptElement => {
  const script = document.createElement('script');
  script.src = url;

  const parent = document.head || document.body;

  if (!parent) {
    throw new Error('No <head> or <body> elements found in document.');
  }

  parent.appendChild(script);

  return script;
};

export const transformRequestSnakeCase: AxiosTransformer = <T, S>(
  data: T
): S | undefined => {
  if (data === undefined) {
    return undefined;
  }
  return snakecaseKeys(data, {
    deep: true,
  }) as S;
};

export const transformResponseCamelCase: AxiosTransformer = <T, C>(
  data: T
): C | undefined => {
  if (data === undefined) {
    return undefined;
  }
  return (camelcaseKeys(data, {
    deep: true,
  }) as unknown) as C;
};

export const dataExtractor = <T>(res: AxiosResponse<T>): T => res.data;

export const createRequestConfig = (
  options?: RequestOptions
): AxiosRequestConfig | undefined => {
  if (!options) {
    return undefined;
  }
  const { apiKey, correlationId } = options;
  const apiKeyHeader = apiKey
    ? {
        [API_KEY_HEADER]: apiKey,
      }
    : {};
  const correlationIdHeader = correlationId
    ? {
        [BT_TRACE_ID_HEADER]: correlationId,
      }
    : {};
  return {
    headers: {
      ...apiKeyHeader,
      ...correlationIdHeader,
    },
  };
};
