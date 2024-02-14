import MockAdapter from 'axios-mock-adapter';
import { Chance } from 'chance';
import {
  API_KEY_HEADER,
  BT_IDEMPOTENCY_KEY_HEADER,
  BT_TRACE_ID_HEADER,
  CONTENT_TYPE_HEADER,
  transformRequestSnakeCase,
} from '@/common';
import { BasisTheoryServiceOptions } from '@/service';
import {
  BasisTheoryServiceConstructor,
  CrudBuilder,
  ICreate,
  IDelete,
  IList,
  IRetrieve,
  IUpdate,
  IPatch,
} from '@/service/CrudBuilder';
import type { BasisTheoryElementsInternal } from '@/types/elements';
import type {
  Create,
  PaginatedList,
  PaginatedQuery,
  Tokenize,
  ApplicationInfo,
} from '@/types/sdk';

const describeif = (condition: boolean): typeof describe =>
  condition ? describe : describe.skip;

// eslint-disable-next-line @typescript-eslint/no-explicit-any, @typescript-eslint/explicit-module-boundary-types
const mockServiceClient = (service: any): MockAdapter =>
  new MockAdapter(service.client);

const errorStatus = (): number =>
  new Chance().integer({
    min: 400,
    max: 599,
  });

const expectBasisTheoryApiError = <T>(
  promise: Promise<T>,
  status: number
): Promise<void> =>
  expect(promise).rejects.toMatchObject({
    name: 'BasisTheoryApiError',
    status,
  });

type TestParam<S> = {
  service: S;
  client: MockAdapter;
};

type TestCreateParam<T, C> = TestParam<ICreate<T, C>> & {
  createPayload: C;
  /**
   * @default snake case transformed {@link createPayload}
   */
  transformedCreatePayload?: unknown;
};

type TestUpdateParam<T, U> = TestParam<IUpdate<T, U>> & {
  updatePayload: U;
  /**
   * @default snake case transformed {@link updatePayload}
   */
  transformedUpdatePayload?: unknown;
};

type TestPatchParam<P> = TestParam<IPatch<P>> & {
  patchPayload: P;
  /**
   * @default snake case transformed {@link patchPayload}
   */
  transformedPatchPayload?: unknown;
};

type TestRetrieveParam<T> = TestParam<IRetrieve<T>>;

type TestDeleteParam = TestParam<IDelete>;

type TestListParam<T> = TestParam<IList<T, PaginatedQuery>>;

const testCreate = <T, C>(param: () => TestCreateParam<T, C>): void => {
  const chance = new Chance();
  const correlationId = chance.string();
  const apiKey = chance.string();
  const idempotencyKey = chance.string();

  test('should create', async () => {
    const {
      service,
      client,
      createPayload,
      transformedCreatePayload = transformRequestSnakeCase(createPayload),
    } = param();
    const createdAt = chance.string();

    client.onPost('/').reply(
      201,
      JSON.stringify({
        ...(transformedCreatePayload as C),

        created_at: createdAt,
      })
    );

    expect(await service.create(createPayload)).toStrictEqual({
      ...createPayload,
      createdAt,
    });

    expect(client.history.post).toHaveLength(1);
    expect(client.history.post[0].data).toStrictEqual(
      JSON.stringify(transformedCreatePayload)
    );
    expect(client.history.post[0].headers).toMatchObject({
      [API_KEY_HEADER]: expect.any(String),
    });
  });

  test('should create with options', async () => {
    const {
      service,
      client,
      createPayload,
      transformedCreatePayload = transformRequestSnakeCase(createPayload),
    } = param();
    const createdAt = chance.string();

    client.onPost('/').reply(
      201,
      JSON.stringify({
        ...(transformedCreatePayload as C),

        created_at: createdAt,
      })
    );

    expect(
      await service.create(createPayload, {
        apiKey,
        correlationId,
        idempotencyKey,
      })
    ).toStrictEqual({
      ...createPayload,
      createdAt,
    });

    expect(client.history.post).toHaveLength(1);
    expect(client.history.post[0].data).toStrictEqual(
      JSON.stringify(transformedCreatePayload)
    );
    expect(client.history.post[0].headers).toMatchObject({
      [API_KEY_HEADER]: apiKey,
      [BT_TRACE_ID_HEADER]: correlationId,
      [BT_IDEMPOTENCY_KEY_HEADER]: idempotencyKey,
    });
  });

  test('should reject with status >= 400 <= 599', async () => {
    const { service, client, createPayload } = param();
    const status = errorStatus();

    client.onPost('/').reply(status);

    const promise = service.create(createPayload);

    await expectBasisTheoryApiError(promise, status);
  });
};

