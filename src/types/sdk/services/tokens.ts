import type {
  Token,
  CreateToken,
  TokenType,
  UpdateToken,
} from '@/types/models';
import type {
  Create,
  Retrieve,
  Delete,
  List,
  RequestOptions,
  PaginatedQuery,
  PaginatedList,
  Update,
} from './shared';

interface ListTokensQuery extends PaginatedQuery {
  id?: string | string[];
  type?: TokenType | TokenType[];
  metadata?: Record<string, string>;
}

interface SearchTokensRequest {
  query?: string;
  page?: number;
  size?: number;
}

interface Tokens
  extends Create<Token, CreateToken>,
    Update<Token, UpdateToken>,
    // avoid casting when accessing token data props
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    Retrieve<Token<any>>,
    Delete,
    List<Token, ListTokensQuery> {
  search(
    searchRequest: SearchTokensRequest,
    options?: RequestOptions
  ): Promise<PaginatedList<Token>>;
}

export type { Tokens, ListTokensQuery, SearchTokensRequest };
