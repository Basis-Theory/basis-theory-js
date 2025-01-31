import type {
  AxiosRequestConfig,
  AxiosResponse,
  AxiosRequestTransformer,
  AxiosResponseTransformer,
  AxiosError,
} from 'axios';
import axios from 'axios';
import camelcaseKeys from 'camelcase-keys';
import os from 'os';
import { snakeCase } from 'snake-case';
import snakecaseKeys from 'snakecase-keys';
import type { RequestTransformers } from '@/service';
import type {
  Reactor,
  Proxy,
  Token,
  CreateReactor,
  UpdateReactor,
  CreateProxy,
  UpdateProxy,
  Primitive,
} from '@/types/models';
import type {
  ApplicationInfo,
  ClientUserAgent,
  PaginatedList,
  ProxyRequestOptions,
  RequestOptions,
} from '@/types/sdk';
import { BasisTheoryApiError } from './BasisTheoryApiError';
import {
  API_KEY_HEADER,
  BROWSER_LIST,
  BT_IDEMPOTENCY_KEY_HEADER,
  BT_TRACE_ID_HEADER,
  CF_RAY_HEADER,
  CLIENT_USER_AGENT_HEADER,
  USER_AGENT_CLIENT,
} from './constants';
import { logger } from './logging';

const assertInit = <T>(prop: T): NonNullable<T> => {
  if (prop === null || prop === undefined) {
    throw new Error('BasisTheory has not yet been properly initialized.');
  }

  return prop as NonNullable<T>;
};

const transformRequestSnakeCase = <T, S>(data: T): S | undefined => {
  if (typeof data === 'undefined') {
    return undefined;
  }

  return snakecaseKeys(data as Record<string, unknown>, {
    deep: true,
  }) as S;
};

const proxyRaw = <T>(data: T): T | undefined => data;

const transformReactorRequestSnakeCase = (
  reactor: Reactor | CreateReactor | UpdateReactor
): Reactor | CreateReactor | UpdateReactor | undefined => {
  if (typeof reactor === 'undefined') {
    return undefined;
  }

  return {
    ...snakecaseKeys(reactor, { deep: true }),
    ...(reactor.configuration !== undefined
      ? { configuration: reactor.configuration }
      : {}),
  } as Reactor | CreateReactor | UpdateReactor;
};

const transformProxyRequestSnakeCase = (
  proxy: Proxy | CreateProxy | UpdateProxy
): Proxy | CreateProxy | UpdateProxy | undefined => {
  if (typeof proxy === 'undefined') {
    return undefined;
  }

  return {
    ...snakecaseKeys(proxy, { deep: true }),
    ...(proxy.configuration !== undefined
      ? { configuration: proxy.configuration }
      : {}),
  } as Proxy | CreateProxy | UpdateProxy;
};

type TokenLike<DataType> = Partial<Token<DataType>> & Record<string, unknown>;

const transformTokenRequestSnakeCase = <DataType = Primitive>(
  payload: TokenLike<DataType>
): TokenLike<DataType> | undefined => {
  if (typeof payload === 'undefined') {
    return undefined;
  }

  return {
    ...snakecaseKeys(payload, { deep: true }),
    ...(payload.data !== undefined ? { data: payload.data } : {}),
    ...(payload.metadata !== undefined ? { metadata: payload.metadata } : {}),
  } as TokenLike<DataType>;
};

const isList = <T>(arg: unknown): arg is PaginatedList<T> =>
  (arg as PaginatedList<T>) &&
  (arg as PaginatedList<T>)?.pagination !== undefined &&
  (arg as PaginatedList<T>)?.data !== undefined;

const transformTokenResponseCamelCase = <DataType = Primitive>(
  tokenResponse: TokenLike<DataType> | PaginatedList<Token> | undefined
): TokenLike<DataType> | PaginatedList<Token> | undefined => {
  if (typeof tokenResponse === 'undefined') {
    return undefined;
  }

  if (isList<Token>(tokenResponse)) {
    const transformedData = tokenResponse.data.map((t: Token) => ({
      ...camelcaseKeys(t, { deep: true }),
      ...(t.data !== undefined ? { data: t.data } : {}),
      ...(t.metadata !== undefined ? { metadata: t.metadata } : {}),
    }));

    const transformedToken = {
      data: transformedData,
      pagination: camelcaseKeys(tokenResponse.pagination, { deep: true }),
    };

    return transformedToken;
  }

  return {
    ...camelcaseKeys(tokenResponse, { deep: true }),
    ...(tokenResponse.data !== undefined ? { data: tokenResponse.data } : {}),
    ...(tokenResponse.metadata !== undefined
      ? { metadata: tokenResponse.metadata }
      : {}),
  } as TokenLike<DataType>;
};

