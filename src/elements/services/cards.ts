import { BasisTheoryAtomicCards } from '@/atomic';
import type {
  AtomicCards as ElementsAtomicCards,
  BasisTheoryElementsInternal,
  CreateAtomicCard as ElementsCreateAtomicCard,
} from '@/interfaces/elements';
import type { CreateAtomicCard, AtomicCard } from '@/interfaces/models';
import type { RequestOptions, AtomicCards } from '@/interfaces/sdk';

const delegateAtomicCards = (
  elements?: BasisTheoryElementsInternal
): new (
  ...args: ConstructorParameters<typeof BasisTheoryAtomicCards>
) => ElementsAtomicCards & AtomicCards =>
  class BasisTheoryAtomicCardsElementsDelegate
    extends BasisTheoryAtomicCards
    implements ElementsAtomicCards {
    public create(
      payload: CreateAtomicCard | ElementsCreateAtomicCard,
      requestOptions?: RequestOptions
    ): Promise<AtomicCard> {
      if (elements?.hasElement(payload)) {
        return elements.atomicCards.create(
          payload as ElementsCreateAtomicCard,
          requestOptions
        );
      }

      return super.create(payload as CreateAtomicCard, requestOptions);
    }
  };

export { delegateAtomicCards };
