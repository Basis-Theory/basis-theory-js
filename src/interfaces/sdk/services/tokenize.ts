import type { TokenizeData } from '@/interfaces/models';
import type { RequestOptions } from './shared';

interface Tokenize {
  tokenize(
    tokens: TokenizeData,
    options?: RequestOptions
  ): Promise<TokenizeData>;
}

export type { Tokenize };
