interface RequestOptions {
  apiKey?: string;
  correlationId?: string;
  idempotencyKey?: string;
}

type QueryValue =
  | boolean
  | number
  | string
  | null
  | undefined
  | Record<string, string>
  | (number | string)[];

interface PaginatedQuery {
  [key: string]: QueryValue;
  [key: number]: QueryValue;
  page?: number;
  size?: number;
  start?: string;
}
interface PaginatedList<T> {
  pagination: {
    totalItems?: number;
    pageNumber?: number;
    pageSize: number;
    totalPages?: number;
    after?: string;
  };
  data: T[];
}

type Create<T, C> = {
  create(model: C, options?: RequestOptions): Promise<T>;
};

type Retrieve<T> = {
  retrieve(id: string, options?: RequestOptions): Promise<T>;
};

type Update<T, U> = {
  update(id: string, model: U, options?: RequestOptions): Promise<T>;
};

type Patch<P> = {
  patch(id: string, model: P, options?: RequestOptions): Promise<void>;
};

type Delete = {
  delete(id: string, options?: RequestOptions): Promise<void>;
};

type List<T, Q extends PaginatedQuery = PaginatedQuery> = {
  list(query?: Q, options?: RequestOptions): Promise<PaginatedList<T>>;
};

export type {
  RequestOptions,
  PaginatedQuery,
  PaginatedList,
  Create,
  Retrieve,
  Update,
  Delete,
  List,
  Patch,
};
