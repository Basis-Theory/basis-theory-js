import type {
  Tokens as ElementsTokens,
  BasisTheoryElementsInternal,
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

const delegateTokens = (
  elements?: BasisTheoryElementsInternal
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
      if (elements?.hasElement(payload)) {
        return elements.tokens.create(
          payload as ElementsCreateToken,
          requestOptions
        );
      }

      return super.create(payload as CreateToken, requestOptions);
    }
  };

export { delegateTokens };
