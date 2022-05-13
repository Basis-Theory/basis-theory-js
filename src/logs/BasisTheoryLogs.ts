import type { Log } from '@/interfaces/models';
import type { ListLogQuery } from '@/interfaces/sdk';
import { BasisTheoryService } from '@/service';
import { CrudBuilder } from '@/service/CrudBuilder';

export const BasisTheoryLogs = new CrudBuilder(
  class BasisTheoryLogs extends BasisTheoryService {}
)
  .list<Log, ListLogQuery>()
  .build();

export type BasisTheoryLogs = InstanceType<typeof BasisTheoryLogs>;
