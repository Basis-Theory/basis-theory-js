import type { RequestOptions } from '@/types/sdk';
import { AccessRule } from '../../models/applications';

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
};

interface Sessions {
  create(options?: RequestOptions): Promise<CreateSessionResponse>;
  authorize(
    authorizeSessionRequest: AuthorizeSessionRequest,
    options?: RequestOptions
  ): Promise<void>;
}

export { AuthorizeSessionRequest, CreateSessionResponse, Sessions };
