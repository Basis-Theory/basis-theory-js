import type { ReactorFormula } from '../reactor-formulas/types';
import type { PaginatedQuery } from '../service';
import type { TokenType } from '../tokens/types';
import type { Auditable } from '../types';

interface Reactor extends Auditable {
  id: string;
  tenantId: string;
  name: string;
  formula: ReactorFormula;
  configuration: Record<string, string>;
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

export type { Reactor, CreateReactorModel, UpdateReactorModel, ReactorQuery };
