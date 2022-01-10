import type {
  Reactor,
  ReactRequest,
  Token,
  TokenBase,
} from '@basis-theory/basis-theory-elements-interfaces/models';
import type { RequestOptions } from '@basis-theory/basis-theory-elements-interfaces/sdk/services';
import type {
  AxiosRequestConfig,
  AxiosResponse,
  AxiosTransformer,
} from 'axios';
import axios from 'axios';
import camelcaseKeys from 'camelcase-keys';
import { snakeCase } from 'snake-case';
import snakecaseKeys from 'snakecase-keys';
import { RequestTransformers } from '../service';
import { BasisTheoryApiError } from './BasisTheoryApiError';
import { API_KEY_HEADER, BT_TRACE_ID_HEADER } from './constants';

const assertInit = <T>(prop: T): NonNullable<T> => {
  // eslint-disable-next-line unicorn/no-null
  if (prop === null || prop === undefined) {
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

const proxyRaw: AxiosTransformer = <T>(data: T): T | undefined => data;

const transformReactorRequestSnakeCase: AxiosTransformer = (
  reactor: Reactor
): Reactor | undefined => {
  if (typeof reactor === 'undefined') {
    return undefined;
  }

  return {
    ...snakecaseKeys(reactor, { deep: true }),
    ...(reactor.configuration !== undefined
      ? { configuration: reactor.configuration }
      : {}),
  } as Reactor;
};

const transformAtomicRequestSnakeCase: AxiosTransformer = <
  T extends TokenBase,
  S extends TokenBase
>(
  data: T
): S | undefined => {
  if (typeof data === 'undefined') {
    return undefined;
  }

  return {
    ...snakecaseKeys(data, { deep: true }),
    ...(data.metadata !== undefined ? { metadata: data.metadata } : {}),
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
    ...(token.data !== undefined ? { data: token.data } : {}),
    ...(token.metadata !== undefined ? { metadata: token.metadata } : {}),
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
    ...(request.requestParameters !== undefined
      ? // eslint-disable-next-line camelcase
        { request_parameters: request.requestParameters }
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
    ...(token.data !== undefined ? { data: token.data } : {}),
    ...(token.metadata !== undefined ? { metadata: token.metadata } : {}),
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
    ...(reactor.configuration !== undefined
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
  T extends TokenBase,
  C extends TokenBase
>(
  data: T
): C | undefined => {
  if (typeof data === 'undefined') {
    return undefined;
  }

  return ({
    ...camelcaseKeys(data, { deep: true }),
    ...(data.metadata !== undefined ? { metadata: data.metadata } : {}),
  } as unknown) as C;
};

const dataExtractor = <T>(res: AxiosResponse<T>): T => res?.data;

const concatRequestTransformerWithDefault = (
  requestTransformer: AxiosTransformer | AxiosTransformer[]
): AxiosTransformer | AxiosTransformer[] | undefined => [
  ...([] as AxiosTransformer[]),
  ...([requestTransformer] as AxiosTransformer[]),
  ...(axios.defaults.transformRequest as AxiosTransformer[]),
];

const concatResponseTransformermWithDefault = (
  responseTransformer: AxiosTransformer | AxiosTransformer[]
): AxiosTransformer | AxiosTransformer[] | undefined => [
  ...(axios.defaults.transformResponse as AxiosTransformer[]),
  ...([responseTransformer] as AxiosTransformer[]),
];

const createRequestConfig = (
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

// eslint-disable-next-line @typescript-eslint/no-explicit-any,@typescript-eslint/explicit-module-boundary-types
const errorInterceptor = (error: any): void => {
  const status = error.response?.status || -1;
  const data = error.response?.data;

  throw new BasisTheoryApiError(error.message, status, data);
};

const getQueryParams = <Q>(query: Q): string => {
  const keys = Object.keys(query) as (keyof Q)[];

  if (keys.length) {
    const params = new URLSearchParams();

    const appendSafe = (
      key: string,
      value: unknown,
      toSnakeCaseOrNotToSnakeCaseThatIsTheQuestion = true
    ): void => {
      const type = typeof value;

      const parsedKey = toSnakeCaseOrNotToSnakeCaseThatIsTheQuestion
        ? snakeCase(key)
        : key;

      // eslint-disable-next-line unicorn/no-null
      if (value === null || ['boolean', 'number', 'string'].includes(type)) {
        params.append(parsedKey, value as string);
      }
    };

    keys.forEach((key) => {
      const value = query[key];

      if (Array.isArray(value)) {
        value.forEach((aValue) => {
          appendSafe(String(key), aValue);
        });
      } else if (value && typeof value === 'object') {
        const objectKeys = Object.keys(value);

        objectKeys.forEach((objectKey) => {
          appendSafe(
            `${key}.${objectKey}`,
            ((value as unknown) as Record<string, string>)[objectKey],
            false
          );
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
  proxyRaw,
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
