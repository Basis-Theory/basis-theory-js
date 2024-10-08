import type {
  DataObject,
  TokenData,
  Auditable,
  TokenType,
} from '@/types/models';

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

interface TokenIntent<DataType = DataObject>
  extends Omit<Auditable, 'modifiedAt' | 'modifiedBy'> {
  data: TokenData<DataType>;
  type: TokenType;
  enrichments?: TokenIntentCardDetails;
  tenantId: string;
  expiresAt: string;
}

type CreateTokenIntent<DataType = DataObject> = Pick<
  TokenIntent<DataType>,
  'type' | 'data'
> & {
  id: string;
};

export type { TokenIntent, CreateTokenIntent, TokenIntentCardDetails };
