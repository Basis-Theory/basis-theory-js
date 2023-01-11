import MockAdapter from 'axios-mock-adapter';
import { Chance } from 'chance';
import { BasisTheory } from '@/BasisTheory';
import { API_KEY_HEADER } from '@/common';
import type {
  AuthorizeSessionRequest,
  BasisTheory as IBasisTheory,
} from '@/types/sdk';
import { mockServiceClient } from './setup/utils';

describe('Sessions', () => {
  let bt: IBasisTheory,
    chance: Chance.Chance,
    apiKey: string,
    client: MockAdapter;

  beforeAll(async () => {
    chance = new Chance();
    apiKey = chance.string();
    bt = await new BasisTheory().init(apiKey);
    client = mockServiceClient(bt.sessions);
  });

  beforeEach(() => {
    client.resetHandlers();
    client.resetHistory();
  });

  describe('create', () => {
    test('should create session', async () => {
      const sessionKey = chance.string();
      const nonce = chance.string();
      const expiresAt = chance.string();

      client.onPost('/sessions').reply(
        201,
        /* eslint-disable camelcase */
        JSON.stringify({
          session_key: sessionKey,
          nonce,
          expires_at: expiresAt,
        })
        /* eslint-enable camelcase */
      );

      expect(await bt.sessions.create()).toStrictEqual({
        sessionKey,
        nonce,
        expiresAt,
      });
      expect(client.history.post).toHaveLength(1);
      expect(client.history.post[0].headers).toMatchObject({
        [API_KEY_HEADER]: expect.any(String),
      });
    });
  });

  describe('authorize', () => {
    test('should authorize session', async () => {
      const authorizeSessionRequest: AuthorizeSessionRequest = {
        nonce: chance.string(),
      };

      client.onPost('/sessions/authorize').reply(200, JSON.stringify({}));

      expect(
        await bt.sessions.authorize(authorizeSessionRequest)
      ).toStrictEqual({});
      expect(client.history.post).toHaveLength(1);
      expect(client.history.post[0].headers).toMatchObject({
        [API_KEY_HEADER]: expect.any(String),
      });
    });
  });
});
