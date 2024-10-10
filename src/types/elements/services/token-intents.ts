import type { ElementValue } from '@/types/elements';
import type {
  CreateTokenIntent as CreateTokenIntentModel,
  TokenIntent,
} from '@/types/models';
import type { Create } from '@/types/sdk';

type CreateTokenIntent = CreateTokenIntentModel<ElementValue>;

type TokenIntents = Create<TokenIntent, CreateTokenIntent>;

export type { TokenIntents, CreateTokenIntent };
