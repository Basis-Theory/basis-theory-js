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
    //  returned data type as any to avoid casting when trying to retrieve token.data.<prop>
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    Retrieve<Token<any>>,
    Delete,
    List<Token, ListTokensQuery> {
  createAssociation(
    parentId: string,
    childId: string,
    options?: RequestOptions
  ): Promise<void>;
  deleteAssociation(
    parentId: string,
    childId: string,
    options?: RequestOptions
  ): Promise<void>;
  createChild(
    parentId: string,
    token: CreateToken,
    options?: RequestOptions
  ): Promise<Token>;
  listChildren(
    parentId: string,
    query?: ListTokensQuery,
    options?: RequestOptions
  ): Promise<PaginatedList<Token>>;
  search(
    searchRequest: SearchTokensRequest,
    options?: RequestOptions
  ): Promise<PaginatedList<Token>>;
}

export type { Tokens, ListTokensQuery, SearchTokensRequest };
