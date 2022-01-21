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
import os from 'os';
import { snakeCase } from 'snake-case';
import snakecaseKeys from 'snakecase-keys';
import { RequestTransformers } from '../service';
import { ApplicationInfo, ClientUserAgent } from '../types';
import { BasisTheoryApiError } from './BasisTheoryApiError';
import {
  API_KEY_HEADER,
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
            `${key}.${objectKey}`,
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
  `${appInfo.name ? appInfo.name : ''}; ${
    appInfo.version ? appInfo.version : ''
  }; ${appInfo.url ? appInfo.url : ''})`;

const buildUserAgentString = (appInfo?: ApplicationInfo): string => {
  let userAgent = `${USER_AGENT_CLIENT}/{'version'}`;

  if (appInfo && Object.keys(appInfo).length !== 0) {
    userAgent += ` ${appInfoToUserAgentString(appInfo)}`;
  }

  return userAgent;
};

const getBrowser = (): string => {
  const { userAgent } = window.navigator;
  let browserUA;
  let browser = 'unknown';
  let version;

  if (userAgent.includes('Firefox')) {
    browser = 'Firefox';
    browserUA = 'Firefox';
  } else if (userAgent.includes('SamsungBrowser')) {
    browser = 'SamsungBrowser';
    browserUA = 'SamsungBrowser';
  } else if (userAgent.includes('Opera')) {
    browser = 'Opera';
    browserUA = 'Opera';
  } else if (userAgent.includes('OPR')) {
    browser = 'Opera';
    browserUA = 'OPR';
  } else if (userAgent.includes('Trident')) {
    browser = 'Microsoft Internet Explorer';
    browserUA = 'Trident';
  } else if (userAgent.includes('Edge')) {
    browser = 'Microsoft Edge (Legacy)';
    browserUA = 'Edge';
  } else if (userAgent.includes('Edg')) {
    browser = 'Microsoft Edge (Chromium)';
    browserUA = 'Edg';
  } else if (userAgent.includes('Chrome')) {
    browser = 'Google Chrome/Chromium';
    browserUA = 'Edg';
  } else if (userAgent.includes('Safari')) {
    browser = 'Safari';
    browserUA = 'Safari';
  }

  try {
    version = userAgent.split(`${browserUA}/`)[1];
  } catch {
    version = 'unknown';
  }

  return `${browser}/${version}`;
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
    clientVersion: 'meme',
    osVersion: getOSVersion(),
    runtimeVersion: getRuntime(),
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
  buildUserAgentString,
  buildClientUserAgentString,
};
