import type { Application } from './applications';
import type { ReactorFormula } from './reactor-formulas';
import type { Auditable } from './shared';
import type { Nullable } from './util';

interface Reactor extends Auditable {
  id: string;
  tenantId: string;
  name: string;
  application?: Application;
  code?: string;
  configuration?: Record<string, string>;
  /**
   * @deprecated Reactor Formulas are now deprecated and will be removed in a future release.
   * @description We have introduced a `code` property for Reactors to replace Formula's code. For more details visit [our API reference](https://developers.basistheory.com/docs/api/reactors#create-reactor).
   */
  formula?: ReactorFormula;
}

type CreateReactor = Pick<Reactor, 'name' | 'configuration'> & {
  code?: string;
  application?: Pick<Application, 'id'>;
};

type UpdateReactor = Pick<Reactor, 'name' | 'configuration' | 'code'> & {
  application?: Pick<Application, 'id'>;
};

type PatchReactor = Omit<Partial<UpdateReactor>, 'configuration'> & {
  configuration?: Nullable<UpdateReactor['configuration']>;
};

export type { Reactor, CreateReactor, UpdateReactor, PatchReactor };
