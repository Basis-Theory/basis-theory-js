import type {
  AxiosRequestConfig,
  AxiosResponse,
  AxiosTransformer,
} from 'axios';
import axios from 'axios';
import camelcaseKeys from 'camelcase-keys';
import { snakeCase } from 'snake-case';
import snakecaseKeys from 'snakecase-keys';
import type { Atomic, ReactRequest } from '../atomic';
import type { Reactor } from '../reactors';
import type { RequestOptions, RequestTransformers } from '../service';
import type { Token } from '../tokens';
import { BasisTheoryApiError } from './BasisTheoryApiError';
import { API_KEY_HEADER, BT_TRACE_ID_HEADER } from './constants';

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

export const transformReactorRequestSnakeCase: AxiosTransformer = (
  reactor: Reactor
): Reactor | undefined => {
  if (reactor === undefined) {
    return undefined;
  }

  return {
    ...snakecaseKeys(reactor, { deep: true }),
    ...(reactor.configuration !== undefined
      ? { configuration: reactor.configuration }
      : {}),
  } as Reactor;
};

export const transformAtomicRequestSnakeCase: AxiosTransformer = <
  T extends Atomic,
  S extends Atomic
>(
  data: T
): S | undefined => {
  if (data === undefined) {
    return undefined;
  }

  return {
    ...snakecaseKeys(data, { deep: true }),
    ...(data.metadata !== undefined ? { metadata: data.metadata } : {}),
  } as S;
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

export const transformAtomicReactionRequestSnakeCase: AxiosTransformer = (
  request: ReactRequest
): Token | undefined => {
  if (request === undefined) {
    return undefined;
  }

  return {
    ...snakecaseKeys(request, { deep: true }),
    ...(request.requestParameters !== undefined
      ? { request_parameters: request.requestParameters }
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

export const transformReactorResponseCamelCase: AxiosTransformer = (
  reactor: Reactor
): Reactor | undefined => {
  if (reactor === undefined) {
    return undefined;
  }

  return {
    ...camelcaseKeys(reactor, { deep: true }),
    ...(reactor.configuration !== undefined
      ? { configuration: reactor.configuration }
      : {}),
  } as Reactor;
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

export const transformAtomicResponseCamelCase: AxiosTransformer = <
  T extends Atomic,
  C extends Atomic
>(
  data: T
): C | undefined => {
  if (data === undefined) {
    return undefined;
  }

  return ({
    ...camelcaseKeys(data, { deep: true }),
    ...(data.metadata !== undefined ? { metadata: data.metadata } : {}),
  } as unknown) as C;
};

export const dataExtractor = <T>(res: AxiosResponse<T>): T => res?.data;

export const createRequestConfig = (
  options?: RequestOptions,
  transformers?: RequestTransformers
): AxiosRequestConfig | undefined => {
  if (!options) {
    if (!transformers) {
      return undefined;
    }

    return {
      ...(transformers.transformRequest !== undefined
        ? {
            transformRequest: concatRequestTransformerWithDefault(
              transformers.transformRequest
            ),
          }
        : {}),
      ...(transformers.transformResponse !== undefined
        ? {
            transformResponse: concatResponseTransformermWithDefault(
              transformers.transformResponse
            ),
          }
        : {}),
    };
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
    ...(transformers?.transformRequest !== undefined
      ? {
          transformRequest: concatRequestTransformerWithDefault(
            transformers.transformRequest
          ),
        }
      : {}),
    ...(transformers?.transformResponse !== undefined
      ? {
          transformResponse: concatResponseTransformermWithDefault(
            transformers.transformResponse
          ),
        }
      : {}),
  };
};

export const concatRequestTransformerWithDefault = (
  requestTransformer: AxiosTransformer | AxiosTransformer[]
): AxiosTransformer | AxiosTransformer[] | undefined =>
  ([] as AxiosTransformer[]).concat(
    requestTransformer,
    axios.defaults.transformRequest as AxiosTransformer[]
  );

export const concatResponseTransformermWithDefault = (
  responseTransformer: AxiosTransformer | AxiosTransformer[]
): AxiosTransformer | AxiosTransformer[] | undefined =>
  (axios.defaults.transformResponse as AxiosTransformer[]).concat(
    responseTransformer
  );

// eslint-disable-next-line @typescript-eslint/no-explicit-any,@typescript-eslint/explicit-module-boundary-types
export const errorInterceptor = (error: any): void => {
  const status = error.response?.status || -1;
  const data = error.response?.data;

  throw new BasisTheoryApiError(error.message, status, data);
};

export function getQueryParams<Q>(query: Q): string {
  const keys = Object.keys(query) as (keyof Q)[];

  if (keys.length) {
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