const testRetrieve = <T>(param: () => TestRetrieveParam<T>): void => {
  const chance = new Chance();
  const id = chance.string();
  const correlationId = chance.string();
  const apiKey = chance.string();
  const idempotencyKey = chance.string();

  test('should retrieve', async () => {
    const { service, client } = param();
    const createdAt = chance.string();

    client.onGet(id).reply(
      200,
      JSON.stringify({
        id,
        created_at: createdAt,
      })
    );

    expect(await service.retrieve(id)).toStrictEqual({
      id,
      createdAt,
    });
    expect(client.history.get).toHaveLength(1);
    expect(client.history.get[0].headers).toMatchObject({
      [API_KEY_HEADER]: expect.any(String),
    });
  });

  test('should retrieve with options', async () => {
    const { service, client } = param();
    const createdAt = chance.string();

    client.onGet(id).reply(
      200,
      JSON.stringify({
        id,

        created_at: createdAt,
      })
    );

    expect(
      await service.retrieve(id, {
        apiKey,
        correlationId,
        idempotencyKey,
      })
    ).toStrictEqual({
      id,
      createdAt,
    });
    expect(client.history.get).toHaveLength(1);
    expect(client.history.get[0].headers).toMatchObject({
      [API_KEY_HEADER]: apiKey,
      [BT_TRACE_ID_HEADER]: correlationId,
      [BT_IDEMPOTENCY_KEY_HEADER]: idempotencyKey,
    });
  });

  // eslint-disable-next-line jest/no-identical-title
  test('should reject with status >= 400 <= 599', async () => {
    const { service, client } = param();
    const status = errorStatus();

    client.onGet(id).reply(status);

    const promise = service.retrieve(id);

    await expectBasisTheoryApiError(promise, status);
  });
};

const testUpdate = <T, U>(param: () => TestUpdateParam<T, U>): void => {
  const chance = new Chance();
  const id = chance.string();
  const correlationId = chance.string();
  const apiKey = chance.string();
  const idempotencyKey = chance.string();

  test('should update', async () => {
    const {
      service,
      client,
      updatePayload,
      transformedUpdatePayload = transformRequestSnakeCase(updatePayload),
    } = param();
    const updatedAt = chance.string();

    client.onPut(id).reply(
      200,
      JSON.stringify({
        ...(transformedUpdatePayload as U),
        // eslint-disable-next-line camelcase
        updated_at: updatedAt,
      })
    );

    expect(await service.update(id, updatePayload)).toStrictEqual({
      ...updatePayload,
      updatedAt,
    });
    expect(client.history.put).toHaveLength(1);
    expect(client.history.put[0].data).toStrictEqual(
      JSON.stringify(transformedUpdatePayload)
    );
    expect(client.history.put[0].headers).toMatchObject({
      [API_KEY_HEADER]: expect.any(String),
    });
  });

  test('should update with options', async () => {
    const {
      service,
      client,
      updatePayload,
      transformedUpdatePayload = transformRequestSnakeCase(updatePayload),
    } = param();
    const updatedAt = chance.string();

    client.onPut(id).reply(
      200,
      JSON.stringify({
        ...(transformedUpdatePayload as U),
        // eslint-disable-next-line camelcase
        updated_at: updatedAt,
      })
    );

    expect(
      await service.update(id, updatePayload, {
        apiKey,
        correlationId,
        idempotencyKey,
      })
    ).toStrictEqual({
      ...updatePayload,
      updatedAt,
    });
    expect(client.history.put).toHaveLength(1);
    expect(client.history.put[0].data).toStrictEqual(
      JSON.stringify(transformedUpdatePayload)
    );
    expect(client.history.put[0].headers).toMatchObject({
      [API_KEY_HEADER]: apiKey,
      [BT_TRACE_ID_HEADER]: correlationId,
      [BT_IDEMPOTENCY_KEY_HEADER]: idempotencyKey,
    });
  });

  // eslint-disable-next-line jest/no-identical-title
  test('should reject with status >= 400 <= 599', async () => {
    const { service, client, updatePayload } = param();
    const status = errorStatus();

    client.onPut(id).reply(status);

    const promise = service.update(id, updatePayload);

    await expectBasisTheoryApiError(promise, status);
  });
};

