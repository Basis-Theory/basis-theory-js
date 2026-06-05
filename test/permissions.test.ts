import MockAdapter from 'axios-mock-adapter';
import { Chance } from 'chance';
import { BasisTheory } from '@/BasisTheory';
import {
  BT_TRACE_ID_HEADER,
  API_KEY_HEADER,
  BT_IDEMPOTENCY_KEY_HEADER,
} from '@/common';
import type { ApplicationType } from '@/types/models';
import type { BasisTheory as IBasisTheory } from '@/types/sdk';
import {
  errorStatus,
  expectBasisTheoryApiError,
  mockServiceClient,
} from './setup/utils';

describe('Permissions', () => {
  let bt: IBasisTheory,
    chance: Chance.Chance,
    apiKey: string,
    client: MockAdapter;

  beforeAll(async () => {
    chance = new Chance();
    apiKey = chance.string();
    bt = await new BasisTheory().init(apiKey);
    client = mockServiceClient(bt.permissions);
  });

  beforeEach(() => {
    client.resetHandlers();
    client.resetHistory();
  });

  describe('list permissions', () => {
    test('should list permissions', async () => {
      const type = chance.string();
      const description = chance.string();
      const applicationTypes = [chance.string() as ApplicationType];

      client.onGet().reply(
        200,
        JSON.stringify([
          {
            type,
            description,
            application_types: applicationTypes,
          },
        ])
      );

      expect(await bt.permissions.list()).toStrictEqual([
        {
          type,
          description,
          applicationTypes,
        },
      ]);

      expect(client.history.get).toHaveLength(1);
      expect(client.history.get[0].headers).toMatchObject({
        [API_KEY_HEADER]: apiKey,
      });
    });

    test('should list permissions w/ query', async () => {
      const type = chance.string();
      const description = chance.string();
      const applicationTypes = [
        chance.string({ alpha: true }) as ApplicationType,
      ];

      const query = {
        applicationType: applicationTypes[0],
      };
      const url = `/?application_type=${query.applicationType}`;

      client.onGet(url).reply(
        200,
        JSON.stringify([
          {
            type,
            description,
            application_types: applicationTypes,
          },
        ])
      );

      expect(await bt.permissions.list(query)).toStrictEqual([
        {
          type,
          description,
          applicationTypes,
        },
      ]);
      expect(client.history.get).toHaveLength(1);
      expect(client.history.get[0].url).toStrictEqual(url);
      expect(client.history.get[0].headers).toMatchObject({
        [API_KEY_HEADER]: expect.any(String),
      });
    });

    test('should list permissions w/ options', async () => {
      const type = chance.string();
      const description = chance.string();
      const applicationTypes = [chance.string() as ApplicationType];
      const _apiKey = chance.string();
      const correlationId = chance.string();
      const idempotencyKey = chance.string();

      client.onGet().reply(
        200,
        JSON.stringify([
          {
            type,
            description,
            application_types: applicationTypes,
          },
        ])
      );

      expect(
        await bt.permissions.list(undefined, {
          apiKey: _apiKey,
          correlationId,
          idempotencyKey,
        })
      ).toStrictEqual([
        {
          type,
          description,
          applicationTypes,
        },
      ]);

      expect(client.history.get).toHaveLength(1);
      expect(client.history.get[0].headers).toMatchObject({
        [API_KEY_HEADER]: _apiKey,
        [BT_TRACE_ID_HEADER]: correlationId,
        [BT_IDEMPOTENCY_KEY_HEADER]: idempotencyKey,
      });
    });

    test('should reject with status >= 400 <= 599', async () => {
      const status = errorStatus();

      client.onGet().reply(status);

      const promise = bt.permissions.list();

      await expectBasisTheoryApiError(promise, status);
    });
  });
});
