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
 * @docs For more details visit [our API reference](https://developers.basistheory.com/docs/api/reactors).
 */
interface ListReactorFormulaQuery extends PaginatedQuery {
  name?: string;
}
/**
 * @deprecated Reactor Formulas are now deprecated and will be removed in a future release.
 * @docs For more details visit [our API reference](https://developers.basistheory.com/docs/api/reactors).
 */
interface ReactorFormulas
  /**
   * @deprecated Reactor Formulas are now deprecated and will be removed in a future release.
   * @docs For more details visit [our API reference](https://developers.basistheory.com/docs/api/reactors).
   */
  extends Create<ReactorFormula, CreateReactorFormula>,
    Retrieve<ReactorFormula>,
    Update<ReactorFormula, CreateReactorFormula>,
    Delete,
    List<ReactorFormula, ListReactorFormulaQuery> {}

export type { ListReactorFormulaQuery, ReactorFormulas };
