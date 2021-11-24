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
  mask?: DataObject;
  metadata?: Record<string, string>;
  encryption?: TokenEncryption;
}

type CreateTokenModel = Pick<
  Token,
  'type' | 'data' | 'metadata' | 'encryption'
>;

interface ListTokensQuery extends PaginatedQuery {
  id?: string | string[];
  type?: TokenType | TokenType[];
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
  ListTokensQuery,
  ListTokensQueryDecrypted,
};