const testPatch = <P>(param: () => TestPatchParam<P>): void => {
  const chance = new Chance();
  const id = chance.string();
  const correlationId = chance.string();
  const apiKey = chance.string();
  const idempotencyKey = chance.string();
  const expectedContentType = 'application/merge-patch+json';

  test('should patch', async () => {
    const {
      service,
      client,
      patchPayload,
      transformedPatchPayload = transformRequestSnakeCase(patchPayload),
    } = param();
    const updatedAt = chance.string();

    client.onPatch(id).reply(
      200,
      JSON.stringify({
        ...(transformedPatchPayload as P),
        // eslint-disable-next-line camelcase
        updated_at: updatedAt,
      })
    );

    expect(await service.patch(id, patchPayload)).toStrictEqual({
      ...patchPayload,
      updatedAt,
    });
    expect(client.history.patch).toHaveLength(1);
    expect(client.history.patch[0].data).toStrictEqual(
      JSON.stringify(transformedPatchPayload)
    );
    expect(client.history.patch[0].headers).toMatchObject({
      [API_KEY_HEADER]: expect.any(String),
      [CONTENT_TYPE_HEADER]: expectedContentType,
    });
  });

  test('should patch with options', async () => {
    const {
      service,
      client,
      patchPayload,
      transformedPatchPayload = transformRequestSnakeCase(patchPayload),
    } = param();
    const updatedAt = chance.string();

    client.onPatch(id).reply(
      200,
      JSON.stringify({
        ...(transformedPatchPayload as P),
        // eslint-disable-next-line camelcase
        updated_at: updatedAt,
      })
    );

    expect(
      await service.patch(id, patchPayload, {
        apiKey,
        correlationId,
        idempotencyKey,
      })
    ).toStrictEqual({
      ...patchPayload,
      updatedAt,
    });
    expect(client.history.patch).toHaveLength(1);
    expect(client.history.patch[0].data).toStrictEqual(
      JSON.stringify(transformedPatchPayload)
    );
    expect(client.history.patch[0].headers).toMatchObject({
      [API_KEY_HEADER]: apiKey,
      [CONTENT_TYPE_HEADER]: expectedContentType,
      [BT_TRACE_ID_HEADER]: correlationId,
      [BT_IDEMPOTENCY_KEY_HEADER]: idempotencyKey,
    });
  });

  // eslint-disable-next-line jest/no-identical-title
  test('should reject with status >= 400 <= 599', async () => {
    const { service, client, patchPayload } = param();
    const status = errorStatus();

    client.onPatch(id).reply(status);

    const promise = service.patch(id, patchPayload);

    await expectBasisTheoryApiError(promise, status);
  });
};
const testDelete = (param: () => TestDeleteParam): void => {
  const chance = new Chance();
  const id = chance.string();
  const correlationId = chance.string();
  const apiKey = chance.string();
  const idempotencyKey = chance.string();

  test('should delete', async () => {
    const { service, client } = param();
    const createdAt = chance.string();

    client.onDelete(id).reply(204, {
      id,

      created_at: createdAt,
    });

    expect(await service.delete(id)).toBeUndefined();
    expect(client.history.delete).toHaveLength(1);
    expect(client.history.delete[0].headers).toMatchObject({
      [API_KEY_HEADER]: expect.any(String),
    });
  });

  test('should delete with options', async () => {
    const { service, client } = param();
    const createdAt = chance.string();

    client.onDelete(id).reply(204, {
      id,

      created_at: createdAt,
    });

    expect(
      await service.delete(id, {
        apiKey,
        correlationId,
        idempotencyKey,
      })
    ).toBeUndefined();
    expect(client.history.delete).toHaveLength(1);
    expect(client.history.delete[0].headers).toMatchObject({
      [API_KEY_HEADER]: apiKey,
      [BT_TRACE_ID_HEADER]: correlationId,
      [BT_IDEMPOTENCY_KEY_HEADER]: idempotencyKey,
    });
  });

  // eslint-disable-next-line jest/no-identical-title
  test('should reject with status >= 400 <= 599', async () => {
    const { service, client } = param();
    const status = errorStatus();

    client.onDelete(id).reply(status);

    const promise = service.delete(id);

    await expectBasisTheoryApiError(promise, status);
  });
};

