/* eslint-disable max-classes-per-file, @typescript-eslint/no-shadow */
import {
  CONTENT_TYPE_HEADER,
  createRequestConfig,
  dataExtractor,
  getQueryParams,
} from '@/common';
import type {
  PaginatedList,
  PaginatedQuery,
  RequestOptions,
  Create as ICreate,
  Retrieve as IRetrieve,
  Update as IUpdate,
  Delete as IDelete,
  List as IList,
  Patch as IPatch,
} from '@/types/sdk';
import { BasisTheoryService } from './BasisTheoryService';

/* eslint-disable @typescript-eslint/no-explicit-any */
type BasisTheoryServiceConstructor<
  T extends BasisTheoryService = BasisTheoryService
> = new (...params: any[]) => T;

type ICreateConstructor<T, C> = new (...args: any[]) => ICreate<T, C>;
type IRetrieveConstructor<T> = new (...args: any[]) => IRetrieve<T>;
type IUpdateConstructor<T, U> = new (...args: any[]) => IUpdate<T, U>;
type IPatchConstructor<P> = new (...args: any[]) => IPatch<P>;
type IDeleteConstructor = new (...args: any[]) => IDelete;
type IListConstructor<T, Q extends PaginatedQuery> = new (
  ...args: any[]
) => IList<T, Q>;
/* eslint-enable @typescript-eslint/no-explicit-any */

const Create = <T, C, S extends BasisTheoryServiceConstructor>(Service: S): S =>
  class Create extends Service implements ICreate<T, C> {
    public create(model: C, options?: RequestOptions): Promise<T> {
      return this.client
        .post('/', model, createRequestConfig(options))
        .then(dataExtractor);
    }
  };

const Retrieve = <T, S extends BasisTheoryServiceConstructor>(Service: S): S =>
  class Retrieve extends Service implements IRetrieve<T> {
    public retrieve(id: string, options?: RequestOptions): Promise<T> {
      return this.client
        .get(id, createRequestConfig(options))
        .then(dataExtractor);
    }
  };

const Update = <T, U, S extends BasisTheoryServiceConstructor>(Service: S): S =>
  class Update extends Service implements IUpdate<T, U> {
    public update(id: string, model: U, options?: RequestOptions): Promise<T> {
      return this.client
        .put(id, model, createRequestConfig(options))
        .then(dataExtractor);
    }
  };

const Patch = <P, S extends BasisTheoryServiceConstructor>(Service: S): S =>
  class Patch extends Service implements IPatch<P> {
    public patch(
      id: string,
      model: P,
      options?: RequestOptions
    ): Promise<void> {
      const config = createRequestConfig(options);

      return this.client
        .patch(id, model, {
          ...config,
          headers: {
            ...(config?.headers || {}),
            [CONTENT_TYPE_HEADER]: 'application/merge-patch+json',
          },
        })
        .then(dataExtractor);
    }
  };

const Delete = <S extends BasisTheoryServiceConstructor>(Service: S): S =>
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
): S =>
  class List extends Service implements IList<T, Q> {
    public list(
      query: Q = {} as Q,
      options: RequestOptions = {} as RequestOptions
    ): Promise<PaginatedList<T>> {
      const url = `/${getQueryParams(query)}`;

      return this.client
        .get(url, createRequestConfig(options))
        .then(dataExtractor);
    }
  };

class CrudBuilder<Class extends BasisTheoryServiceConstructor> {
  private BaseService: Class;

  public constructor(baseService: Class) {
    this.BaseService = baseService;
  }

  public create<T, C>(): CrudBuilder<Class & ICreateConstructor<T, C>> {
    // eslint-disable-next-line new-cap
    this.BaseService = Create<T, C, Class>(this.BaseService);

    return (this as unknown) as CrudBuilder<Class & ICreateConstructor<T, C>>;
  }

  public retrieve<T>(): CrudBuilder<Class & IRetrieveConstructor<T>> {
    // eslint-disable-next-line new-cap
    this.BaseService = Retrieve<T, Class>(this.BaseService);

    return (this as unknown) as CrudBuilder<Class & IRetrieveConstructor<T>>;
  }

  public update<T, U>(): CrudBuilder<Class & IUpdateConstructor<T, U>> {
    // eslint-disable-next-line new-cap
    this.BaseService = Update<T, U, Class>(this.BaseService);

    return (this as unknown) as CrudBuilder<Class & IUpdateConstructor<T, U>>;
  }

  public patch<P>(): CrudBuilder<Class & IPatchConstructor<P>> {
    // eslint-disable-next-line new-cap
    this.BaseService = Patch<P, Class>(this.BaseService);

    return (this as unknown) as CrudBuilder<Class & IPatchConstructor<P>>;
  }

  public delete(): CrudBuilder<Class & IDeleteConstructor> {
    // eslint-disable-next-line new-cap
    this.BaseService = Delete<Class>(this.BaseService);

    return (this as unknown) as CrudBuilder<Class & IDeleteConstructor>;
  }

  public list<T, Q extends PaginatedQuery>(): CrudBuilder<
    Class & IListConstructor<T, Q>
  > {
    // eslint-disable-next-line new-cap
    this.BaseService = List<T, Q, Class>(this.BaseService);

    return (this as unknown) as CrudBuilder<Class & IListConstructor<T, Q>>;
  }

  public build(): Class {
    return this.BaseService;
  }
}

export { CrudBuilder };
export type {
  ICreate,
  IRetrieve,
  IUpdate,
  IPatch,
  IDelete,
  IList,
  BasisTheoryServiceConstructor,
};

/* eslint-enable max-classes-per-file, @typescript-eslint/no-shadow */
