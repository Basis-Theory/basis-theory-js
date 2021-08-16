import { BasisTheoryService } from '../service';
import { CrudBuilder } from '../service/CrudBuilder';
import type { Log, LogQuery } from './types';

export const BasisTheoryLogs = new CrudBuilder(
  class BasisTheoryLogs extends BasisTheoryService {}
)
  .list<Log, LogQuery>()
  .build();

export type BasisTheoryLogs = InstanceType<typeof BasisTheoryLogs>;
