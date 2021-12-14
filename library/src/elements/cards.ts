import type {
  AtomicCards as ElementsAtomicCards,
  BasisTheoryElements,
  CreateAtomicCard as ElementsCreateAtomicCard,
} from '@basis-theory/basis-theory-elements-interfaces/elements';
import type {
  CreateAtomicCard,
  AtomicCard,
} from '@basis-theory/basis-theory-elements-interfaces/models';
import type {
  RequestOptions,
  AtomicCards,
} from '@basis-theory/basis-theory-elements-interfaces/sdk';
import { BasisTheoryAtomicCards } from '../atomic';
import { hasElement } from './utils';

const delegateAtomicCards = (
  elements?: BasisTheoryElements
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
      if (hasElement(payload)) {
        if (elements) {
          return elements.atomicCards.create(
            payload as ElementsCreateAtomicCard,
            requestOptions
          );
        }

        throw new Error(
          'BasisTheory was not initialized with "elements: true"'
        );
      }

      return super.create(payload as CreateAtomicCard, requestOptions);
    }
  };

export { delegateAtomicCards };
