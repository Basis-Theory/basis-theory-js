import type { RequestOptions } from '@/types/sdk';

type CreateTransactionResponse = {
  id: string;
  createdBy: string;
  createdAt: string;
  expiresAt: string;
};

interface Transactions {
  create(options?: RequestOptions): Promise<CreateTransactionResponse>;
  commit(id: string, options?: RequestOptions): Promise<void>;
  rollback(id: string, options?: RequestOptions): Promise<void>;
}

export { CreateTransactionResponse, Transactions };
