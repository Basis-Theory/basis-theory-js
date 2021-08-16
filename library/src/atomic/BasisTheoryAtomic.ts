import { BasisTheoryService, BasisTheoryServiceOptions } from '../service';
import { AtomicCard } from './types';
import { AtomicBank, CreateAtomicBankModel } from './bank/types';
import { assertInit, dataExtractor } from '../common';
import { BasisTheoryAtomicBanks } from './bank/BasisTheoryAtomicBanks';

export class BasisTheoryAtomic extends BasisTheoryService {
  public async storeCreditCard(
    source: Omit<AtomicCard, 'id'>
  ): Promise<AtomicCard> {
    return this.client.post<AtomicCard>('/cards', source).then(dataExtractor);
  }

  /**
   * @deprecated use {@link BasisTheoryAtomicBanks.create} instead
   */
  public async storeBank(model: CreateAtomicBankModel): Promise<AtomicBank> {
    return this.client.post('/banks', model).then(dataExtractor);
  }
}
