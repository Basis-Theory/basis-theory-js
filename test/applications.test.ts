import type MockAdapter from 'axios-mock-adapter';
import { Chance } from 'chance';
import { BasisTheory } from '@/BasisTheory';
import { API_KEY_HEADER, BT_TRACE_ID_HEADER } from '@/common';
import type { ApplicationType } from '@/types/models';
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

  describe('CRUD', () => {
    testCRUD(() => ({
      service: bt.applications,
      client,
      createPayload: {
        name: chance.string(),
        type: chance.string() as ApplicationType,
        permissions: [chance.string()],
      },
      updatePayload: {
        name: chance.string(),
        permissions: [chance.string()],
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
        /* eslint-disable camelcase */
        JSON.stringify({
          id,
          created_at: createdAt,
          created_by: createdBy,
          modified_at: modifiedAt,
          modified_by: modifiedBy,
        })
        /* eslint-enable camelcase */
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

      client.onGet('/key').reply(
        200,
        /* eslint-disable camelcase */
        JSON.stringify({
          id,
          created_at: createdAt,
          created_by: createdBy,
          modified_at: modifiedAt,
          modified_by: modifiedBy,
        })
        /* eslint-enable camelcase */
      );

      expect(
        await bt.applications.retrieveByKey({
          apiKey: _apiKey,
          correlationId,
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
        /* eslint-disable camelcase */
        JSON.stringify({
          id,
          key,
          created_at: createdAt,
          created_by: createdBy,
          modified_at: modifiedAt,
          modified_by: modifiedBy,
        })
        /* eslint-enable camelcase */
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

      client.onPost(`${id}/regenerate`).reply(
        200,
        /* eslint-disable camelcase */
        JSON.stringify({
          id,
          key,
          created_at: createdAt,
          created_by: createdBy,
          modified_at: modifiedAt,
          modified_by: modifiedBy,
        })
        /* eslint-enable camelcase */
      );

      expect(
        await bt.applications.regenerateKey(id, {
          apiKey: _apiKey,
          correlationId,
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
