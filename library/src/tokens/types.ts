import type { PaginatedQuery } from '../service';
import type { Auditable } from '../types';

type Primitive = string | number | boolean | null;
type DataObject = {
  [member: string]: TokenData;
};
type DataArray = Array<TokenData>;
type TokenData = Primitive | DataObject | DataArray;

type TokenType = 'token' | 'card' | 'bank';

interface TokenEncryptionKey {
  key: string;
  alg: string;
}

interface TokenEncryption {
  cek: TokenEncryptionKey;
  kek: TokenEncryptionKey;
}

interface Token extends Auditable {
  id: string;
  tenantId: string;
  type: TokenType;
  data: TokenData;
  fingerprint?: string;
  metadata?: Record<string, string>;
  encryption?: TokenEncryption;
  children?: Token[];
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
