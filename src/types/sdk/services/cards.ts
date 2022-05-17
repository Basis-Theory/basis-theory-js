import type {
  AtomicCard,
  CreateAtomicCard,
  UpdateAtomicCard,
} from '@/types/models';
import type {
  Create,
  Retrieve,
  Update,
  Delete,
  List,
  AtomicReact,
} from './shared';

interface AtomicCards
  extends Create<AtomicCard, CreateAtomicCard>,
    Retrieve<AtomicCard>,
    Update<AtomicCard, UpdateAtomicCard>,
    Delete,
    List<AtomicCard>,
    AtomicReact {}

export type { AtomicCards };
