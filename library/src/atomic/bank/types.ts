export type BankType = 'bank';

export interface Bank {
  routing_number: string;
  account_number: string;
}

export interface AtomicBank {
  id: string;
  tenantId: string;
  type: BankType;
  bank: Bank;
  metadata?: Record<string, string>;
  createdBy: string;
  createdAt: string;
}

export type CreateAtomicBankModel = Pick<AtomicBank, 'bank' | 'metadata'>;
