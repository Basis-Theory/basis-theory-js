import type {
  AtomicBanks as ElementsAtomicBanks,
  BasisTheoryElements,
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
import { BasisTheoryAtomicBanks } from '../atomic';
import { hasElement } from './utils';

const delegateAtomicBanks = (
  elements?: BasisTheoryElements
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
      if (hasElement(payload)) {
        if (elements) {
          return elements.atomicBanks.create(
            payload as ElementsCreateAtomicBank,
            requestOptions
          );
        }

        throw new Error(
          'BasisTheory was not initialized with "elements: true"'
        );
      }

      return super.create(payload as CreateAtomicBank, requestOptions);
    }
  };

export { delegateAtomicBanks };
