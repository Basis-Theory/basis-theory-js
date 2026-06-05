import type { Auditable } from './shared';

type FormulaType = 'official' | 'private';
type DataType = 'string' | 'boolean' | 'number';

/**
 * @deprecated Reactor Formulas are now deprecated and will be removed in a future release.
 * @description We have introduced a `code` property for Reactors to replace Formula's code. For more details visit [our API reference](https://developers.basistheory.com/docs/api/reactors#create-reactor).
 */
interface ReactorFormula extends Auditable {
  id: string;
  name: string;
  description?: string;
  type: FormulaType;
  icon?: string;
  code: string;
  configuration: ReactorFormulaConfig[];
  requestParameters: ReactorFormulaRequestParam[];
}

interface ReactorFormulaConfig {
  name: string;
  description?: string;
  type: DataType;
}

interface ReactorFormulaRequestParam {
  name: string;
  description?: string;
  type: DataType;
  optional?: boolean;
}
/**
 * @deprecated Reactor Formulas are now deprecated and will be removed in a future release.
 * @description We have introduced a `code` property for Reactors to replace Formula's code. For more details visit [our API reference](https://developers.basistheory.com/docs/api/reactors#create-reactor).
 */
type CreateReactorFormula = Omit<
  ReactorFormula,
  'id' | 'createdAt' | 'createdBy' | 'modifiedAt' | 'modifiedBy'
>;

export type {
  FormulaType,
  DataType,
  ReactorFormula,
  ReactorFormulaConfig,
  ReactorFormulaRequestParam,
  CreateReactorFormula,
};
