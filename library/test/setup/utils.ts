/* eslint-disable @typescript-eslint/explicit-module-boundary-types,@typescript-eslint/explicit-function-return-type */
import MockAdapter from 'axios-mock-adapter';
import { Chance } from 'chance';
import type { CRUD, PaginatedList } from '../../src/service';
import { API_KEY_HEADER, transformRequestSnakeCase } from '../../src/common';
import { BT_TRACE_ID_HEADER } from '../../src/common';
import { PaginatedQuery } from '../../src/service';

export const describeif = (condition: boolean): typeof describe =>
  condition ? describe : describe.skip;

// eslint-disable-next-line @typescript-eslint/no-explicit-any, @typescript-eslint/explicit-module-boundary-types
export const mockServiceClient = (service: any): MockAdapter =>
  new MockAdapter(service.client);

export const errorStatus = (): number =>
  new Chance().integer({
    min: 400,
    max: 599,
  });

export const expectBasisTheoryApiError = <T>(
  promise: Promise<T>,
  status: number
): Promise<void> =>
  expect(promise).rejects.toMatchObject({
    name: 'BasisTheoryApiError',
    status,
  });

type TestCrudParam<T, C, U> = () => {
  service: CRUD<T, C, U>;
  client: MockAdapter;
  createPayload: C;
  /**
   * @default snake case transformed {@link createPayload}
   */
  transformedCreatePayload?: unknown;
  updatePayload: U;
  /**
   * @default snake case transformed {@link updatePayload}
   */
  transformedUpdatePayload?: unknown;
};

export const testCRUD = <T, C, U>(param: TestCrudParam<T, C, U>): void => {
  testCreate(param);
  testRetrieve(param);
  testUpdate(param);
  testDelete(param);
  testList(param);
};

export const testCreate = <T, C, U>(param: TestCrudParam<T, C, U>) => {
  const chance = new Chance();
  const correlationId = chance.string();
  const apiKey = chance.string();

  it('should create', async () => {
    const {
      service,
      client,
      createPayload,
      transformedCreatePayload = transformRequestSnakeCase(createPayload),
    } = param();
    const createdAt = chance.string();

    client.onPost('/').reply(201, {
      ...transformedCreatePayload,
      created_at: createdAt,
    });

    expect(await service.create(createPayload)).toStrictEqual({
      ...createPayload,
      createdAt,
    });

    expect(client.history.post.length).toBe(1);
    expect(client.history.post[0].data).toStrictEqual(
      JSON.stringify(transformedCreatePayload)
    );
    expect(client.history.post[0].headers).toMatchObject({
      [API_KEY_HEADER]: expect.any(String),
    });
  });

  it('should create with options', async () => {
    const {
      service,
      client,
      createPayload,
      transformedCreatePayload = transformRequestSnakeCase(createPayload),
    } = param();
    const createdAt = chance.string();

    client.onPost('/').reply(201, {
      ...transformedCreatePayload,
      created_at: createdAt,
    });

    expect(
      await service.create(createPayload, {
        apiKey,
        correlationId,
      })
    ).toStrictEqual({
      ...createPayload,
      createdAt,
    });

    expect(client.history.post.length).toBe(1);
    expect(client.history.post[0].data).toStrictEqual(
      JSON.stringify(transformedCreatePayload)
    );
    expect(client.history.post[0].headers).toMatchObject({
      [API_KEY_HEADER]: apiKey,
      [BT_TRACE_ID_HEADER]: correlationId,
    });
  });

  it('should reject with status >= 400 <= 599', async () => {
    const { service, client, createPayload } = param();
    const status = errorStatus();

    client.onPost('/').reply(status);

    const promise = service.create(createPayload);

    await expectBasisTheoryApiError(promise, status);
  });
};

