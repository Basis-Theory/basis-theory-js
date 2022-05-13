import { TextElement } from '@/types/elements';
import type {
  Bank,
  CreateAtomicBank as CreateAtomicBankModel,
  AtomicBank,
} from '@/types/models';
import type { Create } from '@/types/sdk';

interface CreateAtomicBank extends Pick<CreateAtomicBankModel, 'metadata'> {
  bank: {
    routingNumber: Bank['routingNumber'] | TextElement;
    accountNumber: Bank['accountNumber'] | TextElement;
  };
}

type AtomicBanks = Create<AtomicBank, CreateAtomicBank>;

export type { AtomicBanks, CreateAtomicBank };
