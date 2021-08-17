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
  type?: TokenType;
  data: TokenData;
  metadata?: Record<string, string>;
  encryption?: TokenEncryption;
  children?: Token[];
  createdBy: string;
  createdAt: string;
}

export type CreateTokenModel = Pick<
  Token,
  'type' | 'data' | 'metadata' | 'encryption' | 'children'
>;

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
