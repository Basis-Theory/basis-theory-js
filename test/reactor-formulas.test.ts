import MockAdapter from 'axios-mock-adapter';
import { Chance } from 'chance';
import { BasisTheory } from '@/BasisTheory';
import type {
  ReactorFormulaConfig,
  FormulaType,
  DataType,
} from '@/interfaces/models';
import type { BasisTheory as IBasisTheory } from '@/interfaces/sdk';
import { testCRUD, mockServiceClient } from './setup/utils';

describe('Reactor Formulas', () => {
  let bt: IBasisTheory,
    chance: Chance.Chance,
    apiKey: string,
    client: MockAdapter;

  beforeAll(async () => {
    chance = new Chance();
    apiKey = chance.string();
    bt = await new BasisTheory().init(apiKey);
    client = mockServiceClient(bt.reactorFormulas);
  });

  beforeEach(() => {
    client.resetHandlers();
    client.resetHistory();
  });

  describe('CRUD', () => {
    testCRUD(() => ({
      service: bt.reactorFormulas,
      client,
      createPayload: {
        name: chance.string(),
        description: chance.string(),
        type: chance.string() as FormulaType,
        icon: chance.string(),
        code: chance.string(),
        configuration: [
          {
            name: chance.string(),
            description: chance.string(),
            type: chance.string() as DataType,
          } as ReactorFormulaConfig,
        ],
        requestParameters: [
          {
            name: chance.string(),
            description: chance.string(),
            type: chance.string() as DataType,
            optional: chance.bool(),
          },
        ],
      },
      updatePayload: {
        name: chance.string(),
        description: chance.string(),
        type: chance.string() as FormulaType,
        icon: chance.string(),
        code: chance.string(),
        configuration: [
          {
            name: chance.string(),
            description: chance.string(),
            type: chance.string() as DataType,
          } as ReactorFormulaConfig,
        ],
        requestParameters: [
          {
            name: chance.string(),
            description: chance.string(),
            type: chance.string() as DataType,
            optional: chance.bool(),
          },
        ],
      },
    }));
  });
});
