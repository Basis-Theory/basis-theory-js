import type { Atomic } from '../types';

export interface AtomicCard extends Atomic {
  card: Card;
  billingDetails?: BillingDetails;
}

export interface Card {
  number: string;
  expirationMonth: number;
  expirationYear: number;
  cvc?: string;
}

export interface BillingDetails {
  name: string;
  email: string;
  phone: string;
  address: Address;
}

export interface Address {
  line1: string;
  line2: string;
  city: string;
  state: string;
  postalCode: string;
  country: string;
}

export type CreateAtomicCardModel = Pick<
  AtomicCard,
  'card' | 'billingDetails' | 'metadata'
>;
