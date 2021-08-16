import { PaginatedQuery } from '../service';
import { TokenType } from '../tokens/types';
import {
  ReactorFormula,
  ReactorFormulaConfig,
} from './../reactor-formulas/types';

export interface Reactor {
  id: string;
  tenantId: string;
  name: string;
  formula: ReactorFormula;
  configuration: ReactorFormulaConfig;
  createdAt: string;
  modifiedAt: string;
}

export type CreateReactorModel = Pick<Reactor, 'name' | 'configuration'> & {
  formula: Pick<ReactorFormula, 'id'>;
};

export type UpdateReactorModel = Pick<Reactor, 'name' | 'configuration'>;

export interface ReactorQuery extends PaginatedQuery {
  id?: string | string[];
  name?: string;
  sourceTokenType?: TokenType;
}
