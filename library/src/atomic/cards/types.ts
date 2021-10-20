import type { Atomic } from '../types';

interface AtomicCard extends Atomic {
  card: Card;
  billingDetails?: BillingDetails;
}

interface Card {
  number: string;
  expirationMonth?: number;
  expirationYear?: number;
  cvc?: string;
}

interface BillingDetails {
  name?: string;
  email?: string;
  phone?: string;
  address?: Address;
}

interface Address {
  line1?: string;
  line2?: string;
  city?: string;
  state?: string;
  postalCode?: string;
  country?: string;
}

type CreateAtomicCardModel = Pick<
  AtomicCard,
  'card' | 'billingDetails' | 'metadata'
>;

export type {
  AtomicCard,
  Card,
  BillingDetails,
  Address,
  CreateAtomicCardModel,
};
