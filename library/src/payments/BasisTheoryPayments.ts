import snakecaseKeys from 'snakecase-keys';
import { BasisTheoryService } from '../service';
import { AtomicCard, PaymentsApi } from './types';
import camelcaseKeys from 'camelcase-keys';

export class BasisTheoryPayments extends BasisTheoryService {
  public async storeCreditCard(source: AtomicCard): Promise<AtomicCard> {
    const payload: PaymentsApi.SourceCardModel = snakecaseKeys(source);
    const { data } = await this.client.post<PaymentsApi.SourceCardResponse>(
      '/cards',
      payload
    );
    const newCard = (camelcaseKeys(data) as unknown) as AtomicCard;
    return newCard;
  }
}
