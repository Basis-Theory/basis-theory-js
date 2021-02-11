import axios, { AxiosInstance } from 'axios';
import { API_KEY_HEADER } from '../common';
import { BasisTheoryServiceOptions } from './types';

export abstract class BasisTheoryService<
  T extends BasisTheoryServiceOptions = BasisTheoryServiceOptions
> {
  protected readonly client: AxiosInstance;

  constructor(private readonly options: T) {
    const { apiKey, baseURL } = this.options;
    this.client = axios.create({
      baseURL,
      headers: {
        [API_KEY_HEADER]: apiKey,
      },
    });
  }
}
