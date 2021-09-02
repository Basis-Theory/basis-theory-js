import type { ReactorFormula } from '../reactor-formulas/types';
import type { PaginatedQuery } from '../service';
import type { TokenType } from '../tokens/types';

interface Reactor {
  id: string;
  tenantId: string;
  name: string;
  formula: ReactorFormula;
  configuration: Record<string, string>;
  createdAt: string;
  modifiedAt: string;
}

type CreateReactorModel = Pick<Reactor, 'name' | 'configuration'> & {
  formula: Pick<ReactorFormula, 'id'>;
};

type UpdateReactorModel = Pick<Reactor, 'name' | 'configuration'>;

interface ReactorQuery extends PaginatedQuery {
  id?: string | string[];
  name?: string;
  sourceTokenType?: TokenType;
}

export { Reactor, CreateReactorModel, UpdateReactorModel, ReactorQuery };
