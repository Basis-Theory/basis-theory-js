import type { CreateReactorFormula, ReactorFormula } from '@/types/models';
import type {
  Create,
  Delete,
  List,
  PaginatedQuery,
  Retrieve,
  Update,
} from './shared';

/**
 * @deprecated Reactor Formulas are now deprecated and will be removed in a future release.
 * @description We have introduced a `code` property for Reactors to replace Formula's code. For more details visit [our API reference](https://developers.basistheory.com/docs/api/reactors#create-reactor).
 */
interface ListReactorFormulaQuery extends PaginatedQuery {
  name?: string;
}
/**
 * @deprecated Reactor Formulas are now deprecated and will be removed in a future release.
 * @description We have introduced a `code` property for Reactors to replace Formula's code. For more details visit [our API reference](https://developers.basistheory.com/docs/api/reactors#create-reactor).
 */
interface ReactorFormulas
  extends Create<ReactorFormula, CreateReactorFormula>,
    Retrieve<ReactorFormula>,
    Update<ReactorFormula, CreateReactorFormula>,
    Delete,
    List<ReactorFormula, ListReactorFormulaQuery> {}

export type { ListReactorFormulaQuery, ReactorFormulas };
