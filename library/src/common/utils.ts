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

const assertInit = <T>(prop: T): NonNullable<T> => {
  if (prop === undefined) {
    throw new Error('BasisTheory has not yet been properly initialized.');
  }

  return prop as NonNullable<T>;
};

const transformRequestSnakeCase: AxiosTransformer = <T, S>(
  data: T
): S | undefined => {
  if (typeof data === 'undefined') {
    return undefined;
  }

  return snakecaseKeys(data, {
    deep: true,
  }) as S;
};

const transformReactorRequestSnakeCase: AxiosTransformer = (
  reactor: Reactor
): Reactor | undefined => {
  if (typeof reactor === 'undefined') {
    return undefined;
  }

  return {
    ...snakecaseKeys(reactor, { deep: true }),
    ...(typeof reactor.configuration !== 'undefined'
      ? { configuration: reactor.configuration }
      : {}),
  } as Reactor;
};

const transformAtomicRequestSnakeCase: AxiosTransformer = <
  T extends Atomic,
  S extends Atomic
>(
  data: T
): S | undefined => {
  if (typeof data === 'undefined') {
    return undefined;
  }

  return {
    ...snakecaseKeys(data, { deep: true }),
    ...(typeof data.metadata !== 'undefined'
      ? { metadata: data.metadata }
      : {}),
  } as S;
};

const transformTokenRequestSnakeCase: AxiosTransformer = (
  token: Token
): Token | undefined => {
  if (typeof token === 'undefined') {
    return undefined;
  }

  return {
    ...snakecaseKeys(token, { deep: true }),
    ...(typeof token.data !== 'undefined' ? { data: token.data } : {}),
    ...(typeof token.metadata !== 'undefined'
      ? { metadata: token.metadata }
      : {}),
  } as Token;
};

const transformAtomicReactionRequestSnakeCase: AxiosTransformer = (
  request: ReactRequest
): Token | undefined => {
  if (typeof request === 'undefined') {
    return undefined;
  }

  return {
    ...snakecaseKeys(request, { deep: true }),
    ...(typeof request.requestParameters !== 'undefined'
      ? // eslint-disable-next-line camelcase
        { request_parameters: request.requestParameters }
      : {}),
    ...(typeof request.metadata !== 'undefined'
      ? { metadata: request.metadata }
      : {}),
  } as Token;
};

const transformTokenResponseCamelCase: AxiosTransformer = (
  token: Token
): Token | undefined => {
  if (typeof token === 'undefined') {
    return undefined;
  }

  return {
    ...camelcaseKeys(token, { deep: true }),
    ...(typeof token.data !== 'undefined' ? { data: token.data } : {}),
    ...(typeof token.metadata !== 'undefined'
      ? { metadata: token.metadata }
      : {}),
  } as Token;
};

const transformReactorResponseCamelCase: AxiosTransformer = (
  reactor: Reactor
): Reactor | undefined => {
  if (typeof reactor === 'undefined') {
    return undefined;
  }

  return {
    ...camelcaseKeys(reactor, { deep: true }),
    ...(typeof reactor.configuration !== 'undefined'
      ? { configuration: reactor.configuration }
      : {}),
  } as Reactor;
};

const transformResponseCamelCase: AxiosTransformer = <T, C>(
  data: T
): C | undefined => {
  if (typeof data === 'undefined') {
    return undefined;
  }

  return (camelcaseKeys(data, {
    deep: true,
  }) as unknown) as C;
};

const transformAtomicResponseCamelCase: AxiosTransformer = <
  T extends Atomic,
  C extends Atomic
>(
  data: T
): C | undefined => {
  if (typeof data === 'undefined') {
    return undefined;
  }

  return ({
    ...camelcaseKeys(data, { deep: true }),
    ...(typeof data.metadata !== 'undefined'
      ? { metadata: data.metadata }
      : {}),
  } as unknown) as C;
};

const dataExtractor = <T>(res: AxiosResponse<T>): T => res?.data;

const concatRequestTransformerWithDefault = (
  requestTransformer: AxiosTransformer | AxiosTransformer[]
): AxiosTransformer | AxiosTransformer[] | undefined => [
  ...([] as AxiosTransformer[]),
  ...(requestTransformer as AxiosTransformer[]),
  ...(axios.defaults.transformRequest as AxiosTransformer[]),
];

const concatResponseTransformermWithDefault = (
  responseTransformer: AxiosTransformer | AxiosTransformer[]
): AxiosTransformer | AxiosTransformer[] | undefined => [
  ...(axios.defaults.transformResponse as AxiosTransformer[]),
  ...(responseTransformer as AxiosTransformer[]),
];

const createRequestConfig = (
  options?: RequestOptions,
  transformers?: RequestTransformers
): AxiosRequestConfig | undefined => {
  if (typeof options === 'undefined') {
    if (typeof transformers === 'undefined') {
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

// eslint-disable-next-line @typescript-eslint/no-explicit-any, @typescript-eslint/explicit-module-boundary-types
const errorInterceptor = (error: any): void => {
  const status = error.response?.status || -1;
  const data = error.response?.data;

  throw new BasisTheoryApiError(error.message, status, data);
};

const getQueryParams = <Q>(query: Q): string => {
  const keys = Object.keys(query) as (keyof Q)[];

  if (keys.length) {
    const params = new URLSearchParams();

    const appendSafe = (key: string, value: unknown): void => {
      const type = typeof value;

      if (
        type === 'undefined' ||
        ['boolean', 'number', 'string'].includes(type)
      ) {
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
};

export {
  assertInit,
  transformRequestSnakeCase,
  transformReactorRequestSnakeCase,
  transformAtomicRequestSnakeCase,
  transformTokenRequestSnakeCase,
  transformAtomicReactionRequestSnakeCase,
  transformTokenResponseCamelCase,
  transformReactorResponseCamelCase,
  transformResponseCamelCase,
  transformAtomicResponseCamelCase,
  dataExtractor,
  createRequestConfig,
  concatRequestTransformerWithDefault,
  concatResponseTransformermWithDefault,
  errorInterceptor,
  getQueryParams,
};
