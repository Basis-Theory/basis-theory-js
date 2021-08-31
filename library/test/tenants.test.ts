import MockAdapter from 'axios-mock-adapter';
import { Chance } from 'chance';
import { BasisTheory } from '../src';
import { BT_TRACE_ID_HEADER, API_KEY_HEADER } from '../src/common';
import {
  errorStatus,
  expectBasisTheoryApiError,
  mockServiceClient,
} from './setup/utils';

describe('Tenants', () => {
  let bt: BasisTheory;
  let chance: Chance.Chance;
  let apiKey: string;
  let client: MockAdapter;

  beforeAll(async () => {
    chance = new Chance();
    apiKey = chance.string();
    bt = await new BasisTheory().init(apiKey);
    client = mockServiceClient(bt.tenants);
  });

  beforeEach(() => {
    client.resetHandlers();
    client.resetHistory();
  });

  describe('retrieve', () => {
    it('should retrieve a tenant', async () => {
      const id = chance.string();
      const ownerId = chance.string();
      const name = chance.string();
      const createdAt = chance.string();
      const modifiedAt = chance.string();

      client.onGet().reply(
        200,
        JSON.stringify({
          id,
          owner_id: ownerId,
          name,
          created_at: createdAt,
          modified_at: modifiedAt,
        })
      );

      expect(await bt.tenants.retrieve()).toEqual({
        id,
        ownerId,
        name,
        createdAt,
        modifiedAt,
      });
      expect(client.history.get.length).toBe(1);
      expect(client.history.get[0].headers).toMatchObject({
        [API_KEY_HEADER]: apiKey,
      });
    });

    it('should retrieve a tenant with options', async () => {
      const id = chance.string();
      const ownerId = chance.string();
      const name = chance.string();
      const createdAt = chance.string();
      const modifiedAt = chance.string();
      const _apiKey = chance.string();
      const correlationId = chance.string();

      client.onGet().reply(
        200,
        JSON.stringify({
          id,
          owner_id: ownerId,
          name,
          created_at: createdAt,
          modified_at: modifiedAt,
        })
      );

      expect(
        await bt.tenants.retrieve({ apiKey: _apiKey, correlationId })
      ).toEqual({
        id,
        ownerId,
        name,
        createdAt,
        modifiedAt,
      });
      expect(client.history.get.length).toBe(1);
      expect(client.history.get[0].headers).toMatchObject({
        [API_KEY_HEADER]: _apiKey,
        [BT_TRACE_ID_HEADER]: correlationId,
      });
    });

    it('should reject with status >= 400 <= 599', async () => {
      const status = errorStatus();

      client.onGet().reply(status);

      const promise = bt.tenants.retrieve();

      await expectBasisTheoryApiError(promise, status);
    });
  });

  describe('update', () => {
    it('should update a tenant', async () => {
      const name = chance.string();

      client.onPut().reply(200, JSON.stringify({ name }));

      expect(await bt.tenants.update({ name })).toStrictEqual({
        name,
      });
      expect(client.history.put.length).toBe(1);
      expect(client.history.put[0].data).toStrictEqual(
        JSON.stringify({ name })
      );
      expect(client.history.put[0].headers).toMatchObject({
        [API_KEY_HEADER]: expect.any(String),
      });
    });

    it('should update with options', async () => {
      const name = chance.string();
      const _apiKey = chance.string();
      const correlationId = chance.string();

      client.onPut().reply(200, JSON.stringify({ name }));

      expect(
        await bt.tenants.update({ name }, { apiKey: _apiKey, correlationId })
      ).toStrictEqual({
        name,
      });
      expect(client.history.put.length).toBe(1);
      expect(client.history.put[0].data).toStrictEqual(
        JSON.stringify({ name })
      );
      expect(client.history.put[0].headers).toMatchObject({
        [API_KEY_HEADER]: _apiKey,
        [BT_TRACE_ID_HEADER]: correlationId,
      });
    });

    it('should reject with status >= 400 <= 599', async () => {
      const status = errorStatus();

      client.onPut().reply(status);

      const promise = bt.tenants.update({ name: chance.string() });

      await expectBasisTheoryApiError(promise, status);
    });
  });

  describe('delete', () => {
    it('should delete a tenant', async () => {
      client.onDelete().reply(204, {});

      expect(await bt.tenants.delete()).toBeUndefined();
      expect(client.history.delete.length).toBe(1);
      expect(client.history.delete[0].headers).toMatchObject({
        [API_KEY_HEADER]: expect.any(String),
      });
    });

    it('should delete a tenant with options', async () => {
      const _apiKey = chance.string();
      const correlationId = chance.string();

      client.onDelete().reply(204, {});

      expect(
        await bt.tenants.delete({
          apiKey: _apiKey,
          correlationId,
        })
      ).toBeUndefined();
      expect(client.history.delete.length).toBe(1);
      expect(client.history.delete[0].headers).toMatchObject({
        [API_KEY_HEADER]: _apiKey,
        [BT_TRACE_ID_HEADER]: correlationId,
      });
    });

    it('should reject with status >= 400 <= 599', async () => {
      const status = errorStatus();

      client.onDelete().reply(status);

      const promise = bt.tenants.delete();

      await expectBasisTheoryApiError(promise, status);
    });
  });
});