const testList = <T>(param: () => TestListParam<T>): void => {
  const chance = new Chance();
  const correlationId = chance.string();
  const apiKey = chance.string();
  const idempotencyKey = chance.string();
  const totalItems = chance.integer();
  const pageNumber = chance.integer();
  const pageSize = chance.integer();
  const totalPages = chance.integer();
  const page = chance.integer();
  const size = chance.integer();
  const query = {
    page,
    size,
    nul: null,
    und: undefined,
    camelCase: chance.string({
      alpha: true,
      numeric: true,
    }),
    bool: chance.bool(),
    int: chance.integer(),
    float: chance.floating(),
    str: chance.string({
      alpha: true,
      numeric: true,
    }),
    arr: [
      chance.bool(),
      chance.integer(),
      chance.floating(),
      chance.string({
        alpha: true,
        numeric: true,
      }),
      [chance.string()],
      {},
    ],
    obj: {
      str: chance.string({ alpha: true }),
      bool: chance.bool(),
      int: chance.integer(),
      float: chance.floating(),
      obj: {
        [chance.string()]: chance.string(),
      },
    },
    fn: (): undefined => undefined,
    [Symbol(chance.string())]: Symbol(chance.string()),
  } as const;

  test('should list', async () => {
    const { service, client } = param();

    client.onGet().reply(
      200,

      JSON.stringify({
        pagination: {
          total_items: totalItems,
          page_number: pageNumber,
          page_size: pageSize,
          total_pages: totalPages,
        },
        data: [],
      })
    );

    expect(await service.list()).toStrictEqual({
      pagination: {
        totalItems,
        pageNumber,
        pageSize,
        totalPages,
      },
      data: [], // no need to assert this conversion, since we are asserting pagination already
    } as PaginatedList<T>);
    expect(client.history.get).toHaveLength(1);
    expect(client.history.get[0].url).toStrictEqual('/');
    expect(client.history.get[0].headers).toMatchObject({
      [API_KEY_HEADER]: expect.any(String),
    });
  });

  test('should list with query', async () => {
    const { service, client } = param();

    client.onGet().reply(
      200,

      JSON.stringify({
        pagination: {
          total_items: totalItems,
          page_number: pageNumber,
          page_size: pageSize,
          total_pages: totalPages,
        },
        data: [],
      })
    );

    expect(
      await service.list((query as unknown) as PaginatedQuery)
    ).toStrictEqual({
      pagination: {
        totalItems,
        pageNumber,
        pageSize,
        totalPages,
      },
      data: [], // no need to assert this conversion, since we are asserting pagination already
    } as PaginatedList<T>);
    expect(client.history.get).toHaveLength(1);
    expect(client.history.get[0].url).toStrictEqual(
      `/?page=${page}&size=${size}&nul=null&camel_case=${query.camelCase}&bool=${query.bool}&int=${query.int}&float=${query.float}&str=${query.str}&arr=${query.arr[0]}&arr=${query.arr[1]}&arr=${query.arr[2]}&arr=${query.arr[3]}&obj.str=${query.obj.str}&obj.bool=${query.obj.bool}&obj.int=${query.obj.int}&obj.float=${query.obj.float}`
    );
    expect(client.history.get[0].headers).toMatchObject({
      [API_KEY_HEADER]: expect.any(String),
    });
  });

  test('should list with options', async () => {
    const { service, client } = param();

    client.onGet().reply(
      200,

      JSON.stringify({
        pagination: {
          total_items: totalItems,
          page_number: pageNumber,
          page_size: pageSize,
          total_pages: totalPages,
        },
        data: [],
      })
    );

    expect(
      await service.list((query as unknown) as PaginatedQuery, {
        apiKey,
        correlationId,
        idempotencyKey,
      })
    ).toStrictEqual({
      pagination: {
        totalItems,
        pageNumber,
        pageSize,
        totalPages,
      },
      data: [], // no need to assert this conversion, since we are asserting pagination already
    } as PaginatedList<T>);
    expect(client.history.get).toHaveLength(1);
    expect(client.history.get[0].url).toStrictEqual(
      `/?page=${page}&size=${size}&nul=null&camel_case=${query.camelCase}&bool=${query.bool}&int=${query.int}&float=${query.float}&str=${query.str}&arr=${query.arr[0]}&arr=${query.arr[1]}&arr=${query.arr[2]}&arr=${query.arr[3]}&obj.str=${query.obj.str}&obj.bool=${query.obj.bool}&obj.int=${query.obj.int}&obj.float=${query.obj.float}`
    );
    expect(client.history.get[0].headers).toMatchObject({
      [API_KEY_HEADER]: apiKey,
      [BT_TRACE_ID_HEADER]: correlationId,
      [BT_IDEMPOTENCY_KEY_HEADER]: idempotencyKey,
    });
  });
};

