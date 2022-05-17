import type { CardElement, TextElement } from '@/types/elements';
import type { TokenizeData as TokenizeDataModel } from '@/types/models';
import type { RequestOptions } from '@/types/sdk';

type TokenizeData = TokenizeDataModel<TextElement | CardElement>;

interface Tokenize {
  tokenize(
    tokens: TokenizeData,
    options?: RequestOptions
  ): Promise<TokenizeDataModel>;
}

export type { Tokenize, TokenizeData };
