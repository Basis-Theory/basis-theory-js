import MockAdapter from 'axios-mock-adapter';
import { Chance } from 'chance';
import { BasisTheory } from '@/BasisTheory';
import type { CreateTokenIntent } from '@/types/models';
import type { BasisTheory as IBasisTheory } from '@/types/sdk';
import { mockServiceClient, testCreate, testDelete } from './setup/utils';

describe('Token Intents', () => {
  let bt: IBasisTheory,
    chance: Chance.Chance,
    apiKey: string,
    client: MockAdapter;

  beforeAll(async () => {
    chance = new Chance();
    apiKey = chance.string();
    bt = await new BasisTheory().init(apiKey);
    client = mockServiceClient(bt.tokenIntents);
  });

  beforeEach(() => {
    client.resetHandlers();
    client.resetHistory();
  });

  describe('create', () => {
    const _chance = new Chance();

    const createPayload: CreateTokenIntent = {
      id: _chance.string(),
      type: 'card',
      data: {
        number: _chance.integer(),
        expirationMonth: _chance.date().getMonth(),
        expirationYear: _chance.date().getFullYear(),
        cvc: _chance.integer().toString(),
      },
    };

    testCreate(() => ({
      service: bt.tokenIntents,
      client,
      createPayload,
    }));
  });

  describe('delete', () => {
    testDelete(() => ({
      service: bt.tokenIntents,
      client,
    }));
  });
});
