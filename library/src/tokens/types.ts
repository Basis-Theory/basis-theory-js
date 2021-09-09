import type { PaginatedQuery } from '../service';

type Primitive = string | number | boolean | null;
type DataObject = {
  [member: string]: TokenData;
};
type DataArray = Array<TokenData>;
type TokenData = Primitive | DataObject | DataArray;

type TokenType = 'token' | 'card' | 'bank' | 'card:reaction' | 'bank:reaction';

interface TokenEncryptionKey {
  key: string;
  alg: string;
}

interface TokenEncryption {
  cek: TokenEncryptionKey;
  kek: TokenEncryptionKey;
}

interface Token {
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

type CreateTokenModel = Pick<
  Token,
  'type' | 'data' | 'metadata' | 'encryption' | 'children'
>;

interface RetrieveTokenQuery {
  children?: boolean;
  childrenType?: TokenType | TokenType[];
}

interface ListTokensQuery extends PaginatedQuery {
  id?: string | string[];
  type?: TokenType | TokenType[];
  children?: boolean;
  childrenType?: TokenType | TokenType[];
}

interface ListTokensQueryDecrypted extends ListTokensQuery {
  decryptType?: TokenType | TokenType[];
}

export type {
  Primitive,
  DataObject,
  DataArray,
  TokenData,
  TokenType,
  TokenEncryptionKey,
  TokenEncryption,
  Token,
  CreateTokenModel,
  RetrieveTokenQuery,
  ListTokensQuery,
  ListTokensQueryDecrypted,
};
