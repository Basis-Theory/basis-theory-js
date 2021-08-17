import { BasisTheoryService } from '../service';
import type { AtomicBank, CreateAtomicBankModel } from './banks/types';
import type { AtomicCard, CreateAtomicCardModel } from './cards/types';
import { dataExtractor } from '../common';

/**
 * @deprecated use {@link BasisTheoryAtomicBanks} and {@link BasisTheoryAtomicCards} instead
 */
export class BasisTheoryAtomic extends BasisTheoryService {
  /**
   * @deprecated use {@link BasisTheoryAtomicCards.create} instead
   */
  public async storeCreditCard(
    model: CreateAtomicCardModel
  ): Promise<AtomicCard> {
    return this.client.post('/cards', model).then(dataExtractor);
  }

  /**
   * @deprecated use {@link BasisTheoryAtomicBanks.create} instead
   */
  public async storeBank(model: CreateAtomicBankModel): Promise<AtomicBank> {
    return this.client.post('/banks', model).then(dataExtractor);
  }
}
