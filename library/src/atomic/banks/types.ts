import type { Atomic } from '../types';

interface Bank {
  routingNumber: string;
  accountNumber: string;
}

interface AtomicBank extends Atomic {
  bank: Bank;
}

type CreateAtomicBankModel = Pick<AtomicBank, 'bank' | 'metadata'>;

interface UpdateAtomicBankModel {
  bank: Partial<Bank>;
}

export type { Bank, AtomicBank, CreateAtomicBankModel, UpdateAtomicBankModel };
