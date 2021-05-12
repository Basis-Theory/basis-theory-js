import camelcaseKeys from 'camelcase-keys';
import snakecaseKeys from 'snakecase-keys';
import { BasisTheoryService } from '../service';
import { AtomicBank, AtomicCard, PaymentsApi } from './types';

export class BasisTheoryAtomic extends BasisTheoryService {
  public async storeCreditCard(
    source: Omit<AtomicCard, 'id'>
  ): Promise<AtomicCard> {
    const payload: PaymentsApi.SourceCardModel = snakecaseKeys(source, {
      deep: true,
    });
    const { data } = await this.client.post<PaymentsApi.SourceCardResponse>(
      '/cards',
      payload
    );
    const newCard = (camelcaseKeys(data, {
      deep: true,
    }) as unknown) as AtomicCard;
    return newCard;
  }

  public async storeBank(source: Omit<AtomicBank, 'id'>): Promise<AtomicBank> {
    const payload: PaymentsApi.SourceBankModel = snakecaseKeys(source, {
      deep: true,
    });
    const { data } = await this.client.post<PaymentsApi.SourceBankResponse>(
      '/banks',
      payload
    );
    const newBank = (camelcaseKeys(data, {
      deep: true,
    }) as unknown) as AtomicBank;
    return newBank;
  }
}