export const testRetrieve = <T, C, U>(param: TestCrudParam<T, C, U>) => {
  const chance = new Chance();
  const id = chance.string();
  const correlationId = chance.string();
  const apiKey = chance.string();

  it('should retrieve', async () => {
    const { service, client } = param();
    const createdAt = chance.string();

    client.onGet(id).reply(200, {
      id,
      created_at: createdAt,
    });

    expect(await service.retrieve(id)).toStrictEqual({
      id,
      createdAt,
    });
    expect(client.history.get.length).toBe(1);
    expect(client.history.get[0].headers).toMatchObject({
      [API_KEY_HEADER]: expect.any(String),
    });
  });

  it('should retrieve with options', async () => {
    const { service, client } = param();
    const createdAt = chance.string();

    client.onGet(id).reply(200, {
      id,
      created_at: createdAt,
    });

    expect(
      await service.retrieve(id, {
        apiKey,
        correlationId,
      })
    ).toStrictEqual({
      id,
      createdAt,
    });
    expect(client.history.get.length).toBe(1);
    expect(client.history.get[0].headers).toMatchObject({
      [API_KEY_HEADER]: apiKey,
      [BT_TRACE_ID_HEADER]: correlationId,
    });
  });

  it('should reject with status >= 400 <= 599', async () => {
    const { service, client } = param();
    const status = errorStatus();

    client.onGet(id).reply(status);

    const promise = service.retrieve(id);

    await expectBasisTheoryApiError(promise, status);
  });
};

export const testUpdate = <T, C, U>(param: TestCrudParam<T, C, U>) => {
  const chance = new Chance();
  const id = chance.string();
  const correlationId = chance.string();
  const apiKey = chance.string();

  it('should update', async () => {
    const {
      service,
      client,
      updatePayload,
      transformedUpdatePayload = transformRequestSnakeCase(updatePayload),
    } = param();
    const updatedAt = chance.string();

    client.onPut(id).reply(200, {
      ...transformedUpdatePayload,
      updated_at: updatedAt,
    });

    expect(await service.update(id, updatePayload)).toStrictEqual({
      ...updatePayload,
      updatedAt,
    });
    expect(client.history.put.length).toBe(1);
    expect(client.history.put[0].data).toStrictEqual(
      JSON.stringify(transformedUpdatePayload)
    );
    expect(client.history.put[0].headers).toMatchObject({
      [API_KEY_HEADER]: expect.any(String),
    });
  });

  it('should update with options', async () => {
    const {
      service,
      client,
      updatePayload,
      transformedUpdatePayload = transformRequestSnakeCase(updatePayload),
    } = param();
    const updatedAt = chance.string();

    client.onPut(id).reply(200, {
      ...transformedUpdatePayload,
      updated_at: updatedAt,
    });

    expect(
      await service.update(id, updatePayload, {
        apiKey,
        correlationId,
      })
    ).toStrictEqual({
      ...updatePayload,
      updatedAt,
    });
    expect(client.history.put.length).toBe(1);
    expect(client.history.put[0].data).toStrictEqual(
      JSON.stringify(transformedUpdatePayload)
    );
    expect(client.history.put[0].headers).toMatchObject({
      [API_KEY_HEADER]: apiKey,
      [BT_TRACE_ID_HEADER]: correlationId,
    });
  });

  it('should reject with status >= 400 <= 599', async () => {
    const { service, client, updatePayload } = param();
    const status = errorStatus();

    client.onPut(id).reply(status);

    const promise = service.update(id, updatePayload);

    await expectBasisTheoryApiError(promise, status);
  });
};

export const testDelete = <T, C, U>(param: TestCrudParam<T, C, U>) => {
  const chance = new Chance();
  const id = chance.string();
  const correlationId = chance.string();
  const apiKey = chance.string();

  it('should delete', async () => {
    const { service, client } = param();
    const createdAt = chance.string();

    client.onDelete(id).reply(204, {
      id,
      created_at: createdAt,
    });

    expect(await service.delete(id)).toBeUndefined();
    expect(client.history.delete.length).toBe(1);
    expect(client.history.delete[0].headers).toMatchObject({
      [API_KEY_HEADER]: expect.any(String),
    });
  });

  it('should delete with options', async () => {
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
      })
    ).toBeUndefined();
    expect(client.history.delete.length).toBe(1);
    expect(client.history.delete[0].headers).toMatchObject({
      [API_KEY_HEADER]: apiKey,
      [BT_TRACE_ID_HEADER]: correlationId,
    });
  });

  it('should reject with status >= 400 <= 599', async () => {
    const { service, client } = param();
    const status = errorStatus();

    client.onDelete(id).reply(status);

    const promise = service.delete(id);

    await expectBasisTheoryApiError(promise, status);
  });
};

