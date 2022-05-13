import type { ReactorFormula } from './reactor-formulas';
import type { Auditable } from './shared';

interface Reactor extends Auditable {
  id: string;
  tenantId: string;
  name: string;
  formula: ReactorFormula;
  configuration: Record<string, string>;
}

type CreateReactor = Pick<Reactor, 'name' | 'configuration'> & {
  formula: Pick<ReactorFormula, 'id'>;
};

type UpdateReactor = Pick<Reactor, 'name' | 'configuration'>;

export type { Reactor, CreateReactor, UpdateReactor };
