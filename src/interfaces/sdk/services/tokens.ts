import type { Token, CreateToken, TokenType } from '@/interfaces/models';
import type {
  Create,
  Retrieve,
  Delete,
  List,
  RequestOptions,
  PaginatedQuery,
  PaginatedList,
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
    Retrieve<Token>,
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
