import axios, { AxiosInstance } from 'axios';
import { API_KEY_HEADER, BasisTheoryApiError } from '../common';
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
    });
    this.client.interceptors.response.use(
      (response) => response,
      (error) => {
        const status = error.response?.data.statusCode || -1;
        const data = error.response?.data;

        throw new BasisTheoryApiError(error.message, status, data);
      }
    );
  }
}
