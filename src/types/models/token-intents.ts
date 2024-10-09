import type { TokenData } from '@/types/models';
import type { Auditable, TokenType } from '@/types/models/shared';

interface TokenIntentCardDetails {
  cardDetails: {
    bin: string;
    last4: string;
    brand: string;
    type: string;
    expirationMonth: string;
    expirationYear: string;
  };
}

interface TokenIntent extends Omit<Auditable, 'modifiedAt' | 'modifiedBy'> {
  data: TokenData;
  type: TokenType;
  enrichments?: TokenIntentCardDetails;
  tenantId: string;
  expiresAt: string;
}

type CreateTokenIntent = Pick<TokenIntent, 'type' | 'data'> & {
  id: string;
};

export type { TokenIntent, CreateTokenIntent, TokenIntentCardDetails };
