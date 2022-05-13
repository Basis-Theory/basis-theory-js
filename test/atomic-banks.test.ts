import MockAdapter from 'axios-mock-adapter';
import { Chance } from 'chance';
import { BasisTheory } from '@/BasisTheory';
import {
  API_KEY_HEADER,
  BT_TRACE_ID_HEADER,
  transformAtomicRequestSnakeCase,
} from '@/common';
import type {
  AtomicBank,
  UpdateAtomicBank,
  TokenType,
} from '@/interfaces/models';
import type { BasisTheory as IBasisTheory } from '@/interfaces/sdk';
import {
  testCreate,
  testRetrieve,
  testList,
  errorStatus,
  expectBasisTheoryApiError,
  mockServiceClient,
  testDelete,
} from './setup/utils';

describe('Atomic Banks', () => {
  let bt: IBasisTheory,
    chance: Chance.Chance,
    apiKey: string,
    client: MockAdapter;

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
        // eslint-disable-next-line camelcase
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

  describe('update', () => {
    let atomicBankId: string;
    let updateBankRequest: UpdateAtomicBank;
    let expectedUpdatedBank: AtomicBank;

    beforeEach(() => {
      atomicBankId = chance.string();
      updateBankRequest = {
        bank: {
          accountNumber: chance.string(),
          routingNumber: chance.string(),
        },
      };
      expectedUpdatedBank = {
        bank: {
          accountNumber: chance.string(),
          routingNumber: chance.string(),
        },
        createdBy: chance.string(),
        createdAt: chance.string(),
        modifiedBy: chance.string(),
        modifiedAt: chance.string(),
        id: atomicBankId,
        type: 'bank',
        tenantId: chance.string(),
        fingerprint: chance.string(),
      };
    });

    test('should update an atomic bank', async () => {
      client
        .onPatch(`/${atomicBankId}`)
        .reply(200, JSON.stringify(expectedUpdatedBank));

      expect(
        await bt.atomicBanks.update(atomicBankId, updateBankRequest)
      ).toStrictEqual(expectedUpdatedBank);
      expect(client.history.patch).toHaveLength(1);
      expect(client.history.patch[0].data).toStrictEqual(
        /* eslint-disable camelcase */
        JSON.stringify({
          bank: {
            account_number: updateBankRequest.bank.accountNumber,
            routing_number: updateBankRequest.bank.routingNumber,
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
        .onPatch(`/${atomicBankId}`)
        .reply(200, JSON.stringify(expectedUpdatedBank));

      expect(
        await bt.atomicBanks.update(atomicBankId, updateBankRequest, {
          apiKey: _apiKey,
          correlationId,
        })
      ).toStrictEqual(expectedUpdatedBank);
      expect(client.history.patch).toHaveLength(1);
      expect(client.history.patch[0].data).toStrictEqual(
        /* eslint-disable camelcase */
        JSON.stringify({
          bank: {
            account_number: updateBankRequest.bank.accountNumber,
            routing_number: updateBankRequest.bank.routingNumber,
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

      client.onPatch(`/${atomicBankId}`).reply(status);

      const promise = bt.atomicBanks.update(atomicBankId, updateBankRequest);

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
        await bt.atomicBanks.react(id, {
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
        await bt.atomicBanks.react(
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

      const promise = bt.atomicBanks.react(id, { reactorId: chance.string() });

      await expectBasisTheoryApiError(promise, status);
    });
  });
});
