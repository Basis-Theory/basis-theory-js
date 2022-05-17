import type { DataObject } from './tokens';

type Primitive = string | number | boolean | null;
type TokenType =
  | 'token'
  | 'card'
  | 'bank'
  | 'card_number'
  | 'us_bank_routing_number'
  | 'us_bank_account_number'
  | 'social_security_number';

interface Auditable {
  createdBy?: string;
  createdAt?: string;
  modifiedBy?: string;
  modifiedAt?: string;
}

interface TokenBase<T extends TokenType = TokenType> extends Auditable {
  id: string;
  type: T;
  tenantId: string;
  fingerprint?: string;
  metadata?: Record<string, string>;
}

interface AtomicReactRequest {
  reactorId: string;
  requestParameters?: Record<string, unknown>;
}

interface ReactResponse {
  tokens: DataObject;
  raw: DataObject;
}

export type {
  Primitive,
  Auditable,
  TokenType,
  TokenBase,
  AtomicReactRequest,
  ReactResponse,
};
