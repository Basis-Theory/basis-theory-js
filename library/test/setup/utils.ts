import MockAdapter from 'axios-mock-adapter';
import { Chance } from 'chance';
import { CRUD } from '../../src/service';
import { API_KEY_HEADER, transformRequestSnakeCase } from '../../dist/common';
import { BT_TRACE_ID_HEADER } from '../../src/common';

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
  updatePayload: U;
};

export const testCRUD = <T, C, U>(param: TestCrudParam<T, C, U>) => {
  testCreate(param);
  testRetrieve(param);
  testUpdate(param);
  testDelete(param);
};

export const testCreate = <T, C, U>(param: TestCrudParam<T, C, U>) => {
  const chance = new Chance();
  const correlationId = chance.string();
  const apiKey = chance.string();

  it('should create', async () => {
    const { service, client, createPayload } = param();
    const createdAt = chance.string();

    client.onPost('/').reply(200, {
      ...transformRequestSnakeCase(createPayload),
      created_at: createdAt,
    });

    expect(await service.create(createPayload)).toStrictEqual({
      ...createPayload,
      createdAt,
    });

    expect(client.history.post.length).toBe(1);
    expect(client.history.post[0].headers).toMatchObject({
      [API_KEY_HEADER]: expect.any(String),
    });
  });

  it('should create with options', async () => {
    const { service, client, createPayload } = param();
    const createdAt = chance.string();

    client.onPost('/').reply(200, {
      ...transformRequestSnakeCase(createPayload),
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
    const { service, client, updatePayload } = param();
    const updatedAt = chance.string();

    client.onPut(id).reply(200, {
      ...transformRequestSnakeCase(updatePayload),
      updated_at: updatedAt,
    });

    expect(await service.update(id, updatePayload)).toStrictEqual({
      ...updatePayload,
      updatedAt,
    });
    expect(client.history.put.length).toBe(1);
    expect(client.history.put[0].headers).toMatchObject({
      [API_KEY_HEADER]: expect.any(String),
    });
  });

  it('should update with options', async () => {
    const { service, client, updatePayload } = param();
    const updatedAt = chance.string();

    client.onPut(id).reply(200, {
      ...transformRequestSnakeCase(updatePayload),
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

    client.onDelete(id).reply(200, {
      id,
      created_at: createdAt,
    });

    expect(await service.delete(id)).toStrictEqual({
      id,
      createdAt,
    });
    expect(client.history.delete.length).toBe(1);
    expect(client.history.delete[0].headers).toMatchObject({
      [API_KEY_HEADER]: expect.any(String),
    });
  });

  it('should delete with options', async () => {
    const { service, client } = param();
    const createdAt = chance.string();

    client.onDelete(id).reply(200, {
      id,
      created_at: createdAt,
    });

    expect(
      await service.delete(id, {
        apiKey,
        correlationId,
      })
    ).toStrictEqual({
      id,
      createdAt,
    });
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
