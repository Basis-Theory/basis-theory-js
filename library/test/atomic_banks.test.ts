import { transformAtomicBankRequestSnakeCase } from './../src/common/utils';
import { Chance } from 'chance';
import MockAdapter from 'axios-mock-adapter';
import type { ApplicationType } from '../src';
import { BasisTheory } from '../src';
import {
  testCRUD,
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
  transformAtomicBankResponseCamelCase,
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

    const transformedCreatePayload = transformAtomicBankRequestSnakeCase(
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
    // todo
  });

  describe('react', () => {
    // todo
  });

  describe('retrieve reaction', () => {
    // todo
  });
});
