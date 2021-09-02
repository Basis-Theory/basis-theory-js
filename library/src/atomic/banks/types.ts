import type { Atomic } from '../types';

interface Bank {
  routingNumber: string;
  accountNumber: string;
}

interface AtomicBank extends Atomic {
  bank: Bank;
}

type CreateAtomicBankModel = Pick<AtomicBank, 'bank' | 'metadata'>;

export { Bank, AtomicBank, CreateAtomicBankModel };
