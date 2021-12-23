import type {
  CreateReactorFormula,
  ReactorFormula,
} from '@basis-theory/basis-theory-elements-interfaces/models';
import type { ListReactorFormulaQuery } from '@basis-theory/basis-theory-elements-interfaces/sdk';
import { BasisTheoryService } from '../service';
import { CrudBuilder } from '../service/CrudBuilder';

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
