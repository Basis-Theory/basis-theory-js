import type {
  Tokenize as ElementsTokenize,
  BasisTheoryElements,
  TokenizeData as ElementsTokenizeData,
} from '@basis-theory/basis-theory-elements-interfaces/elements';
import type { TokenizeData } from '@basis-theory/basis-theory-elements-interfaces/models';
import type {
  RequestOptions,
  Tokenize,
} from '@basis-theory/basis-theory-elements-interfaces/sdk';
import { BasisTheoryTokenize } from '../../tokenize';
import { ELEMENTS_INIT_ERROR_MESSAGE } from '../constants';
import { hasElement } from './utils';

const delegateTokenize = (
  elements?: BasisTheoryElements
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
      if (hasElement(payload)) {
        if (elements) {
          return elements.tokenize.tokenize(
            payload as ElementsTokenizeData,
            requestOptions
          );
        }

        throw new Error(ELEMENTS_INIT_ERROR_MESSAGE);
      }

      return super.tokenize(payload as TokenizeData, requestOptions);
    }
  };

export { delegateTokenize };
