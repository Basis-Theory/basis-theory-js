import { BasisTheoryService } from '@/service';
import { CrudBuilder } from '@/service/CrudBuilder';
import type { TokenIntent, CreateTokenIntent } from '@/types/models';

export const BasisTheoryTokenIntents = new CrudBuilder(
  class BasisTheoryTokenIntents extends BasisTheoryService {}
)
  .create<TokenIntent, CreateTokenIntent>()
  .delete()
  .build();

export type BasisTheoryTokenIntents = InstanceType<
  typeof BasisTheoryTokenIntents
>;
