import MockAdapter from 'axios-mock-adapter';
import { Chance } from 'chance';
import { BasisTheory } from '@/BasisTheory';
import type { BasisTheory as IBasisTheory } from '@/interfaces/sdk';
import { testList, mockServiceClient } from './setup/utils';

describe('Logs', () => {
  let bt: IBasisTheory,
    chance: Chance.Chance,
    apiKey: string,
    client: MockAdapter;

  beforeAll(async () => {
    chance = new Chance();
    apiKey = chance.string();
    bt = await new BasisTheory().init(apiKey);
    client = mockServiceClient(bt.logs);
  });

  beforeEach(() => {
    client.resetHandlers();
    client.resetHistory();
  });

  describe('List', () => {
    testList(() => ({
      service: bt.logs,
      client,
    }));
  });
});
