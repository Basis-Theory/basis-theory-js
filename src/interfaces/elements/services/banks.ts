import { TextElement } from '@/interfaces/elements';
import type {
  Bank,
  CreateAtomicBank as CreateAtomicBankModel,
  AtomicBank,
} from '@/interfaces/models';
import type { Create } from '@/interfaces/sdk';

interface CreateAtomicBank extends Pick<CreateAtomicBankModel, 'metadata'> {
  bank: {
    routingNumber: Bank['routingNumber'] | TextElement;
    accountNumber: Bank['accountNumber'] | TextElement;
  };
}

type AtomicBanks = Create<AtomicBank, CreateAtomicBank>;

export type { AtomicBanks, CreateAtomicBank };
