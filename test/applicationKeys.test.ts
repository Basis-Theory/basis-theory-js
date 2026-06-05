import type MockAdapter from 'axios-mock-adapter';
import { Chance } from 'chance';
import { BasisTheory } from '@/BasisTheory';
import { API_KEY_HEADER } from '@/common';
import type { BasisTheory as IBasisTheory } from '@/types/sdk';
import {
  errorStatus,
  expectBasisTheoryApiError,
  mockServiceClient,
} from './setup/utils';

describe('ApplicationKeys', () => {
  let bt: IBasisTheory,
    chance: Chance.Chance,
    apiKey: string,
    client: MockAdapter;

  beforeAll(async () => {
    chance = new Chance();
    apiKey = chance.string();
    bt = await new BasisTheory().init(apiKey);
    client = mockServiceClient(bt.applicationKeys);
  });

  beforeEach(() => {
    client.resetHandlers();
    client.resetHistory();
  });

  describe('create', () => {
    test('create a new key', async () => {
      const id = chance.string();
      const key = chance.string();
      const createdAt = chance.string();
      const createdBy = chance.string();

      client.onPost(`/${id}/keys`).reply(
        200,
        JSON.stringify({
          id,
          key,
          createdAt,
          createdBy,
        })
      );

      const create = jest.spyOn(bt.applicationKeys, 'create');

      expect(await bt.applicationKeys.create(id)).toStrictEqual({
        id,
        key,
        createdAt,
        createdBy,
      });
      expect(await bt.applicationKeys.create(id)).toStrictEqual({
        id,
        key,
        createdAt,
        createdBy,
      });
      expect(create).toHaveBeenCalledTimes(2);
      expect(client.history.post).toHaveLength(2);
      expect(client.history.post[0].headers).toMatchObject({
        [API_KEY_HEADER]: apiKey,
      });
      expect(client.history.post[1].headers).toMatchObject({
        [API_KEY_HEADER]: apiKey,
      });
    });

    test('should reject with status >= 400 <= 599', async () => {
      const status = errorStatus();

      client.onPost('/test/keys').reply(status);

      const promise = bt.applicationKeys.create('test');

      await expectBasisTheoryApiError(promise, status);
    });
  });

  describe('get', () => {
    test('get all keys', async () => {
      const id = chance.string();
      const key = chance.string();
      const createdAt = chance.string();
      const createdBy = chance.string();

      client.onGet(`/${id}/keys`).reply(
        200,
        JSON.stringify([
          {
            id,
            key,
            createdAt,
            createdBy,
          },
        ])
      );

      const get = jest.spyOn(bt.applicationKeys, 'get');

      expect(await bt.applicationKeys.get(id)).toStrictEqual([
        {
          id,
          key,
          createdAt,
          createdBy,
        },
      ]);
      expect(await bt.applicationKeys.get(id)).toStrictEqual([
        {
          id,
          key,
          createdAt,
          createdBy,
        },
      ]);
      expect(get).toHaveBeenCalledTimes(2);
      expect(client.history.get).toHaveLength(2);
      expect(client.history.get[0].headers).toMatchObject({
        [API_KEY_HEADER]: apiKey,
      });
      expect(client.history.get[1].headers).toMatchObject({
        [API_KEY_HEADER]: apiKey,
      });
    });

    test('get all keys - should reject with status >= 400 <= 599', async () => {
      const status = errorStatus();

      client.onGet('/test/keys').reply(status);

      const promise = bt.applicationKeys.get('test');

      await expectBasisTheoryApiError(promise, status);
    });

    test('get key by id', async () => {
      const id = chance.string();
      const keyId = chance.string();
      const createdAt = chance.string();
      const createdBy = chance.string();

      client.onGet(`/${id}/keys/${keyId}`).reply(
        200,
        JSON.stringify({
          id,
          createdAt,
          createdBy,
        })
      );

      const get = jest.spyOn(bt.applicationKeys, 'getById');

      expect(await bt.applicationKeys.getById(id, keyId)).toStrictEqual({
        id,
        createdAt,
        createdBy,
      });
      expect(await bt.applicationKeys.getById(id, keyId)).toStrictEqual({
        id,
        createdAt,
        createdBy,
      });
      expect(get).toHaveBeenCalledTimes(2);
      expect(client.history.get).toHaveLength(2);
      expect(client.history.get[0].headers).toMatchObject({
        [API_KEY_HEADER]: apiKey,
      });
      expect(client.history.get[1].headers).toMatchObject({
        [API_KEY_HEADER]: apiKey,
      });
    });

    test('get key by id - should reject with status >= 400 <= 599', async () => {
      const status = errorStatus();

      client.onGet('/123/keys/456').reply(status);

      const promise = bt.applicationKeys.getById('123', '456');

      await expectBasisTheoryApiError(promise, status);
    });
  });

  describe('delete', () => {
    test('delete key', async () => {
      const id = chance.string();
      const key = chance.string();

      client.onDelete(`/${id}/keys/${key}`).reply(200, {});

      const del = jest.spyOn(bt.applicationKeys, 'delete');

      expect(await bt.applicationKeys.delete(id, key)).toStrictEqual({});
      expect(await bt.applicationKeys.delete(id, key)).toStrictEqual({});
      expect(del).toHaveBeenCalledTimes(2);
      expect(client.history.delete).toHaveLength(2);
      expect(client.history.delete[0].headers).toMatchObject({
        [API_KEY_HEADER]: apiKey,
      });
      expect(client.history.delete[1].headers).toMatchObject({
        [API_KEY_HEADER]: apiKey,
      });
    });

    test('get all keys - should reject with status >= 400 <= 599', async () => {
      const status = errorStatus();

      client.onDelete('/123/keys/456').reply(status);

      const promise = bt.applicationKeys.delete('123', '456');

      await expectBasisTheoryApiError(promise, status);
    });
  });
});
