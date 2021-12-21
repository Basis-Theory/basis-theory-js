import type { BasisTheory as IBasisTheory } from '@basis-theory/basis-theory-elements-interfaces/sdk';
import MockAdapter from 'axios-mock-adapter';
import { Chance } from 'chance';
import { BasisTheory } from '../src';
import { transformReactorRequestSnakeCase } from '../src/common/utils';
import { testCRUD, mockServiceClient } from './setup/utils';

describe('Reactors', () => {
  let bt: IBasisTheory,
    chance: Chance.Chance,
    apiKey: string,
    client: MockAdapter;

  beforeAll(async () => {
    chance = new Chance();
    apiKey = chance.string();
    bt = await new BasisTheory().init(apiKey);
    client = mockServiceClient(bt.reactors);
  });

  beforeEach(() => {
    client.resetHandlers();
    client.resetHistory();
  });

  describe('CRUD', () => {
    const _chance = new Chance();
    const createPayload = {
      name: _chance.string(),
      configuration: {
        // eslint-disable-next-line camelcase
        snake_case: _chance.string(),
        camelCase: _chance.string(),
      },
      formula: {
        id: _chance.string(),
      },
    };

    const updatePayload = {
      name: _chance.string(),
      configuration: {
        // eslint-disable-next-line camelcase
        snake_case: _chance.string(),
        camelCase: _chance.string(),
      },
    };

    const transformedCreatePayload = transformReactorRequestSnakeCase(
      createPayload
    );

    const transformedUpdatePayload = transformReactorRequestSnakeCase(
      updatePayload
    );

    testCRUD(() => ({
      service: bt.reactors,
      client,
      createPayload,
      transformedCreatePayload,
      updatePayload,
      transformedUpdatePayload,
    }));
  });
});
