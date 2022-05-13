import type { TextElement, CardElement } from '@/interfaces/elements';
import type {
  CreateToken as CreateTokenModel,
  Token,
} from '@/interfaces/models';
import type { Create } from '@/interfaces/sdk';

type CreateToken = CreateTokenModel<TextElement | CardElement>;

type Tokens = Create<Token, CreateToken>;

export type { Tokens, CreateToken };
