import type {
  Tokenize as ElementsTokenize,
  BasisTheoryElementsInternal,
  TokenizeData as ElementsTokenizeData,
} from '@/interfaces/elements';
import type { TokenizeData } from '@/interfaces/models';
import type { RequestOptions, Tokenize } from '@/interfaces/sdk';
import { BasisTheoryTokenize } from '@/tokenize';

const delegateTokenize = (
  elements?: BasisTheoryElementsInternal
): new (
  ...args: ConstructorParameters<typeof BasisTheoryTokenize>
) => ElementsTokenize & Tokenize =>
  class BasisTheoryTokenizesElementsDelegate
    extends BasisTheoryTokenize
    implements ElementsTokenize {
    public tokenize(
      payload: ElementsTokenizeData | TokenizeData,
      requestOptions?: RequestOptions
    ): Promise<TokenizeData> {
      if (elements?.hasElement(payload)) {
        return elements.tokenize(
          payload as ElementsTokenizeData,
          requestOptions
        );
      }

      return super.tokenize(payload as TokenizeData, requestOptions);
    }
  };

export { delegateTokenize };
