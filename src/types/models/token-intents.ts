import { TokenType } from '@/types/models/shared';

interface TokenIntentCardData {
  number: number;
  expiration_month: string;
  expiration_year: string;
}

interface TokenIntent<DataType = TokenIntentCardData> {
  data: DataType;
  type: TokenType;
}

type CreateTokenIntent = Pick<TokenIntent, 'type' | 'data'>;

export type { TokenIntent, CreateTokenIntent, TokenIntentCardData };
