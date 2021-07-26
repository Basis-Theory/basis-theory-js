import { BasisTheoryService } from './BasisTheoryService';
import type {
  CRUD,
  PaginatedList,
  PaginatedQuery,
  RequestOptions,
} from './types';
import { createRequestConfig, dataExtractor } from '../common';
import snakecaseKeys from 'snakecase-keys';
import { snakeCase } from 'snake-case';

export abstract class BasisTheoryCRUDService<
    T,
    C,
    U,
    Q extends PaginatedQuery = PaginatedQuery
  >
  extends BasisTheoryService
  implements CRUD<T, C, U, Q> {
  public create(application: C, options?: RequestOptions): Promise<T> {
    return this.client
      .post('/', application, createRequestConfig(options))
      .then(dataExtractor);
  }

  public retrieve(id: string, options?: RequestOptions): Promise<T> {
    return this.client
      .get(id, createRequestConfig(options))
      .then(dataExtractor);
  }

  public update(
    id: string,
    application: U,
    options?: RequestOptions
  ): Promise<T> {
    return this.client
      .put(id, application, createRequestConfig(options))
      .then(dataExtractor);
  }

  public delete(id: string, options?: RequestOptions): Promise<T> {
    return this.client
      .delete(id, createRequestConfig(options))
      .then(dataExtractor);
  }

  public list(
    query: Q = {} as Q,
    options?: RequestOptions
  ): Promise<PaginatedList<T>> {
    let url = '/';

    const keys = Object.keys(query) as (keyof Q)[];

    if (keys.length > 0) {
      const params = new URLSearchParams();

      const appendSafe = (key: string, value: unknown): void => {
        const type = typeof value;
        if (value === null || ['boolean', 'number', 'string'].includes(type)) {
          params.append(snakeCase(key), value as string);
        }
      };

      keys.forEach((key) => {
        const value = query[key];

        if (Array.isArray(value)) {
          value.forEach((aValue) => {
            appendSafe(String(key), aValue);
          });
        } else {
          appendSafe(String(key), value);
        }
      });
      url += `?${params.toString()}`;
    }

    return this.client
      .get(url, createRequestConfig(options))
      .then(dataExtractor);
  }
}
