import type { TokenBase } from './shared';

interface Bank {
  routingNumber: string;
  accountNumber: string;
}

interface AtomicBank extends TokenBase {
  type: 'bank';
  bank: Bank;
}

type CreateAtomicBank = Pick<AtomicBank, 'bank' | 'metadata'>;

interface UpdateAtomicBank {
  bank: Partial<Bank>;
}

export type { Bank, AtomicBank, CreateAtomicBank, UpdateAtomicBank };
