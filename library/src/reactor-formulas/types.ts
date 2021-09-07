import type { PaginatedQuery } from '../service';
import type { TokenType } from '../tokens';

type FormulaType = 'official' | 'private';
type DataType = 'string' | 'boolean' | 'number';

interface ReactorFormula {
  id: string;
  name: string;
  description?: string;
  type: FormulaType;
  sourceTokenType: TokenType;
  icon?: string;
  code: string;
  configuration: ReactorFormulaConfig[];
  requestParameters: ReactorFormulaRequestParam[];
  createdAt: string;
  modifiedAt?: string;
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
  'id' | 'createdAt' | 'modifiedAt'
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
