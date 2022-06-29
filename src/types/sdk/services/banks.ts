import type {
  AtomicBank,
  CreateAtomicBank,
  UpdateAtomicBank,
} from '@/types/models';
import type { Create, Retrieve, Update, Delete, List } from './shared';

interface AtomicBanks
  extends Create<AtomicBank, CreateAtomicBank>,
    Retrieve<AtomicBank>,
    Update<AtomicBank, UpdateAtomicBank>,
    Delete,
    List<AtomicBank> {}

export type { AtomicBanks };
