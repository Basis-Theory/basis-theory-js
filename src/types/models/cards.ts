import type { TokenBase } from './shared';

interface Card {
  number: string;
  expirationMonth?: number;
  expirationYear?: number;
  cvc?: string;
}

interface AtomicCard extends TokenBase {
  card: Card;
}

type CreateAtomicCard = Pick<AtomicCard, 'card' | 'metadata'>;

interface UpdateAtomicCard {
  card?: Partial<Card>;
}

export type { AtomicCard, Card, CreateAtomicCard, UpdateAtomicCard };
