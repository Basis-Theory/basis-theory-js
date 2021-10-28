import MockAdapter from 'axios-mock-adapter';
import { Chance } from 'chance';
import type { ApplicationType } from '../src';
import { BasisTheory } from '../src';
import { API_KEY_HEADER, BT_TRACE_ID_HEADER } from '../src/common';
import {
  testCRUD,
  errorStatus,
  expectBasisTheoryApiError,
  mockServiceClient,
} from './setup/utils';

describe('Applications', () => {
  let bt: BasisTheory;
  let chance: Chance.Chance;
  let apiKey: string;
  let client: MockAdapter;

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
    it('should get by key', async () => {
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
      expect(await bt.applications.getApplicationByKey()).toEqual({
        id,
        createdAt,
        createdBy,
        modifiedAt,
        modifiedBy,
      });
      expect(await bt.applications.retrieveByKey()).toEqual({
        id,
        createdAt,
        createdBy,
        modifiedAt,
        modifiedBy,
      });
      expect(retrieveByKey).toHaveBeenCalledTimes(2);
      expect(client.history.get.length).toBe(2);
      expect(client.history.get[0].headers).toMatchObject({
        [API_KEY_HEADER]: apiKey,
      });
      expect(client.history.get[1].headers).toMatchObject({
        [API_KEY_HEADER]: apiKey,
      });
    });

    it('should get by key with options', async () => {
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
      ).toEqual({
        id,
        createdAt,
        createdBy,
        modifiedAt,
        modifiedBy,
      });
      expect(client.history.get.length).toBe(1);
      expect(client.history.get[0].headers).toMatchObject({
        [API_KEY_HEADER]: _apiKey,
        [BT_TRACE_ID_HEADER]: correlationId,
      });
    });

    it('should reject with status >= 400 <= 599', async () => {
      const status = errorStatus();

      client.onGet('/key').reply(status);

      const promise = bt.applications.retrieveByKey();

      await expectBasisTheoryApiError(promise, status);
    });
  });

  describe('regenerate key', () => {
    it('should regenerate key', async () => {
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

      expect(await bt.applications.regenerateKey(id)).toEqual({
        id,
        key,
        createdAt,
        createdBy,
        modifiedAt,
        modifiedBy,
      });
      expect(client.history.post.length).toBe(1);
      expect(client.history.post[0].headers).toMatchObject({
        [API_KEY_HEADER]: apiKey,
      });
    });

    it('should regenerate key with options', async () => {
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
      ).toEqual({
        id,
        key,
        createdAt,
        createdBy,
        modifiedAt,
        modifiedBy,
      });
      expect(client.history.post.length).toBe(1);
      expect(client.history.post[0].headers).toMatchObject({
        [API_KEY_HEADER]: _apiKey,
        [BT_TRACE_ID_HEADER]: correlationId,
      });
    });

    it('should reject with status >= 400 <= 599', async () => {
      const id = chance.string();
      const status = errorStatus();

      client.onPost(`${id}/regenerate`).reply(status);

      const promise = bt.applications.regenerateKey(id);

      await expectBasisTheoryApiError(promise, status);
    });
  });
});
