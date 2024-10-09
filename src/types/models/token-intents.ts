import type { Auditable } from '@/types/models/shared';

interface TokenIntentCardData {
  number: number;
  expirationMonth: number;
  expirationYear: number;
  cvc?: string;
}

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

interface TokenIntent<DataType = TokenIntentCardData>
  extends Omit<Auditable, 'modifiedAt' | 'modifiedBy'> {
  data: DataType;
  type: 'card';
  enrichments?: TokenIntentCardDetails;
  tenantId: string;
  expiresAt: string;
}

type CreateTokenIntent = Pick<TokenIntent, 'type' | 'data'> & {
  id: string;
};

export type {
  TokenIntent,
  CreateTokenIntent,
  TokenIntentCardData,
  TokenIntentCardDetails,
};