const testCursorPaginatedList = <T>(param: () => TestListParam<T>): void => {
  const chance = new Chance();
  const correlationId = chance.string();
  const apiKey = chance.string();
  const idempotencyKey = chance.string();
  const start = chance.string({
    alpha: true,
    numeric: true,
  });
  const pageSize = chance.integer();
  const after = chance.string();
  const size = chance.integer();
  const query = {
    start,
    size,
    nul: null,
    und: undefined,
    camelCase: chance.string({
      alpha: true,
      numeric: true,
    }),
    bool: chance.bool(),
    int: chance.integer(),
    float: chance.floating(),
    str: chance.string({
      alpha: true,
      numeric: true,
    }),
    arr: [
      chance.bool(),
      chance.integer(),
      chance.floating(),
      chance.string({
        alpha: true,
        numeric: true,
      }),
      [chance.string()],
      {},
    ],
    obj: {
      str: chance.string({ alpha: true }),
      bool: chance.bool(),
      int: chance.integer(),
      float: chance.floating(),
      obj: {
        [chance.string()]: chance.string(),
      },
    },
    fn: (): undefined => undefined,
    [Symbol(chance.string())]: Symbol(chance.string()),
  } as const;

  test('should list with cursor pagination', async () => {
    const { service, client } = param();

    client.onGet().reply(
      200,

      JSON.stringify({
        pagination: {
          after,
          page_size: pageSize,
        },
        data: [],
      })
    );

    expect(await service.list()).toStrictEqual({
      pagination: {
        after,
        pageSize,
      },
      data: [], // no need to assert this conversion, since we are asserting pagination already
    } as PaginatedList<T>);
    expect(client.history.get).toHaveLength(1);
    expect(client.history.get[0].url).toStrictEqual('/');
    expect(client.history.get[0].headers).toMatchObject({
      [API_KEY_HEADER]: expect.any(String),
    });
  });

  test('should list with cursor paginated query', async () => {
    const { service, client } = param();

    client.onGet().reply(
      200,

      JSON.stringify({
        pagination: {
          after,
          page_size: pageSize,
        },
        data: [],
      })
    );

    expect(
      await service.list((query as unknown) as PaginatedQuery)
    ).toStrictEqual({
      pagination: {
        after,
        pageSize,
      },
      data: [], // no need to assert this conversion, since we are asserting pagination already
    } as PaginatedList<T>);
    expect(client.history.get).toHaveLength(1);
    expect(client.history.get[0].url).toStrictEqual(
      `/?start=${query.start}&size=${size}&nul=null&camel_case=${query.camelCase}&bool=${query.bool}&int=${query.int}&float=${query.float}&str=${query.str}&arr=${query.arr[0]}&arr=${query.arr[1]}&arr=${query.arr[2]}&arr=${query.arr[3]}&obj.str=${query.obj.str}&obj.bool=${query.obj.bool}&obj.int=${query.obj.int}&obj.float=${query.obj.float}`
    );
    expect(client.history.get[0].headers).toMatchObject({
      [API_KEY_HEADER]: expect.any(String),
    });
  });

  test('should list with cursor pagination and options', async () => {
    const { service, client } = param();

    client.onGet().reply(
      200,

      JSON.stringify({
        pagination: {
          after,
          page_size: pageSize,
        },
        data: [],
      })
    );

    expect(
      await service.list((query as unknown) as PaginatedQuery, {
        apiKey,
        correlationId,
        idempotencyKey,
      })
    ).toStrictEqual({
      pagination: {
        after,
        pageSize,
      },
      data: [], // no need to assert this conversion, since we are asserting pagination already
    } as PaginatedList<T>);
    expect(client.history.get).toHaveLength(1);
    expect(client.history.get[0].url).toStrictEqual(
      `/?start=${query.start}&size=${size}&nul=null&camel_case=${query.camelCase}&bool=${query.bool}&int=${query.int}&float=${query.float}&str=${query.str}&arr=${query.arr[0]}&arr=${query.arr[1]}&arr=${query.arr[2]}&arr=${query.arr[3]}&obj.str=${query.obj.str}&obj.bool=${query.obj.bool}&obj.int=${query.obj.int}&obj.float=${query.obj.float}`
    );
    expect(client.history.get[0].headers).toMatchObject({
      [API_KEY_HEADER]: apiKey,
      [BT_TRACE_ID_HEADER]: correlationId,
      [BT_IDEMPOTENCY_KEY_HEADER]: idempotencyKey,
    });
  });
};

