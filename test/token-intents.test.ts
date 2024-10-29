import MockAdapter from 'axios-mock-adapter';
import { Chance } from 'chance';
import { BasisTheory } from '@/BasisTheory';
import { transformTokenRequestSnakeCase } from '@/common';
import type { CreateTokenIntent, DataObject } from '@/types/models';
import type { BasisTheory as IBasisTheory } from '@/types/sdk';
import { mockServiceClient, testCreate, testDelete } from './setup/utils';

describe('Token Intents', () => {
  const chance = new Chance();
  let bt: IBasisTheory, apiKey: string, client: MockAdapter;

  beforeAll(async () => {
    apiKey = chance.string();
    bt = await new BasisTheory().init(apiKey);
    client = mockServiceClient(bt.tokenIntents);
  });

  beforeEach(() => {
    client.resetHandlers();
    client.resetHistory();
  });

  describe('create', () => {
    const createPayload: CreateTokenIntent = {
      type: 'card',
      data: {
        number: chance.integer(),
        expirationMonth: chance.date().getMonth(),
        expirationYear: chance.date().getFullYear(),
        cvc: chance.integer().toString(),
      },
    };

    testCreate(() => ({
      service: bt.tokenIntents,
      client,
      createPayload,
      transformedCreatePayload: transformTokenRequestSnakeCase<DataObject>(
        createPayload
      ),
    }));
  });

  describe('delete', () => {
    testDelete(() => ({
      service: bt.tokenIntents,
      client,
    }));
  });
});