export const testList = <T, C, U>(param: TestCrudParam<T, C, U>) => {
  const chance = new Chance();
  const correlationId = chance.string();
  const apiKey = chance.string();
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
    camelCase: chance.string({ alpha: true, numeric: true }),
    bool: chance.bool(),
    int: chance.integer(),
    float: chance.floating(),
    str: chance.string({ alpha: true, numeric: true }),
    arr: [
      chance.bool(),
      chance.integer(),
      chance.floating(),
      chance.string({ alpha: true, numeric: true }),
      [chance.string()],
      {},
    ],
    obj: {
      [chance.string()]: chance.string(),
    },
    fn: (): undefined => undefined,
    [Symbol(chance.string())]: Symbol(chance.string()),
  } as const;

  it('should list', async () => {
    const { service, client } = param();

    client.onGet().reply(200, {
      pagination: {
        total_items: totalItems,
        page_number: pageNumber,
        page_size: pageSize,
        total_pages: totalPages,
      },
      data: [],
    });

    expect(await service.list()).toStrictEqual({
      pagination: {
        totalItems,
        pageNumber,
        pageSize,
        totalPages,
      },
      data: [], // no need to assert this conversion, since we are asserting pagination already
    } as PaginatedList<T>);
    expect(client.history.get.length).toBe(1);
    expect(client.history.get[0].url).toStrictEqual('/');
    expect(client.history.get[0].headers).toMatchObject({
      [API_KEY_HEADER]: expect.any(String),
    });
  });

  it('should list with query', async () => {
    const { service, client } = param();

    client.onGet().reply(200, {
      pagination: {
        total_items: totalItems,
        page_number: pageNumber,
        page_size: pageSize,
        total_pages: totalPages,
      },
      data: [],
    });

    expect(await service.list(query as PaginatedQuery)).toStrictEqual({
      pagination: {
        totalItems,
        pageNumber,
        pageSize,
        totalPages,
      },
      data: [], // no need to assert this conversion, since we are asserting pagination already
    } as PaginatedList<T>);
    expect(client.history.get.length).toBe(1);
    expect(client.history.get[0].url).toStrictEqual(
      `/?page=${page}&size=${size}&nul=null&camel_case=${query.camelCase}&bool=${query.bool}&int=${query.int}&float=${query.float}&str=${query.str}&arr=${query.arr[0]}&arr=${query.arr[1]}&arr=${query.arr[2]}&arr=${query.arr[3]}`
    );
    expect(client.history.get[0].headers).toMatchObject({
      [API_KEY_HEADER]: expect.any(String),
    });
  });

  it('should list with options', async () => {
    const { service, client } = param();

    client.onGet().reply(200, {
      pagination: {
        total_items: totalItems,
        page_number: pageNumber,
        page_size: pageSize,
        total_pages: totalPages,
      },
      data: [],
    });

    expect(
      await service.list(query as PaginatedQuery, { apiKey, correlationId })
    ).toStrictEqual({
      pagination: {
        totalItems,
        pageNumber,
        pageSize,
        totalPages,
      },
      data: [], // no need to assert this conversion, since we are asserting pagination already
    } as PaginatedList<T>);
    expect(client.history.get.length).toBe(1);
    expect(client.history.get[0].url).toStrictEqual(
      `/?page=${page}&size=${size}&nul=null&camel_case=${query.camelCase}&bool=${query.bool}&int=${query.int}&float=${query.float}&str=${query.str}&arr=${query.arr[0]}&arr=${query.arr[1]}&arr=${query.arr[2]}&arr=${query.arr[3]}`
    );
    expect(client.history.get[0].headers).toMatchObject({
      [API_KEY_HEADER]: apiKey,
      [BT_TRACE_ID_HEADER]: correlationId,
    });
  });
};
