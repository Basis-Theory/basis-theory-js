import type { Application } from './applications';
import type { ReactorFormula } from './reactor-formulas';
import type { Auditable } from './shared';
import type { Nullable } from './util';

interface Reactor extends Auditable {
  id: string;
  tenantId: string;
  name: string;
  formula: ReactorFormula;
  application?: Application;
  configuration?: Record<string, string>;
}

type CreateReactor = Pick<Reactor, 'name' | 'configuration'> & {
  formula: Pick<ReactorFormula, 'id'>;
  application?: Pick<Application, 'id'>;
};

type UpdateReactor = Pick<Reactor, 'name' | 'configuration'> & {
  application?: Pick<Application, 'id'>;
};

type PatchReactor =
  | Partial<UpdateReactor>
  | {
      configuration?: Nullable<UpdateReactor['configuration']>;
    };

export type { Reactor, CreateReactor, UpdateReactor, PatchReactor };
