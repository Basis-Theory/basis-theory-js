import { Chance } from 'chance';
import MockAdapter from 'axios-mock-adapter';
import { BasisTheory } from '../src';
import { TokenType } from '../src/tokens';
import {
  DataType,
  FormulaType,
  ReactorFormulaConfig,
  ReactorFormulaRequestParam,
} from '../src/reactor-formulas/types';
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
        requestParameters: [{} as ReactorFormulaRequestParam],
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
        requestParameters: [{} as ReactorFormulaRequestParam],
      },
    }));
  });
});
