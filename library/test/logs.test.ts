import MockAdapter from 'axios-mock-adapter';
import { Chance } from 'chance';
import { BasisTheory } from '../src';
import { testList, mockServiceClient } from './setup/utils';

describe('Logs', () => {
  let bt: BasisTheory;
  let chance: Chance.Chance;
  let apiKey: string;
  let client: MockAdapter;

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
