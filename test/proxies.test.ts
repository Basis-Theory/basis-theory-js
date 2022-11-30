import type MockAdapter from 'axios-mock-adapter';
import { Chance } from 'chance';
import { BasisTheory } from '@/BasisTheory';
import { transformProxyRequestSnakeCase } from '@/common/utils';
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
    const _chance = new Chance();

    const createPayload = {
      name: _chance.animal(),
      destinationUrl: _chance.url(),
      requestReactorId: _chance.guid(),
      responseReactorId: _chance.guid(),
      requestTransform: {
        code: _chance.string(),
      },
      responseTransform: {
        code: _chance.string(),
      },
      application: {
        id: _chance.guid(),
      },
      configuration: {
        // eslint-disable-next-line camelcase
        snake_case: _chance.string(),
        camelCase: _chance.string(),
      },
      requireAuth: _chance.bool(),
    };

    const updatePayload = {
      name: _chance.animal(),
      destinationUrl: _chance.url(),
      requestReactorId: _chance.guid(),
      responseReactorId: _chance.guid(),
      requestTransform: {
        code: _chance.word(),
      },
      responseTransform: {
        code: _chance.word(),
      },
      application: {
        id: _chance.guid(),
      },
      configuration: {
        // eslint-disable-next-line camelcase
        snake_case: _chance.string(),
        camelCase: _chance.string(),
      },
      requireAuth: _chance.bool(),
    };

    const transformedCreatePayload = transformProxyRequestSnakeCase(
      createPayload
    );

    const transformedUpdatePayload = transformProxyRequestSnakeCase(
      updatePayload
    );

    testCRUD(() => ({
      service: bt.proxies,
      client,
      createPayload,
      transformedCreatePayload,
      updatePayload,
      transformedUpdatePayload,
    }));
  });
});
