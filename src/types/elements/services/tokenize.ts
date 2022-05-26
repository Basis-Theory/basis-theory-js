import type { ElementValue } from '@/types/elements';
import type { TokenizeData as TokenizeDataModel } from '@/types/models';
import type { RequestOptions } from '@/types/sdk';

type TokenizeData = TokenizeDataModel<ElementValue>;

interface Tokenize {
  tokenize(
    tokens: TokenizeData,
    options?: RequestOptions
  ): Promise<TokenizeDataModel>;
}

export type { Tokenize, TokenizeData };
