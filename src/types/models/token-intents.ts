import type {
  TokenBase,
  DataObject,
  Auditable,
  TokenType,
} from '@/types/models';

interface TokenIntentCardDetails {
  type: 'card';
  card: {
    bin: string;
    last4: string;
    brand: string;
    type: string;
    expirationMonth: string;
    expirationYear: string;
  };
}

type AvailableTokenTypes = Exclude<TokenType, 'token' | 'card'>;

type TokenTypeMap = {
  [K in AvailableTokenTypes]: {
    type: K;
  } & Record<K, Record<string, unknown>>;
};

type TokenIntent<DataType = DataObject> = (TokenBase<DataType> &
  Omit<Auditable, 'modifiedAt' | 'modifiedBy'> & {
    id: string;
    tenantId: string;
    expiresAt: string;
    fingerprint?: string;
  }) &
  (
    | TokenTypeMap[AvailableTokenTypes]
    | TokenIntentCardDetails
    | {
        type: 'token';
      }
  );

type CreateTokenIntent<DataType = DataObject> = Pick<
  TokenIntent<DataType>,
  'type' | 'data'
>;

export type { TokenIntent, CreateTokenIntent, TokenIntentCardDetails };