const testCRUD = <T, C, U>(
  param: () => TestCreateParam<T, C> &
    TestRetrieveParam<T> &
    TestUpdateParam<T, U> &
    TestDeleteParam &
    TestListParam<T>
): void => {
  testCreate(param);
  testRetrieve(param);
  testUpdate(param);
  testDelete(param);
  testList(param);
};

const testMethodDelegate = (
  method: 'tokenize',
  delegateServiceUnderTest: <T extends BasisTheoryServiceConstructor>(
    elements?: BasisTheoryElementsInternal
  ) => new (
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    ...initBtArgs: CrudBuilder<T> extends { new (...args: infer P): any }
      ? P
      : BasisTheoryServiceOptions[]
  ) => Create<unknown, unknown> | Tokenize
): void => {
  const chance = new Chance();
  const expectedCreatedToken = chance.string();
  const hasElement = jest.fn();

  let elementsInstance: {
    [method]: jest.Mock;
  } & {
    hasElement: jest.Mock;
  };

  describe('elements is initialized', () => {
    beforeEach(() => {
      elementsInstance = {
        [method]: jest.fn().mockReturnValue(expectedCreatedToken),
        hasElement,
      };
    });

    describe('element instance is on the payload', () => {
      beforeEach(() => {
        (hasElement as jest.Mock).mockReturnValue(true);
      });

      test('should delegate create call to elements', () => {
        const serviceInstance = new (delegateServiceUnderTest(
          (elementsInstance as unknown) as BasisTheoryElementsInternal
        ))({
          apiKey: chance.string(),
          baseURL: chance.url(),
        });
        const expectedPayload = chance.string(),
          expectedRequestOptions = chance.string();
        const createdToken = ((serviceInstance as unknown) as {
          tokenize?: (...args: unknown[]) => string;
        })[method]?.(expectedPayload, expectedRequestOptions);

        expect(elementsInstance[method]).toHaveBeenCalledTimes(1);
        expect(elementsInstance[method]).toHaveBeenCalledWith(
          expectedPayload,
          expectedRequestOptions
        );
        expect(createdToken).toBe(expectedCreatedToken);
      });
    });

    describe('element instance is not on the payload', () => {
      beforeEach(() => {
        (hasElement as jest.Mock).mockReturnValue(false);
      });

      test('should delegate create call to bt.js', () => {
        const superMethod = jest.fn().mockReturnValue(expectedCreatedToken);
        const ClassToBeInstantiated = delegateServiceUnderTest(
          (elementsInstance as unknown) as BasisTheoryElementsInternal
        );

        Object.setPrototypeOf(ClassToBeInstantiated.prototype, {
          tokenize: superMethod,
        });
        const serviceInstance = new ClassToBeInstantiated({
          apiKey: chance.string(),
          baseURL: chance.url(),
        });
        const expectedPayload = chance.string(),
          expectedRequestOptions = chance.string();

        const createdToken = ((serviceInstance as unknown) as {
          tokenize?: (...args: unknown[]) => string;
        })[method]?.(expectedPayload, expectedRequestOptions);

        expect(superMethod).toHaveBeenCalledTimes(1);
        expect(superMethod).toHaveBeenCalledWith(
          expectedPayload,
          expectedRequestOptions
        );
        expect(createdToken).toBe(expectedCreatedToken);
      });
    });
  });

  describe('elements is not initialized', () => {
    beforeEach(() => {
      (hasElement as jest.Mock).mockReturnValue(false);
    });

    test('should delegate create call to bt.js', () => {
      const superMethod = jest.fn().mockReturnValue(expectedCreatedToken);
      const ClassToBeInstantiated = delegateServiceUnderTest(undefined);

      Object.setPrototypeOf(ClassToBeInstantiated.prototype, {
        tokenize: superMethod,
      });
      const serviceInstance = new ClassToBeInstantiated({
        apiKey: chance.string(),
        baseURL: chance.url(),
      });
      const expectedPayload = chance.string(),
        expectedRequestOptions = chance.string();
      const createdToken = ((serviceInstance as unknown) as {
        tokenize?: (...args: unknown[]) => string;
      })[method]?.(expectedPayload, expectedRequestOptions);

      expect(superMethod).toHaveBeenCalledTimes(1);
      expect(superMethod).toHaveBeenCalledWith(
        expectedPayload,
        expectedRequestOptions
      );
      expect(createdToken).toBe(expectedCreatedToken);
    });
  });
};

