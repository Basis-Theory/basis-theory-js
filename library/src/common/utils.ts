import camelcaseKeys from 'camelcase-keys';
import snakecaseKeys from 'snakecase-keys';
import { snakeCase } from 'snake-case';
import type {
  AxiosRequestConfig,
  AxiosResponse,
  AxiosTransformer,
} from 'axios';
import type { RequestOptions } from '../service';
import { API_KEY_HEADER, BT_TRACE_ID_HEADER } from './constants';
import { BasisTheoryApiError } from './BasisTheoryApiError';
import type { Token } from '../tokens';
import type { ReactRequest } from '../atomic';
import type { AtomicBank } from '../atomic/banks';

export const assertInit = <T>(prop: T): NonNullable<T> => {
  if (prop === null || prop === undefined) {
    throw new Error('BasisTheory has not yet been properly initialized.');
  }
  return prop as NonNullable<T>;
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

export const transformTokenRequestSnakeCase: AxiosTransformer = (
  token: Token
): Token | undefined => {
  if (token === undefined) {
    return undefined;
  }

  return {
    ...snakecaseKeys(token, { deep: true }),
    ...(token.data !== undefined ? { data: token.data } : {}),
    ...(token.metadata !== undefined ? { metadata: token.metadata } : {}),
  } as Token;
};

export const transformAtomicBankRequestSnakeCase: AxiosTransformer = (
  atomicBank: AtomicBank
): AtomicBank | undefined => {
  if (atomicBank === undefined) {
    return undefined;
  }

  return {
    ...snakecaseKeys(atomicBank, { deep: true }),
    ...(atomicBank.metadata !== undefined
      ? { metadata: atomicBank.metadata }
      : {}),
  } as AtomicBank;
};

export const transformAtomicReactionRequestSnakeCase: AxiosTransformer = (
  request: ReactRequest
): Token | undefined => {
  if (request === undefined) {
    return undefined;
  }

  return {
    ...snakecaseKeys(request, { deep: true }),
    ...(request.requestParameters !== undefined
      ? { requestParameters: request.requestParameters }
      : {}),
    ...(request.metadata !== undefined ? { metadata: request.metadata } : {}),
  } as Token;
};

export const transformTokenResponseCamelCase: AxiosTransformer = (
  token: Token
): Token | undefined => {
  if (token === undefined) {
    return undefined;
  }

  return {
    ...camelcaseKeys(token, { deep: true }),
    ...(token.data !== undefined ? { data: token.data } : {}),
    ...(token.metadata !== undefined ? { metadata: token.metadata } : {}),
  } as Token;
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

export const transformAtomicBankResponseCamelCase: AxiosTransformer = (
  atomicBank: AtomicBank
): AtomicBank | undefined => {
  if (atomicBank === undefined) {
    return undefined;
  }

  return {
    ...camelcaseKeys(atomicBank, { deep: true }),
    ...(atomicBank.metadata !== undefined
      ? { metadata: atomicBank.metadata }
      : {}),
  } as AtomicBank;
};

export const dataExtractor = <T>(res: AxiosResponse<T>): T => res?.data;

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

// eslint-disable-next-line @typescript-eslint/no-explicit-any,@typescript-eslint/explicit-module-boundary-types
export const errorInterceptor = (error: any): void => {
  const status = error.response?.status || -1;
  const data = error.response?.data;

  throw new BasisTheoryApiError(error.message, status, data);
};

export function getQueryParams<Q>(query: Q): string {
  const keys = Object.keys(query) as (keyof Q)[];

  if (keys.length > 0) {
    const params = new URLSearchParams();

    const appendSafe = (key: string, value: unknown): void => {
      const type = typeof value;
      if (value === null || ['boolean', 'number', 'string'].includes(type)) {
        params.append(snakeCase(key), value as string);
      }
    };

    keys.forEach((key) => {
      const value = query[key];

      if (Array.isArray(value)) {
        value.forEach((aValue) => {
          appendSafe(String(key), aValue);
        });
      } else {
        appendSafe(String(key), value);
      }
    });

    return `?${params.toString()}`;
  }

  return '';
}
