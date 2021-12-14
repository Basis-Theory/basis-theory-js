/* eslint-disable max-classes-per-file, @typescript-eslint/no-shadow */
import type {
  PaginatedList,
  PaginatedQuery,
  RequestOptions,
  Create as ICreate,
  Retrieve as IRetrieve,
  Update as IUpdate,
  Delete as IDelete,
  List as IList,
} from '@basis-theory/basis-theory-elements-interfaces/sdk';
import { createRequestConfig, dataExtractor, getQueryParams } from '../common';
import { BasisTheoryService } from './BasisTheoryService';

/* eslint-disable @typescript-eslint/no-explicit-any */
type BasisTheoryServiceConstructor<
  T extends BasisTheoryService = BasisTheoryService
> = new (...params: any[]) => T;

type ICreateConstructor<T, C> = new (...args: any[]) => ICreate<T, C>;
type IRetrieveConstructor<T> = new (...args: any[]) => IRetrieve<T>;
type IUpdateConstructor<T, U> = new (...args: any[]) => IUpdate<T, U>;
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
export type { ICreate, IRetrieve, IUpdate, IDelete, IList };

/* eslint-enable max-classes-per-file, @typescript-eslint/no-shadow */
