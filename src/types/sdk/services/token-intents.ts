import type { TokenIntent, CreateTokenIntent } from '@/types/models';
import type { Create, Delete } from './shared';

interface TokenIntents extends Create<TokenIntent, CreateTokenIntent>, Delete {}

export type { TokenIntents };
