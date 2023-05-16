import type {
  AxiosRequestConfig,
  AxiosResponse,
  AxiosTransformer,
} from 'axios';
import axios from 'axios';
import camelcaseKeys from 'camelcase-keys';
import os from 'os';
import { snakeCase } from 'snake-case';
import snakecaseKeys from 'snakecase-keys';
import type { RequestTransformers } from '@/service';
import type { Reactor, Proxy, Token, TokenBase } from '@/types/models';
import type {
  ApplicationInfo,
  ClientUserAgent,
  ProxyRequestOptions,
  RequestOptions,
} from '@/types/sdk';
import { BasisTheoryApiError } from './BasisTheoryApiError';
import {
  API_KEY_HEADER,
  BROWSER_LIST,
  BT_IDEMPOTENCY_KEY_HEADER,
  BT_TRACE_ID_HEADER,
  USER_AGENT_CLIENT,
} from './constants';

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

const transformProxyRequestSnakeCase: AxiosTransformer = (
  proxy: Proxy
): Proxy | undefined => {
  if (typeof proxy === 'undefined') {
    return undefined;
  }

  return {
    ...snakecaseKeys(proxy, { deep: true }),
    ...(proxy.configuration !== undefined
      ? { configuration: proxy.configuration }
      : {}),
  } as Proxy;
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

const transformProxyResponseCamelCase: AxiosTransformer = (
  proxy: Proxy
): Proxy | undefined => {
  if (typeof proxy === 'undefined') {
    return undefined;
  }

  return {
    ...camelcaseKeys(proxy, { deep: true }),
    ...(proxy.configuration !== undefined
      ? { configuration: proxy.configuration }
      : {}),
  } as Proxy;
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

const dataExtractor = <T>(res: AxiosResponse<T>): AxiosResponse<T>['data'] =>
  res?.data;

const dataAndHeadersExtractor = <T>(
  res: AxiosResponse<T>
): Pick<AxiosResponse<T>, 'data' | 'headers'> => ({
  data: res?.data,
  headers: res?.headers,
});

const concatRequestTransformerWithDefault = (
  requestTransformer: AxiosTransformer | AxiosTransformer[]
): AxiosTransformer | AxiosTransformer[] | undefined => [
  ...([] as AxiosTransformer[]),
  ...([requestTransformer] as AxiosTransformer[]),
  ...(axios.defaults.transformRequest as AxiosTransformer[]),
];

const concatResponseTransformerWithDefault = (
  responseTransformer: AxiosTransformer | AxiosTransformer[]
): AxiosTransformer | AxiosTransformer[] | undefined => [
  ...(axios.defaults.transformResponse as AxiosTransformer[]),
  ...([responseTransformer] as AxiosTransformer[]),
];

const createRequestConfig = (
  options?: ProxyRequestOptions | RequestOptions,
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
            transformResponse: concatResponseTransformerWithDefault(
              transformers.transformResponse
            ),
          }
        : {}),
    };
  }

  const {
    apiKey,
    correlationId,
    idempotencyKey,
    query,
    headers,
  } = options as ProxyRequestOptions;
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
  const idempotencyKeyHeader = idempotencyKey
    ? {
        [BT_IDEMPOTENCY_KEY_HEADER]: idempotencyKey,
      }
    : {};

  return {
    headers: {
      ...apiKeyHeader,
      ...correlationIdHeader,
      ...idempotencyKeyHeader,
      ...(typeof headers !== 'undefined' && { ...headers }),
    },
    ...(typeof query !== 'undefined' && { params: query }),
    ...(transformers?.transformRequest !== undefined
      ? {
          transformRequest: concatRequestTransformerWithDefault(
            transformers.transformRequest
          ),
        }
      : {}),
    ...(transformers?.transformResponse !== undefined
      ? {
          transformResponse: concatResponseTransformerWithDefault(
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

const getQueryParams = <Q>(query: Q = {} as Q): string => {
  const keys = Object.keys(query) as (keyof Q)[];

  if (keys.length) {
    const params = new URLSearchParams();

    const appendSafe = (
      key: string,
      value: unknown,
      isNested = false
    ): void => {
      const type = typeof value;

      const formattedKey = isNested ? key : snakeCase(key);

      // eslint-disable-next-line unicorn/no-null
      if (value === null || ['boolean', 'number', 'string'].includes(type)) {
        params.append(formattedKey, value as string);
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
            `${String(key)}.${objectKey}`,
            ((value as unknown) as Record<string, string>)[objectKey],
            true
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

const appInfoToUserAgentString = (appInfo: ApplicationInfo): string =>
  `(${appInfo.name || ''}; ${appInfo.version || ''}; ${appInfo.url || ''})`;

const buildUserAgentString = (appInfo?: ApplicationInfo): string => {
  let userAgent = `${USER_AGENT_CLIENT}/${process.env.VERSION || 'unknown'}`;

  if (appInfo && Object.keys(appInfo || {}).length) {
    userAgent += ` ${appInfoToUserAgentString(appInfo)}`;
  }

  return userAgent;
};

const getBrowser = (): string => {
  const { userAgent } = window.navigator;

  let version = 'unknown';

  const browser = BROWSER_LIST.find((b) => userAgent.includes(b.browserUA));

  if (browser) {
    try {
      version = userAgent.split(`${browser.browserUA}/`)[1];
    } catch {
      version = 'unknown';
    }
  }

  return `${browser?.browserName || 'unknown'}/${version}`;
};

const getOSVersion = (): string => {
  // node
  if (typeof window === 'undefined') {
    try {
      return `${os.type()}/${os.version()}`;
    } catch {
      return 'unknown';
    }
  }

  // browser
  try {
    const appVersionString = window.navigator.appVersion;
    const osMatch = appVersionString.match(/\(([^)]+)\)/u);

    if (osMatch && osMatch.length > 1) {
      return osMatch[1];
    }

    return 'unknown';
  } catch {
    return 'unknown';
  }
};

const getRuntime = (): string => {
  // node
  if (typeof window === 'undefined') {
    return `NodeJS/${process.version}`;
  }

  // browser
  return getBrowser();
};

const buildClientUserAgentString = (appInfo?: ApplicationInfo): string => {
  const clientUserAgent: ClientUserAgent = {
    client: USER_AGENT_CLIENT,
    clientVersion: process.env.VERSION || 'unknown',
    osVersion: getOSVersion(),
    runtimeVersion: getRuntime(),
    application: {},
  };

  if (appInfo) {
    clientUserAgent.application = appInfo;
  }

  return JSON.stringify(snakecaseKeys(clientUserAgent));
};

export {
  assertInit,
  transformRequestSnakeCase,
  proxyRaw,
  dataAndHeadersExtractor,
  transformReactorRequestSnakeCase,
  transformProxyRequestSnakeCase,
  transformAtomicRequestSnakeCase,
  transformTokenRequestSnakeCase,
  transformTokenResponseCamelCase,
  transformReactorResponseCamelCase,
  transformProxyResponseCamelCase,
  transformResponseCamelCase,
  transformAtomicResponseCamelCase,
  dataExtractor,
  createRequestConfig,
  concatRequestTransformerWithDefault,
  concatResponseTransformerWithDefault,
  errorInterceptor,
  getQueryParams,
  buildUserAgentString,
  buildClientUserAgentString,
  getOSVersion,
  getRuntime,
  getBrowser,
};
