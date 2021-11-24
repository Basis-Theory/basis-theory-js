import MockAdapter from 'axios-mock-adapter';
import { Chance } from 'chance';
import { BasisTheory } from '../src';
import { BT_TRACE_ID_HEADER, API_KEY_HEADER } from '../src/common';
import {
  errorStatus,
  expectBasisTheoryApiError,
  mockServiceClient,
} from './setup/utils';

describe('Tokenize', () => {
  let bt: BasisTheory;
  let chance: Chance.Chance;
  let apiKey: string;
  let client: MockAdapter;

  beforeAll(async () => {
    chance = new Chance();
    apiKey = chance.string();
    bt = await new BasisTheory().init(apiKey);
    client = mockServiceClient(bt.tokenize);
  });

  beforeEach(() => {
    client.resetHandlers();
    client.resetHistory();
  });

  describe('tokenize', () => {
    it('should tokenize', async () => {
      /* eslint-disable camelcase */
      const tokens = {
        first_name: chance.string(),
        last_name: chance.string(),
        card: {
          type: 'card',
          data: {
            number: chance.string(),
            expiration_month: chance.integer(),
            expiration_year: chance.integer(),
            cvc: chance.string(),
          },
          metadata: {
            camelCase: chance.string(),
            snake_case: chance.string(),
          },
        },
        random_tokens: [
          chance.string(),
          {
            type: 'token',
            data: chance.string(),
          },
        ],
      };

      const tokenResponse = {
        first_name: chance.guid(),
        last_name: chance.guid(),
        card: {
          id: chance.guid(),
          type: 'card',
          mask: {
            number: chance.string(),
            expiration_month: chance.integer(),
            expiration_year: chance.integer(),
          },
          metadata: {
            camelCase: chance.string(),
            snake_case: chance.string(),
          },
        },
        random_tokens: [
          chance.guid(),
          {
            id: chance.guid(),
            type: 'token',
          },
        ],
      };
      /* eslint-enable camelcase */

      client.onPost('/').reply(200, JSON.stringify(tokenResponse));

      expect(await bt.tokenize.tokenize(tokens)).toEqual(tokenResponse);
      expect(client.history.post.length).toBe(1);
      expect(client.history.post[0].data).toStrictEqual(JSON.stringify(tokens));
      expect(client.history.post[0].headers).toMatchObject({
        [API_KEY_HEADER]: apiKey,
      });
    });

    it('should tokenize with options', async () => {
      const _apiKey = chance.string();
      const correlationId = chance.string();
      /* eslint-disable camelcase */
      const tokens = {
        first_name: chance.string(),
        last_name: chance.string(),
        card: {
          type: 'card',
          data: {
            number: chance.string(),
            expiration_month: chance.integer(),
            expiration_year: chance.integer(),
            cvc: chance.string(),
          },
          metadata: {
            camelCase: chance.string(),
            snake_case: chance.string(),
          },
        },
        random_tokens: [
          chance.string(),
          {
            type: 'token',
            data: chance.string(),
          },
        ],
      };

      const tokenResponse = {
        first_name: chance.guid(),
        last_name: chance.guid(),
        card: {
          id: chance.guid(),
          type: 'card',
          mask: {
            number: chance.string(),
            expiration_month: chance.integer(),
            expiration_year: chance.integer(),
          },
          metadata: {
            camelCase: chance.string(),
            snake_case: chance.string(),
          },
        },
        random_tokens: [
          chance.guid(),
          {
            id: chance.guid(),
            type: 'token',
          },
        ],
      };
      /* eslint-enable camelcase */

      client.onPost('/').reply(200, JSON.stringify(tokenResponse));

      expect(
        await bt.tokenize.tokenize(tokens, {
          apiKey: _apiKey,
          correlationId,
        })
      ).toEqual(tokenResponse);
      expect(client.history.post.length).toBe(1);
      expect(client.history.post[0].data).toStrictEqual(JSON.stringify(tokens));
      expect(client.history.post[0].headers).toMatchObject({
        [API_KEY_HEADER]: _apiKey,
        [BT_TRACE_ID_HEADER]: correlationId,
      });
    });

    it('should reject with status >= 400 <= 599', async () => {
      const status = errorStatus();

      client.onPost('/').reply(status);

      const promise = bt.tokenize.tokenize({});

      await expectBasisTheoryApiError(promise, status);
    });
  });
});