const testServiceDelegate = (
  serviceToBeTested: 'tokens' | 'tokenize',
  method: 'create' | 'tokenize',
  delegateServiceUnderTest: <T extends BasisTheoryServiceConstructor>(
    elements?: BasisTheoryElementsInternal
  ) => new (
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    ...initBtArgs: CrudBuilder<T> extends { new (...args: infer P): any }
      ? P
      : BasisTheoryServiceOptions[]
  ) => Create<unknown, unknown> | Tokenize
): void => {
  const chance = new Chance();
  const expectedCreatedToken = chance.string();
  const hasElement = jest.fn();

  let elementsInstance: {
    [service in typeof serviceToBeTested]?: {
      create: jest.Mock;
      tokenize: jest.Mock;
    };
  } & {
    hasElement: jest.Mock;
  };

  // eslint-disable-next-line jest/no-identical-title
  describe('elements is initialized', () => {
    beforeEach(() => {
      elementsInstance = {
        [serviceToBeTested]: {
          create: jest.fn().mockReturnValue(expectedCreatedToken),
          tokenize: jest.fn().mockReturnValue(expectedCreatedToken),
        },
        hasElement,
      };
    });

    describe('element instance is on the payload', () => {
      beforeEach(() => {
        (hasElement as jest.Mock).mockReturnValue(true);
      });

      test('should delegate create call to elements', () => {
        const serviceInstance = new (delegateServiceUnderTest(
          (elementsInstance as unknown) as BasisTheoryElementsInternal
        ))({
          apiKey: chance.string(),
          baseURL: chance.url(),
        });
        const expectedPayload = chance.string(),
          expectedRequestOptions = chance.string();
        const createdToken = ((serviceInstance as unknown) as {
          tokenize?: (...args: unknown[]) => string;
          create?: (...args: unknown[]) => string;
        })[method]?.(expectedPayload, expectedRequestOptions);

        expect(
          elementsInstance[serviceToBeTested]?.[method]
        ).toHaveBeenCalledTimes(1);
        expect(
          elementsInstance[serviceToBeTested]?.[method]
        ).toHaveBeenCalledWith(expectedPayload, expectedRequestOptions);
        expect(createdToken).toBe(expectedCreatedToken);
      });
    });

    describe('element instance is not on the payload', () => {
      beforeEach(() => {
        (hasElement as jest.Mock).mockReturnValue(false);
      });

      test('should delegate create call to bt.js', () => {
        const superMethod = jest.fn().mockReturnValue(expectedCreatedToken);
        const ClassToBeInstantiated = delegateServiceUnderTest(
          (elementsInstance as unknown) as BasisTheoryElementsInternal
        );

        Object.setPrototypeOf(ClassToBeInstantiated.prototype, {
          create: superMethod,
          tokenize: superMethod,
        });
        const serviceInstance = new ClassToBeInstantiated({
          apiKey: chance.string(),
          baseURL: chance.url(),
        });
        const expectedPayload = chance.string(),
          expectedRequestOptions = chance.string();

        const createdToken = ((serviceInstance as unknown) as {
          tokenize?: (...args: unknown[]) => string;
          create?: (...args: unknown[]) => string;
        })[method]?.(expectedPayload, expectedRequestOptions);

        expect(superMethod).toHaveBeenCalledTimes(1);
        expect(superMethod).toHaveBeenCalledWith(
          expectedPayload,
          expectedRequestOptions
        );
        expect(createdToken).toBe(expectedCreatedToken);
      });
    });
  });

  // eslint-disable-next-line jest/no-identical-title
  describe('elements is not initialized', () => {
    beforeEach(() => {
      (hasElement as jest.Mock).mockReturnValue(false);
    });

    test('should delegate create call to bt.js', () => {
      const superMethod = jest.fn().mockReturnValue(expectedCreatedToken);
      const ClassToBeInstantiated = delegateServiceUnderTest(undefined);

      Object.setPrototypeOf(ClassToBeInstantiated.prototype, {
        create: superMethod,
        tokenize: superMethod,
      });
      const serviceInstance = new ClassToBeInstantiated({
        apiKey: chance.string(),
        baseURL: chance.url(),
      });
      const expectedPayload = chance.string(),
        expectedRequestOptions = chance.string();
      const createdToken = ((serviceInstance as unknown) as {
        tokenize?: (...args: unknown[]) => string;
        create?: (...args: unknown[]) => string;
      })[method]?.(expectedPayload, expectedRequestOptions);

      expect(superMethod).toHaveBeenCalledTimes(1);
      expect(superMethod).toHaveBeenCalledWith(
        expectedPayload,
        expectedRequestOptions
      );
      expect(createdToken).toBe(expectedCreatedToken);
    });
  });
};

const getTestAppInfo = (): ApplicationInfo => {
  const testApp: ApplicationInfo = {
    name: 'TestApp',
    version: '1.0.0',
    url: 'http://localhost',
  };

  return testApp;
};

export {
  describeif,
  mockServiceClient,
  errorStatus,
  expectBasisTheoryApiError,
  testCRUD,
  testCreate,
  testRetrieve,
  testUpdate,
  testPatch,
  testDelete,
  testList,
  testCursorPaginatedList,
  testServiceDelegate,
  testMethodDelegate,
  getTestAppInfo,
};
