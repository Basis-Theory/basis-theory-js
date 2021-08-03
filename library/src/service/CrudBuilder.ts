/* eslint-disable @typescript-eslint/explicit-function-return-type,@typescript-eslint/no-explicit-any */
import { BasisTheoryService } from './BasisTheoryService';
import type { RequestOptions } from './types';
import { createRequestConfig, dataExtractor } from '../common';
import type { PaginatedList, PaginatedQuery } from './types';
import { snakeCase } from 'snake-case';

type BasisTheoryServiceConstructor<
  T extends BasisTheoryService = BasisTheoryService
> = new (...params: any[]) => T;

export type ICreate<T, C> = {
  create(model: C, options?: RequestOptions): Promise<T>;
};

export type IRetrieve<T> = {
  retrieve(id: string, options?: RequestOptions): Promise<T>;
};

export type IUpdate<T, U> = {
  update(id: string, model: U, options?: RequestOptions): Promise<T>;
};

export type IDelete = {
  delete(id: string, options?: RequestOptions): Promise<void>;
};

export type IList<T, Q extends PaginatedQuery> = {
  list(query?: Q, options?: RequestOptions): Promise<PaginatedList<T>>;
};

type ICreateConstructor<T, C> = new (...args: any[]) => ICreate<T, C>;
type IRetrieveConstructor<T> = new (...args: any[]) => IRetrieve<T>;
type IUpdateConstructor<T, U> = new (...args: any[]) => IUpdate<T, U>;
type IDeleteConstructor = new (...args: any[]) => IDelete;
type IListConstructor<T, Q extends PaginatedQuery> = new (
  ...args: any[]
) => IList<T, Q>;

const Create = <T, C, S extends BasisTheoryServiceConstructor>(Service: S) =>
  class Create extends Service implements ICreate<T, C> {
    public create(model: C, options?: RequestOptions): Promise<T> {
      return this.client
        .post('/', model, createRequestConfig(options))
        .then(dataExtractor);
    }
  };

const Retrieve = <T, S extends BasisTheoryServiceConstructor>(Service: S) =>
  class Retrieve extends Service implements IRetrieve<T> {
    public retrieve(id: string, options?: RequestOptions): Promise<T> {
      return this.client
        .get(id, createRequestConfig(options))
        .then(dataExtractor);
    }
  };

const Update = <T, U, S extends BasisTheoryServiceConstructor>(Service: S) =>
  class Update extends Service implements IUpdate<T, U> {
    public update(id: string, model: U, options?: RequestOptions): Promise<T> {
      return this.client
        .put(id, model, createRequestConfig(options))
        .then(dataExtractor);
    }
  };

const Delete = <S extends BasisTheoryServiceConstructor>(Service: S) =>
  class Delete extends Service implements IDelete {
    public async delete(id: string, options?: RequestOptions): Promise<void> {
      await this.client.delete(id, createRequestConfig(options));
    }
  };

const List = <
  T,
  Q extends PaginatedQuery,
  S extends BasisTheoryServiceConstructor
>(
  Service: S
) =>
  class List extends Service implements IList<T, Q> {
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
          if (
            value === null ||
            ['boolean', 'number', 'string'].includes(type)
          ) {
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
  };

export class CrudBuilder<Class extends BasisTheoryServiceConstructor> {
  public constructor(private BaseService: Class) {}

  public create<T, C>(): CrudBuilder<Class & ICreateConstructor<T, C>> {
    this.BaseService = Create<T, C, Class>(this.BaseService);
    return (this as unknown) as CrudBuilder<Class & ICreateConstructor<T, C>>;
  }

  public retrieve<T>(): CrudBuilder<Class & IRetrieveConstructor<T>> {
    this.BaseService = Retrieve<T, Class>(this.BaseService);
    return (this as unknown) as CrudBuilder<Class & IRetrieveConstructor<T>>;
  }

  public update<T, U>(): CrudBuilder<Class & IUpdateConstructor<T, U>> {
    this.BaseService = Update<T, U, Class>(this.BaseService);
    return (this as unknown) as CrudBuilder<Class & IUpdateConstructor<T, U>>;
  }

  public delete(): CrudBuilder<Class & IDeleteConstructor> {
    this.BaseService = Delete<Class>(this.BaseService);
    return (this as unknown) as CrudBuilder<Class & IDeleteConstructor>;
  }

  public list<T, Q extends PaginatedQuery>(): CrudBuilder<
    Class & IListConstructor<T, Q>
  > {
    this.BaseService = List<T, Q, Class>(this.BaseService);
    return (this as unknown) as CrudBuilder<Class & IListConstructor<T, Q>>;
  }

  public build(): Class {
    return this.BaseService;
  }
}
