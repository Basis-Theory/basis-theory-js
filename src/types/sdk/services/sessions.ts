import type { AccessRule } from '@/types/models/applications';
import type { RequestOptions } from '@/types/sdk';

type AuthorizeSessionRequest = {
  nonce: string;
  expiresAt?: string;
  permissions?: string[];
  rules?: AccessRule[];
};

type CreateSessionResponse = {
  sessionKey: string;
  nonce: string;
  expiresAt: string;
  _debug?: Record<string, unknown>;
};

interface Sessions {
  create(options?: RequestOptions): Promise<CreateSessionResponse>;
  authorize(
    authorizeSessionRequest: AuthorizeSessionRequest,
    options?: RequestOptions
  ): Promise<void>;
}

export { AuthorizeSessionRequest, CreateSessionResponse, Sessions };
