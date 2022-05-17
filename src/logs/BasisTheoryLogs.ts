import { BasisTheoryService } from '@/service';
import { CrudBuilder } from '@/service/CrudBuilder';
import type { Log } from '@/types/models';
import type { ListLogQuery } from '@/types/sdk';

export const BasisTheoryLogs = new CrudBuilder(
  class BasisTheoryLogs extends BasisTheoryService {}
)
  .list<Log, ListLogQuery>()
  .build();

export type BasisTheoryLogs = InstanceType<typeof BasisTheoryLogs>;
