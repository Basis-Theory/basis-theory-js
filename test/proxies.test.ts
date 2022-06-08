import type MockAdapter from 'axios-mock-adapter';
import { Chance } from 'chance';
import { BasisTheory } from '@/BasisTheory';
import type { BasisTheory as IBasisTheory } from '@/types/sdk';
import { mockServiceClient, testCRUD } from './setup/utils';

describe('Proxies', () => {
  let bt: IBasisTheory,
    chance: Chance.Chance,
    apiKey: string,
    client: MockAdapter;

  beforeAll(async () => {
    chance = new Chance();
    apiKey = chance.string();
    bt = await new BasisTheory().init(apiKey);
    client = mockServiceClient(bt.proxies);
  });

  beforeEach(() => {
    client.resetHandlers();
    client.resetHistory();
  });

  describe('CRUD', () => {
    testCRUD(() => ({
      service: bt.proxies,
      client,
      createPayload: {
        name: chance.animal(),
        destinationUrl: chance.url(),
        requestReactorId: chance.guid(),
        responseReactorId: chance.guid(),
        requireAuth: chance.bool(),
      },
      updatePayload: {
        name: chance.animal(),
        destinationUrl: chance.url(),
        requestReactorId: chance.guid(),
        responseReactorId: chance.guid(),
        requireAuth: chance.bool(),
      },
    }));
  });
});
