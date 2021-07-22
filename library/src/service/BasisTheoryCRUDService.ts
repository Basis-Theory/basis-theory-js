import { BasisTheoryService } from './BasisTheoryService';
import type {
  CRUD,
  PaginatedList,
  PaginatedQuery,
  RequestOptions,
} from './types';
import { createRequestConfig, dataExtractor } from '../common';

export abstract class BasisTheoryCRUDService<T, C, U, Q = PaginatedQuery>
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

  public list(query?: Q, options?: RequestOptions): Promise<PaginatedList<T>> {
    return this.client
      .get('/', createRequestConfig(options))
      .then(dataExtractor);
  }
}
