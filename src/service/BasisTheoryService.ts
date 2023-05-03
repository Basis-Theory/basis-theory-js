import axios, { AxiosInstance, AxiosTransformer } from 'axios';
import {
  API_KEY_HEADER,
  CLIENT_USER_AGENT_HEADER,
  USER_AGENT_HEADER,
  errorInterceptor,
  transformRequestSnakeCase,
  transformResponseCamelCase,
  buildUserAgentString,
  buildClientUserAgentString,
} from '@/common';
import { BasisTheoryServiceOptions } from './types';

export abstract class BasisTheoryService<
  T extends BasisTheoryServiceOptions = BasisTheoryServiceOptions
> {
  public readonly client: AxiosInstance;

  public constructor(options: T) {
    const {
      apiKey,
      baseURL,
      transformRequest,
      transformResponse,
      appInfo,
    } = options;

    this.client = axios.create({
      baseURL,
      headers: {
        [API_KEY_HEADER]: apiKey,
        [CLIENT_USER_AGENT_HEADER]: buildClientUserAgentString(appInfo),
        ...(typeof window === 'undefined' && {
          [USER_AGENT_HEADER]: buildUserAgentString(appInfo),
        }),
      },
      /* eslint-disable unicorn/prefer-spread */
      transformRequest: ([] as AxiosTransformer[]).concat(
        transformRequest || transformRequestSnakeCase,
        axios.defaults.transformRequest as AxiosTransformer[]
      ),
      transformResponse: (axios.defaults
        .transformResponse as AxiosTransformer[]).concat(
        transformResponse || transformResponseCamelCase
      ),
      /* eslint-enable unicorn/prefer-spread */
    });
    this.client.interceptors.response.use(undefined, errorInterceptor);
  }
}
