import type {
  AtomicBank,
  CreateAtomicBank,
  UpdateAtomicBank,
} from '@/types/models';
import type {
  Create,
  Retrieve,
  Update,
  Delete,
  List,
  AtomicReact,
} from './shared';

interface AtomicBanks
  extends Create<AtomicBank, CreateAtomicBank>,
    Retrieve<AtomicBank>,
    Update<AtomicBank, UpdateAtomicBank>,
    Delete,
    List<AtomicBank>,
    AtomicReact {}

export type { AtomicBanks };
