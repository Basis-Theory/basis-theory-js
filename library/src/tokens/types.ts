import type { PaginatedQuery } from '../service';
export type Primitive = string | number | boolean | null;
export type DataObject = {
  [member: string]: TokenData;
};
export type DataArray = Array<TokenData>;
export type TokenData = Primitive | DataObject | DataArray;

export type TokenType =
  | 'token'
  | 'card'
  | 'bank'
  | 'card:reaction'
  | 'bank:reaction';

export interface TokenEncryptionKey {
  key: string;
  alg: string;
}

export interface TokenEncryption {
  cek: TokenEncryptionKey;
  kek: TokenEncryptionKey;
}

export interface Token {
  id: string;
  tenantId: string;
  type: TokenType;
  data: TokenData;
  metadata?: unknown;
  encryption?: TokenEncryption;
  children?: Token[];
  createdBy: string;
  createdAt: string;
}

export type CreateTokenModel = Pick<
  Token,
  'type' | 'data' | 'metadata' | 'encryption' | 'children'
>;

export interface CreateTokenResponse {
  id: string;
  tenantId: string;
  type: TokenType;
  createdBy: string;
  createdAt: string;
  metadata: unknown;
}

export interface GetTokenResponse extends CreateTokenResponse {
  data: unknown;
}

export interface RetrieveTokenQuery {
  children?: boolean;
  childrenType?: TokenType | TokenType[];
}

export interface ListTokensQuery extends PaginatedQuery {
  id?: string | string[];
  type?: TokenType | TokenType[];
  children?: boolean;
  childrenType?: TokenType | TokenType[];
}

export interface ListTokensQueryDecrypted extends ListTokensQuery {
  decryptType?: TokenType | TokenType[];
}

// we can disable for this next line as we are only exporting interfaces here
// eslint-disable-next-line @typescript-eslint/no-namespace
export declare namespace TokensApi {
  export interface CreateTokenResponse {
    id: string;
    tenant_id: string;
    type: TokenType;
    created_by: string;
    created_at: string;
    metadata: unknown;
  }
}
