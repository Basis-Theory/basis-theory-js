import { BasisTheoryService } from '@/service';
import { CrudBuilder } from '@/service/CrudBuilder';
import type { CreateReactorFormula, ReactorFormula } from '@/types/models';
import type { ListReactorFormulaQuery } from '@/types/sdk';

export const BasisTheoryReactorFormulas = new CrudBuilder(
  class BasisTheoryReactorFormulas extends BasisTheoryService {}
)
  .create<ReactorFormula, CreateReactorFormula>()
  .retrieve<ReactorFormula>()
  .update<ReactorFormula, CreateReactorFormula>()
  .delete()
  .list<ReactorFormula, ListReactorFormulaQuery>()
  .build();

export type BasisTheoryReactorFormulas = InstanceType<
  typeof BasisTheoryReactorFormulas
>;
