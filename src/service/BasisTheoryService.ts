import axios from 'axios';
import type {
  AxiosInstance,
  AxiosRequestTransformer,
  AxiosResponseTransformer,
} from 'axios';
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

    if (typeof axios === 'string') {
      // known issue with create react app
      // eslint-disable-next-line unicorn/prefer-type-error
      throw new Error(
        'basis-theory-js@1.77.0+ and basis-theory-react@1.12.1+ are not supported with CRA 5, go to https://github.com/Basis-Theory/basis-theory-js/issues/365#issuecomment-1662883062 for workarounds.'
      );
    } else {
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
        transformRequest: ([] as AxiosRequestTransformer[]).concat(
          transformRequest || transformRequestSnakeCase,
          axios.defaults.transformRequest as AxiosRequestTransformer[]
        ),
        transformResponse: (axios.defaults
          .transformResponse as AxiosResponseTransformer[]).concat(
          transformResponse || transformResponseCamelCase
        ),
        /* eslint-enable unicorn/prefer-spread */
      });
      this.client.interceptors.response.use(undefined, errorInterceptor);
    }
  }
}
