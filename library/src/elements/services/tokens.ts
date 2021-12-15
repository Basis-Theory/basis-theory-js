import type {
  Tokens as ElementsTokens,
  BasisTheoryElements,
  CreateToken as ElementsCreateToken,
} from '@basis-theory/basis-theory-elements-interfaces/elements';
import type {
  CreateToken,
  Token,
} from '@basis-theory/basis-theory-elements-interfaces/models';
import type {
  RequestOptions,
  Tokens,
} from '@basis-theory/basis-theory-elements-interfaces/sdk';
import { BasisTheoryTokens } from '../../tokens';
import { ELEMENTS_INIT_ERROR_MESSAGE } from '../constants';
import { hasElement } from './utils';

const delegateTokens = (
  elements?: BasisTheoryElements
): new (
  ...args: ConstructorParameters<typeof BasisTheoryTokens>
) => ElementsTokens & Tokens =>
  class BasisTheoryTokensElementsDelegate
    extends BasisTheoryTokens
    implements ElementsTokens {
    public create(
      payload: CreateToken | ElementsCreateToken,
      requestOptions?: RequestOptions
    ): Promise<Token> {
      if (hasElement(payload)) {
        if (elements) {
          return elements.tokens.create(
            payload as ElementsCreateToken,
            requestOptions
          );
        }

        throw new Error(ELEMENTS_INIT_ERROR_MESSAGE);
      }

      return super.create(payload as CreateToken, requestOptions);
    }
  };

export { delegateTokens };
