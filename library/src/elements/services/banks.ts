import type {
  AtomicBanks as ElementsAtomicBanks,
  BasisTheoryElementsInternal,
  CreateAtomicBank as ElementsCreateAtomicBank,
} from '@basis-theory/basis-theory-elements-interfaces/elements';
import type {
  CreateAtomicBank,
  AtomicBank,
} from '@basis-theory/basis-theory-elements-interfaces/models';
import type {
  RequestOptions,
  AtomicBanks,
} from '@basis-theory/basis-theory-elements-interfaces/sdk';
import { BasisTheoryAtomicBanks } from '../../atomic';

const delegateAtomicBanks = (
  elements?: BasisTheoryElementsInternal
): new (
  ...args: ConstructorParameters<typeof BasisTheoryAtomicBanks>
) => ElementsAtomicBanks & AtomicBanks =>
  class BasisTheoryAtomicBanksElementsDelegate
    extends BasisTheoryAtomicBanks
    implements ElementsAtomicBanks {
    public create(
      payload: CreateAtomicBank | ElementsCreateAtomicBank,
      requestOptions?: RequestOptions
    ): Promise<AtomicBank> {
      if (elements?.hasElement(payload)) {
        return elements.atomicBanks.create(
          payload as ElementsCreateAtomicBank,
          requestOptions
        );
      }

      return super.create(payload as CreateAtomicBank, requestOptions);
    }
  };

export { delegateAtomicBanks };
