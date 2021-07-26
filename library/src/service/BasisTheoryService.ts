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
  protected readonly client: AxiosInstance;

  public constructor(private readonly options: T) {
    const { apiKey, baseURL } = this.options;
    this.client = axios.create({
      baseURL,
      headers: {
        [API_KEY_HEADER]: apiKey,
      },
      transformRequest: [
        ...(options.transformRequest
          ? Array.isArray(options.transformRequest)
            ? (options.transformRequest as AxiosTransformer[])
            : [options.transformRequest]
          : [transformRequestSnakeCase]),
        ...(axios.defaults.transformRequest as AxiosTransformer[]),
      ],
      transformResponse: [
        ...(axios.defaults.transformResponse as AxiosTransformer[]),
        ...(options.transformResponse
          ? Array.isArray(options.transformResponse)
            ? (options.transformResponse as AxiosTransformer[])
            : [options.transformResponse]
          : [transformResponseCamelCase]),
      ],
    });
    this.client.interceptors.response.use(undefined, errorInterceptor);
  }
}
