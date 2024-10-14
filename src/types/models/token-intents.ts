import type { TokenBase, DataObject, Auditable } from '@/types/models';

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

type TokenIntent<DataType = DataObject> = TokenBase<DataType> &
  Omit<Auditable, 'modifiedAt' | 'modifiedBy'> & {
    enrichments?: TokenIntentCardDetails;
    tenantId: string;
    expiresAt: string;
  };

type CreateTokenIntent<DataType = DataObject> = Pick<
  TokenIntent<DataType>,
  'type' | 'data'
> & {
  id: string;
};

export type { TokenIntent, CreateTokenIntent, TokenIntentCardDetails };