const transformReactorResponseCamelCase = (
  reactorResponse: Reactor | PaginatedList<Reactor> | undefined
): Reactor | PaginatedList<Reactor> | undefined => {
  if (typeof reactorResponse === 'undefined') {
    return undefined;
  }

  if (isList<Reactor>(reactorResponse)) {
    const transformedData = reactorResponse.data.map((r: Reactor) => ({
      ...camelcaseKeys(r, { deep: true }),
      ...(r.configuration !== undefined
        ? { configuration: r.configuration }
        : {}),
    }));

    const transformedReactor = {
      data: transformedData,
      pagination: camelcaseKeys(reactorResponse.pagination, { deep: true }),
    };

    return transformedReactor;
  }

  return {
    ...camelcaseKeys(reactorResponse, { deep: true }),
    ...(reactorResponse.configuration !== undefined
      ? { configuration: reactorResponse.configuration }
      : {}),
  } as Reactor;
};

const transformProxyResponseCamelCase = (
  proxyResponse: Proxy | PaginatedList<Proxy> | undefined
): Proxy | PaginatedList<Proxy> | undefined => {
  if (typeof proxyResponse === 'undefined') {
    return undefined;
  }

  if (isList<Proxy>(proxyResponse)) {
    const transformedData = proxyResponse.data.map((p: Proxy) => ({
      ...camelcaseKeys(p, { deep: true }),
      ...(p.configuration !== undefined
        ? { configuration: p.configuration }
        : {}),
    }));

    const transformedReactor = {
      data: transformedData,
      pagination: camelcaseKeys(proxyResponse.pagination, { deep: true }),
    };

    return transformedReactor;
  }

  return {
    ...camelcaseKeys(proxyResponse, { deep: true }),
    ...(proxyResponse.configuration !== undefined
      ? { configuration: proxyResponse.configuration }
      : {}),
  } as Proxy;
};

const transformResponseCamelCase = <T, C>(data: T): C | undefined => {
  if (typeof data === 'undefined') {
    return undefined;
  }

  return (camelcaseKeys(data as Record<string, unknown>, {
    deep: true,
  }) as unknown) as C;
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
  requestTransformer: AxiosRequestTransformer | AxiosRequestTransformer[]
): AxiosRequestTransformer | AxiosRequestTransformer[] | undefined => [
  ...([] as AxiosRequestTransformer[]),
  ...([requestTransformer] as AxiosRequestTransformer[]),
  ...(axios.defaults.transformRequest as AxiosRequestTransformer[]),
];

const concatResponseTransformerWithDefault = (
  responseTransformer: AxiosResponseTransformer | AxiosResponseTransformer[]
): AxiosResponseTransformer | AxiosResponseTransformer[] | undefined => [
  ...(axios.defaults.transformResponse as AxiosResponseTransformer[]),
  ...([responseTransformer] as AxiosResponseTransformer[]),
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

const errorInterceptor = (error: AxiosError): void => {
  const status = error.response?.status ?? -1;
  const data = error.response?.data;

  const logSeverity = status > -1 && status < 499 ? 'warn' : 'error';

  logger.log[logSeverity](
    `Error when making ${error?.config?.method?.toUpperCase()} request to ${
      error?.config?.baseURL
    } from the JS SDK`,
    {
      apiStatus: status,
      logType: 'axiosError',
      logOrigin: 'axiosErrorInterceptor',
      requestDetails: {
        url: error?.config?.baseURL,
        method: error?.config?.method?.toUpperCase(),
        btUserAgent: error?.config?.headers?.[CLIENT_USER_AGENT_HEADER],
      },
      errorDetails: {
        code: error?.code,
        name: error?.name,
        stack: error?.stack,
        headers: error?.response?.headers,
        message: error?.message,
        status: error?.response?.status,
        statusText: error?.response?.statusText,
        data: error?.response?.data,
      },
    }
  );

  throw new BasisTheoryApiError(error.message, status, data);
};

const getQueryParams = <Q>(query: Q = {} as Q): string => {
  const keys = Object.keys(query as Record<string, unknown>) as (keyof Q)[];

  if (keys.length) {
    const params = new URLSearchParams();

    const appendSafe = (
      key: string,
      value: unknown,
      isNested = false
    ): void => {
      const type = typeof value;

      const formattedKey = isNested ? key : snakeCase(key);

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

// the following product property is deprecated but it's the only way
// I've found to detect react-native
const isEnvReactNative = (): boolean =>
  typeof window === 'object' && window.navigator.product === 'ReactNative';

const getOSVersion = (): string => {
  // react-native
  if (isEnvReactNative()) {
    return 'ReactNative';
  }

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
  // react-native
  if (isEnvReactNative()) {
    return 'ReactNative';
  }

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

const debugTransform: AxiosResponseTransformer = (data, headers) => {
  if (headers && typeof data === 'object' && data !== undefined) {
    // we are deliberately mutating the data object here to include the debug headers
    // eslint-disable-next-line no-param-reassign
    data._debug = {
      ...data._debug,
      cfRay: headers[CF_RAY_HEADER],
      btTraceId: headers[BT_TRACE_ID_HEADER],
    };
  }

  return data;
};

export {
  assertInit,
  transformRequestSnakeCase,
  proxyRaw,
  dataAndHeadersExtractor,
  transformReactorRequestSnakeCase,
  transformProxyRequestSnakeCase,
  transformTokenRequestSnakeCase,
  transformTokenResponseCamelCase,
  transformReactorResponseCamelCase,
  transformProxyResponseCamelCase,
  transformResponseCamelCase,
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
  debugTransform,
};
