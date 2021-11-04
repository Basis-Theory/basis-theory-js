import type { DataObject, TokenType } from '../tokens';
import type { Auditable } from '../types';

interface Atomic extends Auditable {
  id: string;
  tenantId: string;
  type: TokenType;
  fingerprint: string;
  metadata?: Record<string, string>;
}

interface ReactRequest {
  reactorId: string;
  requestParameters?: Record<string, unknown>;
}

interface ReactResponse {
  tokens: DataObject;
  raw: DataObject;
}

export type { Atomic, ReactRequest, ReactResponse };
