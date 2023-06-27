import type MockAdapter from 'axios-mock-adapter';
import { Chance } from 'chance';
import { BasisTheory } from '@/BasisTheory';
import {
  API_KEY_HEADER,
  BT_IDEMPOTENCY_KEY_HEADER,
  BT_TRACE_ID_HEADER,
} from '@/common';
import type { ApplicationType, TransformType } from '@/types/models';
import type { BasisTheory as IBasisTheory } from '@/types/sdk';
import {
  testCRUD,
  errorStatus,
  expectBasisTheoryApiError,
  mockServiceClient,
} from './setup/utils';

describe('Applications', () => {
  let bt: IBasisTheory,
    chance: Chance.Chance,
    apiKey: string,
    client: MockAdapter;

  beforeAll(async () => {
    chance = new Chance();
    apiKey = chance.string();
    bt = await new BasisTheory().init(apiKey);
    client = mockServiceClient(bt.applications);
  });

  beforeEach(() => {
    client.resetHandlers();
    client.resetHistory();
  });

  describe('CRUD with permissions', () => {
    testCRUD(() => ({
      service: bt.applications,
      client,
      createPayload: {
        name: chance.string(),
        type: chance.string() as ApplicationType,
        permissions: [chance.string()],
        expiresAt: chance.date().toString(),
      },
      updatePayload: {
        name: chance.string(),
        permissions: [chance.string()],
      },
    }));
  });

  describe('CRUD with access rules', () => {
    testCRUD(() => ({
      service: bt.applications,
      client,
      createPayload: {
        name: chance.string(),
        type: chance.string() as ApplicationType,
        rules: [
          {
            description: chance.string(),
            priority: chance.integer(),
            container: chance.string(),
            transform: chance.pickone<TransformType>([
              'mask',
              'redact',
              'reveal',
            ]),
            permissions: [chance.string()],
            conditions: [
              {
                attribute: chance.string(),
                operator: chance.string(),
                value: chance.string(),
              },
            ],
          },
        ],
        expiresAt: chance.date().toString(),
      },
      updatePayload: {
        name: chance.string(),
        rules: [
          {
            description: chance.string(),
            priority: chance.integer(),
            container: chance.string(),
            transform: chance.pickone<TransformType>([
              'mask',
              'redact',
              'reveal',
            ]),
            permissions: [chance.string()],
            conditions: [],
          },
        ],
      },
    }));
  });

  describe('get by key', () => {
    test('should get by key', async () => {
      const id = chance.string();
      const createdBy = chance.string();
      const createdAt = chance.string();
      const modifiedBy = chance.string();
      const modifiedAt = chance.string();

      client.onGet('/key').reply(
        200,
        JSON.stringify({
          id,
          created_at: createdAt,
          created_by: createdBy,
          modified_at: modifiedAt,
          modified_by: modifiedBy,
        })
      );

      const retrieveByKey = jest.spyOn(bt.applications, 'retrieveByKey');

      // should call retrieveByKey, and not have own implementation
      expect(await bt.applications.retrieveByKey()).toStrictEqual({
        id,
        createdAt,
        createdBy,
        modifiedAt,
        modifiedBy,
      });
      expect(await bt.applications.retrieveByKey()).toStrictEqual({
        id,
        createdAt,
        createdBy,
        modifiedAt,
        modifiedBy,
      });
      expect(retrieveByKey).toHaveBeenCalledTimes(2);
      expect(client.history.get).toHaveLength(2);
      expect(client.history.get[0].headers).toMatchObject({
        [API_KEY_HEADER]: apiKey,
      });
      expect(client.history.get[1].headers).toMatchObject({
        [API_KEY_HEADER]: apiKey,
      });
    });

    test('should get by key with options', async () => {
      const id = chance.string();
      const createdBy = chance.string();
      const createdAt = chance.string();
      const modifiedBy = chance.string();
      const modifiedAt = chance.string();
      const _apiKey = chance.string();
      const correlationId = chance.string();
      const idempotencyKey = chance.string();

      client.onGet('/key').reply(
        200,
        JSON.stringify({
          id,
          created_at: createdAt,
          created_by: createdBy,
          modified_at: modifiedAt,
          modified_by: modifiedBy,
        })
      );

      expect(
        await bt.applications.retrieveByKey({
          apiKey: _apiKey,
          correlationId,
          idempotencyKey,
        })
      ).toStrictEqual({
        id,
        createdAt,
        createdBy,
        modifiedAt,
        modifiedBy,
      });
      expect(client.history.get).toHaveLength(1);
      expect(client.history.get[0].headers).toMatchObject({
        [API_KEY_HEADER]: _apiKey,
        [BT_TRACE_ID_HEADER]: correlationId,
        [BT_IDEMPOTENCY_KEY_HEADER]: idempotencyKey,
      });
    });

    test('should reject with status >= 400 <= 599', async () => {
      const status = errorStatus();

      client.onGet('/key').reply(status);

      const promise = bt.applications.retrieveByKey();

      await expectBasisTheoryApiError(promise, status);
    });
  });

  describe('regenerate key', () => {
    test('should regenerate key', async () => {
      const id = chance.string();
      const key = chance.string();
      const createdBy = chance.string();
      const createdAt = chance.string();
      const modifiedBy = chance.string();
      const modifiedAt = chance.string();

      client.onPost(`${id}/regenerate`).reply(
        200,
        JSON.stringify({
          id,
          key,
          created_at: createdAt,
          created_by: createdBy,
          modified_at: modifiedAt,
          modified_by: modifiedBy,
        })
      );

      expect(await bt.applications.regenerateKey(id)).toStrictEqual({
        id,
        key,
        createdAt,
        createdBy,
        modifiedAt,
        modifiedBy,
      });
      expect(client.history.post).toHaveLength(1);
      expect(client.history.post[0].headers).toMatchObject({
        [API_KEY_HEADER]: apiKey,
      });
    });

    test('should regenerate key with options', async () => {
      const id = chance.string();
      const key = chance.string();
      const createdBy = chance.string();
      const createdAt = chance.string();
      const modifiedBy = chance.string();
      const modifiedAt = chance.string();
      const _apiKey = chance.string();
      const correlationId = chance.string();
      const idempotencyKey = chance.string();

      client.onPost(`${id}/regenerate`).reply(
        200,
        JSON.stringify({
          id,
          key,
          created_at: createdAt,
          created_by: createdBy,
          modified_at: modifiedAt,
          modified_by: modifiedBy,
        })
      );

      expect(
        await bt.applications.regenerateKey(id, {
          apiKey: _apiKey,
          correlationId,
          idempotencyKey,
        })
      ).toStrictEqual({
        id,
        key,
        createdAt,
        createdBy,
        modifiedAt,
        modifiedBy,
      });
      expect(client.history.post).toHaveLength(1);
      expect(client.history.post[0].headers).toMatchObject({
        [API_KEY_HEADER]: _apiKey,
        [BT_TRACE_ID_HEADER]: correlationId,
        [BT_IDEMPOTENCY_KEY_HEADER]: idempotencyKey,
      });
    });

    test('should reject with status >= 400 <= 599', async () => {
      const id = chance.string();
      const status = errorStatus();

      client.onPost(`${id}/regenerate`).reply(status);

      const promise = bt.applications.regenerateKey(id);

      await expectBasisTheoryApiError(promise, status);
    });
  });
});
