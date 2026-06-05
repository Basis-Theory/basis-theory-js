import type MockAdapter from 'axios-mock-adapter';
import { Chance } from 'chance';
import { BasisTheory } from '@/BasisTheory';
import {
  API_KEY_HEADER,
  BT_IDEMPOTENCY_KEY_HEADER,
  BT_TRACE_ID_HEADER,
} from '@/common';
import type { BasisTheory as IBasisTheory } from '@/types/sdk';
import {
  errorStatus,
  expectBasisTheoryApiError,
  mockServiceClient,
  testRetrieve,
} from './setup/utils';

describe('Application Templates', () => {
  let bt: IBasisTheory,
    chance: Chance.Chance,
    apiKey: string,
    client: MockAdapter;

  beforeAll(async () => {
    chance = new Chance();
    apiKey = chance.string();
    bt = await new BasisTheory().init(apiKey);
    client = mockServiceClient(bt.applicationTemplates);
  });
  beforeEach(() => {
    client.resetHandlers();
    client.resetHistory();
  });

  describe('list', () => {
    test('should list', async () => {
      const id = chance.string();
      const applicationType = chance.string();
      const templateType = chance.string();

      client.onGet('/').reply(
        200,
        JSON.stringify([
          {
            id,
            application_type: applicationType,
            template_type: templateType,
          },
        ])
      );

      expect(await bt.applicationTemplates.list()).toStrictEqual([
        {
          id,
          applicationType,
          templateType,
        },
      ]);
      expect(client.history.get).toHaveLength(1);
      expect(client.history.get[0].headers).toMatchObject({
        [API_KEY_HEADER]: apiKey,
      });
    });
    test('should list with options', async () => {
      const id = chance.string();
      const applicationType = chance.string();
      const templateType = chance.string();
      const _apiKey = chance.string();
      const correlationId = chance.string();
      const idempotencyKey = chance.string();

      client.onGet('/').reply(
        200,
        JSON.stringify([
          {
            id,
            application_type: applicationType,
            template_type: templateType,
          },
        ])
      );

      expect(
        await bt.applicationTemplates.list({
          apiKey: _apiKey,
          correlationId,
          idempotencyKey,
        })
      );
      expect(client.history.get).toHaveLength(1);
      expect(client.history.get[0].headers).toMatchObject({
        [API_KEY_HEADER]: _apiKey,
        [BT_TRACE_ID_HEADER]: correlationId,
        [BT_IDEMPOTENCY_KEY_HEADER]: idempotencyKey,
      });
    });
    test('should reject with status >= 400 <= 599', async () => {
      const status = errorStatus();

      client.onGet('/').reply(status);

      const promise = bt.applicationTemplates.list();

      await expectBasisTheoryApiError(promise, status);
    });
  });

  describe('retrieve', () => {
    testRetrieve(() => ({
      service: bt.applicationTemplates,
      client,
    }));
  });
});
