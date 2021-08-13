import { BasisTheoryService } from '../service';
import { CrudBuilder } from '../service/CrudBuilder';
import {
  CreateReactorFormulaModel,
  ReactorFormula,
  ReactorFormulaQuery,
} from './types';

export const BasisTheoryReactorFormulas = new CrudBuilder(
  class BasisTheoryReactorFormulas extends BasisTheoryService {}
)
  .create<ReactorFormula, CreateReactorFormulaModel>()
  .retrieve<ReactorFormula>()
  .update<ReactorFormula, CreateReactorFormulaModel>()
  .delete()
  .list<ReactorFormula, ReactorFormulaQuery>()
  .build();

export type BasisTheoryReactorFormulas = InstanceType<
  typeof BasisTheoryReactorFormulas
>;
