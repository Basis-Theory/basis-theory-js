import type { Log } from '@basis-theory/basis-theory-elements-interfaces/models';
import type { ListLogQuery } from '@basis-theory/basis-theory-elements-interfaces/sdk';
import { BasisTheoryService } from '../service';
import { CrudBuilder } from '../service/CrudBuilder';

export const BasisTheoryLogs = new CrudBuilder(
  class BasisTheoryLogs extends BasisTheoryService {}
)
  .list<Log, ListLogQuery>()
  .build();

export type BasisTheoryLogs = InstanceType<typeof BasisTheoryLogs>;
