import type { Auditable } from './shared';

type FormulaType = 'official' | 'private';
type DataType = 'string' | 'boolean' | 'number';

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
