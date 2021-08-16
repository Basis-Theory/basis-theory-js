import { Chance } from 'chance';
import MockAdapter from 'axios-mock-adapter';
import { BasisTheory } from '../src';
import type {
  DataType,
  ReactorFormulaConfig,
} from '../src/reactor-formulas/types';
import { testCRUD, mockServiceClient } from './setup/utils';
import type { CreateReactorModel, UpdateReactorModel } from '../src/reactors';

describe('Reactors', () => {
  let bt: BasisTheory;
  let chance: Chance.Chance;
  let apiKey: string;
  let client: MockAdapter;

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
    testCRUD(() => ({
      service: bt.reactors,
      client,
      createPayload: {
        name: chance.string(),
        configuration: {
          name: chance.string(),
          description: chance.string(),
        } as ReactorFormulaConfig,
        formula: {
          id: chance.string(),
        },
      } as CreateReactorModel,
      updatePayload: {
        name: chance.string(),
        configuration: {
          name: chance.string(),
          description: chance.string(),
          type: chance.string() as DataType,
        } as ReactorFormulaConfig,
      } as UpdateReactorModel,
    }));
  });
});
