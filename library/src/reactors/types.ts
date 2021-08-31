import type { ReactorFormula } from '../reactor-formulas/types';
import type { PaginatedQuery } from '../service';
import type { TokenType } from '../tokens/types';

export interface Reactor {
  id: string;
  tenantId: string;
  name: string;
  formula: ReactorFormula;
  configuration: Record<string, string>;
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
