import MockAdapter from 'axios-mock-adapter';
import { Chance } from 'chance';
import { BasisTheory } from '@/BasisTheory';
import {
  API_KEY_HEADER,
  BT_IDEMPOTENCY_KEY_HEADER,
  BT_TRACE_ID_HEADER,
} from '@/common';
import { transformReactorRequestSnakeCase } from '@/common/utils';
import { TokenType } from '@/types/models';
import type { BasisTheory as IBasisTheory, ReactRequest } from '@/types/sdk';
import {
  testCRUD,
  mockServiceClient,
  errorStatus,
  expectBasisTheoryApiError,
} from './setup/utils';

describe('Reactors', () => {
  let bt: IBasisTheory,
    chance: Chance.Chance,
    apiKey: string,
    client: MockAdapter;

  beforeAll(async () => {
    chance = new Chance();
    apiKey = chance.string();
    bt = await new BasisTheory().init(apiKey);
    client = mockServiceClient(bt.reactors);
  });

  beforeEach(() => {
    client.resetHandlers();
    client.resetHistory();
  });

  describe('CRUD', () => {
    const _chance = new Chance();
    const createPayload = {
      name: _chance.string(),
      configuration: {
        // eslint-disable-next-line camelcase
        snake_case: _chance.string(),
        camelCase: _chance.string(),
      },
      formula: {
        id: _chance.string(),
      },
    };

    const updatePayload = {
      name: _chance.string(),
      configuration: {
        // eslint-disable-next-line camelcase
        snake_case: _chance.string(),
        camelCase: _chance.string(),
      },
    };

    const transformedCreatePayload = transformReactorRequestSnakeCase(
      createPayload
    );

    const transformedUpdatePayload = transformReactorRequestSnakeCase(
      updatePayload
    );

    testCRUD(() => ({
      service: bt.reactors,
      client,
      createPayload,
      transformedCreatePayload,
      updatePayload,
      transformedUpdatePayload,
    }));
  });

  describe('react', () => {
    test('should react', async () => {
      const id = chance.string();
      const reactorId = chance.string();
      const tenantId = chance.string();
      const fingerprint = chance.string();
      const type = chance.string() as TokenType;

      /* eslint-disable camelcase */
      const args = {
        first: chance.string(),
        second: chance.string(),
        nested: {
          first_nested: chance.string(),
          second_nested: chance.string(),
        },
      };

      const reactRequest = {
        args,
      } as ReactRequest;
      const data = {
        first_nested: chance.string(),
        second_nested: chance.string(),
      };
      /* eslint-enable camelcase */

      const createdBy = chance.string();
      const createdAt = chance.string();
      const modifiedBy = chance.string();
      const modifiedAt = chance.string();

      client.onPost(`/${reactorId}/react`).reply(
        200,
        /* eslint-disable camelcase */
        JSON.stringify({
          tokens: {
            id,
            tenant_id: tenantId,
            fingerprint,
            type,
            data,
            created_at: createdAt,
            created_by: createdBy,
            modified_at: modifiedAt,
            modified_by: modifiedBy,
          },
          raw: data,
        })
        /* eslint-enable camelcase */
      );

      expect(await bt.reactors.react(reactorId, reactRequest)).toStrictEqual({
        /* eslint-disable camelcase */
        tokens: {
          id,
          tenant_id: tenantId,
          fingerprint,
          type,
          data,
          created_at: createdAt,
          created_by: createdBy,
          modified_at: modifiedAt,
          modified_by: modifiedBy,
        },
        raw: data,
        /* eslint-enable camelcase */
      });
      expect(client.history.post).toHaveLength(1);
      expect(client.history.post[0].url).toStrictEqual(`/${reactorId}/react`);
      expect(client.history.post[0].data).toStrictEqual(
        JSON.stringify({
          args,
        })
      );
      expect(client.history.post[0].headers).toMatchObject({
        [API_KEY_HEADER]: expect.any(String),
      });
    });

    test('should react with options', async () => {
      const id = chance.string();
      const reactorId = chance.string();
      const tenantId = chance.string();
      const fingerprint = chance.string();
      const type = chance.string() as TokenType;

      /* eslint-disable camelcase */
      const args = {
        first: chance.string(),
        second: chance.string(),
        nested: {
          first_nested: chance.string(),
          second_nested: chance.string(),
        },
      };

      const reactRequest = {
        args,
      };
      const data = {
        first_nested: chance.string(),
        second_nested: chance.string(),
      };
      /* eslint-enable camelcase */

      const createdBy = chance.string();
      const createdAt = chance.string();
      const modifiedBy = chance.string();
      const modifiedAt = chance.string();
      const _apiKey = chance.string();
      const correlationId = chance.string();
      const idempotencyKey = chance.string();

      client.onPost(`/${reactorId}/react`).reply(
        200,
        /* eslint-disable camelcase */
        JSON.stringify({
          tokens: {
            id,
            tenant_id: tenantId,
            fingerprint,
            type,
            data,
            created_at: createdAt,
            created_by: createdBy,
            modified_at: modifiedAt,
            modified_by: modifiedBy,
          },
          raw: data,
        })
        /* eslint-enable camelcase */
      );

      expect(
        await bt.reactors.react(reactorId, reactRequest, {
          apiKey: _apiKey,
          correlationId,
          idempotencyKey,
        })
      ).toStrictEqual({
        /* eslint-disable camelcase */
        tokens: {
          id,
          tenant_id: tenantId,
          fingerprint,
          type,
          data,
          created_at: createdAt,
          created_by: createdBy,
          modified_at: modifiedAt,
          modified_by: modifiedBy,
        },
        raw: data,
        /* eslint-enable camelcase */
      });
      expect(client.history.post).toHaveLength(1);
      expect(client.history.post[0].url).toStrictEqual(`/${reactorId}/react`);
      expect(client.history.post[0].data).toStrictEqual(
        JSON.stringify({
          args,
        })
      );
      expect(client.history.post[0].headers).toMatchObject({
        [API_KEY_HEADER]: _apiKey,
        [BT_TRACE_ID_HEADER]: correlationId,
        [BT_IDEMPOTENCY_KEY_HEADER]: idempotencyKey,
      });
    });

    test('should react with callbackUrl and timeout', async () => {
      const id = chance.string();
      const reactorId = chance.string();
      const tenantId = chance.string();
      const fingerprint = chance.string();
      const type = chance.string() as TokenType;

      /* eslint-disable camelcase */
      const args = {
        first: chance.string(),
        second: chance.string(),
        nested: {
          first_nested: chance.string(),
          second_nested: chance.string(),
        },
      };

      const timeout = chance.minute();
      const callbackUrl = chance.url();

      const reactRequest = {
        args,
        callbackUrl,
        timeout,
      };
      const data = {
        first_nested: chance.string(),
        second_nested: chance.string(),
      };
      /* eslint-enable camelcase */

      const createdBy = chance.string();
      const createdAt = chance.string();
      const modifiedBy = chance.string();
      const modifiedAt = chance.string();
      const _apiKey = chance.string();
      const correlationId = chance.string();
      const idempotencyKey = chance.string();

      client.onPost(`/${reactorId}/react`).reply(
        200,
        /* eslint-disable camelcase */
        JSON.stringify({
          tokens: {
            id,
            tenant_id: tenantId,
            fingerprint,
            type,
            data,
            created_at: createdAt,
            created_by: createdBy,
            modified_at: modifiedAt,
            modified_by: modifiedBy,
          },
          raw: data,
        })
        /* eslint-enable camelcase */
      );

      expect(
        await bt.reactors.react(reactorId, reactRequest, {
          apiKey: _apiKey,
          correlationId,
          idempotencyKey,
        })
      ).toStrictEqual({
        /* eslint-disable camelcase */
        tokens: {
          id,
          tenant_id: tenantId,
          fingerprint,
          type,
          data,
          created_at: createdAt,
          created_by: createdBy,
          modified_at: modifiedAt,
          modified_by: modifiedBy,
        },
        raw: data,
        /* eslint-enable camelcase */
      });
      expect(client.history.post).toHaveLength(1);
      expect(client.history.post[0].url).toStrictEqual(`/${reactorId}/react`);
      expect(client.history.post[0].data).toStrictEqual(
        JSON.stringify({
          args,
          callbackUrl,
          timeout,
        })
      );
      expect(client.history.post[0].headers).toMatchObject({
        [API_KEY_HEADER]: _apiKey,
        [BT_TRACE_ID_HEADER]: correlationId,
        [BT_IDEMPOTENCY_KEY_HEADER]: idempotencyKey,
      });
    });

    test('should reject with status >= 400 <= 599', async () => {
      const reactorId = chance.string();
      const status = errorStatus();

      /* eslint-disable camelcase */
      const args = {
        first: chance.string(),
        second: chance.string(),
        nested: {
          first_nested: chance.string(),
          second_nested: chance.string(),
        },
      };

      const reactRequest = {
        args,
      };
      /* eslint-enable camelcase */

      client.onPost(`/${reactorId}/react`).reply(status);

      const promise = bt.reactors.react(reactorId, reactRequest);

      await expectBasisTheoryApiError(promise, status);
    });
  });
});
