import { BasisTheoryTokens } from '@/tokens';
import type {
  Tokens as ElementsTokens,
  BasisTheoryElementsInternal,
  CreateToken as ElementsCreateToken,
  UpdateToken as ElementsUpdateToken,
} from '@/types/elements';
import type { CreateToken, Token, UpdateToken } from '@/types/models';
import type { RequestOptions, Tokens } from '@/types/sdk';

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

    public update(
      id: string,
      payload: UpdateToken | ElementsUpdateToken,
      requestOptions?: RequestOptions
    ): Promise<Token> {
      if (elements?.hasElement(payload)) {
        return elements.tokens.update(
          id,
          payload as ElementsUpdateToken,
          requestOptions
        );
      }

      return super.update(id, payload as UpdateToken, requestOptions);
    }

    public retrieve(
      id: string,
      requestOptions?: RequestOptions
    ): Promise<Token> {
      if (elements !== undefined) {
        return elements.tokens.retrieve(id, requestOptions);
      }

      return super.retrieve(id, requestOptions);
    }
  };

export { delegateTokens };
