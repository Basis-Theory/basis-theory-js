import type { TokenType } from '../tokens';

interface Atomic {
  id: string;
  tenantId: string;
  type: TokenType;
  metadata?: Record<string, string>;
  createdBy: string;
  createdAt: string;
}

interface ReactRequest {
  reactorId: string;
  requestParameters?: Record<string, unknown>;
  metadata?: Record<string, string>;
}

export { Atomic, ReactRequest };
