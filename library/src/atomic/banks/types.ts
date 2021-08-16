import type { Atomic } from '../types';

export interface Bank {
  routingNumber: string;
  accountNumber: string;
}

export interface AtomicBank extends Atomic {
  bank: Bank;
}

export type CreateAtomicBankModel = Pick<AtomicBank, 'bank' | 'metadata'>;
