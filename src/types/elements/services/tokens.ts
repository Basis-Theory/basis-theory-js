import type { ElementValue } from '@/types/elements';
import type { CreateToken as CreateTokenModel, Token } from '@/types/models';
import type { Create } from '@/types/sdk';

type CreateToken = CreateTokenModel<ElementValue>;

type Tokens = Create<Token, CreateToken>;

export type { Tokens, CreateToken };
