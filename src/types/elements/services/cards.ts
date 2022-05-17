import type { CardElement, TextElement } from '@/types/elements';
import type {
  CreateAtomicCard as CreateAtomicCardModel,
  AtomicCard,
  Card,
} from '@/types/models';
import type { Create } from '@/types/sdk';

interface CreateAtomicCard extends Pick<CreateAtomicCardModel, 'metadata'> {
  card:
    | CardElement
    | {
        number: Card['number'] | TextElement;
        expirationMonth: Card['expirationMonth'] | TextElement;
        expirationYear: Card['expirationYear'] | TextElement;
        cvc: Card['cvc'] | TextElement;
      };
}

type AtomicCards = Create<AtomicCard, CreateAtomicCard>;

export type { AtomicCards, CreateAtomicCard };
