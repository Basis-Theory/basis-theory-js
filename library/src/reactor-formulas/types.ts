import type { PaginatedQuery } from '../service';
import type { TokenType } from '../tokens';

export type FormulaType = 'official' | 'private';
export type DataType = 'string' | 'boolean' | 'number';

export interface ReactorFormula {
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

export interface ReactorFormulaConfig {
  name: string;
  description?: string;
  type: DataType;
}

export interface ReactorFormulaRequestParam {
  name: string;
  description?: string;
  type: DataType;
  optional?: boolean;
}

export type CreateReactorFormulaModel = Omit<
  ReactorFormula,
  'id' | 'createdAt' | 'modifiedAt'
>;

export interface ReactorFormulaQuery extends PaginatedQuery {
  name?: string;
  sourceTokenType?: TokenType;
}
