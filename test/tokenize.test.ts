import MockAdapter from 'axios-mock-adapter';
import { Chance } from 'chance';
import { BasisTheory } from '@/BasisTheory';
import { BT_TRACE_ID_HEADER, API_KEY_HEADER } from '@/common';
import {
  DATA_CLASSIFICATIONS,
  DATA_IMPACT_LEVELS,
  DATA_RESTRICTION_POLICIES,
} from '@/types/models';
import type { BasisTheory as IBasisTheory } from '@/types/sdk';
import {
  errorStatus,
  expectBasisTheoryApiError,
  mockServiceClient,
} from './setup/utils';

describe('Tokenize', () => {
  let bt: IBasisTheory,
    chance: Chance.Chance,
    apiKey: string,
    client: MockAdapter;

  beforeAll(async () => {
    chance = new Chance();
    apiKey = chance.string();
    bt = await new BasisTheory().init(apiKey);
    // this is the only service we need to do this
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    client = mockServiceClient((bt as any)._tokenize);
  });

  beforeEach(() => {
    client.resetHandlers();
    client.resetHistory();
  });

  describe('tokenize', () => {
    test('should tokenize', async () => {
      /* eslint-disable camelcase */
      const tokens = {
        first_name: chance.string(),
        last_name: chance.string(),
        card: {
          id: chance.string(),
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
          privacy: {
            impactLevel: chance.pickone([...DATA_IMPACT_LEVELS]),
            classification: chance.pickone([...DATA_CLASSIFICATIONS]),
            restrictionPolicy: chance.pickone([...DATA_RESTRICTION_POLICIES]),
          },
          container: `/${chance.string()}/`,
          searchIndexes: [chance.string(), chance.string()],
          fingerprintExpression: chance.string(),
          mask: {
            number: chance.string(),
            expiration_month: chance.integer(),
            expiration_year: chance.integer(),
          },
          expiresAt: chance.date().toString(),
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
          id: chance.string(),
          type: 'card',
          data: {
            number: chance.string(),
            expiration_month: chance.integer(),
            expiration_year: chance.integer(),
          },
          metadata: {
            camelCase: chance.string(),
            snake_case: chance.string(),
          },
          privacy: {
            impactLevel: chance.pickone([...DATA_IMPACT_LEVELS]),
            classification: chance.pickone([...DATA_CLASSIFICATIONS]),
            restrictionPolicy: chance.pickone([...DATA_RESTRICTION_POLICIES]),
          },
          container: `/${chance.string()}/`,
          searchIndexes: [chance.string(), chance.string()],
          fingerprintExpression: chance.string(),
          mask: {
            number: chance.string(),
            expiration_month: chance.integer(),
            expiration_year: chance.integer(),
          },
          expiresAt: chance.date().toString(),
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

      expect(await bt.tokenize(tokens)).toStrictEqual(tokenResponse);
      expect(client.history.post).toHaveLength(1);
      expect(client.history.post[0].data).toStrictEqual(JSON.stringify(tokens));
      expect(client.history.post[0].headers).toMatchObject({
        [API_KEY_HEADER]: apiKey,
      });
    });

    test('should tokenize with options', async () => {
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
          container: `/${chance.string()}/`,
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
          container: `/${chance.string()}/`,
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
        await bt.tokenize(tokens, {
          apiKey: _apiKey,
          correlationId,
        })
      ).toStrictEqual(tokenResponse);
      expect(client.history.post).toHaveLength(1);
      expect(client.history.post[0].data).toStrictEqual(JSON.stringify(tokens));
      expect(client.history.post[0].headers).toMatchObject({
        [API_KEY_HEADER]: _apiKey,
        [BT_TRACE_ID_HEADER]: correlationId,
      });
    });

    test('should reject with status >= 400 <= 599', async () => {
      const status = errorStatus();

      client.onPost('/').reply(status);

      const promise = bt.tokenize({});

      await expectBasisTheoryApiError(promise, status);
    });
  });
});
