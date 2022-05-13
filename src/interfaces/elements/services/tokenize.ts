import type { CardElement, TextElement } from '@/interfaces/elements';
import type { TokenizeData as TokenizeDataModel } from '@/interfaces/models';
import type { RequestOptions } from '@/interfaces/sdk';

type TokenizeData = TokenizeDataModel<TextElement | CardElement>;

interface Tokenize {
  tokenize(
    tokens: TokenizeData,
    options?: RequestOptions
  ): Promise<TokenizeDataModel>;
}

export type { Tokenize, TokenizeData };
