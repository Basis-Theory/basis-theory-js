import type { TokenType } from '../tokens';

export interface Atomic {
  id: string;
  tenantId: string;
  type: TokenType;
  metadata?: Record<string, string>;
  createdBy: string;
  createdAt: string;
}

export interface ReactRequest {
  reactorId: string;
  requestParameters?: Record<string, unknown>;
  metadata?: Record<string, string>;
}
