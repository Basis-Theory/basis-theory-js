import axios, { AxiosInstance, AxiosTransformer } from 'axios';
import {
  API_KEY_HEADER,
  errorInterceptor,
  transformRequestSnakeCase,
  transformResponseCamelCase,
} from '../common';
import { BasisTheoryServiceOptions } from './types';

export abstract class BasisTheoryService<
  T extends BasisTheoryServiceOptions = BasisTheoryServiceOptions
> {
  public readonly client: AxiosInstance;

  public constructor(options: T) {
    const { apiKey, baseURL, transformRequest, transformResponse } = options;

    this.client = axios.create({
      baseURL,
      headers: {
        [API_KEY_HEADER]: apiKey,
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
