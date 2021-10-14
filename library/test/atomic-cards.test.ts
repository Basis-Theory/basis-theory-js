import MockAdapter from 'axios-mock-adapter';
import { Chance } from 'chance';
import type { TokenType } from '../src';
import { BasisTheory } from '../src';
import { API_KEY_HEADER, BT_TRACE_ID_HEADER } from '../src/common';
import {
  transformAtomicRequestSnakeCase,
  transformAtomicResponseCamelCase,
} from '../src/common/utils';
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
  let bt: BasisTheory;
  let chance: Chance.Chance;
  let apiKey: string;
  let client: MockAdapter;

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
      billingDetails: {
        name: _chance.string(),
        email: _chance.string(),
        phone: _chance.string(),
        address: {
          line1: _chance.string(),
          line2: _chance.string(),
          city: _chance.string(),
          state: _chance.string(),
          postalCode: _chance.string(),
          country: _chance.string(),
        },
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

  describe('retrieve decrypted', () => {
    it('should retrieve decrypted', async () => {
      const id = chance.string();
      const tenantId = chance.string();
      const fingerprint = chance.string();
      const createdBy = chance.string();
      const createdAt = chance.string();

      /* eslint-disable camelcase */
      const metadata = {
        camelCase: chance.string(),
        snake_case: chance.string(),
      };
      const card = {
        number: chance.string(),
        expiration_month: chance.integer(),
        expiration_year: chance.integer(),
        cvc: chance.string(),
      };
      const billingDetails = {
        name: chance.string(),
        email: chance.string(),
        phone: chance.string(),
        address: {
          line1: chance.string(),
          line2: chance.string(),
          city: chance.string(),
          state: chance.string(),
          postal_code: chance.string(),
          country: chance.string(),
        },
      };
      /* eslint-enable camelcase */

      client.onGet(`/${id}/decrypt`).reply(
        200,
        /* eslint-disable camelcase */
        JSON.stringify({
          id,
          tenant_id: tenantId,
          fingerprint,
          type: 'card',
          card,
          billingDetails,
          metadata,
          created_at: createdAt,
          created_by: createdBy,
        })
        /* eslint-enable camelcase */
      );

      expect(await bt.atomicCards.retrieveDecrypted(id)).toStrictEqual(
        /* eslint-disable camelcase */
        transformAtomicResponseCamelCase({
          id,
          tenant_id: tenantId,
          fingerprint,
          type: 'card',
          card,
          billingDetails,
          metadata,
          created_at: createdAt,
          created_by: createdBy,
        })
        /* eslint-enable camelcase */
      );
      expect(client.history.get.length).toBe(1);
      expect(client.history.get[0].url).toStrictEqual(`/${id}/decrypt`);
      expect(client.history.get[0].headers).toMatchObject({
        [API_KEY_HEADER]: expect.any(String),
      });
    });

    it('should retrieve decrypted w/ options', async () => {
      const id = chance.string();
      const tenantId = chance.string();
      const fingerprint = chance.string();
      const createdBy = chance.string();
      const createdAt = chance.string();

      /* eslint-disable camelcase */
      const metadata = {
        camelCase: chance.string(),
        snake_case: chance.string(),
      };
      const card = {
        number: chance.string(),
        expiration_month: chance.integer(),
        expiration_year: chance.integer(),
        cvc: chance.string(),
      };
      const billingDetails = {
        name: chance.string(),
        email: chance.string(),
        phone: chance.string(),
        address: {
          line1: chance.string(),
          line2: chance.string(),
          city: chance.string(),
          state: chance.string(),
          postal_code: chance.string(),
          country: chance.string(),
        },
      };
      /* eslint-enable camelcase */

      const _apiKey = chance.string();
      const correlationId = chance.string();

      client.onGet(`/${id}/decrypt`).reply(
        200,
        /* eslint-disable camelcase */
        JSON.stringify({
          id,
          tenant_id: tenantId,
          fingerprint,
          type: 'card',
          card,
          billingDetails,
          metadata,
          created_at: createdAt,
          created_by: createdBy,
        })
        /* eslint-enable camelcase */
      );

      expect(
        await bt.atomicCards.retrieveDecrypted(id, {
          apiKey: _apiKey,
          correlationId,
        })
      ).toStrictEqual(
        /* eslint-disable camelcase */
        transformAtomicResponseCamelCase({
          id,
          tenant_id: tenantId,
          fingerprint,
          type: 'card',
          card,
          billingDetails,
          metadata,
          created_at: createdAt,
          created_by: createdBy,
        })
        /* eslint-enable camelcase */
      );
      expect(client.history.get.length).toBe(1);
      expect(client.history.get[0].url).toStrictEqual(`/${id}/decrypt`);
      expect(client.history.get[0].headers).toMatchObject({
        [API_KEY_HEADER]: _apiKey,
        [BT_TRACE_ID_HEADER]: correlationId,
      });
    });

    it('should reject with status >= 400 <= 599', async () => {
      const id = chance.string();
      const status = errorStatus();

      client.onGet(`/${id}/decrypt`).reply(status);

      const promise = bt.atomicCards.retrieveDecrypted(id);

      await expectBasisTheoryApiError(promise, status);
    });
  });

  describe('react', () => {
    it('should react', async () => {
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
      const metadata = {
        camelCase: chance.string(),
        snake_case: chance.string(),
      };
      const data = {
        snake_case: chance.string(),
        camelCase: chance.string(),
      };
      /* eslint-enable camelcase */

      const createdBy = chance.string();
      const createdAt = chance.string();

      client.onPost(`/${id}/react`).reply(
        201,
        /* eslint-disable camelcase */
        JSON.stringify({
          id,
          tenant_id: tenantId,
          fingerprint,
          type,
          data,
          metadata,
          created_at: createdAt,
          created_by: createdBy,
        })
        /* eslint-enable camelcase */
      );

      expect(
        await bt.atomicCards.react(id, {
          reactorId,
          requestParameters,
          metadata,
        })
      ).toStrictEqual({
        id,
        tenantId,
        fingerprint,
        type,
        data,
        metadata,
        createdAt,
        createdBy,
      });
      expect(client.history.post.length).toBe(1);
      expect(client.history.post[0].url).toStrictEqual(`/${id}/react`);
      expect(client.history.post[0].data).toStrictEqual(
        /* eslint-disable camelcase */
        JSON.stringify({
          reactor_id: reactorId,
          request_parameters: requestParameters,
          metadata,
        })
        /* eslint-enable camelcase */
      );
      expect(client.history.post[0].headers).toMatchObject({
        [API_KEY_HEADER]: expect.any(String),
      });
    });

    it('should react with options', async () => {
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
      const metadata = {
        camelCase: chance.string(),
        snake_case: chance.string(),
      };
      const data = {
        snake_case: chance.string(),
        camelCase: chance.string(),
      };
      /* eslint-enable camelcase */

      const createdBy = chance.string();
      const createdAt = chance.string();
      const _apiKey = chance.string();
      const correlationId = chance.string();

      client.onPost(`/${id}/react`).reply(
        201,
        /* eslint-disable camelcase */
        JSON.stringify({
          id,
          tenant_id: tenantId,
          fingerprint,
          type,
          data,
          metadata,
          created_at: createdAt,
          created_by: createdBy,
        })
        /* eslint-enable camelcase */
      );

      expect(
        await bt.atomicCards.react(
          id,
          {
            reactorId,
            requestParameters,
            metadata,
          },
          {
            apiKey: _apiKey,
            correlationId,
          }
        )
      ).toStrictEqual({
        id,
        tenantId,
        fingerprint,
        type,
        data,
        metadata,
        createdAt,
        createdBy,
      });
      expect(client.history.post.length).toBe(1);
      expect(client.history.post[0].url).toStrictEqual(`/${id}/react`);
      expect(client.history.post[0].data).toStrictEqual(
        /* eslint-disable camelcase */
        JSON.stringify({
          reactor_id: reactorId,
          request_parameters: requestParameters,
          metadata,
        })
        /* eslint-enable camelcase */
      );
      expect(client.history.post[0].headers).toMatchObject({
        [API_KEY_HEADER]: _apiKey,
        [BT_TRACE_ID_HEADER]: correlationId,
      });
    });

    it('should reject with status >= 400 <= 599', async () => {
      const id = chance.string();
      const status = errorStatus();

      client.onPost(`/${id}/react`).reply(status);

      const promise = bt.atomicCards.react(id, { reactorId: chance.string() });

      await expectBasisTheoryApiError(promise, status);
    });
  });

  describe('retrieve reaction', () => {
    it('should retrieve reaction', async () => {
      const atomicCardId = chance.string();
      const reactionTokenId = chance.string();
      const tenantId = chance.string();
      const type = chance.string() as TokenType;

      /* eslint-disable camelcase */
      const metadata = {
        camelCase: chance.string(),
        snake_case: chance.string(),
      };
      const data = {
        snake_case: chance.string(),
        camelCase: chance.string(),
      };
      /* eslint-enable camelcase */

      const createdBy = chance.string();
      const createdAt = chance.string();

      client.onGet(`/${atomicCardId}/reaction/${reactionTokenId}`).reply(
        200,
        /* eslint-disable camelcase */
        JSON.stringify({
          id: reactionTokenId,
          tenant_id: tenantId,
          type,
          data,
          metadata,
          created_at: createdAt,
          created_by: createdBy,
        })
        /* eslint-enable camelcase */
      );

      expect(
        await bt.atomicCards.retrieveReaction(atomicCardId, reactionTokenId)
      ).toStrictEqual({
        id: reactionTokenId,
        tenantId,
        type,
        data,
        metadata,
        createdAt,
        createdBy,
      });
      expect(client.history.get.length).toBe(1);
      expect(client.history.get[0].url).toStrictEqual(
        `/${atomicCardId}/reaction/${reactionTokenId}`
      );
      expect(client.history.get[0].headers).toMatchObject({
        [API_KEY_HEADER]: expect.any(String),
      });
    });

    it('should retrieve reaction with options', async () => {
      const atomicCardId = chance.string();
      const reactionTokenId = chance.string();
      const tenantId = chance.string();
      const type = chance.string() as TokenType;

      /* eslint-disable camelcase */
      const metadata = {
        camelCase: chance.string(),
        snake_case: chance.string(),
      };
      const data = {
        snake_case: chance.string(),
        camelCase: chance.string(),
      };
      /* eslint-enable camelcase */

      const createdBy = chance.string();
      const createdAt = chance.string();
      const _apiKey = chance.string();
      const correlationId = chance.string();

      client.onGet(`/${atomicCardId}/reaction/${reactionTokenId}`).reply(
        200,
        /* eslint-disable camelcase */
        JSON.stringify({
          id: reactionTokenId,
          tenant_id: tenantId,
          type,
          data,
          metadata,
          created_at: createdAt,
          created_by: createdBy,
        })
        /* eslint-enable camelcase */
      );

      expect(
        await bt.atomicCards.retrieveReaction(atomicCardId, reactionTokenId, {
          apiKey: _apiKey,
          correlationId,
        })
      ).toStrictEqual({
        id: reactionTokenId,
        tenantId,
        type,
        data,
        metadata,
        createdAt,
        createdBy,
      });
      expect(client.history.get.length).toBe(1);
      expect(client.history.get[0].url).toStrictEqual(
        `/${atomicCardId}/reaction/${reactionTokenId}`
      );
      expect(client.history.get[0].headers).toMatchObject({
        [API_KEY_HEADER]: _apiKey,
        [BT_TRACE_ID_HEADER]: correlationId,
      });
    });

    it('should reject with status >= 400 <= 599', async () => {
      const atomicCardId = chance.string();
      const reactionTokenId = chance.string();
      const status = errorStatus();

      client
        .onGet(`/${atomicCardId}/reaction/${reactionTokenId}`)
        .reply(status);

      const promise = bt.atomicCards.retrieveReaction(
        atomicCardId,
        reactionTokenId
      );

      await expectBasisTheoryApiError(promise, status);
    });
  });
});