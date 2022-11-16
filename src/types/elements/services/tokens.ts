import type { ElementValue } from '@/types/elements';
import type {
  CreateToken as CreateTokenModel,
  UpdateToken as UpdateTokenModel,
  Token,
} from '@/types/models';
import type { Create, Retrieve, Update } from '@/types/sdk';

type CreateToken = CreateTokenModel<ElementValue>;
type UpdateToken = UpdateTokenModel<ElementValue>;

type Tokens = Create<Token, CreateToken> &
  // avoid casting when accessing token data props
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  Retrieve<Token<any>> &
  Update<Token, UpdateToken>;

export type { Tokens, CreateToken, UpdateToken };
