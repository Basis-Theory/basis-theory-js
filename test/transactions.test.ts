import MockAdapter from 'axios-mock-adapter';
import { Chance } from 'chance';
import { BasisTheory } from '@/BasisTheory';
import { API_KEY_HEADER } from '@/common';
import type { BasisTheory as IBasisTheory } from '@/types/sdk';
import { mockServiceClient } from './setup/utils';

describe('Transactions', () => {
  let bt: IBasisTheory,
    chance: Chance.Chance,
    apiKey: string,
    client: MockAdapter;

  beforeAll(async () => {
    chance = new Chance();
    apiKey = chance.string();
    bt = await new BasisTheory().init(apiKey);
    client = mockServiceClient(bt.transactions);
  });

  beforeEach(() => {
    client.resetHandlers();
    client.resetHistory();
  });

  describe('create', () => {
    test('should create transaction', async () => {
      const id = chance.string();
      const createdBy = chance.string();
      const createdAt = chance.string();
      const expiresAt = chance.string();

      client.onPost('/').reply(
        201,
        /* eslint-disable camelcase */
        JSON.stringify({
          id,
          created_by: createdBy,
          created_at: createdAt,
          expires_at: expiresAt,
        })
        /* eslint-enable camelcase */
      );

      expect(await bt.transactions.create()).toStrictEqual({
        id,
        createdBy,
        createdAt,
        expiresAt,
      });
      expect(client.history.post).toHaveLength(1);
      expect(client.history.post[0].headers).toMatchObject({
        [API_KEY_HEADER]: expect.any(String),
      });
    });
  });

  describe('commit', () => {
    test('should commit transaction', async () => {
      const id = chance.string();

      client.onPost(`/${id}/commit`).reply(204, JSON.stringify({}));

      expect(await bt.transactions.commit(id)).toStrictEqual({});
      expect(client.history.post).toHaveLength(1);
      expect(client.history.post[0].headers).toMatchObject({
        [API_KEY_HEADER]: expect.any(String),
      });
    });
  });

  describe('rollback', () => {
    test('should rollback transaction', async () => {
      const id = chance.string();

      client.onPost(`/${id}/rollback`).reply(204, JSON.stringify({}));

      expect(await bt.transactions.rollback(id)).toStrictEqual({});
      expect(client.history.post).toHaveLength(1);
      expect(client.history.post[0].headers).toMatchObject({
        [API_KEY_HEADER]: expect.any(String),
      });
    });
  });
});
