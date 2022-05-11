import type {
  AtomicCard,
  UpdateAtomicCard,
  TokenType,
} from '@basis-theory/basis-theory-elements-interfaces/models';
import type { BasisTheory as IBasisTheory } from '@basis-theory/basis-theory-elements-interfaces/sdk';
import MockAdapter from 'axios-mock-adapter';
import { Chance } from 'chance';
import { BasisTheory } from '../src';
import { API_KEY_HEADER, BT_TRACE_ID_HEADER } from '../src/common';
import { transformAtomicRequestSnakeCase } from '../src/common/utils';
import {
  testCreate,
  testRetrieve,
  testList,
  errorStatus,
  expectBasisTheoryApiError,
  mockServiceClient,
  testDelete,
} from './setup/utils';

describe('Atomic Cards', () => {
  let bt: IBasisTheory,
    chance: Chance.Chance,
    apiKey: string,
    client: MockAdapter;

  beforeAll(async () => {
    chance = new Chance();
    apiKey = chance.string();
    bt = await new BasisTheory().init(apiKey);
    client = mockServiceClient(bt.atomicCards);
  });

  beforeEach(() => {
    client.resetHandlers();
    client.resetHistory();
  });

  describe('CRUD (no update)', () => {
    const _chance = new Chance();

    const createPayload = {
      card: {
        number: _chance.string(),
        expirationMonth: _chance.integer(),
        expirationYear: _chance.integer(),
        cvc: _chance.string(),
      },
      metadata: {
        camelCase: _chance.string(),
        // eslint-disable-next-line camelcase
        snake_case: _chance.string(),
      },
    };

    const transformedCreatePayload = transformAtomicRequestSnakeCase(
      createPayload
    );

    testCreate(() => ({
      service: bt.atomicCards,
      client,
      createPayload,
      transformedCreatePayload,
    }));

    testRetrieve(() => ({
      service: bt.atomicCards,
      client,
    }));

    testDelete(() => ({
      service: bt.atomicCards,
      client,
    }));

    testList(() => ({
      service: bt.atomicCards,
      client,
    }));
  });

  describe('update', () => {
    let atomicCardId: string;
    let updateCardRequest: UpdateAtomicCard;
    let expectedUpdatedCard: AtomicCard;

    beforeEach(() => {
      atomicCardId = chance.string();
      updateCardRequest = {
        card: {
          number: chance.string(),
          expirationMonth: chance.integer(),
          expirationYear: chance.integer(),
        },
      };
      expectedUpdatedCard = {
        card: {
          number: chance.string(),
          expirationMonth: chance.integer(),
          expirationYear: chance.integer(),
        },
        createdBy: chance.string(),
        createdAt: chance.string(),
        modifiedBy: chance.string(),
        modifiedAt: chance.string(),
        id: atomicCardId,
        type: 'card',
        tenantId: chance.string(),
        fingerprint: chance.string(),
      };
    });

    test('should update an atomic card', async () => {
      client
        .onPatch(`/${atomicCardId}`)
        .reply(200, JSON.stringify(expectedUpdatedCard));

      expect(
        await bt.atomicCards.update(atomicCardId, updateCardRequest)
      ).toStrictEqual(expectedUpdatedCard);
      expect(client.history.patch).toHaveLength(1);
      expect(client.history.patch[0].data).toStrictEqual(
        /* eslint-disable camelcase */
        JSON.stringify({
          card: {
            number: updateCardRequest.card?.number,
            expiration_month: updateCardRequest.card?.expirationMonth,
            expiration_year: updateCardRequest.card?.expirationYear,
          },
        })
        /* eslint-enable camelcase */
      );
      expect(client.history.patch[0].headers).toMatchObject({
        [API_KEY_HEADER]: expect.any(String),
      });
    });

    test('should update with options', async () => {
      const _apiKey = chance.string();
      const correlationId = chance.string();

      client
        .onPatch(`/${atomicCardId}`)
        .reply(200, JSON.stringify(expectedUpdatedCard));

      expect(
        await bt.atomicCards.update(atomicCardId, updateCardRequest, {
          apiKey: _apiKey,
          correlationId,
        })
      ).toStrictEqual(expectedUpdatedCard);
      expect(client.history.patch).toHaveLength(1);
      expect(client.history.patch[0].data).toStrictEqual(
        /* eslint-disable camelcase */
        JSON.stringify({
          card: {
            number: updateCardRequest.card?.number,
            expiration_month: updateCardRequest.card?.expirationMonth,
            expiration_year: updateCardRequest.card?.expirationYear,
          },
        })
        /* eslint-enable camelcase */
      );
      expect(client.history.patch[0].headers).toMatchObject({
        [API_KEY_HEADER]: _apiKey,
        [BT_TRACE_ID_HEADER]: correlationId,
      });
    });

    test('should reject with status >= 400 <= 599', async () => {
      const status = errorStatus();

      client.onPatch(`/${atomicCardId}`).reply(status);

      const promise = bt.atomicCards.update(atomicCardId, updateCardRequest);

      await expectBasisTheoryApiError(promise, status);
    });
  });

  describe('react', () => {
    test('should react', async () => {
      const id = chance.string();
      const reactorId = chance.string();
      const tenantId = chance.string();
      const fingerprint = chance.string();
      const type = chance.string() as TokenType;

      /* eslint-disable camelcase */
      const requestParameters = {
        snake_case: chance.string(),
        camelCase: chance.string(),
        object: {
          snake_case: chance.string(),
          camelCase: chance.string(),
        },
      };
      const data = {
        snake_case: chance.string(),
        camelCase: chance.string(),
      };
      /* eslint-enable camelcase */

      const createdBy = chance.string();
      const createdAt = chance.string();
      const modifiedBy = chance.string();
      const modifiedAt = chance.string();

      client.onPost(`/${id}/react`).reply(
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
        await bt.atomicCards.react(id, {
          reactorId,
          requestParameters,
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
      expect(client.history.post[0].url).toStrictEqual(`/${id}/react`);
      expect(client.history.post[0].data).toStrictEqual(
        /* eslint-disable camelcase */
        JSON.stringify({
          reactor_id: reactorId,
          request_parameters: requestParameters,
        })
        /* eslint-enable camelcase */
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
      const requestParameters = {
        snake_case: chance.string(),
        camelCase: chance.string(),
        object: {
          snake_case: chance.string(),
          camelCase: chance.string(),
        },
      };
      const data = {
        snake_case: chance.string(),
        camelCase: chance.string(),
      };
      /* eslint-enable camelcase */

      const createdBy = chance.string();
      const createdAt = chance.string();
      const modifiedBy = chance.string();
      const modifiedAt = chance.string();
      const _apiKey = chance.string();
      const correlationId = chance.string();

      client.onPost(`/${id}/react`).reply(
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
        await bt.atomicCards.react(
          id,
          {
            reactorId,
            requestParameters,
          },
          {
            apiKey: _apiKey,
            correlationId,
          }
        )
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
      expect(client.history.post[0].url).toStrictEqual(`/${id}/react`);
      expect(client.history.post[0].data).toStrictEqual(
        /* eslint-disable camelcase */
        JSON.stringify({
          reactor_id: reactorId,
          request_parameters: requestParameters,
        })
        /* eslint-enable camelcase */
      );
      expect(client.history.post[0].headers).toMatchObject({
        [API_KEY_HEADER]: _apiKey,
        [BT_TRACE_ID_HEADER]: correlationId,
      });
    });

    test('should reject with status >= 400 <= 599', async () => {
      const id = chance.string();
      const status = errorStatus();

      client.onPost(`/${id}/react`).reply(status);

      const promise = bt.atomicCards.react(id, { reactorId: chance.string() });

      await expectBasisTheoryApiError(promise, status);
    });
  });
});
