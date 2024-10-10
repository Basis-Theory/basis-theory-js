import { BasisTheoryTokenIntents } from '@/token-intents';
import type {
  TokenIntents as ElementsTokenIntents,
  BasisTheoryElementsInternal,
  CreateTokenIntent as ElementsCreateTokenIntent,
} from '@/types/elements';
import type { CreateTokenIntent, TokenIntent } from '@/types/models';
import type { RequestOptions, TokenIntents } from '@/types/sdk';

const delegateTokenIntents = (
  elements?: BasisTheoryElementsInternal
): new (
  ...args: ConstructorParameters<typeof BasisTheoryTokenIntents>
) => ElementsTokenIntents & TokenIntents =>
  class BasisTheoryTokenIntentsElementsDelegate
    extends BasisTheoryTokenIntents
    implements ElementsTokenIntents {
    public create(
      payload: CreateTokenIntent | ElementsCreateTokenIntent,
      requestOptions?: RequestOptions
    ): Promise<TokenIntent> {
      if (elements?.hasElement(payload)) {
        return elements.tokenIntents.create(
          payload as ElementsCreateTokenIntent,
          requestOptions
        );
      }

      return super.create(payload as CreateTokenIntent, requestOptions);
    }
  };

export { delegateTokenIntents };
