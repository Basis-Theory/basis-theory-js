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
    const { apiKey, baseURL } = options;
    this.client = axios.create({
      baseURL,
      headers: {
        [API_KEY_HEADER]: apiKey,
      },
      transformRequest: ([] as AxiosTransformer[]).concat(
        options.transformRequest || transformRequestSnakeCase,
        axios.defaults.transformRequest as AxiosTransformer[]
      ),
      transformResponse: (axios.defaults
        .transformResponse as AxiosTransformer[]).concat(
        options.transformResponse || transformResponseCamelCase
      ),
    });
    this.client.interceptors.response.use(undefined, errorInterceptor);
  }
}
