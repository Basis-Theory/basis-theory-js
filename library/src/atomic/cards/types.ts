import type { Atomic } from '../types';

interface AtomicCard extends Atomic {
  card: Card;
}

interface Card {
  number: string;
  expirationMonth?: number;
  expirationYear?: number;
  cvc?: string;
}

type CreateAtomicCardModel = Pick<AtomicCard, 'card' | 'metadata'>;

interface UpdateAtomicCardModel {
  card?: Partial<Card>;
}

export type { AtomicCard, Card, CreateAtomicCardModel, UpdateAtomicCardModel };
