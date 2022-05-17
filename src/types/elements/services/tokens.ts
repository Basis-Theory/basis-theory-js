import type { TextElement, CardElement } from '@/types/elements';
import type { CreateToken as CreateTokenModel, Token } from '@/types/models';
import type { Create } from '@/types/sdk';

type CreateToken = CreateTokenModel<TextElement | CardElement>;

type Tokens = Create<Token, CreateToken>;

export type { Tokens, CreateToken };
