import type { PaginatedQuery } from '../service';
import type { TokenType } from '../tokens';
import type { Auditable } from '../types';

type FormulaType = 'official' | 'private';
type DataType = 'string' | 'boolean' | 'number';

interface ReactorFormula extends Auditable {
  id: string;
  name: string;
  description?: string;
  type: FormulaType;
  sourceTokenType: TokenType;
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

type CreateReactorFormulaModel = Omit<
  ReactorFormula,
  'id' | 'createdAt' | 'createdBy' | 'modifiedAt' | 'modifiedBy'
>;

interface ReactorFormulaQuery extends PaginatedQuery {
  name?: string;
  sourceTokenType?: TokenType;
}

export type {
  FormulaType,
  DataType,
  ReactorFormula,
  ReactorFormulaConfig,
  ReactorFormulaRequestParam,
  CreateReactorFormulaModel,
  ReactorFormulaQuery,
};
