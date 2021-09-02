import MockAdapter from 'axios-mock-adapter';
import { Chance } from 'chance';
import { BasisTheory } from '../src';
import type {
  DataType,
  FormulaType,
  ReactorFormulaConfig,
} from '../src/reactor-formulas/types';
import type { TokenType } from '../src/tokens';
import { testCRUD, mockServiceClient } from './setup/utils';

describe('Reactor Formulas', () => {
  let bt: BasisTheory;
  let chance: Chance.Chance;
  let apiKey: string;
  let client: MockAdapter;

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
        sourceTokenType: chance.string() as TokenType,
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
        sourceTokenType: chance.string() as TokenType,
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
