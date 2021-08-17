import { Chance } from 'chance';
import MockAdapter from 'axios-mock-adapter';
import type { TokenType } from '../src';
import { BasisTheory } from '../src';
import {
  testCreate,
  testRetrieve,
  testList,
  errorStatus,
  expectBasisTheoryApiError,
  mockServiceClient,
  testDelete,
} from './setup/utils';
import {
  API_KEY_HEADER,
  BT_TRACE_ID_HEADER,
  transformAtomicRequestSnakeCase,
} from '../src/common';

describe('Atomic Banks', () => {
  let bt: BasisTheory;
  let chance: Chance.Chance;
  let apiKey: string;
  let client: MockAdapter;

  beforeAll(async () => {
    chance = new Chance();
    apiKey = chance.string();
    bt = await new BasisTheory().init(apiKey);
    client = mockServiceClient(bt.atomicBanks);
  });

  beforeEach(() => {
    client.resetHandlers();
    client.resetHistory();
  });

  describe('CRUD (no update)', () => {
    const _chance = new Chance();

    const createPayload = {
      bank: {
        routingNumber: _chance.string(),
        accountNumber: _chance.string(),
      },
      metadata: {
        camelCase: _chance.string(),
        snake_case: _chance.string(),
      },
    };

    const transformedCreatePayload = transformAtomicRequestSnakeCase(
      createPayload
    );

    testCreate(() => ({
      service: bt.atomicBanks,
      client,
      createPayload,
      transformedCreatePayload,
    }));

    testRetrieve(() => ({
      service: bt.atomicBanks,
      client,
    }));

    testDelete(() => ({
      service: bt.atomicBanks,
      client,
    }));

    testList(() => ({
      service: bt.atomicBanks,
      client,
    }));
  });

  describe('retrieve decrypted', () => {
    it('should retrieve decrypted', async () => {
      const id = chance.string();
      const tenantId = chance.string();
      const routingNumber = chance.string();
      const accountNumber = chance.string();
      const metadata = {
        camelCase: chance.string(),
        snake_case: chance.string(),
      };
      const createdBy = chance.string();
      const createdAt = chance.string();

      client.onGet(`/${id}/decrypt`).reply(200, {
        id,
        tenant_id: tenantId,
        type: 'bank',
        bank: {
          routing_number: routingNumber,
          account_number: accountNumber,
        },
        metadata,
        created_at: createdAt,
        created_by: createdBy,
      });

      expect(await bt.atomicBanks.retrieveDecrypted(id)).toStrictEqual({
        id,
        tenantId,
        type: 'bank',
        bank: {
          routingNumber,
          accountNumber,
        },
        metadata,
        createdAt,
        createdBy,
      });
      expect(client.history.get.length).toBe(1);
      expect(client.history.get[0].url).toStrictEqual(`/${id}/decrypt`);
      expect(client.history.get[0].headers).toMatchObject({
        [API_KEY_HEADER]: expect.any(String),
      });
    });

    it('should retrieve decrypted with options', async () => {
      const id = chance.string();
      const tenantId = chance.string();
      const routingNumber = chance.string();
      const accountNumber = chance.string();
      const metadata = {
        camelCase: chance.string(),
        snake_case: chance.string(),
      };
      const createdBy = chance.string();
      const createdAt = chance.string();
      const _apiKey = chance.string();
      const correlationId = chance.string();

      client.onGet(`/${id}/decrypt`).reply(200, {
        id,
        tenant_id: tenantId,
        type: 'bank',
        bank: {
          routing_number: routingNumber,
          account_number: accountNumber,
        },
        metadata,
        created_at: createdAt,
        created_by: createdBy,
      });

      expect(
        await bt.atomicBanks.retrieveDecrypted(id, {
          apiKey: _apiKey,
          correlationId,
        })
      ).toStrictEqual({
        id,
        tenantId,
        type: 'bank',
        bank: {
          routingNumber,
          accountNumber,
        },
        metadata,
        createdAt,
        createdBy,
      });
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

      const promise = bt.atomicBanks.retrieveDecrypted(id);

      await expectBasisTheoryApiError(promise, status);
    });
  });

  describe('react', () => {
    it('should react', async () => {
      const id = chance.string();
      const reactorId = chance.string();
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
      const tenantId = chance.string();
      const type = chance.string() as TokenType;
      const data = {
        snake_case: chance.string(),
        camelCase: chance.string(),
      };
      const createdBy = chance.string();
      const createdAt = chance.string();

      client.onPost(`/${id}/react`).reply(201, {
        id,
        tenant_id: tenantId,
        type,
        data,
        metadata,
        created_at: createdAt,
        created_by: createdBy,
      });

      expect(
        await bt.atomicBanks.react(id, {
          reactorId,
          requestParameters,
          metadata,
        })
      ).toStrictEqual({
        id,
        tenantId,
        type,
        data,
        metadata,
        createdAt,
        createdBy,
      });
      expect(client.history.post.length).toBe(1);
      expect(client.history.post[0].url).toStrictEqual(`/${id}/react`);
      expect(client.history.post[0].data).toStrictEqual({
        reactor_id: reactorId,
        request_parameters: requestParameters,
        metadata: metadata,
      });
      expect(client.history.post[0].headers).toMatchObject({
        [API_KEY_HEADER]: expect.any(String),
      });
    });

    it('should react with options', async () => {
      const id = chance.string();
      const reactorId = chance.string();
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
      const tenantId = chance.string();
      const type = chance.string() as TokenType;
      const data = {
        snake_case: chance.string(),
        camelCase: chance.string(),
      };
      const createdBy = chance.string();
      const createdAt = chance.string();
      const _apiKey = chance.string();
      const correlationId = chance.string();

      client.onPost(`/${id}/react`).reply(201, {
        id,
        tenant_id: tenantId,
        type,
        data,
        metadata,
        created_at: createdAt,
        created_by: createdBy,
      });

      expect(
        await bt.atomicBanks.react(
          id,
          {
            reactorId,
            requestParameters,
            metadata,
          },
          { apiKey: _apiKey, correlationId }
        )
      ).toStrictEqual({
        id,
        tenantId,
        type,
        data,
        metadata,
        createdAt,
        createdBy,
      });
      expect(client.history.post.length).toBe(1);
      expect(client.history.post[0].url).toStrictEqual(`/${id}/react`);
      expect(client.history.post[0].data).toStrictEqual({
        reactor_id: reactorId,
        request_parameters: requestParameters,
        metadata: metadata,
      });
      expect(client.history.post[0].headers).toMatchObject({
        [API_KEY_HEADER]: _apiKey,
        [BT_TRACE_ID_HEADER]: correlationId,
      });
    });

    it('should reject with status >= 400 <= 599', async () => {
      const id = chance.string();
      const status = errorStatus();

      client.onPost(`/${id}/react`).reply(status);

      const promise = bt.atomicBanks.react(id, { reactorId: chance.string() });

      await expectBasisTheoryApiError(promise, status);
    });
  });

  describe('retrieve reaction', () => {
    it('should retrieve reaction', async () => {
      const atomicBankId = chance.string();
      const reactionTokenId = chance.string();
      const metadata = {
        camelCase: chance.string(),
        snake_case: chance.string(),
      };
      const tenantId = chance.string();
      const type = chance.string() as TokenType;
      const data = {
        snake_case: chance.string(),
        camelCase: chance.string(),
      };
      const createdBy = chance.string();
      const createdAt = chance.string();

      client.onGet(`/${atomicBankId}/reaction/${reactionTokenId}`).reply(200, {
        id: reactionTokenId,
        tenant_id: tenantId,
        type,
        data,
        metadata,
        created_at: createdAt,
        created_by: createdBy,
      });

      expect(
        await bt.atomicBanks.retrieveReaction(atomicBankId, reactionTokenId)
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
        `/${atomicBankId}/reaction/${reactionTokenId}`
      );
      expect(client.history.get[0].headers).toMatchObject({
        [API_KEY_HEADER]: expect.any(String),
      });
    });

    it('should retrieve reaction with options', async () => {
      const atomicBankId = chance.string();
      const reactionTokenId = chance.string();
      const metadata = {
        camelCase: chance.string(),
        snake_case: chance.string(),
      };
      const tenantId = chance.string();
      const type = chance.string() as TokenType;
      const data = {
        snake_case: chance.string(),
        camelCase: chance.string(),
      };
      const createdBy = chance.string();
      const createdAt = chance.string();
      const _apiKey = chance.string();
      const correlationId = chance.string();

      client.onGet(`/${atomicBankId}/reaction/${reactionTokenId}`).reply(200, {
        id: reactionTokenId,
        tenant_id: tenantId,
        type,
        data,
        metadata,
        created_at: createdAt,
        created_by: createdBy,
      });

      expect(
        await bt.atomicBanks.retrieveReaction(atomicBankId, reactionTokenId, {
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
        `/${atomicBankId}/reaction/${reactionTokenId}`
      );
      expect(client.history.get[0].headers).toMatchObject({
        [API_KEY_HEADER]: _apiKey,
        [BT_TRACE_ID_HEADER]: correlationId,
      });
    });

    it('should reject with status >= 400 <= 599', async () => {
      const atomicBankId = chance.string();
      const reactionTokenId = chance.string();
      const status = errorStatus();

      client
        .onGet(`/${atomicBankId}/reaction/${reactionTokenId}`)
        .reply(status);

      const promise = bt.atomicBanks.retrieveReaction(
        atomicBankId,
        reactionTokenId
      );

      await expectBasisTheoryApiError(promise, status);
    });
  });
});
