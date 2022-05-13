import type { CreateReactorFormula, ReactorFormula } from '@/interfaces/models';
import type {
  Create,
  Delete,
  List,
  PaginatedQuery,
  Retrieve,
  Update,
} from './shared';

interface ListReactorFormulaQuery extends PaginatedQuery {
  name?: string;
}

interface ReactorFormulas
  extends Create<ReactorFormula, CreateReactorFormula>,
    Retrieve<ReactorFormula>,
    Update<ReactorFormula, CreateReactorFormula>,
    Delete,
    List<ReactorFormula, ListReactorFormulaQuery> {}

export type { ListReactorFormulaQuery, ReactorFormulas };
